const kickPlayer = require('machine').build(require('../machines/kick-player.js'))
require('dotenv').config()
var _ = require('lodash')

const ip = process.env.TEST_IP,
    port = process.env.TEST_PORT,
    authName = process.env.TEST_AUTHNAME,
    authToken = process.env.TEST_AUTHTOKEN,
    steamId = process.env.TEST_STEAMID


describe('Kick-player', function() {
    it('Should error when no ID is given', function(done) {
        kickPlayer({
            ip: ip,
            port:port,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function(err) {
                done()
            },
            success: function(response) {
                done(new Error(`Success when it should have failed`))
            }
        })
    });
    it('Should exit unauthorized when incorrect auth info is given', function(done) {
        kickPlayer({
            ip: ip,
            port:port,
            authName: authName+'INVALID',
            authToken: authToken,
            playerId: steamId
        }).exec({
            error: function(err) {
                done(new Error(`Error but should have specified unauthorized`))
            },
            unauthorized: function(err) {
                done()
            },
            success: function(response) {
                done(new Error(`Success when it should have failed`))
            }
        })
    });
    it('Should exit connectionRefused when incorrect connection info is given', function(done) {
        kickPlayer({
            ip: ip,
            port:port,
            authName: authName+'INVALID',
            authToken: authToken,
            playerId: steamId
        }).exec({
            error: function(err) {
                done(new Error(`Error but should have specified unauthorized`))
            },
            unauthorized: function(err) {
                done()
            },
            success: function(response) {
                done(new Error(`Success when it should have failed`))
            }
        })
    })
})