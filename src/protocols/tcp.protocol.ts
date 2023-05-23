import { Transport } from "../interfaces/transport-interface";
import net from "net";
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
