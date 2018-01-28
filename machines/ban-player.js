const _ = require("lodash")
var executeCommand = require('machine').build(require('./execute-command.js'))

module.exports = {


  friendlyName: 'Ban player',


  description: 'Ban a player from the server',


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
      description: 'Steam ID / entity id / name of the player to ban',
      example: '76561198028175841',
      required: true
    },

    reason: {
      type: 'string',
      description: 'Reason for banning the player',
      example: "Spamming the chat"
    },

    duration: {
      type: 'number',
      example: 5,
      required: true
    },
    durationUnit: {
      type: 'string',
      example: 'minutes',
      required: true
    }
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

    badDuration: {
        description: 'Please provide a valid unit of duration'
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


  fn: function (inputs, exits) {

    if (!validateDuration()) {
        return exits.badDuration()
    } 

    // ban add <name / entity id / steam id> <duration> <duration unit> [reason]
    executeCommand({
      ip: inputs.ip,
      port: inputs.port,
      authName: inputs.authName,
      authToken: inputs.authToken,
      command: `ban add ${inputs.playerId} ${inputs.duration} ${inputs.durationUnit} ${inputs.reason}`
    }).exec({
      success: function (response) {
        return exits.success(response)

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


    function validateDuration() {
      let validDurationUnits = ["minutes", "hours", "days", "weeks", "months", "years"];
      return validDurationUnits.includes(inputs.durationUnit)
    }
  },



};
