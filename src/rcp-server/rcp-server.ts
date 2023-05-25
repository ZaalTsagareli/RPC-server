import { isArray } from "util";
import { Transport } from "../interfaces/transport-interface";

export interface Methods {
  [methodName: string]: (...params: any[]) => Promise<any> | any;
}

export class RCPServer {
  private transport: Transport[];
  private ports: Array<number>;
  private methods: Methods;
  constructor(transport: Transport[]) {
    this.transport = transport;
    this.ports = transport.map((data) => data.port);
    this.expose({ ping: () => true });
  }

  expose(methods: Methods) {
    this.methods = {
      ...this.methods,
      ...methods,
    };
  }

  public async run() {
    const filtered = new Set(this.ports);
    if (filtered.size !== this.ports.length) {
      throw Error("ports are not identic");
    }
    await Promise.all([
      this.transport.map((data) => {
        data.onData(this.handleRequest.bind(this));
        data.start();
      }),
    ]);
  }

  public removeTransport(transport: Transport) {
    let index = this.transport.indexOf(transport);
    if (index !== -1) {
      console.log("removing");
      this.transport[index].showDown();
      this.transport.splice(index, 1);
    }
  }

  private methodInRequestExsists(methodName) {
    return (
      this.methods[methodName] &&
      typeof this.methods[methodName] === "function" &&
      methodName !== "constructor"
    );
  }

  private handleRequest(request) {
    const isRequest = request.hasOwnProperty("method");
    if (!isRequest) return;

    if (!this.methodInRequestExsists(request["method"]))
      return {
        jsonrpc: "2.0",
        id: "4",
        error: {
          code: "METHOD_NOT_FOUND",
          message: "Method not found",
        },
      };

    if (Array.isArray(request["params"])) {
      return {
        jsonrpc: "2.0",
        id: request["id"],
        result: this.methods[request["method"]](...request["params"]),
      };
    } else if (typeof request["params"] == "object") {
      return {
        jsonrpc: "2.0",
        id: request["id"],
        result: this.methods[request["method"]](request["params"]),
      };
    } else {
      return {
        jsonrpc: "2.0",
        id: "4",
        error: {
          code: "Invalid param",
          message: "param must be array or object",
        },
      };
    }
  }

  public addTransport(transport: Transport): void {
    this.transport.push(transport);
  }
}
