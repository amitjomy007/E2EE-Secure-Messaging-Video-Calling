import {Server, Socket} from "socket.io"

class SocketService {
    private _io: Server;

    constructor() {
        console.log("initializing a new Server")
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin:"*",
            },
        });
        console.log('Initialized a new Server');
    }

    public initListeners() {
        const io = this.io;
        console.log("INitializing socket lsiteners>...");
        io.on('connect', (socket) => {
            console.log(`new socket with id : ${socket.id} has connected`);
            socket.on('event:message', async ({message} : {message:string})=>{
                console.log("New message : " , message);
            })
        })
    }
    get io(){
        return this._io;

    }
}

export default SocketService;