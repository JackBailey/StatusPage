const services = require("../../../services/index");
const serviceEmbed = require("../../modules/serviceEmbed");

module.exports = {
	async execute(interaction) {
		console.log(interaction.options.getString("service"));
		var serviceOption = interaction.options.getString("service");

		var embeds = [];

		if (!serviceOption) {
			var allServices = services.list();
			Object.values(allServices).forEach((service) => {
				embeds.push(serviceEmbed.embed(service.title, service.status, service.customDescription));
			});
		} else {
			var service = services.service.get(serviceOption);
			embeds.push(serviceEmbed.embed(service.title, service.status, service.customDescription));
		}

		await interaction.reply({ embeds });
	},
};
