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

exports.command = command;