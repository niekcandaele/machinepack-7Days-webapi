module.exports = {


  friendlyName: 'Get player list',


  description: 'Gets a list of persistent player profiles',


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
      apiModule: "getplayerlist",
      extraqs: {
        rowsperpage: 99999
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
      error: function(error) {
        return exits.error(error)
      }
    })
  },



};
