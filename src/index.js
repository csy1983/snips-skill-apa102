const led = require('./led')
const mqtt = require('./mqtt')

async function main () {
    const client = await mqtt.init()

    let cleanup = null
    process.on('SIGINT', function() {
        led.clearLeds()
        client.end({ force: true })
        if(cleanup)
            cleanup()
    })
    client.on('message', function (topic, messageBuffer) {
        const message = JSON.parse(messageBuffer.toString())
        const siteId = message.siteId

        if(siteId !== 'default')
            return

        if(cleanup)
            cleanup()
        cleanup = null

        switch(topic) {
            case 'hermes/hotword/toggleOn':
                led.setHalfLeds(0, 0, 255, 1)
                break
            case 'hermes/asr/startListening':
                cleanup = led.rollLeds(offset => {
                    for(let i = 0; i < 5; i++) {
                        const brightness = i
                        led.setLed(i, 50 * i, 100, 50 * (5 - i), brightness, true, offset)
                    }
                    for(let i = 5; i < 12; i++) {
                        led.setLed(0, 0, 0, 0, 0, i !== 11, offset)
                    }
                })
                break
            case 'hermes/tts/say':
                cleanup = led.rollLeds(offset => {
                    led.setHalfLeds(255, 255, 0, Math.abs(offset % 30 - 15))
                })
                break
            case 'hermes/asr/stopListening':
                cleanup = led.rollLeds(offset => {
                    led.setLed(0, 255, 100,   0, 1, true,  offset)
                    led.setLed(1,   0,   0,   0, 0, true,  offset)
                    led.setLed(2,   0,   0,   0, 0, true,  offset)
                    led.setLed(3,   0,   0,   0, 0, true,  offset)
                    led.setLed(4,   0,   0,   0, 0, true,  offset)
                    led.setLed(5, 100, 255,   0, 1, true,  offset)
                    led.setLed(6,   0,   0,   0, 0, true,  offset)
                    led.setLed(7,   0,   0,   0, 0, true,  offset)
                    led.setLed(8,   0,   0,   0, 0, true,  offset)
                    led.setLed(9,   0, 100, 255, 1, true,  offset)
                    led.setLed(10,  0,   0,   0, 0, true,  offset)
                    led.setLed(11,  0,   0,   0, 0, false, offset)
                }, 200)
                break
            case 'hermes/hotword/toggleOff':
            case 'hermes/tts/sayFinished':
                led.clearLeds()
                break
        }
    })
}
module.exports = main