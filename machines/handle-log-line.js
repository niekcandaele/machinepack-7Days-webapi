const _ = require("lodash")

module.exports = {


    friendlyName: 'Handle log line',


    description: 'Figures out what happened during a log line',


    extendedDescription: 'Used internally for logging, probably not useful outside this machinepack',


    cacheable: false,


    sync: false,


    inputs: {

        logLine: {
            type: 'string',
            example: {
                date: '2017-11-14',
                time: '21:48:52',
                uptime: '25216.950',
                msg: 'Chat: \'Server\': test',
                trace: '',
                type: 'Log'
            }
        }

    },


    exits: {

        success: {
            variableName: 'result',
            description: 'Done.',
        },

        chatMessage: {
            variableName: 'chatMessage',
            description: 'Log line entered was a chat message'
        }

    },


    fn: function(inputs, exits) {

        const logLine = inputs.logLine;

        if (_.startsWith(logLine.msg, 'Chat:')) {
            // Chat: 'Dave': can you enter the radiated zone with full hazmat>?
            let firstIdx = logLine.msg.indexOf('\'');
            let secondIdx = logLine.msg.indexOf('\'', firstIdx + 1)
            let playerName = logLine.msg.slice(firstIdx + 1, secondIdx)
            let messageText = logLine.msg.slice(secondIdx + 3, logLine.msg.length)

            let date = logLine.date
            let time = logLine.time
            let type = "chat"
            if (playerName == 'Server') {
                type = "server"
            }

            chatMessage = {
                playerName,
                messageText,
                type,
                date,
                time
            }
            console.log(chatMessage)
            return exits.chatMessage(chatMessage)
        }

    },



};