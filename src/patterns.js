const led = require('./led')

let cleanupAnimation = null
process.on('SIGINT', function() {
    if(cleanupAnimation) {
        cleanupAnimation()
        cleanupAnimation = null
    }
})

const animations = {
    idle() {
        led.setHalfLeds(0, 0, 255, 1)
    },
    listening() {
        cleanupAnimation = led.rollLeds(offset => {
            for(let i = 0; i < 5; i++) {
                const brightness = i
                led.setLed(i, 50 * i, 100, 50 * (5 - i), brightness, true, offset)
            }
            for(let i = 5; i < 12; i++) {
                led.setLed(0, 0, 0, 0, 0, i !== 11, offset)
            }
        })
    },
    thinking() {
        cleanupAnimation = led.rollLeds(offset => {
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
    },
    speaking() {
        cleanupAnimation = led.rollLeds(offset => {
            led.setHalfLeds(255, 100, 0, Math.abs(offset % 30 - 15))
        })
    }
}

module.exports = {
    setPattern (patternName) {
        if(!animations[patternName])
            return
        if(cleanupAnimation) {
            cleanupAnimation()
            cleanupAnimation = null
        }
        led.clearLeds()
        animations[patternName]()
    }
}