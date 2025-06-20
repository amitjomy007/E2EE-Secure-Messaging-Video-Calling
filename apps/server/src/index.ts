import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";
const init = async () => {
    startMessageConsumer();
    const httpServer = http.createServer();

    const socketService = new SocketService();
    
    // const PORT = process.env.PORT ? process.env.PORT : 8000;
    const PORT = 8000;

    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`HTTP Server started at PORT - ${PORT}`);
    })
    socketService.initListeners();
}

init();