import { IDGenerator } from "./../generateId/generate.id";
import { Transport } from "../interfaces/transport-interface";
import { JSONRPCRequest } from "../interfaces/rcp.request";
import { Mode } from "../enums/mode.enum";
import { JSONRPCResponse } from "../interfaces/rcp.response";

export interface Methods {
  [methodName: string]: (...params: any[]) => Promise<any> | any;
}

export class RCPServer {
  private transport: Transport[];
  private methods: Methods;
  private generator: IDGenerator;
  constructor(transport: Transport[]) {
    this.transport = transport;
    this.generator = new IDGenerator();
    this.expose({ ping: () => true });
  }

  expose(methods: Methods) {
    this.methods = {
      ...this.methods,
      ...methods,
    };
  }

  public async run() {
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
      this.transport[index].showDown();
      this.transport.splice(index, 1);
    }
  }

  private methodInRequestExsists(methodName: string) {
    return (
      this.methods[methodName] &&
      typeof this.methods[methodName] === "function" &&
      methodName !== "constructor"
    );
  }

  private handleRequest(request: JSONRPCRequest): any {
    const isRequest = request.hasOwnProperty("method");
    if (!isRequest) return;
    switch (request.mode) {
      case Mode.NORMAL:
        return this.handleNormalRequest(request);
      case Mode.PING:
        return this.handlePing(request);
      default:
        return "invalid request mode";
    }
  }

  private handlePing(request: JSONRPCRequest): JSONRPCResponse {
    const response: JSONRPCResponse = {
      id: this.generator.generateRequestId(),
      result: this.methods["ping"](),
      jsonrpc: request.jsonrpc,
    };
    return response;
  }

  private handleNormalRequest(request: JSONRPCRequest): JSONRPCResponse {
    if (!this.methodInRequestExsists(request["method"]))
      return {
        jsonrpc: "2.0",
        id: "4",
        error: {
          code: 6000,
          message: "Method not found",
        },
      };

    if (Array.isArray(request["params"])) {
      return {
        jsonrpc: "2.0",
        id: this.generator.generateRequestId(),
        result: this.methods[request["method"]](...request["params"]),
      };
    } else if (typeof request["params"] == "object") {
      return {
        jsonrpc: "2.0",
        id: this.generator.generateRequestId(),
        result: this.methods[request["method"]](request["params"]),
      };
    } else {
      return {
        jsonrpc: "2.0",
        id: "4",
        error: {
          code: 6001,
          message: "param must be array or object",
        },
      };
    }
  }

  public addTransport(transport: Transport): void {
    this.transport.push(transport);
  }
}
