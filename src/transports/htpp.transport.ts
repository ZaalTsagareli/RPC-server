import { promisify } from "util";
import { Transport } from "../interfaces/transport-interface";
import http from "http";

export class HttpServer implements Transport {
  protocol: string;

  port: number;

  private server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;

  private handler: Function;

  constructor(port: number) {
    this.port = port;
    this.server = http.createServer((req, res) => {
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
  }

  showDown() {
    console.log("aqvar");
    if (this.server.listening) {
      console.log("closing");
      this.server.close(() => {
        console.log("httpserver closed");
      });
    }
  }

  onData(handler: (request) => {}) {
    this.handler = handler;
  }

  async start(): Promise<void> {
    const promisifiedListen = promisify(this.server.listen).bind(this.server);
    await promisifiedListen(this.port);
    // this.server.listen(this.port, "localhost", () => {
    //   console.log("httpserver started");
    // });
  }
}
