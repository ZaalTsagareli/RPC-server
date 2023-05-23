import { Transport } from "../interfaces/transport-interface";

export class RCPServer {
  private transport: Transport[];
  private ports: Array<number>;
  constructor(transport: Transport[]) {
    this.transport = transport;
    this.ports = transport.map((data) => data.port);
  }

  public run() {
    const filtered = new Set(this.ports);
    if (filtered.size !== this.ports.length) {
      throw Error("ports are not identic");
    }
    this.transport.map((data) => {
      data.start();
    });
  }

  public setMethods(methods: Function[]) {}
}
