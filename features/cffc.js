const fetch = require('node-fetch');

var upper = 61947;
var lower = 71;

//hardcoded limits lol
    
//https://www.cffc.se/thumbnail/thumb/71/big.jpg
//https://www.cffc.se/thumbnail/thumb/61947/big.jpg

async function random() {
    return `https://www.cffc.se/thumbnail/thumb/${Math.floor(Math.random() * (upper - lower)) + lower}/big.jpg`
}

async function action(message) {
    random()
        .then((url) => message.channel.send({
             files: [{
                attachment: url,
                name: 'cffc_random.jpg'
             }]
          }))
}

exports.action = action;