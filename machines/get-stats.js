module.exports = {


  friendlyName: 'Get stats',


  description: 'Get basic stats of the server',


  extendedDescription: 'Returns gametime, # animals and hostiles',


  cacheable: false,


  sync: false,


  inputs: {

  },


  exits: {

    success: {
      variableName: 'result',
      description: 'Done.',
    },

  },


  fn: function(inputs, exits
    /*``*/
  ) {
    return exits.success();
  },



};