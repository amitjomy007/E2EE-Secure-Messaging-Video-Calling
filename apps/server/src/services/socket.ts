import {Server, Socket} from "socket.io"
import Redis from "ioredis"
import * as dotenv from 'dotenv';
import prismaClient from "./prisma";
dotenv.config();
//has constructor which creates a new socket server - io 
// a initlistener which handles connections, events
// get method which return io


const pub = new Redis({
  host: process.env.VALKEY_HOST,
  port: Number(process.env.VALKEY_PORT),
  username: process.env.VALKEY_USERNAME,
  password: process.env.VALKEY_PASSWORD,
});
const sub = new Redis({
  host: process.env.VALKEY_HOST,
  port: Number(process.env.VALKEY_PORT),
  username: process.env.VALKEY_USERNAME,
  password: process.env.VALKEY_PASSWORD,
});



class SocketService {
    private _io: Server;

    constructor() {
        console.log("initializing a new Server");


        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin:"*",
            },
        });
        sub.subscribe('MESSAGES', )

        console.log('Initialized a new Server');
    }

    public initListeners() {
        const io = this.io;
        console.log("INitializing socket lsiteners>...");
        io.on('connect', (socket) => {
            console.log(`new socket with id : ${socket.id} has connected`);
            socket.on('event:message', async ({message} : {message:string})=>{
                console.log("New message : " , message);
                //whenever a new message is available, it has to be published to 
                //redis or valkey
                await pub.publish("MESSAGES", JSON.stringify({message}))
                console.log("published to MESSAGES")
            })
        })
        sub.on('message', async (channel,message) => {
            if(channel==="MESSAGES"){
                io.emit('message', message)
                await prismaClient.message.create({
                    data: {
                        text: message,
                    }
                })
            }
        })
    }
    get io(){
        return this._io;

    }
}

export default SocketService;