import { Methods, RCPServer } from "./rcp-server/rcp-server";
import { Transport } from "./interfaces/transport-interface";
import net from "net";
import http from "http";

class TcpServer implements Transport {
  port: number;
  protocol: string;
  private handler: Function;
  constructor(port: number) {
    this.port = port;
  }

  onData(handler: Function) {
    this.handler = handler;
  }
  public start(): void {
    const socket = net.createServer();

    socket.on("connection", (socket) => {
      socket.on("data", (request) => {
        // Parse and process the received data
        console.log(request);
        this.handler(request);
        socket.emit("done");
      });
    });
    socket.listen(this.port, "localhost", () => {
      console.log("tcpserver is running");
    });
  }
}

class HttpServer implements Transport {
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
const transports = [new TcpServer(3000)];

const rcpServer = new RCPServer(transports);
rcpServer.addTransport(new HttpServer(3001));

rcpServer.expose({ add: (a, b) => a + b, mines: (a, b) => a - b });

rcpServer.expose({ mult: (a, b) => a * b });
rcpServer.run();
