const services = require("../../../services/index");
const { userAuthorized } = require("../../modules/checkAuth");

module.exports = {
	async execute(interaction) {
		if (!userAuthorized(interaction)) return;
		var serviceOption = interaction.options.getString("service");
		services.reset(serviceOption, interaction.user);

		await interaction.reply({
			content: `Successfully reset ${serviceOption ? serviceOption + "'s status" : "All Services's statuses"}`,
			ephemeral: true,
		});
	},
};
