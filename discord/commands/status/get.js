const services = require("../../../services/index");
const serviceEmbed = require("../../modules/serviceEmbed");

module.exports = {
	async execute(interaction) {
		var serviceOption = interaction.options.getString("service");

		var embeds = [];

		if (!serviceOption) {
			var allServices = services.all();
			Object.keys(allServices).forEach((id) => {
				const service = allServices[id];
				embeds.push(serviceEmbed.embed(service, id));
			});
		} else {
			var service = services.service.get(serviceOption);
			embeds.push(serviceEmbed.embed(service, serviceOption));
		}

		await interaction.reply({ embeds, ephemeral: embeds.length > 1 });
	},
};
