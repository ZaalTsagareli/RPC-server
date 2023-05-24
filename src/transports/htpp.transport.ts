import { Transport } from "../interfaces/transport-interface";
import http from "http";
export class HttpServer implements Transport {
  protocol: string;

  port: number;
  private handler: Function;

  constructor(port: number) {
    this.port = port;
  }

  onData(handler: (request) => {}) {
    this.handler = handler;
  }

  start(): void {
    const httpServer = http.createServer((req, res) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        const request = JSON.parse(data);
        if (!this.handler) throw "not handlers registared";

        res.end(JSON.stringify(this.handler(request)));
      });
    });
    httpServer.listen(this.port, "localhost", () => {
      console.log("httpserver started");
    });
  }
}
