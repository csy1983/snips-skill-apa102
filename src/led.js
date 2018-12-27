const rpio = require('rpio')
const Apa102spi = require('apa102-spi')

const LED_COUNT = 12

const leds = new Apa102spi(LED_COUNT + 1, 16)

rpio.init({
    gpiomem: false,
    mapping: 'gpio'
})
rpio.open(5, rpio.OUTPUT, rpio.HIGH)

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