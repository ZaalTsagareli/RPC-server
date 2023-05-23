import * as http from "http";
import { JsonRpcRequest } from "../interfaces/rpc.json.request";
import { Http2Server } from "http2";
import { JsonRpcResponse } from "../interfaces/rcp.json.response";
import { Responses } from "../responses/response";

export class Server {
  private server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  private responses: Responses;
  private isServerListening: boolean = false;
  constructor() {
    this.server = this.createServer();
    this.responses = new Responses();
  }

  private createServer() {
    return http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        let requestData = "";

        req.on("data", (chunk) => {
          requestData += chunk;
        });

        req.on("end", () => {
          console.log("here");
          try {
            const request = JSON.parse(requestData) as
              | JsonRpcRequest
              | JsonRpcRequest[];

            const responses = Array.isArray(request)
              ? this.handleBatchRequest(request)
              : [this.handleRequest(request)];

            const responseBody = JSON.stringify(responses);

            res.setHeader("Content-Type", "application/json");
            res.end(responseBody);
          } catch (err) {
            console.log(err);
            res.end(err.toString());
          }
        });
      }
    );
  }

  private handleBatchRequest(requests: JsonRpcRequest[]): JsonRpcResponse[] {
    return requests.map((request) => this.handleRequest(request));
  }

  private handleRequest(request: JsonRpcRequest): JsonRpcResponse {
    const { jsonrpc, method, params, id } = request;
    console.log("erroring");
    if (jsonrpc !== "2.0" || !method || typeof method !== "string") {
      return this.responses.createErrorResponse(id, -32600, "Invalid Request");
    }

    switch (method) {
      case "add":
        console.log(method);
        console.log("trying to ad");
        console.log(typeof id, typeof params);
        return this.responses.createSuccessResponse(id, this.add(params));
      case "multiply":
        return this.responses.createSuccessResponse(id, this.multiply(params));
      default:
        return this.responses.createErrorResponse(
          id,
          -32601,
          "Method not found"
        );
    }
  }

  private add({ a, b }: { a: number; b: number }): number {
    console.log("aqvshemovdivar");
    console.log(a, b);
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Error("Invalid params");
    }
    return a + b;
  }

  private multiply({ a, b }: { a: number; b: number }): number {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Error("Invalid params");
    }
    return a * b;
  }

  public listen(port: number) {
    if (!this.isServerListening) {
      this.server.listen(port, () => {
        console.log(`JSON-RPC server is running on port ${port}`);
        this.isServerListening = true;
      });
    } else {
      console.log("server is already on port");
    }
  }
}
