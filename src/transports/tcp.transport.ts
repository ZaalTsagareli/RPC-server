import { Transport } from "../interfaces/transport-interface";
import net from "net";
export class TcpServer implements Transport {
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
      if (!this.handler) throw "not registared handlers";
      socket.on("data", (request) => {
        socket.emit(this.handler(request));
      });
    });
    socket.listen(this.port, "localhost", () => {
      console.log("tcpserver is running");
    });
  }
}
