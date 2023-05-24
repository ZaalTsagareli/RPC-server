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
  }

  expose(methods: Methods) {
    this.methods = {
      ...this.methods,
      ...methods,
    };
  }

  public run() {
    const filtered = new Set(this.ports);
    if (filtered.size !== this.ports.length) {
      throw Error("ports are not identic");
    }
    this.transport.map((data) => {
      data.onData(this.handleRequest.bind(this));
      data.start();
    });
  }

  private methodInRequestExsists(methodName) {
    return (
      this.methods[methodName] &&
      typeof this.methods[methodName] === "function" &&
      methodName !== "constructor"
    );
  }

  private handleRequest(request) {
    console.log("sworia");
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

  public setMethods(methods: Function[]) {}
}
