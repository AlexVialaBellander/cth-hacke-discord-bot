const fs = require('fs');
let success = []
let words = fs.readFileSync("./features/keepers/words.txt", "utf8").split(",")

function handle_init(message){
    words = fs.readFileSync("./features/keepers/words.txt", "utf8").split(",")    
    message.channel.send(`Reset words ${words.length} now ready to use.`)
}

function handle(message){
    random_words = words[(Math.floor(Math.random()*words.length))]
    message.channel.send(random_words)
}

function handle_correct(message){
    argument = message.content.split(" ")[1]

    const index = words.indexOf(argument)
    if (index > -1) {
        words.splice(index, 1)
    }
    message.channel.send(`added ${argument} to success array. ${words.length} words remaining`)
}

function handle_next_round(message){
    words = fs.readFileSync("./features/keepers/words.txt", "utf8").split(",")    
    message.channel.send(`Reset words ${words.length} now ready to use.`)
}




exports.handle = handle
exports.handle_correct = handle_correct
exports.handle_next_round = handle_next_round
exports.handle_init = handle_init
