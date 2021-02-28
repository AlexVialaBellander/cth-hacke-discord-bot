const Discord = require("discord.js")
const say = require("./features/say.js")
const react = require("./features/react.js")
const dfoto = require("./features/dfoto.js")
const config = require("./config.json")


const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

react.addListenerForAdd(client)
react.addListenerForRemove(client)

client.on("message", message => {
    if (message.content === "ping") {
        message.channel.send("pong");
    } else if (message.content === "!dfoto") {
        dfoto.random()
        .then((url) => message.channel.send({
             files: [{
                attachment: url,
                name: 'dfoto_random.jpg'
             }]
          }))
    }
})




client.once("ready", () => {
    console.log("bot is online")
    
    //https://discord.com/developers/docs/interactions/slash-commands#create-guild-application-command
    client.api.applications(client.user.id).guilds('812278673386111016').commands.post({
        data: say.command
    })

    client.api.applications(client.user.id).guilds('812278673386111016').commands.post({
        data: react.command
    })

    //https://discord.com/developers/docs/interactions/slash-commands#interaction
    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase()
        const args = interaction.data.options

        switch(command) {
            case "say":
                say.handle(Discord, client, interaction, command, args)
                break;
            case "react":
                react.handle(Discord, client, interaction, command, args)
              break;
            default:
              // code block
          }
    })
    
})

client.login(config)