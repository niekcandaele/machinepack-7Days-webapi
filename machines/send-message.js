module.exports = {


    friendlyName: 'Send message',


    description: 'Send a message to the server or pm a player',


    extendedDescription: 'Broadcast a message, if a playerID is provided; send a PM',


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
        playerID: {
            type: 'string',
            description: 'Entity ID of the player to kick',
            example: '76561198028175841'
        },

        message: {
            type: "string",
            description: "Message to send",
            example: "Hello world",
            required: true
        }
    },


    exits: {

        success: {
            variableName: 'result',
            description: 'Done.',
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
        const _ = require("lodash");
        var executeCommand = require('machine').build(require('./execute-command.js'))

        let command
        if (_.isUndefined(inputs.playerID)) {
            command = `say ${inputs.message}`
        } else {
            command = `pm ${inputs.playerID} ${inputs.message}`
        }

        executeCommand({
            ip: inputs.ip,
            port: inputs.port,
            authName: inputs.authName,
            authToken: inputs.authToken,
            command: command
        }).exec({
            success: function(response) {
                return exits.success(response)
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