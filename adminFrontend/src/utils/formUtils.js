export function isURLValid(url) {
    const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    let match = url.match(regex)
    if (match === null) {
        return false
    } else {
        if (match[0].length === url.length) {
            return true
        } else {
            return false
        }
    }
}


export function parseDateTime(dateTimeString) {
    const regex = /:[0-9]{2}\.[0-9]{3}/
    // check if the pattern exists in the string
    if (dateTimeString.match(regex) !== null) {
        const parts = dateTimeString.split(regex)
        return splitDateTime(parts[0])
    } else {
        return splitDateTime(dateTimeString)
    }
}

export function parseDateTimeInFormData(template, formData) {
    const fData = { ...formData }
    template.forEach(field => {
        if (field.type === "date") {
            const fName = field.name
            if (fData[fName] === null || fData[fName] === undefined) {
                fData[fName] = ""
            } else {
                fData[fName] = parseDateTime(fData[fName])
            }
        }
    })

    if (fData['created-at']) {
        fData['created-at'] = parseDateTime(fData['created-at'])
    }

    if (fData['last-update-at']) {
        fData['last-update-at'] = parseDateTime(fData['last-update-at'])
    }
    return fData
}

export function splitDateTime(dateTime) {
    const dateTimeArray = dateTime.split('T')
    return `${dateTimeArray[0]} ${dateTimeArray[1]}`
}

export function isEmailValid(email) {
    let match = email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gm)
    if (match === null) {
        return false
    } else {
        if (match[0].length === email.length) {
            return true
        } else {
            return false
        }
    }
}