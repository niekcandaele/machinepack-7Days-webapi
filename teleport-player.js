module.exports = {


    friendlyName: 'teleport player',


    description: 'teleport a player from the server',


    cacheable: false,


    sync: false,


    inputs: {
        ip: {
            friendlyName: 'IP address',
            type: 'string',
            description: 'IP of the server to send a request to',
            required: true,
            example: "192.168.0.1",
        },

        port: {
            type: 'number',
            description: "Port of the server to send a request.",
            extendedDescription: "Make sure this is the port for the web server, not telnet or ...",
            required: true,
            example: "8082",
        },

        authName: {
            type: 'string',
            description: 'Authorization name to send with the request',
            example: "csmm",
            required: true,
            whereToGet: {
            description: 'Set in webpermission.xml or with webtokens telnet command'
            }
        },

        authToken: {
            type: 'string',
            description: 'Authorization token to send with the request',
            example: "EOGHZANOIZEAHZFUR93573298539242F3NG",
            required: true,
            whereToGet: {
            description: 'Set in webpermission.xml or with webtokens telnet command'
            }
        },

        playerId: {
            type: 'string',
            description: 'Steam ID of the player to teleport or entity ID',
            example: '76561198028175841',
            required: true
        },

        coordinates: {
            type: 'string',
            description: 'co ordinates to send a player',
			required: true,
            example: "401 10 120"
        }
    },


    exits: {

        success: {
            variableName: 'result',
            description: 'Player was teleported',
        },

        connectionRefused: {
            variableName: 'error',
            description: 'Server refused the request (usually means server offline)'
        },

        unauthorized: {
            variableName: 'error',
            description: 'Not authorized to do this request',
            extendedDescription: 'Server rejected the auth info sent. Please check if the server has auth name and token configured'
        },

        error: {
            variableName: 'error',
            description: "An unknown error occurred"
        },

        unknownPlayer: {
            variableName: 'error',
            description: "The given player id is not valid"
        },

    },


    fn: function(inputs, exits) {
        const _ = require("lodash")
        var executeCommand = require('machine').build(require('./execute-command.js'))
	 
        executeCommand({
            ip: inputs.ip,
            port: inputs.port,
            authName: inputs.authName,
            authToken: inputs.authToken,
            command: `tele ${inputs.playerId} ${inputs.coordinates}`
        }).exec({
            success: function(response) {
                if (response.result == 'Playername or entity/steamid id not found.') {
                    return exits.unknownPlayer("Playername or entity/steamid id not found.")
                }
                if (_.startsWith(response.result, "teleporting player")) {
                    return exits.success(response);
                }
            },
            connectionRefused: function(error) {
                return exits.connectionRefused(error)
            },
            unauthorized: function(error) {
                return exits.unauthorized(error)
            },
            error: function(error) {
                return exits.error(error)
            }
        })
    },



};