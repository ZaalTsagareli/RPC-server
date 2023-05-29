import { Mode } from "../enums/mode.enum";

export interface JSONRPCRequest {
  mode: Mode;
  jsonrpc: string;
  method: string;
  params?: any[];
  id?: string | number | null;
}
