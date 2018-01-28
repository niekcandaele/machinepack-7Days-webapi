const _ = require("lodash")
var executeCommand = require('machine').build(require('./execute-command.js'))

module.exports = {


  friendlyName: 'Unban player',


  description: '',


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
      description: 'Steam ID of the player to unban',
      example: '76561198028175842',
      required: true
    },
  },


  exits: {

    success: {
      variableName: 'result',
      description: 'Player was banned',
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

  // ban remove <name / entity id / steam id>

  fn: function(inputs, exits) {
    
    executeCommand({
      ip: inputs.ip,
      port: inputs.port,
      authName: inputs.authName,
      authToken: inputs.authToken,
      command: `ban remove ${inputs.playerId}`
    }).exec({
      success: function (response) {

        if (response.result.includes('removed from ban list')) {
          return exits.success(response)
        }

        return exits.error(new Error(`Unknown response type ${response.result}`))
      },
      connectionRefused: function (error) {
        return exits.connectionRefused(error)
      },
      unauthorized: function (error) {
        return exits.unauthorized(error)
      },
      error: function (error) {
        return exits.error(error)
      }
    })
  },



};