const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("node:path");
const fs = require("node:fs");
const servicesConfig = require("../../services.json");
const config = require("../../config.json");

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
		.addSubcommand((subcommand) =>
			subcommand
				.setName("get")
				.setDescription("Gets a service's status")
				.addStringOption((option) => {
					option.setName("service").setDescription("The service to get the status for").setRequired(false);
					Object.keys(servicesConfig).map((service) => {
						option.addChoices({
							name: service,
							value: service,
						});
					});
					return option;
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("set")
				.setDescription("Sets a service's status")
				.addStringOption((option) => {
					option.setName("service").setDescription("The service to set the status for").setRequired(true);
					Object.keys(servicesConfig).map((service) => {
						option.addChoices({
							name: service,
							value: service,
						});
					});
					return option;
				})
				.addStringOption((option) => {
					option.setName("status").setDescription("The status to set the service to").setRequired(true);

					Object.keys(config.statuses).forEach((status) => {
						option.addChoices({
							name: status,
							value: status,
						});
					});

					return option;
				})
				.addStringOption((option) => {
					return option
						.setName("custom-description")
						.setDescription("A custom description to set for the chosen service's status")
						.setRequired(false);
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("reset")
				.setDescription("Resets a service's status")
				.addStringOption((option) => {
					option.setName("service").setDescription("The service to reset the status for").setRequired(false);
					Object.keys(servicesConfig).map((service) => {
						option.addChoices({
							name: service,
							value: service,
						});
					});
					return option;
				})
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand(false);
		if (!commands.hasOwnProperty(subcommand)) {
			logger.warning(`The subcommand at ${subcommand} does not exist.`, "Discord");
			interaction.reply({ content: "Invalid Subcommand." });
			return;
		}

		commands[subcommand].execute(interaction);
	},
};
