//IMPORTS
//Import required modules
const chalk = require('chalk');
const fs = require('fs');
const emojiMap = require('emoji-unicode-to-name');
const reply = require('../handling/interactionReply.js');

//JSON document sent to Discord for layout of slashcommand.
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
                    name: "message-id",
                    description: "send the message ID you want to add the bot to",
                    type: 3,
                    required: true
                },
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
                }
            ]
        },
        {
            name: "disable",
            description: "disable the react-role-bot from a message",
            type: 1,
            options: [
                {
                    name: "message-id",
                    description: "send the message ID to remove react bot from that message",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "remove a role from the message",
            type: 1,
            options: [
                {
                    name: "message-id",
                    description: "send the message ID to remove react bot from that message",
                    type: 3,
                    required: true
                },
                {
                    name: "emoji",
                    description: "emoji representing the role you want to remove",
                    type: 3,
                    required: true
                }
            ]
        }
        ]
}

//handler function for when enabling react bot on a channel
async function handle(Discord, client, interaction, command, args) {
    //if slash command argument is add, do this.
    add : if(args[0]["name"] == "add") {
        //find emoji, name and target text message from the user input.
        const emoji = args[0]["options"].find(arg => arg.name.toLowerCase() == "emoji").value
        const name = args[0]["options"].find(arg => arg.name.toLowerCase() == "role-name").value
        const target = args[0]["options"].find(arg => arg.name.toLowerCase() == "message-id").value

        //fetch guild and roles from the interaction
        let guild = await client.guilds.fetch(interaction.guild_id)
        let roles = await guild.roles.fetch(interaction.guild_id)
        let exists = roles.guild.roles.cache.some(role => role.name.toLowerCase() == name)
        
        //react on the target message with the target emoji
        let targetChannel = await client.channels.fetch(interaction.channel_id)
        let message = ""
        try {
            //fetch the target message.
            message = await targetChannel['messages'].fetch(target)
        } catch {
            console.log(chalk.yellowBright("REACT.ADD : Message not found in interaction channel"))
            //send a reply to the discord api.
            reply.reply(client, interaction, `Message not found in interaction channel`)
            break add
        }
        //if there does not already exist a role with the user input defined name.
        if(!exists){
            try {
                //create the role with said name.
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
                    //react on the message with the emoji from user input.
                    message.react(emoji)
                        .then(() => {
                            console.log(chalk.greenBright(`REACT.ADD : reacted with ${emoji} on ${target}`)) 
                            //Update the keeper
                            let keeper = JSON.parse(fs.readFileSync("./features/keepers/react-keeper.json", "utf8"))
                            if(keeper[target] === undefined){
                                keeper[target] = {}
                            }
                            let emojiName = emojiMap.get(emoji)
                            if(emojiName === undefined){
                                emojiName = emoji.split(":")[1]
                            }
                            keeper[target][emojiName] = data.id
                            keeperOutput = JSON.stringify(keeper, null, 2)
                            try {
                                fs.writeFile("./features/keepers/react-keeper.json", keeperOutput, { flag: "w+" }, error => {
                                    if(error) {
                                        console.log(error)
                                    }
                                })
                                console.log(chalk.greenBright(`REACT.ADD : keeper now: ${keeperOutput}`))
                            } catch {
                                console.log(chalk.redBright(`REACT.ADD : Error when writing to keeper`))
                                //send a reply to the discord api.
                                reply.reply(client, interaction, `Error when writing to keeper`)
                            }
                        })
                })
            } catch {
                console.log(chalk.redBright(`REACT.ADD : Error when creating role`))
                //send a reply to the discord api.
                reply.reply(client, interaction, `Error when creating role`)
           }
        } else {
            console.log(chalk.redBright(`REACT.ADD : Role with name: ${name} already exists`))
            //send a reply to the discord api.
            reply.reply(client, interaction, `Role with name: ${name} already exists`)
        }
    reply.reply(client, interaction, `React-to-role successfully added`) 
    } else disable : if(args[0]["name"] == "disable") { //if the slash command argument is disable, run this.  
        //fetch target message from user input and fetch all channel(s) from interaction
        const target = args[0]["options"].find(arg => arg.name.toLowerCase() == "message-id").value
        let targetChannel = await client.channels.fetch(interaction.channel_id)
        let targetMessage = await targetChannel.messages.fetch(target)
        let keeper = JSON.parse(fs.readFileSync("./features/keepers/react-keeper.json", "utf8"))

        //for every role in the keeper related to the message.
        for (var e in keeper[target]) {
            //fetch the role from Discord
            let role = await targetChannel.guild.roles.fetch(keeper[target][e])
            //delete the role
            role.delete()
            console.log(chalk.greenBright(`REACT.DISABLE : Removed role ${keeper[target][e]}`))
        }
        //once all roles are removed, (above), remove entry from keeper.
        delete keeper[target]
        keeperOutput = JSON.stringify(keeper, null, 2)

        try {
            fs.writeFile("./features/keepers/react-keeper.json", keeperOutput, { flag: "w+" }, error => {
                if(error) {
                    console.log(error)
                }
            })
            console.log(chalk.greenBright(`REACT.DISABLE : keeper now: ${keeperOutput}`))
        } catch {
            console.log(chalk.redBright(`REACT.DISABLE : Error when writing to keeper`))
        }
        //remove all reactions from the message
        targetMessage.reactions.removeAll()
        console.log(chalk.greenBright(`REACT.DISABLE : Removed All Reactions on ${target}`))
        //send a reply to the discord api.
        reply.reply(client, interaction, `Successfully removed all reactions on ${target}`)

    } else remove : if(args[0]["name"] == "remove") { //if the slash command argument is remove, run this. 
        //fetch target message from user input and fetch all channel(s) from interaction
        const target = args[0]["options"].find(arg => arg.name.toLowerCase() == "message-id").value
        const emoji = args[0]["options"].find(arg => arg.name.toLowerCase() == "emoji").value
        let targetChannel = await client.channels.fetch(interaction.channel_id)
        let targetMessage = await targetChannel.messages.fetch(target)
        let keeper = JSON.parse(fs.readFileSync("./features/keepers/react-keeper.json", "utf8"))

        //decide emojiName for keeper
        let emojiName = emojiMap.get(emoji)
        if(emojiName === undefined){
            emojiName = emoji.split(":")[1]
        }
        //remove reaction from message.
        targetMessage.reactions.cache.get(emojiMap.get(emoji) === undefined ? emoji.split(":")[2].split(">")[0] : emoji).remove()
        //fetch role.
        let role = await targetChannel.guild.roles.fetch(keeper[target][emojiName])
        //remove role.
        role.delete()
        console.log(chalk.greenBright(`REACT.REMOVE : Removed role ${keeper[target][e]}`))
        //update keeper
        delete keeper[target][emojiName]
        let counter = 0
        for (var e in keeper[target]) {
            counter = counter + 1
        }
        if(counter == 0) {
            delete keeper[target]
        }
        keeperOutput = JSON.stringify(keeper, null, 2)
        try {
            fs.writeFile("./features/keepers/react-keeper.json", keeperOutput, { flag: "w+" }, error => {
                if(error) {
                    console.log(error)
                }
            })
            console.log(chalk.greenBright(`REACT.REMOVE : keeper now: ${keeperOutput}`))
        } catch {
            console.log(chalk.redBright(`REACT.REMOVE : Error when writing to keeper`))
        }
        console.log(chalk.greenBright(`REACT.REMOVE : Removed reaction ${emoji} from ${target}`))
        //send a reply to the discord api.
        reply.reply(client, interaction, `Successfully removed reaction ${emoji} from ${target}`)
    }
    
}

