module.exports = {


  friendlyName: 'Execute Command',


  description: 'Execute a command via web api',


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

    command: {
      type: 'string',
      example: 'kick',
      description: "Command to execute on the server",
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

    unknownCommand: {
      description: 'Unknown command entered'
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
      apiModule: "executeconsolecommand",
      extraqs: {
        command: inputs.command
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
      notImplemented: function(error) {
        return exits.unknownCommand(error)
      },
      badRequest: function(error) {
        return exits.error(error)
      },
      error: function(error) {
        return exits.error(error)
      }
    })
  },



};
