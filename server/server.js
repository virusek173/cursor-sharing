const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();
console.log('Server listening on 7071 port...');

wss.on('error', console.error);

wss.on('connection', (ws) => {
    const sender = uuid();
    const color = Math.floor(Math.random() * 361);
    const metadata = { sender, color };
    console.log(`Client with sender ${sender} connected!`)
    clients.set(ws, metadata);      
    
    ws.on('message', (buf) => {
        const data = JSON.parse(buf.toString());
        const { cursorCoords } = data
        const payload = { cursorCoords, color, sender }

        clients.forEach((_, _ws) => {
            _ws.send(JSON.stringify(payload));
        }) 
    })
})