function addListenerForAdd(client) {
    //REF: https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
    client.on('messageReactionAdd', async (reaction, user) => {
        //on Reaction add events.
        //exit function if the bot is reacting.
        if(client.user.id == user.id) return;
        //fetch the message.
        target = await reaction.message.fetch()
        //get keeper
        let keeper = JSON.parse(fs.readFileSync("./features/keepers/react-keeper.json", "utf8"))
         //check if message has a rolebot assigned in keeper.
        if(keeper[target.id] !== undefined){
            let member = await target.guild.members.fetch(user.id)
            let emojiName = emojiMap.get(reaction.emoji.name)
            if(emojiName === undefined){
                emojiName = reaction.emoji.name.split(":")[0]
            }
            try {
                member.roles.add(keeper[target.id][emojiName])
                console.log(chalk.greenBright(`REACT.messageReactionAdd : Added role ${reaction.emoji.name} to ${member}`))
            }
            catch {
                console.log(chalk.redBright(`REACT.messageReactionAdd : ${member} reacted with non-added emoji: ${reaction.emoji.name}, not found in keeper`))
            }
        } else {console.log(chalk.yellowBright(`REACT.messageReactionAdd : ${target.id} not found in keeper`))}
      })
}

function addListenerForRemove(client) {
    client.on('messageReactionRemove', async (reaction, user) => {
        //on Reaction remove events.
        //fetch the message.
        target = await reaction.message.fetch()
        //get keeper
        let keeper = JSON.parse(fs.readFileSync("./features/keepers/react-keeper.json", "utf8"))
         //check if message has a rolebot assigned in keeper.
        if(keeper[target.id] !== undefined){
            let member = await target.guild.members.fetch(user.id)
            //get the correct emojiname.
            let emojiName = emojiMap.get(reaction.emoji.name)
            if(emojiName === undefined){
                emojiName = reaction.emoji.name.split(":")[0]
            }
            try {
                //remove role from user who reacted.
                member.roles.remove(keeper[target.id][emojiName])
                console.log(chalk.greenBright(`REACT.addListenerForRemove : Removed role ${reaction.emoji.name} to ${member}`))
            }
            catch {
                console.log(chalk.redBright(`REACT.addListenerForRemove : ${member} removed Reaction with non-added emoji: ${reaction.emoji.name}, not found in keeper`))
            }
        } else {console.log(chalk.yellowBright(`REACT.addListenerForRemove : ${target.id} not found in keeper`))}
    })
}

exports.addListenerForRemove = addListenerForRemove
exports.addListenerForAdd = addListenerForAdd
exports.handle = handle
exports.command = command;