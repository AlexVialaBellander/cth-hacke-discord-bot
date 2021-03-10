const chalk = require('chalk');
const config = require("../config.json")
const error = chalk.bold.redBright;
const success = chalk.bold.greenBright;
const warning = chalk.bold.yellowBright;
const neutral = chalk.whiteBright;

let startup_message = success(`
Hacke is online 
Time: ${neutral(new Date)}
`)

let divider = '\n=====================\n\n'

function configReader() {
    let str = `${neutral('Feature Configuration\n')}`
    for (x in config.features){
        if (config.features[x] != Boolean) {
            str += x + ": " + (config.features[x] ? success('enabled') : error('disabled')) + '\n'
        }
    }
    return str
}

let config_message = ``

let startup = startup_message + divider + configReader() + divider


exports.startup = startup;
exports.success = success;
exports.error = error;
exports.warning = warning;