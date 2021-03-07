const Discord = require("discord.js")
const logging = require("./handling/logging.js")
const commands = require("./handling/postCommands.js")
const say = require("./features/say.js")
const react = require("./features/react.js")
const dfoto = require("./features/dfoto.js")
const cffc = require("./features/cffc.js")
const room = require("./features/study-room.js")
const config = require("./config.json")


const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

react.addListenerForAdd(client)
react.addListenerForRemove(client)

client.on("message", message => {
    switch(message.content) {
        case "ping":
            message.channel.send("pong")
            break;
        case "!dfoto": 
            config.features.dfoto ? dfoto.action(message) : null
            break;
        case "!cffc":
            config.features.cffc ? cffc.action(message) : null
            break;
    }
})

client.on('voiceStateUpdate', async (oldState, newState) =>{
    room.handle_event(oldState, newState)
})

client.once("ready", () => {
    console.log(logging.startup)
    commands.post(client)

    //https://discord.com/developers/docs/interactions/slash-commands#interaction
    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase()
        const args = interaction.data.options

        switch(command) {
            case "say":
                config.features.say ? say.handle(Discord, client, interaction, command, args) : null
                break;
            case "react":
                config.features.react ? react.handle(Discord, client, interaction, command, args) : null
              break;
            case "click":
                config.features.click_to_create ? room.handle(Discord, client, interaction, command, args) : null
            default:
              // code block
          }
    })
    
})

client.login(config.token)