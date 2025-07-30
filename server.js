const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

let rooms = {};

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    switch (data.type) {
      case "join":
        if (!rooms[data.room]) rooms[data.room] = [];
        rooms[data.room].push(ws);

        const youAreCaller = rooms[data.room].length === 1;
        ws.send(JSON.stringify({ type: "joined", youAreCaller }));

        rooms[data.room].forEach(client => {
          if (client !== ws) client.send(JSON.stringify({ type: "peerJoined" }));
        });
        break;

      case "offer":
      case "answer":
      case "candidate":
        rooms[data.room].forEach(client => {
          if (client !== ws) client.send(msg);
        });
        break;
    }
  });

  ws.on("close", () => {
    for (let room in rooms) {
      rooms[room] = rooms[room].filter(client => client !== ws);
    }
  });
});

console.log("WebSocket signaling server running on ws://localhost:3000");
          
