import createSocketServer from "./modules/websocket/server";
import { ENV } from "./config/env";

const io = createSocketServer();
io.listen(ENV.PORT);

console.log(`Realtime server running on port ${ENV.PORT}`);
