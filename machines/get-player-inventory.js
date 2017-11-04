module.exports = {


  friendlyName: 'Get player inventory',


  description: 'Get the contents of a players inventory',


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