const _ = require("lodash")
var executeCommand = require('machine').build(require('./execute-command.js'))

module.exports = {


  friendlyName: 'list items',


  description: 'List available items on the server',


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
    itemToSearch: {
      type: 'string',
      example: 'meatStew'
    }
  },


  exits: {

    success: {
      variableName: 'items',
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

  },


  fn: function (inputs, exits) {

    let itemToSearch = '*';

    if (!_.isUndefined(inputs.itemToSearch)) {
      itemToSearch = inputs.itemToSearch;
    }

    executeCommand({
      ip: inputs.ip,
      port: inputs.port,
      authName: inputs.authName,
      authToken: inputs.authToken,
      command: `listitems ${itemToSearch}`
    }).exec({
      success: function (response) {

        let items = new Array();

        if (!response) {
          return exits.error();
        }

        let splitResult = response.result.split(/\r?\n/)

        splitResult.forEach((element) => {
          element = element.trim()
          items.push(element);
        })
        items = items.slice(0, items.length - 2)
        return exits.success(items)
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
