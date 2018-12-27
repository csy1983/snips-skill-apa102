module.exports = {
    wait (time = 2000) {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }
}