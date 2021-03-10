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
    if (newState === undefined) return; 
    //if active chat and exists and on join
    if (JSON.stringify(rooms.names).includes(newState.channelID) && newState.channelID != null) {
        let role_id
        for (room in rooms.names){
            if(room == newState.channel.name) {
                role_id = rooms.names[room].role
            }
        }
        if(role_id != null){
            try {
                newState.member.roles.add(role_id)
                console.log(success(`CLICK : added role ${role_id} related to ${newState.voice.name} to ${newState.member.id}`))

            } catch {
                console.log(error(`CLICK : unable to add role ${role_id} related to ${newState.voice.name} to ${newState.member.id}`))
            }
        }
    }
    //if active chat and not exists
    if(JSON.stringify(rooms.names).includes(id) && id != null){
        if(channel.members.last() == undefined){
            try{
                //Delete the voice channel
                channel.delete()
                console.log(success(`CLICK : removed channel ${channel.id}`))
                for(x in rooms.names){
                    if(rooms.names[x]["voice"] == channel){
                        //delete role
                        try {
                            newState.guild.roles.resolve(rooms.names[x]["role"]).delete()
                            console.log(success(`CLICK : removed channel ${rooms.names[x]["role"]}`))

                        } catch {
                            console.log(error(`CLICK : unable to removed channel ${rooms.names[x]["role"]}`))

                        }
                        //delete the text channel
                        try {
                            oldState.guild.channels.resolve(rooms.names[x]["text"]).delete()
                            console.log(success(`CLICK : removed channel ${rooms.names[x]["text"]}`))
                        } catch {
                            console.log(error(`CLICK : unable to removed channel ${rooms.names[x]["text"]}`))
                        }
                        
                        rooms.names[x] = null
                        fs.writeFile("./features/keepers/study-room-config.json", JSON.stringify(rooms, null, 2), { flag: "w+" }, error => {
                            if(error) {
                                console.log(error)
                            }
                        })
                        break;
                    }
                }
            } catch(e) {
                console.log(error(`CLICK : unable to remove channel ${channel}`))
            }
        }
        //if click-to-create is enabled and target channel is entered
    } else if(config.features.click_to_create && rooms.target != null) {
        //if the click was on the target generate a new voice channel
        if(newState.member.voice.channelID == rooms.target) {
            generate(newState)
        }
    }
} 

async function generate(newState) {
    let rooms = JSON.parse(fs.readFileSync("./features/keepers/study-room-config.json", "utf8"))
    let name = getName(rooms)
    let v_res = null
    let t_res = null
    try {
        //create voice channel
        v_res = await newState.member.voice.channel.clone({"name": name})
        console.log(success(`CLICK : created voice-channel ${v_res.id}`))
        newState.member.voice.setChannel(v_res.id)
    } catch {
        console.log(error(`CLICK : unable to create voice-channel ${v_res.id} or move user to it`))
    }
    try {
        //create text channel
        t_res = await newState.guild.channels.create(name, {
            type: 'text',
            topic: 'automatically created study room',
            parent: rooms["target-category"] 
        })
        console.log(success(`CLICK : created text-channel ${t_res.id}`))

    } catch {
        console.log(error(`CLICK : unable to create text-channel ${t_res.id}`))
    }
    let role;
    try {
        //create the room role
        role = await newState.guild.roles.create({
            data: {
                "name": name.toLowerCase(),
                "color": '0x' + Math.floor(Math.random()*16777215).toString(16),
                "mentionable": false,
                "managed": false,
                "editable": false
            },
            reason: 'autocreated by click-bot',
        })
        console.log(success(`CLICK : created role ${role.id} named ${name}`))
    } catch {
        console.log(error(`CLICK : could not create role for study-room named ${name}`))
    }
    //add role to user
    try {
        newState.member.roles.add(role.id)
        console.log(success(`CLICK : added role ${role.id} related to ${name} to ${newState.member.id}`))
    } catch {
        console.log(error(`CLICK : could not assign role for study-room named ${name}`))
    }
    //add permissions to text channel
    t_res.overwritePermissions([
        {"id" : role.id ,
         "allow" : ['VIEW_CHANNEL']
        },
        {"id" : newState.guild.roles.everyone.id ,
         "deny" : ['VIEW_CHANNEL']
        }])
    //send welcome message
    let message = fs.readFileSync("./features/configs/study-room-message.txt", "utf8")
    message = message.replace('%', name)
    let msg = await t_res.send(message, )
    msg.suppressEmbeds()

    //update keeper
    updateKeeper(v_res.id, t_res.id, role.id, rooms, name)
}

function getName(rooms) {
    for(room in rooms.names) {
        if(rooms.names[room] === null){
            rooms.names[room] = room
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
function updateKeeper(v_id, t_id, r_id, rooms, target) {
    for(room in rooms.names) {
        if(rooms.names[room] === target){
            rooms.names[room] = 
            {
                "voice" : v_id,
                "text" : t_id,
                "role" : r_id
            }
            fs.writeFile("./features/keepers/study-room-config.json", JSON.stringify(rooms, null, 2), { flag: "w+" }, error => {
                if(error) {
                    console.log(error)
                }
            })
        }
    }
}

function action(message){
    

}

exports.handle_event = handle_event
exports.handle = handle
exports.command = command