export interface Transport {
  port: number;
  protocol: string;

  start();
  onData(handler: Function);

  showDown();
}
