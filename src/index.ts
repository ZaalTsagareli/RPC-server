import { RCPServer } from "./rcp-server/rcp-server";
import { Transport } from "./interfaces/transport-interface";
import net from "net";
import http from "http";

class TcpServer implements Transport {
  port: number;
  protocol: string = "tcp";
  constructor(port: number) {
    this.port = port;
  }

  start(): void {
    const socket = net.createServer();
    socket.listen(this.port, "localhost", () => {
      console.log("tcpserver is running");
    });
  }
}

class HttpServer implements Transport {
  port: number;
  protocol: string = "http";
  constructor(port: number) {
    this.port = port;
  }
  start(): void {
    const httpServer = http.createServer();
    httpServer.listen(this.port, "localhost", () => {
      console.log("httpserver started");
    });
  }
}
const transports = [new TcpServer(3000), new HttpServer(3001)];
const rcpServer = new RCPServer(transports);

rcpServer.run();
