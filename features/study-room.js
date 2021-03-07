const fs = require('fs');
const config = require("../config.json")
const chalk = require('chalk');
const error = chalk.bold.redBright;
const success = chalk.bold.greenBright;
const warning = chalk.bold.yellowBright;
const neutral = chalk.whiteBright;

let command = {
    name: "click",
    description: "Enable a click-to-create voice channel command",
    options: [
        {
            name: "channel-id",
            description: "the channel to turn into a click-to-create button",
            type: 3,
            required: true
        }
    ]
}

async function handle(Discord, client, interaction, command, args) {
    const target = args.find(arg => arg.name.toLowerCase() == "channel-id").value
    let rooms = JSON.parse(fs.readFileSync("./features/keepers/study-room-config.json", "utf8"))
    rooms.target = target 
    fs.writeFile("./features/keepers/study-room-config.json", JSON.stringify(rooms, null, 2), { flag: "w+" }, error => {
        if(error) {
            console.log(error)
        }
    })
} 

async function handle_event(oldState, newState) {
    let rooms = JSON.parse(fs.readFileSync("./features/keepers/study-room-config.json", "utf8"))
    let id = oldState.channelID
    let channel = oldState.channel

    if(JSON.stringify(rooms.names).includes(id) && id != null){
        if(channel.members.last() == undefined){
            try{
                channel.delete()
                console.log(success(`CLICK : removed channel ${channel}`))
                for(x in rooms.names){
                    if(rooms.names[x] == channel){
                        rooms.names[x] = null
                        fs.writeFile("./features/keepers/study-room-config.json", JSON.stringify(rooms, null, 2), { flag: "w+" }, error => {
                            if(error) {
                                console.log(error)
                            }
                        })
                    }
                }
            } catch {
                console.log(error(`CLICK : unable to remove channel ${channel}`))
            }
        }
    }
    if(config.features.click_to_create && rooms.target != null) {
        if(newState.member.voice.channelID == rooms.target) {
            generate(oldState, newState)
        }
    }
} 

async function generate(oldState, newState) {
    let reply = await newState.member.voice.channel.clone()
    let name = getName(reply.id)
    reply.edit({ name: name})
        .then(() => {
            try {
                newState.member.voice.setChannel(reply.id)
                console.log(success(`CLICK : added channel ${reply.id}`))
            } catch {
                console.log(error(`CLICK : could not create channel ${reply.id}`))
            }
        })
    
    /* newState.guild.channels.create(name, {
        type: 'text',
        topic: 'automatically created study room',
        parent: newState.channel.parent.id    
    }) */
}

function getName(id) {
    let rooms = JSON.parse(fs.readFileSync("./features/keepers/study-room-config.json", "utf8"))
    for(room in rooms.names) {
        if(rooms.names[room] === null){
            rooms.names[room] = id
            fs.writeFile("./features/keepers/study-room-config.json", JSON.stringify(rooms, null, 2), { flag: "w+" }, error => {
                if(error) {
                    console.log(error)
                }
            })
            return room
        }
    }
    return "index out of bounds"
}

exports.handle_event = handle_event
exports.handle = handle
exports.command = command