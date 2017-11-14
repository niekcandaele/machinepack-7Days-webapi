module.exports = {


  friendlyName: 'Handle log line',


  description: 'Figures out what happened during a log line',


  extendedDescription: 'Used internally for logging, probably not useful outside this machinepack',


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
    /**/
  ) {
    return exits.success();
  },



};