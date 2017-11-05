module.exports = {


  friendlyName: 'Get player inventory',


  description: 'Get the contents of a players inventory',


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
      whereToGet: {
        description: 'Set in webpermission.xml or with webtokens telnet command'
      }
    },

    authToken: {
      type: 'string',
      description: 'Authorization token to send with the request',
      example: "EOGHZANOIZEAHZFUR93573298539242F3NG",
      whereToGet: {
        description: 'Set in webpermission.xml or with webtokens telnet command'
      }
    },

    steamID: {
      type: "string",
      description: 'Steam ID of the player to look up inventory of',
      example: "76561198028175941",
      required: true
    },
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

    badSteamID: {
      description: "You have entered an invalid steam ID"
    },

    error: {
      description: "An unknown error occurred"
    }

  },


  fn: function(inputs, exits) {
    const doRequest = require('machine').build(require('./send-request.js'))

    doRequest({
      ip: inputs.ip,
      port: inputs.port,
      authName: inputs.authName,
      authToken: inputs.authToken,
      apiModule: "getplayerinventory",
      extraqs: {
        steamid: inputs.steamID
      }
    }).exec({
      success: function(result) {
        return exits.success(result)
      },
      connectionRefused: function(error) {
        return exits.connectionRefused(error)
      },
      unauthorized: function(error) {
        return exits.unauthorized(error)
      },
      badRequest: function(error) {
        return exits.badSteamID(error)
      },
      error: function(error) {
        return exits.error(error)
      }
    })
  },



};
