const getOnlinePlayers = require('machine').build(require('../machines/get-online-players.js'))
require('dotenv').config()
var _ = require('lodash')

const ip = process.env.TEST_IP,
    port = process.env.TEST_PORT,
    authName = process.env.TEST_AUTHNAME,
    authToken = process.env.TEST_AUTHTOKEN

describe('Get online players', function () {
    it('Should exit success with valid info', function (done) {
        getOnlinePlayers({
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
        });
    });
    it('Should return an array', function (done) {
        getOnlinePlayers({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function (err) {
                done(err);
            },
            success: function (response) {
                if (!typeof response == typeof new Array) {
                    return done(new Error(`Did not receive an array`))
                }
                done()
            }
        });
    });
    it('Should exit unauthorized with invalid auth info', function (done) {
        getOnlinePlayers({
            ip: ip,
            port: port,
            authName: authName + 'INVALID',
            authToken: authToken
        }).exec({
            error: function (err) {
                done(new Error(`Errored, but should've specified unauthorized`));
            },
            unauthorized: function (err) {
                done()
            },
            success: function (response) {
                done(new Error(`Exited success but should've exited unauthorized`))
            }
        });
    });
    it('Should exit connectionRefused with invalid connection info', function (done) {
        getOnlinePlayers({
            ip: '192.168.1.1',
            port: port,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function (err) {
                done(new Error(`Errored, but should've specified connection refused`));
            },
            connectionRefused: function (err) { done() },
            success: function (response) {
                done(new Error(`Exited success but should've exited unauthorized`))
            }
        });
    });
})