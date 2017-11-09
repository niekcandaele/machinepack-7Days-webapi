module.exports = {


    friendlyName: 'Start logging events',


    description: 'Detect chat messages, commands, ... on a sdtd server',


    extendedDescription: 'Sends periodic requests to a sdtd webserver /getlogs, detects what kind of event occurred and emits an event',


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
    },


    exits: {

        success: {
            variableName: 'emitterObject',
            description: 'Logging has started!',
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

    },


    fn: function(inputs, exits) {
        const LogEmitter = require("../logEmitter.js");

        try {
            let logEmitter = new LogEmitter(inputs.ip, inputs.port, inputs.authName, inputs.authToken)
            return exits.success(logEmitter)
        } catch (error) {
            return exits.error(error)
        }

    },



};