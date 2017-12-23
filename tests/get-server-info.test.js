const getServerInfo = require('machine').build(require('../machines/get-server-info.js'))
require('dotenv').config()
var _ = require('lodash')

const ip = process.env.TEST_IP,
    port = process.env.TEST_PORT,
    authName = process.env.TEST_AUTHNAME,
    authToken = process.env.TEST_AUTHTOKEN

describe('Get server info', function() {
    it('Should return success with valid info', function(done) {
        getServerInfo({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function(err) {
                done(err);
            },
            success: function(response) {
                done()
            }
        })
    });
    it('Should error with invalid connection info', function(done) {
        getServerInfo({
            ip: "192.168.1.1",
            port: port,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function(err) {
                done(new Error(`Errored but should have specified connection refused`));
            },
            connectionRefused: function(err) {
                done()
            },
            success: function(response) {
                done(new Error(`Success but should have errored`))
            }
        })
    });
    it('Should contain gameHost, ServerDescription, LevelName, ..', function(done) {
        getServerInfo({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken
        }).exec({
            error: function(err) {
                done(err);
            },
            success: function(response) {
                if (_.isUndefined(response.GameHost)) {
                    done(new Error(`Did not find gamehost data`))
                }
                if (_.isUndefined(response.ServerDescription)) {
                    done(new Error(`Did not find server description`))
                }
                done()
            }
        })
    })
})