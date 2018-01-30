const _ = require("lodash")
var executeCommand = require('machine').build(require('./execute-command.js'))

module.exports = {


  friendlyName: 'Give item(s) to player',


  description: 'Execute the give command',


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
    entityId: {
      type: 'string',
      description: 'Entity ID of the player',
      example: '171',
      required: true
    },
    amount: {
      type: 'number',
      example: '5',
      required: true
    },
    itemName: {
      type: 'string',
      example: "meatStew",
      required: true
    },
    quality: {
      example: '120',
      type: 'number'
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

    requestError: {
      variableName: 'error',
      description: 'An error occured when performing the request.'
    },

    playerNotFound: {
      description: "Did not find a player with given entity ID"
    },

    itemNotFound: {
      description: "Invalid item name"
    }

  },

  //   Usage:
  //    give <name / entity id> <item name> <amount>
  //    give <name / entity id> <item name> <amount> <quality>
  // Either pass the full name of a player or his entity id (given by e.g. "lpi").
  // Item name has to be the exact name of an item as listed by "listitems".
  // Amount is the number of instances of this item to drop (as a single stack).
  // Quality is the quality of the dropped items for items that have a quality.


  fn: function (inputs, exits) {

    let quality = Math.floor((Math.random() * 600) + 1);

    if (!isNaN(inputs.quality) && (1 < inputs.quality < 600)) {
      quality = inputs.quality
    }

    executeCommand({
      ip: inputs.ip,
      port: inputs.port,
      authName: inputs.authName,
      authToken: inputs.authToken,
      command: `give ${inputs.entityId} ${inputs.itemName} ${inputs.amount} ${quality}`
    }).exec({
      success: function (response) {
        if (response.result.includes("Playername or entity id not found")) {
          return exits.playerNotFound(response)
        }

        if (response.result.includes("Dropped item")) {
          return exits.success(response)
        }

        if (response.result.includes("Item not found")) {
          return exits.itemNotFound(response)
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
