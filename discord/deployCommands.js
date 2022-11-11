// https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const config = require("../config.json");
const serviceConfig = require("../services.json");
require("dotenv").config("../.env");
const Logger = require("@ptkdev/logger");

const logger = new Logger();

global.serviceConfig = serviceConfig;
global.config = config;
global.logger = logger;

if (!process?.env?.TOKEN) throw new Error("Discord client token not defined!");
if (!config?.discord?.bot?.client_id) throw new Error("Discord client id not defined!");

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync("./discord/commands").filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		logger.info(`Started refreshing ${commands.length} application (/) commands.`, "Discord");

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationGuildCommands(config.discord.bot.client_id, config.discord.bot.guild_id), { body: commands });

		logger.info(`Successfully reloaded ${data.length} application (/) commands.`, "Discord");
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
