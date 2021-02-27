const Discord = require("discord.js")

const client = new Discord.Client()

client.on("message", message => {
    if (message.content === "ping") {
      message.channel.send("pong");
    }
})

client.on("messageReactionAdd", (reaction, user) => {
    handleReaction(reaction, user, "add")


})

client.on("messageReactionRemove", (reaction, user) => {
    handleReaction(reaction, user, "remove")
    
})


async function handleReaction(reaction, user, type){
    console.log(reaction.emoji.name)
    console.log(reaction.emoji)
}


client.once("ready", () => {
    console.log("bot is online")
    console.log(client.channels.cache)
    /*
    client.api.applications(client.user.id).commands.get().then(function(data) {
        console.log(data);
    });
    

    
    client.api.applications(client.user.id).guilds('812278673386111016').commands('812390099714179152').delete().then(function(data) {
        console.log(data);
    });

    client.api.applications(client.user.id).guilds('812278673386111016').commands.get().then(function(data) {
        console.log(data);
    }); 
    */

    client.api.applications(client.user.id).guilds('812278673386111016').commands.post({
        data: {
            name: "rolebot",
            description: "add a role to the rolebot",
            options: [
                {
                    name: "create",
                    description: "the link of the message you want to add roles to",
                    type: 1,
                    options: [
                        {
                            name: "title",
                            description: "title of the message",
                            type: 3,
                            required: true
                        },
                        {
                            name: "message",
                            description: "explanatory message that will be posted in the channel",
                            type: 3,
                            required: true
                        },
                        {
                            name: "channel",
                            description: "choose a channel to post your message",
                            type: 7,
                            required: false
                        }
                    ]
                },
                {
                    name: "add",
                    description: "the link of the message you want to add roles to",
                    type: 1,
                    options: [
                        {
                            name: "message",
                            description: "the link of the message you want to add roles to",
                            type: 3,
                            required: true
                            },
                            {
                            name: "emoji ",
                            description: "select an emoji for the role",
                            type: 3,
                            required: true
                            },
                            {
                            name: "role_name",
                            description: "a role will be created with this name. The role to be assigned when pressing the emoji",
                            type: 3,
                            required: true
                            }
                    ]
                } 
            ]
        }
    })

    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase()
        const args = interaction.data.options

        if(command == "rolebot") {
            
            if(args[0]["name"] == "create") {
                const title = args[0]["options"].find(arg => arg.name.toLowerCase() == "title").value
                const message = args[0]["options"].find(arg => arg.name.toLowerCase() == "message").value
                var channel = "default"
                try {
                    channel = args[0]["options"].find(arg => arg.name.toLowerCase() == "channel").value
                } catch {
                }
                const embedMessage = new Discord.MessageEmbed()
                    .setTitle(title)
                    .setDescription(message)
                    .setColor(0xfa6607)
                client.channels.cache.get(channel == "default" ? interaction.channel_id : channel).send("", embedMessage)

            } else if (args[0]["name"] == "add"){

                const target = args[0]["options"].find(arg => arg.name.toLowerCase() == "message").value.split("/")
                const emoji = args[0]["options"].find(arg => arg.name.toLowerCase() == "emoji").value
                const role_name = args[0]["options"].find(arg => arg.name.toLowerCase() == "role_name").value

                if(!client.guilds.cache.get('812278673386111016').roles.cache.some(role => role.name.toLowerCase() == role_name)){
                    client.guilds.cache.get(interaction.guild_id).roles.create({
                        data: {
                        name: role_name.toLowerCase(),
                        color: '0x' + Math.floor(Math.random()*16777215).toString(16),
                        mentionable: true,
                        managed: true,
                        editable: false
                        },
                        reason: 'autocreated by rolebot',
                    }).catch(console.error)
                    
                    //react on the target message with the target emoji
                    client.channels.cache.get(target[target.length - 2]).messages
                        .fetch(target[target.length - 1])
                        .then(function (message) { 
                            message.react(emoji) 
                        })
                    
  


                } else (console.log("role with this name already exists"))
            }
        }
    })
    
})

async function createAPIMessage(interaction, content) {
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel.id), content)
        .resolveData()
        .resolveFiles()
    return apiMessage
}

client.login('ODEyMzE0Mzg0NTYxODY0NzM2.YC-8uQ.FTV45fE67raOydDhkMGd1TsRds8')