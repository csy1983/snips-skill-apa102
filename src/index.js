const { setPattern } = require('./patterns')
const led = require('./led')
const mqtt = require('./mqtt')

async function main () {
    const client = await mqtt.init()

    process.on('SIGINT', function() {
        led.clearLeds()
        client.end({ force: true })
    })

    client.on('message', function (topic, messageBuffer) {
        const message = JSON.parse(messageBuffer.toString())
        const siteId = message.siteId

        if(siteId !== 'default')
            return

        switch(topic) {
            case 'hermes/hotword/toggleOn':
                setPattern('idle')
                break
            case 'hermes/asr/startListening':
                setPattern('listening')
                break
            case 'hermes/tts/say':
                setPattern('speaking')
                break
            case 'hermes/asr/stopListening':
                setPattern('thinking')
                break
        }
    })
}
module.exports = main