import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { parse } from 'url';
import { generateRoomCode, message } from './util';

const app = express();

//initialize a simple http server
const server = http.createServer(app);
server.on('upgrade', handleUpgrade);
const socketServers: { [code: string]: WebSocket.Server } = { };
const errorServer: WebSocket.Server = new WebSocket.Server({ noServer: true });
errorServer.on('connection', (ws) => {
    ws.send(JSON.stringify({
        type: "404",
        message: ""
    }));
    ws.on('close', () => {
        console.log("Clients connected to error server: " + errorServer.clients.size.toString());
    });
    console.log("Clients connected to error server: " + errorServer.clients.size.toString());
});


function handleUpgrade(request: http.IncomingMessage, socket: any, head: Buffer) {
    const pathname = parse(request.url as string).pathname?.substring(1) || "";

    if(pathname === "open-room") {
        openNewRoom(request, socket, head);
    }
    else if(socketServers.hasOwnProperty(pathname)) {
        var wss = socketServers[pathname];
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        errorServer.handleUpgrade(request, socket, head, function done(ws) {
            errorServer.emit('connection', ws, request);
        });
    }
}

function openNewRoom(request: http.IncomingMessage, socket: any, head: Buffer) {
    const roomCode: string = generateRoomCode(4);
    socketServers[roomCode] = createNewSocketServer(request, socket, head, roomCode);
}

function createNewSocketServer(request: http.IncomingMessage, socket: any, head: Buffer, roomCode: string): WebSocket.Server {
    const wss = new WebSocket.Server({ noServer: true });
    wss.on("connection", (ws) => {
        console.log("Clients connected for server " + roomCode + ": " + wss.clients.size.toString());
        ws.on('message', (data) => {
            var messageObject: message = JSON.parse(data.toString());
            if(messageObject.type === "clientUpdate" && messageObject.message.length > 0) {
                broadcast(wss, JSON.stringify({
                    type: "serverUpdate",
                    message: messageObject.message
                }));
            } else if (messageObject.type === "clientRequestUpdate") {
                broadcast(wss, JSON.stringify({
                    type: "serverRequestUpdate",
                    message: messageObject.message
                }));
            }
        });
        ws.on('close', () => {
            console.log("Clients connected for server " + roomCode + ": " + wss.clients.size.toString());
        });
        ws.send(JSON.stringify({
            type: "roomCode",
            message: roomCode
        }));

    });

    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });

    setTimeout(() => {
        broadcast(wss, JSON.stringify({
            type: "close",
            message: ""
        }));
        wss.close()
        delete socketServers[roomCode];
    }, 300000);

    return wss;
}

function broadcast(wss: WebSocket.Server, message: any): void {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(server.address());
});