const { Client, Events, Collection, GatewayIntentBits, Partials, EmbedBuilder, Embed } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const config = require("../config.json");
const services = require("../services/index");
require("dotenv").config();

module.exports.init = async function () {
	if (!process?.env?.TOKEN) throw new Error("Discord client token not defined!");
	if (!config?.discord?.bot?.client_id) throw new Error("Discord client id not defined!");

	const client = new Client({
		intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages],
		partials: [Partials.Channel],
	});
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

	global.client = client;

	// Login client

	client.once(Events.ClientReady, (c) => {
		console.log(`Ready! Logged in as ${c.user.tag}`);
	});

	client.on(Events.MessageCreate, async (c) => {
		if (c.guildId || c.author.bot) return;

		let allServices = services.all();
		var statuses = config.statuses;

		// Destructure object of services into array
		allServices = Object.keys(allServices).map((id) => {
			let service = allServices[id];
			service.id = id;
			return service;
		});

		var embeds = Object.keys(statuses)
			.map((id) => {
				var status = statuses[id];
				let servicesInStatus = allServices.filter((service) => service.status == id);

				console.log(status, servicesInStatus.length);

				if (servicesInStatus.length == 0) return null;

				let listOfServicesInStatus = servicesInStatus.map((service) => service.title).join("\n");

				console.log(listOfServicesInStatus);

				return new EmbedBuilder().setTitle(status.title).setDescription(listOfServicesInStatus).setColor(`#${status.color}`);
			})
			.filter((embed) => embed !== null);

		await c.reply({ content: "All statuses:", embeds });
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
