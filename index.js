const discord = require("./discord");
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

app.set("view engine", "ejs");
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = new Server(server);

discord.init();

app.get("/api/statuses", require("./api/statuses"));

app.get("/api/status/:service", require("./api/status"));

app.get("/api/config", require("./api/config"));

app.get("/status", require("./api/legacy/statuses"));

app.get("/status/:service", require("./api/legacy/status"));

// websocket

io.on("connection", (socket) => {
	console.log(`[SocketIO] New connection from ${socket.handshake.address} - Total Clients: ${io.engine.clientsCount}`);
});

global.io = io;

// Handle 404s
app.use((req, res) => {
	const { errorPage } = require("./api/error");
	errorPage(req, res, 404);
});

server.listen(process.env.PORT || 3000, () => {
	console.log(`Listening on port ${process.env.PORT || 3000}`);
});
