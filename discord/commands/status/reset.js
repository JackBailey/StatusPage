const services = require("../../../services/index");

module.exports = {
	async execute(interaction) {
		var serviceOption = interaction.options.getString("service");
		services.reset(serviceOption);

		await interaction.reply({ content: `Successfully reset ${serviceOption ? serviceOption + "'s status" : "All Services's statuses"}` });
	},
};
