const sendRequest = require('machine').build(require('../machines/send-request.js'))
require('dotenv').config()
var _ = require('lodash')

const ip = process.env.TEST_IP,
  port = process.env.TEST_PORT,
  authName = process.env.TEST_AUTHNAME,
  authToken = process.env.TEST_AUTHTOKEN

describe('Send request', function() {
    it('Should exit success with valid info', function(done) {
        sendRequest({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            apiModule: 'getstats'
        }).exec({
            error: function(err) {
                done(err)
            },
            success: function(response) {
                done()
            }
        })
    });
    it('Should exit connectionRefused when wrong connection info is given', function(done) {
        sendRequest({
            ip: "192.168.1.1",
            port: port,
            authName: authName,
            authToken: authToken,
            apiModule: 'getstats'
        }).exec({
            error: function(err) {
                console.log(err)
                done(new Error(`Exited with error, but should have specified connectionRefused`))
            },
            connectionRefused: function(err) {
                done()
            },
            success: function(response) {
                done(new Error(`Exited success but should have errored`))
            }
        })
    });
    it('Should exit unauthorized if the auth info does not have sufficient permissions', function(done) {
        sendRequest({
            ip: ip,
            port: port,
            authName: authName + 'INVALID',
            authToken: authToken + 'AUTHINFO',
            apiModule: 'getplayerlist'
        }).exec({
            error: function(err) {
                done(new Error(`Error but should have exited unauthorized`))
            },
            unauthorized: function(err) {
                done()
            },
            success: function(response) {
                done(new Error(`Exited success but should have exited unauthorized`))
            }
        })
    });
    it('Should exit badEndpoint if trying to request an unknown endpoint', function(done) {
        sendRequest({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            apiModule: 'thisonedoesnotexist'
        }).exec({
            error: function(err) {
                done(new Error(`Error but should have exited unauthorized`))
            },
            badEndpoint: function(err) {
                done();
            },
            success: function(response) {
                done(new Error(`Exited success but should have exited badEndpoint`))
            }
        })
    });
    it('Should exit internalError when an internal server error occurs', function(done) {
        sendRequest({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            apiModule: 'executeconsolecommand',
            extraqs: {command: 'UNKNOWNCOMMAND'}
        }).exec({
            error: function(err) {
                done(new Error(`Error but should have exited internalError`))
            },
            internalError: function(err) {
                done();
            },
            success: function(response) {
                done(new Error(`Exited success but should have exited badEndpoint`))
            }
        })
    });
})