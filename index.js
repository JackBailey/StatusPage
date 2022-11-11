const discord = require("./discord");
const express = require("express");

const app = express();
app.set("view engine", "ejs");

discord.init();

app.get("/api/statuses", require("./api/statuses"));

app.get("/api/status/:service", require("./api/status"));

app.get("/status", require("./api/legacy/statuses"));

app.get("/status/:service", require("./api/legacy/status"));

// Handle 404s
app.use((req, res) => {
	const { errorPage } = require("./api/error");
	errorPage(req, res, 404);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Listening on port ${process.env.PORT || 3000}`);
});
