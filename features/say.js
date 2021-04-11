//IMPORTS
//Import required modules
const reply = require('../handling/interactionReply.js');

//JSON document sent to Discord for layout of slashcommand.
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
                    name: "message-id",
                    description: "send the message ID you want to edit",
                    type: 3,
                    required: true
                },
                {
                    name: "description",
                    description: "explanatory message that will be posted in the channel",
                    type: 3,
                    required: false
                },
                {
                    name: "title",
                    description: "title of the message",
                    type: 3,
                    required: false
                }
            ]
        } 
        ]
}

//handler function for when runing slashcommand say 
async function handle(Discord, client, interaction, command, args) {
    //if slash command is /say create
    if(args[0]["name"] == "create") {
        //find the arguments
        const title = args[0]["options"].find(arg => arg.name.toLowerCase() == "title").value
        const description = args[0]["options"].find(arg => arg.name.toLowerCase() == "description").value
        var channel = "default"
        try {
            channel = args[0]["options"].find(arg => arg.name.toLowerCase() == "channel").value
        } catch {
        }
        //create the message
        const embedMessage = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(String(description).replace(/\\n/g, `\n`))
            .setColor(0xfa6607)
        //send the message to discord.
        client.channels.cache.get(channel == "default" ? interaction.channel_id : channel).send("", embedMessage)
        //send a reply to the discord api.
        reply.reply(client, interaction, `Message successfully posted using Hacke.`)

    } else edit : if (args[0]["name"] == "edit"){
        //if slash command is /say edit
        //find arguments
        const title = args[0]["options"].find(arg => arg.name.toLowerCase() == "title")
        const description = args[0]["options"].find(arg => arg.name.toLowerCase() == "description")
        const target = args[0]["options"].find(arg => arg.name.toLowerCase() == "message-id").value
        //fetch the target channel
        let targetChannel = await client.channels.fetch(interaction.channel_id)
        let message = ""
        try {
            //fetch the target message
            message = await targetChannel['messages'].fetch(target)
        } catch {
            //if unable to fetch message
            console.log("SAY.EDIT : Message not found in interaction channel")
            break edit
        }
        //build the new message and set the old content if no new content is given
        const embedMessage = new Discord.MessageEmbed()
            .setTitle(title == undefined ? message.embeds[0].title : title.value)
            .setDescription(description == undefined ? message.embeds[0].description : String(description.value).replace(/\\n/g, `\n`))
            .setColor(0xfa6607)
        //send update to discord
        message.edit("", embedMessage)
        //reply to discord api.
        reply.reply(client, interaction, `Message successfully edited using Hacke.`)
    }
}

exports.handle = handle;
exports.command = command;
