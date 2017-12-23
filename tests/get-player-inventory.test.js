const getplayerInventory = require('machine').build(require('../machines/get-player-inventory.js'))
require('dotenv').config()
var _ = require('lodash')

const ip = process.env.TEST_IP,
    port = process.env.TEST_PORT,
    authName = process.env.TEST_AUTHNAME,
    authToken = process.env.TEST_AUTHTOKEN,
    steamId = process.env.TEST_STEAMID

describe('Get player inventory', function () {
    it('Should exit success with valid info', function (done) {
        getplayerInventory({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            steamId: steamId
        }).exec({
            error: function (err) {
                done(err);
            },
            success: function (response) {
                done()
            }
        })
    });
    it('Should contain inventory info', function (done) {
        getplayerInventory({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            steamId: steamId
        }).exec({
            error: function (err) {
                done(err);
            },
            success: function (response) {
                if (_.isUndefined(response.bag)) {
                    return done(new Error(`Did not find bag information`))
                }
                if (_.isUndefined(response.belt)) {
                    return done(new Error(`Did not find belt information`))
                }
                if (_.isUndefined(response.equipment)) {
                    return done(new Error(`Did not find equipment information`))
                }
                done()
            }
        })
    });
    it('Should return unauthorized with invalid auth info', function (done) {
        getplayerInventory({
            ip: ip,
            port: port,
            authName: authName + "INVALIDAUTH",
            authToken: authToken,
            steamId: steamId
        }).exec({
            error: function (err) {
                done(new Error(`Error but should've specified unauthorized`));
            },
            unauthorized: function () {
                done()
            },
            success: function (response) {
                done(new Error(`Succes but should've errored`))
            }
        })
    });
    it('Should return connection refused with invalid connection info', function (done) {
        getplayerInventory({
            ip: "192.168.1.1",
            port: port,
            authName: authName,
            authToken: authToken,
            steamId: steamId
        }).exec({
            error: function (err) {
                done(new Error(`Error but should've specified connection refused`));
            },
            connectionRefused: function () { done() },
            success: function (response) {
                done(new Error(`Succes but should've errored`))
            }
        })
    });
    it('Should return badSteamID when an invalid ID is given', function (done) {
        getplayerInventory({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            steamId: steamId + "43"
        }).exec({
            error: function (err) {
                done(new Error(`Error but should've specified Bad steam ID`));
            },
            badSteamId: function (err) { done() },
            success: function (response) {
                done(new Error(`Succes but should've errored`))
            }
        })
    });
});