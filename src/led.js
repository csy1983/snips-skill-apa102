const rpio = require('rpio')
const spi = require('spi-device')

const LED_COUNT = 12

/* Power up the respeaker leds using gpio5 */
rpio.init({
    gpiomem: true,
    mapping: 'gpio'
})
rpio.open(5, rpio.OUTPUT, rpio.HIGH)

/* Allocate the APA102 buffer */
const bufferLength = (LED_COUNT + 1) * 4 + 4
const writeBuffer = Buffer.concat([
    Buffer.alloc(4, '00000000', 'hex'),
    Buffer.alloc(bufferLength - 4, 'E0000000', 'hex')
], bufferLength)

/* Init. SPI */
const apa102 = spi.openSync(0, 0)

/* Expose base functions */
const leds = {
    setLedColor (n, brightness, r, g, b) {
        n *= 4
        n += 4
        writeBuffer[n] = brightness | 0b11100000
        writeBuffer[n + 1] = b
        writeBuffer[n + 2] = g
        writeBuffer[n + 3] = r
    },
    sendLeds () {
        apa102.transferSync([{
            sendBuffer: writeBuffer,
            byteLength: bufferLength
        }])
    }
}

module.exports = {
    getDriver() {
        return leds
    },
    setLed (number, red, green, blue, brigtness = 1, dontSend = false, offset = 0) {
        const ledNumber = (offset + number) % LED_COUNT
        leds.setLedColor(ledNumber, brigtness, red, green, blue)
        if(!dontSend)
            leds.sendLeds()
    },
    setLeds (red, green, blue, brightness = 1) {
        for(let i = 0; i < LED_COUNT; i++) {
            leds.setLedColor(i, brightness, red, green, blue)
        }
        leds.sendLeds()
    },
    setHalfLeds (red, green, blue, brightness = 1, offset = 0) {
        module.exports.clearLeds()
        for(let i = 0; i < LED_COUNT; i = i + 2) {
            const ledNumber = (i + offset) % LED_COUNT
            leds.setLedColor(ledNumber, brightness, red, green, blue)
        }
        leds.sendLeds()
    },
    clearLeds () {
        for(let i = 0; i < LED_COUNT; i++) {
            leds.setLedColor(i, 0, 0, 0, 0)
        }
        leds.sendLeds()
    },
    rollLeds (initFunction, timer = 100) {
        let offset = 0
        let ref = null

        // eslint-disable-next-line
        const loop = () => {
            initFunction(offset++)
            ref = setTimeout(loop, timer)
        }
        loop()

        return () => { clearTimeout(ref) }
    }
}