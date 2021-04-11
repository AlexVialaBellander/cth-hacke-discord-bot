//IMPORTS
//Import required modules
const Discord = require("discord.js")
const logging = require("./handling/logging.js")
const commands = require("./handling/postCommands.js")
const say = require("./features/say.js")
const react = require("./features/react.js")
const dfoto = require("./features/dfoto.js")
const cffc = require("./features/cffc.js")
const room = require("./features/study-room.js")
const config = require("./config.json")

//INIT
//Create a new discord Client called client
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

//When running the application, if a token is not set, exit the process and print error message.
if(config.token === null) {
    console.log(logging.error("Welcome to Hacke Discord Bot. Set a token before using the application in config.json"))
    process.exit(1)
}

//Add event listeners for certain Discord API events. Reaction Add and Reaction Remove.
react.addListenerForAdd(client)
react.addListenerForRemove(client)

//Add event listener for message events.
client.on("message", message => {
    switch(message.content.split(" ")[0]) { //check the first word of any message sent in any channel in bot permission scope.
        case "ping": 
            message.channel.send("pong")
            break;
        case "!dfoto": 
            config.features.dfoto ? dfoto.action(message) : null
            break;
        case "!cffc":
            config.features.cffc ? cffc.action(message) : null
            break;
    }
})

//Add event listener for user join or leave voice channel event.
client.on('voiceStateUpdate', async (oldState, newState) =>{
    room.handle_event(oldState, newState)
})

//once init is done run this.
client.once("ready", () => {
    console.log(logging.startup)
    commands.post(client)
    
    //https://discord.com/developers/docs/interactions/slash-commands#interaction
    //On slash command interactions
    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase()
        const args = interaction.data.options
        //check what command was used.
        switch(command) {
            case "say":
                config.features.say ? say.handle(Discord, client, interaction, command, args) : null
                break;
            case "react":
                config.features.rolebot ? react.handle(Discord, client, interaction, command, args) : null
              break;
            case "click":
                config.features.click_to_create ? room.handle(client, interaction, args) : null
            default:
              // code block
        }
    })
    
})
//sign in to discord with the token
client.login(config.token)