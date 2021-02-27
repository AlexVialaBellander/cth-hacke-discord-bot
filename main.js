const Discord = require("discord.js")
const say = require("./features/say.js")
const react = require("./features/react.js")
const config = require("./config.json")


const client = new Discord.Client()

client.on("message", message => {
    if (message.content === "ping") {
      message.channel.send("pong");
    }
})

client.once("ready", () => {
    console.log("bot is online")

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
                console.log("rolebot command launched")
              break;
            default:
              // code block
          }


        if(command == "say") {
        }
    })
    
})

client.login(config)