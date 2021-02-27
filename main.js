const Discord = require("discord.js")
const say = require("./features/say.js")
const config = require("config.json")


const client = new Discord.Client()

client.on("message", message => {
    if (message.content === "ping") {
      message.channel.send("pong");
    }
})

client.once("ready", () => {
    console.log("bot is online")
    console.log(config)
    /*
    client.api.applications(client.user.id).guilds('812278673386111016').commands.get().then(function(data) {
        console.log(data);
    });
    

    
    client.api.applications(client.user.id).guilds('812278673386111016').commands('815248387271426099').delete().then(function(data) {
        console.log(data);
    });

    client.api.applications(client.user.id).guilds('812278673386111016').commands.get().then(function(data) {
        console.log(data);
    }); 
    */

    client.api.applications(client.user.id).guilds('812278673386111016').commands.post({
        data: say.command
    })

    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase()
        const args = interaction.data.options

        if(command == "say") {
            say.handle(Discord, client, interaction, command, args)
        }
    })
    
})

async function createAPIMessage(interaction, content) {
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel.id), content)
        .resolveData()
        .resolveFiles()
    return apiMessage
}

client.login(config)