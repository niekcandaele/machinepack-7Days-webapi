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
        },

        playerConnected: {
            variableName: 'connectedMsg',
            description: 'A player connected to the server'
        },

        playerDisconnected: {
            variableName: 'disconnectedMsg',
            description: 'A player disconnected from the server'
        },

        playerDeath: {
            variableName: 'deathMessage',
            description: 'A player died.'
        },

    },


    fn: function(inputs, exits) {

        const logLine = inputs.logLine;

        if (_.startsWith(logLine.msg, 'Chat:')) {
            /*
            {
              "date": "2017-11-14",
              "time": "14:50:39",
              "uptime": "123.278",
              "msg": "Chat: 'Catalysm': hey",
              "trace": "",
              "type": "Log"
            }
            */
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
            return exits.chatMessage(chatMessage)
        }

        if (_.startsWith(logLine.msg, 'Player connected,')) {
            /*
                    {
                      "date": "2017-11-14",
                      "time": "14:50:25",
                      "uptime": "109.802",
                      "msg": "Player connected, entityid=171, name=Catalysm, steamid=76561198028175941, steamOwner=76561198028175941, ip=::ffff:192.168.1.52",
                      "trace": "",
                      "type": "Log"
                    }
            */

            let date = logLine.date
            let time = logLine.time
            let logMsg = logLine.msg.split(",")

            let entityID = logMsg[1].replace("entityid=", "").trim()
            let playerName = logMsg[2].replace("name=", "").trim()
            let steamID = logMsg[3].replace("steamid=", "").trim()
            let steamOwner = logMsg[4].replace("steamOwner=", "").trim()
            let ip = logMsg[5].replace("ip=", "").trim()
            let country = ipCountry.country(ip)

            let connectedMsg = {
                entityID,
                playerName,
                steamID,
                steamOwner,
                ip,
                country,
                date,
                time
            }
            return exits.playerConnected(connectedMsg)
        }

        if (_.startsWith(logLine.msg, 'Player disconnected:')) {
            /*
            {
              "date": "2017-11-14",
              "time": "14:51:40",
              "uptime": "184.829",
              "msg": "Player disconnected: EntityID=171, PlayerID='76561198028175941', OwnerID='76561198028175941', PlayerName='Catalysm'",
              "trace": "",
              "type": "Log"
            }
            */
            let date = logLine.date
            let time = logLine.time
            let logMsg = logLine.msg
            logMsg = logMsg.replace("Player disconnected", "")
            logMsg = logMsg.split(",")


            let entityID = logMsg[0].replace(": EntityID=", "").trim()
            let playerID = logMsg[1].replace("PlayerID=", "").replace(/'/g, "").trim()
            let ownerID = logMsg[2].replace("OwnerID=", "").replace(/'/g, "").trim()
            let playerName = logMsg[3].replace("PlayerName=", "").replace(/'/g, "").trim()

            let disconnectedMsg = {
                entityID,
                playerName,
                ownerID,
                playerID,
                date,
                time
            }
            return exits.playerDisconnected(disconnectedMsg)
        }

        if (logLine.msg.includes("GMSG: Player") && logLine.msg.includes("died")) {
            /*
            {
              "date": "2017-11-14",
              "time": "14:50:49",
              "uptime": "133.559",
              "msg": "GMSG: Player 'Catalysm' died",
              "trace": "",
              "type": "Log"
            }
            */
            let deathMessage = logLine.msg.split(" ")
            let playerName = deathMessage.slice(2, deathMessage.length - 1).join(" ").replace(/'/g, "")
            let date = logLine.date
            let time = logLine.time
            deathMessage = {
                playerName,
                date,
                time
            }
            return exits.playerDeath(deathMessage);
        }
    },
}