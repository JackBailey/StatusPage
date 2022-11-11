const config = require("../../config.json");
const fs = require("node:fs");

let lastMessage = null;

async function init() {
	var channel = await client.channels.cache.get(config.discord.statusChannel.id);
	try {
		var message = await channel.messages.fetch(config.discord.statusChannel.lastMessage);
	} catch {
		var message = await channel.send({ content: "Loading..." });
		config.discord.statusChannel.lastMessage = message.id;
		fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
	} finally {
		lastMessage = message;
	}
}

async function update(embeds) {
	await lastMessage.edit({ content: "", embeds });
}

module.exports = {
	init,
	update,
};
