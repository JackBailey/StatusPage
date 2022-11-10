const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const config = require("../config.json");
require("dotenv").config();

module.exports.init = async function () {
	if (!process?.env?.TOKEN) throw new Error("Discord client token not defined!");
	if (!config?.discord?.bot?.client_id) throw new Error("Discord client id not defined!");

	const client = new Client({ intents: [GatewayIntentBits.Guilds] });
	client.commands = new Collection();

	// Register commands

	const commandsPath = path.join(__dirname, "commands");
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}

	// Login client

	client.once(Events.ClientReady, (c) => {
		console.log(`Ready! Logged in as ${c.user.tag}`);
	});

	// Handle interactions

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	});

	client.login(process.env.TOKEN);
};
