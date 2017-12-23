const executeCommand = require('machine').build(require('../machines/execute-command.js'))
require('dotenv').config()
var _ = require('lodash')

const ip = process.env.TEST_IP,
  port = process.env.TEST_PORT,
  authName = process.env.TEST_AUTHNAME,
  authToken = process.env.TEST_AUTHTOKEN


describe('Execute-command', function () {
    it('Should exit with success if valid info given', function(done) {
        executeCommand({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            command: 'help'
        }).exec({
            error: function (err) {
                done(err);
            },
            success: function (data) {
                done()
            }
        })
    });
    it('Should exit with unknownCommand when an unknown command is given', function(done) {
        executeCommand({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            command: 'helperinos'
        }).exec({
            error: function (err) {
                done(err);
            },
            unknownCommand: function(err) {
                done()
            },
            success: function (data) {
                done(`Success but should have errored!`)
            }
        })
    });

    it('Should exit with error if bad authInfo', function (done) {
        executeCommand({
            ip: ip,
            port: port,
            authName: authName + "RANDOMSTUFF",
            authToken: authToken + "MOARRANDOM",
            command: 'help'
        }).exec({
            error: function (err) {
                done(`Error but should have exited unauthorized!`);
            },
            unauthorized: function (err) {
                done();
            },
            success: function (data) {
                done(`Function succes but should have errored!`)
            }
        });
    });
    it('Should exit with connectionRefused exit if bad connect info', function(done) {
        executeCommand({
            ip: ip + "invalidSyntax",
            port: port,
            authName: authName,
            authToken: authToken,
            command: 'help'
        }).exec({
            error: function (err) {
                done(new Error(`Errored but should have exited with connectionRefused`));
            },
            connectionRefused: function(err) {
                done()
            },
            success: function (data) {
                done(`Function succes but should have errored!`)
            }
        })
    })
})
