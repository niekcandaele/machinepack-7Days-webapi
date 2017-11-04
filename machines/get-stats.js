module.exports = {


  friendlyName: 'Get stats',


  description: 'Get basic stats of the server',


  extendedDescription: 'Returns gametime, # players, animals and hostiles',


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

    requestError: {
      variableName: 'error',
      description: 'An error occured when performing the request.'
    }

  },


  fn: function(inputs, exits) {

    const doRequest = require('machine').build(require('./send-request.js'))

    doRequest({
      ip: inputs.ip,
      port: inputs.port,
      authName: inputs.authName,
      authToken: inputs.authToken,
      apiModule: "getstats"
    }).exec({
      success: function(result) {
        return exits.success(result)
      },
      connectionRefused: function(error) {
        return exits.requestError(error)
      },
      unauthorized: function(error) {
        return exits.requestError(error)
      },
      error: function(error) {
        return exits.requestError(error)
      }
    })
  },



};
