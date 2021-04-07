function reply(client, interaction, msg) {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                content: msg,
                flags: 1 << 6 //64
            }
        }
    })
}

exports.reply = reply;