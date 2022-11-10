const discord = require("./discord")
const config = require("./config.json")


global.config = config


discord.init()