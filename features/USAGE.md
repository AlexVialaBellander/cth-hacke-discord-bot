![guide](https://user-images.githubusercontent.com/42417723/110225057-c1da9080-7ee1-11eb-88fc-c309a70ee3ab.png)
# How to use the bot
Instructions on how to use the different features

---
![React](https://user-images.githubusercontent.com/42417723/110225177-0e729b80-7ee3-11eb-837a-9833b4fe3c12.png)

## React-to-role
Instruction on how to use react-to-role.

### Add a role-to-react to a message
You can initiate a rolebot and add react-to-roles on any message by using the slash command:

`/react add message-id:<target_message_id> emoji:<unicode or custom> role-name: <name of the role>`

Example:

`/react add message-id:815632427347214396 emoji::minecraft: role-name: minecraft`'

The bot will add a reaction with `emoji` on `message-id` and create a role with the name `role-name` if there doesnt already exist a role with `role-name`

### Remove a role-to-react to a message
You can remove a role a rolebot on any message by using the slash command:

`/react remove message-id:<target_message_id> emoji:<unicode or custom>`

Example:

`/react remove message-id:815632427347214396 emoji::minecraft:`

The bot will remove the reaction with `emoji` on `message-id` and remove the role created when using `/react add`

### Disable rolebot for the entire message
You can remove all roles and the reactbot on any message by using the slash command:

`/react disable message-id:<target_message_id>`

The bot will remove all reaction on `message-id` and remove all associated roles.

---
![click](https://user-images.githubusercontent.com/42417723/110225208-5db8cc00-7ee3-11eb-83ce-1cd6fc81fa6c.png)


## Click-to-create
This feature will convert a voice-channel to a button which generates new voice channels uppon joining the voice channel. Thus, when users press the channel, a new voice channel will be created and they will be transfered to it.

### Enable click-to-create
To enable this feature use the below command.

`/click <voicechannel_id>`

This will turn the voice channel to a button.

### Room name configuration

The list of names for the rooms are kept in the keeper `study-room-config.json`

---
![Say](https://user-images.githubusercontent.com/42417723/110225245-f0596b00-7ee3-11eb-87e4-949c85433321.png)

## Say as Hacke
You can make the bot post limited functionality embeded messages and edit these messages.

### Post message

`/say create title: <title of embed> description: <content of embed> channel:<channel to post message in>{OPTIONAL} `

### Edit message
Edit the title or content of an embeded message posted by Hacke. You must run the edit command in the same channel as the message is in. Use `\n` for newlines.
`/say edit message-id: <message to edit> description: <new content> title: <new title>`

---
![dfoto](https://user-images.githubusercontent.com/42417723/110225298-9ad18e00-7ee4-11eb-8bda-e6acfd5ece80.png)

## Get random DFoto image
Post a random dfoto image in the textchannel by writing `!dfoto`

---
![cffc](https://user-images.githubusercontent.com/42417723/110225335-09165080-7ee5-11eb-9643-28a3eaee7080.png)



## Get random CFFC image
Post a random cffc image in the textchannel by writing `!cffc`
