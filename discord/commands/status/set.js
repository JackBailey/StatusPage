const services = require("../../../services/index");
// const serviceEmbed = require("../../modules/serviceEmbed");

module.exports = {
	async execute(interaction) {
		var serviceOption = interaction.options.getString("service");
		var statusOption = interaction.options.getString("status");
		var descriptionOption = interaction.options.getString("custom-description");

		services.service.update(serviceOption, statusOption, descriptionOption);

		await interaction.reply({ content: `Successfully updated \`${serviceOption}\` to \`${statusOption}\`` });
	},
};
