let command = {
    name: "react",
        description: "A react-role-bot",
        options: [
            {
                name: "add",
                description: "add a react-listener",
                type: 1,
                options: [
                    {
                        name: "emoji",
                        description: "emoji users will use to join the role",
                        type: 3,
                        required: true
                    },
                    {
                        name: "role-name",
                        description: "name of the role to join",
                        type: 3,
                        required: true
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
    add : if(args[0]["name"] == "add") {
        const emoji = args[0]["options"].find(arg => arg.name.toLowerCase() == "emoji").value
        const name = args[0]["options"].find(arg => arg.name.toLowerCase() == "role-name").value
        const target = args[0]["options"].find(arg => arg.name.toLowerCase() == "message-id").value

        //react on the target message with the target emoji
        let targetChannel = await client.channels.fetch(interaction.channel_id)
        let message = ""
        try {
            message = await targetChannel['messages'].fetch(target)
        } catch {
            console.log("REACT.ADD : Message not found in interaction channel")
            break add
        }
        message.react(emoji)
    }
}

exports.handle = handle
exports.command = command;