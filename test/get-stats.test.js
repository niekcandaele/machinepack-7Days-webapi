const getStats = require('machine').build(require('../machines/get-stats.js'))
require('dotenv').config()
var _ = require('lodash')

const ip = process.env.TEST_IP,
  port = process.env.TEST_PORT,
  authName = process.env.TEST_AUTHNAME,
  authToken = process.env.TEST_AUTHTOKEN

describe('Get stats', function() {
  it('Should return success with valid info', function(done) {
    getStats({
      ip: ip,
      port: port,
      authName: authName,
      authToken: authToken
    }).exec({
      error: function(err) {
        done(err);
      },
      success: function(data) {
        done()
      }
    })
  });
  it('Should exit with error if bad IP/port', function(done) {
    getStats({
      ip: 192,
      port: port,
      authName: authName,
      authToken: authToken
    }).exec({
      error: function(err) {
        done();
      },
      success: function(data) {
        done(`Function succes but should have errored!`)
      }
    })
  });
  it('Should return info about gametime, animals, hostiles and players', function(done) {
    getStats({
      ip: ip,
      port: port,
      authName: authName,
      authToken: authToken
    }).exec({
      error: function(err) {
        done(err);
      },
      success: function(data) {
        if (_.isUndefined(data.gametime)) {
          return done(`Did not see gametime info`)
        }
        if (_.isUndefined(data.hostiles)) {
          return done(`Did not see hostiles info`)
        }
        if (_.isUndefined(data.players)) {
          return done(`Did not see players info`)
        }
        if (_.isUndefined(data.animals)) {
          return done(`Did not see animals info`)
        }
        done()
      }
    })
  })

})
