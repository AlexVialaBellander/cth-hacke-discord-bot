![github](https://user-images.githubusercontent.com/42417723/109477305-29bf5000-7a78-11eb-903b-6a07bef23fc8.png)

# Community Discord Bot

This bot was originally developed for a community Discord for Computer Science and Engineering Students @ Chalmers Unviersity of Technology.

## Overview
The bot is called _Hacke_ (en_us: woody woodpecker). It has some basic features which improves quality of life on a discord server.

### Current features
A list of current supported features:

- React-to-role
- Say and edit as bot
- Post random photo from _dfoto.se_ - The photo-committee at CSE at Chalmers.

# How to use the bot
Instructions on how to use the above features.

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

## Say as Hacke
You can make the bot post limited functionality embeded messages and edit these messages.

### Post message

`/say create title: <title of embed> description: <content of embed> channel:<channel to post message in>{OPTIONAL} `

### Edit message
Edit the title or content of an embeded message posted by Hacke. You must run the edit command in the same channel as the message is in. Use `\n` for newlines.
`/say edit message-id: <message to edit> description: <new content> title: <new title>`

## Get random DFoto image
Post a random dfoto image in the textchannel by writing `!dfoto`

# Development & Running the bot

# License
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
