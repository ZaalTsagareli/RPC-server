import { JsonRpcResponse } from "../interfaces/rcp.json.response";

export class Responses {
  public createSuccessResponse(
    id: number | string | null,
    result: any
  ): JsonRpcResponse {
    return {
      jsonrpc: "2.0",
      result,
      id,
    };
  }

  public createErrorResponse(
    id: number | string | null,
    code: number,
    message: string,
    data?: any
  ): JsonRpcResponse {
    return {
      jsonrpc: "2.0",
      error: {
        code,
        message,
        data,
      },
      id,
    };
  }
}
