let command = {
    name: "say",
        description: "interact as Hacke",
        options: [
            {
                name: "create",
                description: "create a post as Hacke",
                type: 1,
                options: [
                    {
                        name: "title",
                        description: "title of the message",
                        type: 3,
                        required: true
                    },
                    {
                        name: "description",
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
                name: "edit",
                description: "edit a Hacke message",
                type: 1,
                options: [
                    {
                        name: "title",
                        description: "title of the message",
                        type: 3,
                        required: false
                    },
                    {
                        name: "description",
                        description: "explanatory message that will be posted in the channel",
                        type: 3,
                        required: false
                    },
                    {
                        name: "message-id",
                        description: "send the message ID you want to edit",
                        type: 3,
                        required: true
                    }
                ]
            } 
        ]
}

async function handle(Discord, client, interaction, command, args) {
    if(args[0]["name"] == "create") {
        const title = args[0]["options"].find(arg => arg.name.toLowerCase() == "title").value
        const description = args[0]["options"].find(arg => arg.name.toLowerCase() == "description").value
        var channel = "default"
        try {
            channel = args[0]["options"].find(arg => arg.name.toLowerCase() == "channel").value
        } catch {
        }
        const embedMessage = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(0xfa6607)
        client.channels.cache.get(channel == "default" ? interaction.channel_id : channel).send("", embedMessage)

    } else edit : if (args[0]["name"] == "edit"){
        const title = args[0]["options"].find(arg => arg.name.toLowerCase() == "title")
        const description = args[0]["options"].find(arg => arg.name.toLowerCase() == "description")
        const target = args[0]["options"].find(arg => arg.name.toLowerCase() == "message-id").value
        let targetChannel = await client.channels.fetch(interaction.channel_id)
        let message = ""
        try {
            message = await targetChannel['messages'].fetch(target)
        } catch {
            console.log("SAY.EDIT : Message not found in interaction channel")
            break edit
        }
        const embedMessage = new Discord.MessageEmbed()
            .setTitle(title == undefined ? message.embeds[0].title : title.value)
            .setDescription(description == undefined ? message.embeds[0].description : description.value)
            .setColor(0xfa6607)
        message.edit("", embedMessage)
    }
}

exports.handle = handle;
exports.command = command;
