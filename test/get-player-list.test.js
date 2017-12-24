const getplayerList = require('machine').build(require('../machines/get-player-list.js'))
require('dotenv').config()
var _ = require('lodash')

const ip = process.env.TEST_IP,
    port = process.env.TEST_PORT,
    authName = process.env.TEST_AUTHNAME,
    authToken = process.env.TEST_AUTHTOKEN,
    steamId = process.env.TEST_STEAMID

let fakePort = parseInt(port) + 1

describe('Get player list', function () {
    it('Should return success with valid info', function (done) {
        getplayerList({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function (err) {
                done(err);
            },
            success: function (response) {
                done()
            }
        })
    });
    it('Should return unauthorized with invalid auth info', function (done) {
        getplayerList({
            ip: ip,
            port: port,
            authName: authName + 'INVALID',
            authToken: authToken
        }).exec({
            error: function (err) {
                done(err);
            },
            unauthorized: function (err) { done() },
            success: function (response) {
                done(new Error(`Function success but should have errored`))
            }
        })
    });
    it('Should return connectionRefused with invalid connection info', function (done) {
        getplayerList({
            ip: ip,
            port: fakePort,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function (err) {
                done(err);
            },
            connectionRefused: function(err) {done()},
            success: function (response) {
                done(new Error(`Function success but should have errored`))

            }
        })
    });
    it('Should include total players, array of players', function (done) {
        getplayerList({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function (err) {
                done(err);
            },
            success: function (response) {
                if (_.isUndefined(response.total)) {
                    return done(new Error(`Did not include total players`))
                }
                if (_.isUndefined(response.players)) {
                    return done(new Error(`Did not include an array with player info`))
                }
                done()
            }
        })
    })
})