import * as http from "http";

import { Server } from "./server/rpc.server";

const rcpServer = new Server();
rcpServer.listen(3000);
