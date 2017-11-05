module.exports = {


  friendlyName: 'Send Request',


  description: 'Send a web request to a 7 days to die server',


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

    apiModule: {
      type: 'string',
      example: "getstats",
      description: 'The API endpoint to send a request to',
      required: true
    },

    extraqs: {
      type: "json",
      example: {
      },
      description: "Extra parameters for the request",
      extendedDescription: "Extra query string to send along with the request. Dependent on which endpoint you're trying to reach"
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
      description: 'Not authorized to do this request'
    },

    badEndpoint: {
      variableName: 'error',
      description: 'Nothing found at specified endpoint'
    },

    badRequest: {
      description: "Something went wrong when doing the request, review the inputs please"
    },

    notImplemented: {
      description: "Internal server error"
    },

    error: {
      description: "An unknown error occurred"
    }

  },


  fn: function(inputs, exits) {
    const request = require('request-promise-native')

    const ip = inputs.ip;
    const port = inputs.port;
    const authName = inputs.authName;
    const authToken = inputs.authToken;

    const requestOptions = getRequestOptions(inputs.apiModule);
    doRequest(requestOptions)

    async function doRequest(options) {
      return request(options)
        .then(function(response) {
          return exits.success(response)
        })
        .catch(function(error) {
          if (error.statusCode == 403) {
            return exits.unauthorized(error.message)
          }
          if (error.statusCode == 404) {
            return exits.badEndpoint(error.message)
          }
          if (error.statusCode == 500) {
            return exits.badRequest(error.message)
          }
          if (error.statusCode == 501) {
            return exits.notImplemented(error.message)
          }

          if (error.error.code == "ECONNREFUSED") {
            return exits.connectionRefused(error.message)
          }
          return exits.error(error.error.code)
        })
    }

    function getRequestOptions(apiModule) {
      try {
        const baseUrl = "http://" + ip + ":" + port + "/api/";
        let requestOptions = {
          url: baseUrl + apiModule,
          json: true,
          timeout: 5000,
          useQuerystring: true,
          qs: {
            adminuser: authName,
            admintoken: authToken
          }
        };
        if (inputs.extraqs) {
          requestOptions.qs = Object.assign(requestOptions.qs, inputs.extraqs)
        }
        return requestOptions

      } catch (error) {
        exits.error(error)
      }
    }

  },



};
