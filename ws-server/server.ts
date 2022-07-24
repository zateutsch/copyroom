import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { parse } from 'url';
import { generateRoomCode } from './util';

const app = express();

//initialize a simple http server
const server = http.createServer(app);
server.on('upgrade', handleUpgrade);
const socketServers: { [code: string]: WebSocket.Server } = { };

function handleUpgrade(request: http.IncomingMessage, socket: any, head: Buffer) {
    const pathname = parse(request.url as string).pathname || "";

    if(pathname === "/open-room") {
        openNewRoom(request, socket, head);
        console.log(1);
        console.log(Object.entries(socketServers));
    }
    else if(socketServers.hasOwnProperty(pathname)) {
        console.log(pathname);
        console.log(2);
    }
}

function openNewRoom(request: http.IncomingMessage, socket: any, head: Buffer) {
    const roomCode: string = generateRoomCode(4);
    socketServers[roomCode] = createNewSocketServer(request, socket, head);
}

function createNewSocketServer(request: http.IncomingMessage, socket: any, head: Buffer): WebSocket.Server {
    const wss = new WebSocket.Server({ noServer: true });
    wss.on("connection", (ws) => {
        ws.on('message', (data) => {
            console.log(data.toString());
            console.log(3);
        });
    });
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });

    return wss;
}


//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(server.address());
});