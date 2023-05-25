import { RCPServer } from "./rcp-server/rcp-server";
import { HttpServer } from "./transports/htpp.transport";
import { TcpServer } from "./transports/tcp.transport";

const transports = [new TcpServer(3000)];

const rcpServer = new RCPServer(transports);

const http = new HttpServer(3001);

const main = async () => {
  rcpServer.addTransport(http);

  rcpServer.expose({ add: (a, b) => a + b, mines: (a, b) => a - b });

  rcpServer.expose({ mult: (a, b) => a * b });

  await rcpServer.run();

  rcpServer.removeTransport(http);
};

main();
