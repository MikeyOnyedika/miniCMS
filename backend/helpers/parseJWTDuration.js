function parseJWTDuration(durationString) {
    const parts = durationString.split(" ")
    let multiplier = 1

    switch (parts[1]) {
        case 'minute':
        case 'minutes':
            multiplier = 60
            break;
        case 'hour':
        case 'hours':
            multiplier = 3600
            break;
        case 'day':
        case 'days':
            multiplier = 3600 * 24
            break;
        default: throw new Error("Specify a valid duration unit!")
    }

    const durationInSec = parts[0] * multiplier
    console.log(durationInSec)
    return durationInSec
}

module.exports = { parseJWTDuration  }