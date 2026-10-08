import createSocketServer from "./modules/websocket/server";
import { ENV } from "./config/env";
import { connectRedis } from "./config/redis";

async function startServer() {

    try {

        await connectRedis();

        const io = createSocketServer();
        io.listen(ENV.PORT as number);

        console.log(`Realtime server running on port ${ENV.PORT}`);

    } catch (err) {

        console.error("Failed to start server", err);
        process.exit(1);
        
    }

};

startServer();
