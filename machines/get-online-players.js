module.exports = {


  friendlyName: 'Get online players',


  description: 'Gets a list of currently online players',


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