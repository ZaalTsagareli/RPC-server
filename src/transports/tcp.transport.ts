import { promisify } from "util";
import { Transport } from "../interfaces/transport-interface";
import net from "net";
export class TcpServer implements Transport {
  port: number;
  protocol: string;
  private server: net.Server;
  private handler: Function;
  constructor(port: number) {
    this.port = port;

    this.server = net.createServer().on("connection", (socket) => {
      if (!this.handler) throw "not registared handlers";
      socket.on("data", (request) => {
        socket.emit(this.handler(request));
      });
    });
  }

  showDown() {
    if (this.server.listening)
      this.server.close(() => {
        console.log("tcp server closed");
      });
  }
  onData(handler: Function) {
    this.handler = handler;
  }
  public async start(): Promise<void> {
    const promisifiedListen = promisify(this.server.listen).bind(this.server);
    await promisifiedListen(this.port);
  }
}
