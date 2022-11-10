const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("node:path");
const fs = require("node:fs");
// const get = require("./get");

const commandsPath = path.join(__dirname, "status");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

// This is so hacky
const commands = Object.fromEntries(
	commandFiles.map((file) => {
		var commandPath = path.join(__dirname, "status", file);
		var command = require(commandPath);
		return [file.replace(".js", ""), command];
	})
);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("status management")
		.addSubcommand((subcommand) => subcommand.setName("get").setDescription("Sets a service's status")),
	async execute(interaction) {
		const subcommand = interaction.options._subcommand;
		if (!commands.hasOwnProperty(subcommand)) {
			console.log(`[WARNING] The subcommand at ${subcommand} does not exist.`);
			interaction.reply({ content: "Invalid Subcommand." });
			return;
		}

		commands[subcommand].execute(interaction);
	},
};
