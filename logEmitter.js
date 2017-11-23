const EventEmitter = require('events');
const _ = require("lodash")
var sendRequest = require('machine').build(require('./machines/send-request.js'))
var handleLogLine = require('machine').build(require('./machines/handle-log-line'))

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    console.log(reason.stack)
        // application specific logging, throwing an error, or other logic here
});

class logEmitter extends EventEmitter {
    constructor(ip, port, authName, authToken, intervalTime = 2000) {
        super();
        this.ip = ip
        this.port = port
        this.authName = authName
        this.authToken = authToken
        this.requestInterval
        this.initialize()
    }

    async initialize() {
        let lastLogLine
        let failed = false
        let eventEmitter = this

        const ip = this.ip,
            port = this.port,
            authName = this.authName,
            authToken = this.authToken;

        // Get the latest log line #
        sendRequest({
            ip: ip,
            port: port,
            authName: authName,
            authToken: authToken,
            apiModule: "getwebuiupdates",
        }).exec({
            error: function(error) {
                if (!failed) {
                    failed = true
                    eventEmitter.emit("connectionLost", error)
                }
            },
            success: function(response) {
                eventEmitter.emit("connected")
                lastLogLine = response.newlogs
            },
        });

        this.requestInterval = setInterval(async function() {
            // Get the new log lines
            sendRequest({
                ip: ip,
                port: port,
                authName: authName,
                authToken: authToken,
                apiModule: "getlog",
                extraqs: {
                    firstLine: lastLogLine
                },
            }).exec({
                error: function(error) {
                    if (!failed) {
                        failed = true
                        eventEmitter.emit("connectionLost", error)
                    }


                },
                success: function(response) {
                    if (!_.isUndefined(response.lastLine)) {
                        lastLogLine = response.lastLine
                    }

                    if (failed) {
                        eventEmitter.emit("connected")
                        failed = false

                        // Get the latest log line #
                        sendRequest({
                            ip: ip,
                            port: port,
                            authName: authName,
                            authToken: authToken,
                            apiModule: "getwebuiupdates",
                        }).exec({
                            error: function(error) {
                                console.log("Error getting latest log line " + error)
                            },
                            success: function(response) {
                                lastLogLine = response.newlogs
                            },
                        });
                    };


                    _.each(response.entries, function(line) {
                        eventEmitter.emit('logLine', line);
                        handleLogLine({ logLine: line }).exec({
                            chatMessage: function(chatMessage) {
                                eventEmitter.emit('chatMessage', chatMessage)
                            },
                            playerConnected: function(connectedMsg) {
                                eventEmitter.emit('playerConnected', connectedMsg)
                            },
                            playerDisconnected: function(disconnectedMsg) {
                                eventEmitter.emit('playerDisconnected', disconnectedMsg)
                            },
                            playerDeath: function(deathMessage) {
                                eventEmitter.emit('playerDeath', deathMessage)
                            },
                            error: function(error) {
                                eventEmitter.emit('error', error)
                            }
                        })

                    })
                },
            })
        }, 2000)

    }

    stop() {
        clearInterval(this.requestInterval)
    }
}

module.exports = logEmitter