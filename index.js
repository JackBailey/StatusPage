const discord = require("./discord");
const config = require("./config.json");
const services = require("./services/index.js");

global.config = config;

discord.init();
