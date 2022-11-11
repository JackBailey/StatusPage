const services = require("../../../services/index");
const { userAuthorized } = require("../../modules/checkAuth");

module.exports = {
	async execute(interaction) {
		if (!userAuthorized(interaction)) return;
		var serviceOption = interaction.options.getString("service");
		var statusOption = interaction.options.getString("status");
		var descriptionOption = interaction.options.getString("custom-description");

		services.service.update(serviceOption, statusOption, descriptionOption, interaction.user);

		await interaction.reply({ content: `Successfully updated \`${serviceOption}\` to \`${statusOption}\``, ephemeral: true });
	},
};
