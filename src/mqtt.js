const mqtt = require('mqtt')

module.exports = {
    async init (address = 'mqtt://localhost:1883', options = {}) {
        const client  = mqtt.connect(address, options)
        return new Promise((res, rej) => {
            const onError = function (error) {
                rej(error)
            }
            const onConnect = function () {
                client.off('error', onError)
                client.subscribe('hermes/hotword/toggleOn')
                client.subscribe('hermes/hotword/toggleOff')
                client.subscribe('hermes/asr/startListening')
                client.subscribe('hermes/asr/stopListening')
                client.subscribe('hermes/tts/say')
                client.subscribe('hermes/tts/sayFinished')
                res(client)
            }
            client.on('connect', onConnect)
            client.once('error', onError)
        })
    }
}
