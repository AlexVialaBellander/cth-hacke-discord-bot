//import features that use slash commands
const say = require("../features/say.js")
const react = require("../features/react.js")
//import config
const config = require("../config.json")

function post(client) {
    if(config.developer.testing) {
        //https://discord.com/developers/docs/interactions/slash-commands#create-guild-application-command
        //post to one guild for testing, this is direct
        client.api.applications(client.user.id).guilds(config.developer.guild_id).commands.post({
            data: say.command
        })

        client.api.applications(client.user.id).guilds(config.developer.guild_id).commands.post({
            data: react.command
        })
    } else {
        //https://discord.com/developers/docs/interactions/slash-commands#create-global-application-command
        
        client.api.applications(client.user.id).commands.post({
            data: say.command
        })

        client.api.applications(client.user.id).commands.post({
            data: react.command
        })
    }
}

exports.post = post