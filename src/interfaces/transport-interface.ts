export interface Transport {
  protocol: string;
  port: number;
  start(): void;
}
