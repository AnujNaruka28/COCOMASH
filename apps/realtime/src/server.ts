import createSocketServer from "./modules/websocket/server";

const io = createSocketServer();
io.listen(443);
