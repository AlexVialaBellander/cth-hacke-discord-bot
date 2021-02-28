const chalk = require('chalk');
const fs = require('fs');

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

        let guild = await client.guilds.fetch(interaction.guild_id)
        let roles = await guild.roles.fetch(interaction.guild_id)
        let exists = roles.guild.roles.cache.some(role => role.name.toLowerCase() == name)
        
        //react on the target message with the target emoji
        let targetChannel = await client.channels.fetch(interaction.channel_id)
        let message = ""
        try {
            message = await targetChannel['messages'].fetch(target)
        } catch {
            console.log(chalk.yellowBright("REACT.ADD : Message not found in interaction channel"))
            break add
        }
        if(!exists){
            try {
                roles.guild.roles.create({
                    data: {
                    name: name.toLowerCase(),
                    color: '0x' + Math.floor(Math.random()*16777215).toString(16),
                    mentionable: true,
                    managed: true,
                    editable: false
                    },
                    reason: 'autocreated by rolebot',
                })  .then((data) => {
                    console.log(chalk.greenBright(`REACT.ADD : ${name} role created with id ${data.id}`))
                    message.react(emoji)
                        .then(() => {
                            console.log(chalk.greenBright(`REACT.ADD : reacted with ${emoji} on ${target}`)) 
                            //Update the keeper
                            let keeper = JSON.parse(fs.readFileSync("./features/react-keeper.json", "utf8"))
                            if(keeper[target] === undefined){
                                keeper[target] = {}
                            }
                            keeper[target][emoji.split(":")[1]] = data.id
                            keeperOutput = JSON.stringify(keeper, null, 2)
                            try {
                                fs.writeFile("./features/react-keeper.json", keeperOutput, { flag: "w+" }, error => {
                                    if(error) {
                                        console.log(error)
                                    }
                                })
                                console.log(chalk.greenBright(`REACT.ADD : keeper now: ${keeperOutput}`))
                            } catch {
                                console.log(chalk.redBright(`REACT.ADD : Error when writing to keeper`))
                            }
                        })
                })
            } catch {
                console.log(chalk.redBright(`REACT.ADD : Error when creating role`))
           }
        } else {console.log(chalk.redBright(`REACT.ADD : Role with name: ${name} already exists`))}
        
    }
}

function addListenerForAdd(client) {
    //REF: https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
    client.on('messageReactionAdd', async (reaction, user) => {
        target = await reaction.message.fetch()
        let keeper = JSON.parse(fs.readFileSync("./features/react-keeper.json", "utf8"))
        if(keeper[target.id] !== undefined){ //if message has a rolebot
            let member = await target.guild.members.fetch(user.id)
            try {
                member.roles.add(keeper[target.id][reaction.emoji.name])
            }
            catch {
                console.log(chalk.redBright(`REACT.messageReactionAdd : ${member} reacted with non-added emoji: ${reaction.emoji.name}, not found in keeper`))
            }
            console.log(chalk.greenBright(`REACT.messageReactionAdd : Added role ${reaction.emoji.name} to ${member}`))
        } else {console.log(`${target.id} not found in keeper`)}
      })
}

function addListenerForRemove(client) {
    client.on('messageReactionRemove', async (reaction, user) => {
        target = await reaction.message.fetch()
        let keeper = JSON.parse(fs.readFileSync("./features/react-keeper.json", "utf8"))
        if(keeper[target.id] !== undefined){ //if message has a rolebot
            let member = await target.guild.members.fetch(user.id)
            try {
                member.roles.remove(keeper[target.id][reaction.emoji.name])
            }
            catch {
                console.log(chalk.redBright(`REACT.addListenerForRemove : ${member} removed Reaction with non-added emoji: ${reaction.emoji.name}, not found in keeper`))
            }
            console.log(chalk.greenBright(`REACT.addListenerForRemove : Removed role ${reaction.emoji.name} to ${member}`))
        } else {console.log(`${target.id} not found in keeper`)}
    })
}

exports.addListenerForRemove = addListenerForRemove
exports.addListenerForAdd = addListenerForAdd
exports.handle = handle
exports.command = command;