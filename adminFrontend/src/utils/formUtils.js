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

export function checkObjectsEqual(objA, objB) {
    if (objA instanceof Object === false || objA instanceof Object === false) {
        throw new Error("Make sure both values are objects")
    }
    let objAKeys = Object.keys(objA)
    let objBKeys = Object.keys(objB)

    // if they don't have the same number of properties, they cannot be equal
    if (objAKeys.length !== objBKeys.length) {
        return false
    }

    // sort the arrays alphabetically
    objAKeys.sort(function (a, b) {
        const nameA = a.toLowerCase(), nameB = b.toLowerCase();
        if (nameA < nameB) //sort string ascending
            return -1;
        if (nameA > nameB)
            return 1;
        return 0; //default return value (no sorting)
    });

    objBKeys.sort(function (a, b) {
        const nameA = a.toLowerCase(), nameB = b.toLowerCase();
        if (nameA < nameB) //sort string ascending
            return -1;
        if (nameA > nameB)
            return 1;
        return 0; //default return value (no sorting)
    });

    // since they have same number of properties, compare the property names and property values
    for (let i = 0; i < objAKeys.length; i++) {
        const propA = objAKeys[i]
        const propB = objBKeys[i]
        if (propA !== propB) {
            return false
        }

        if (objA[propA] !== objB[propB]) {
            return false
        }
    }
    //  if everything passes, they are equal
    return true
}


export function toCamelCase(text) {
    // split the text into words
    let words = text.split(" ")
    // to continue camelCasing, there has to be a min of 2 words in the text that is space separated
    if (words.length < 2) {
        return text
    }

    // make sure the array is not a word and an empty string. that crashes the function
    if (words.length === 2 && words[1] === ""){
        return text
    }

    // separate the first word from the array of words and ensure it's lowercase
    let firstWord = words.shift()

    // capitalise the first letter of each word in the array
    words = words.map((word) => {
        // break word down to letters
        const letters = word.split("")

        // separate the first letter from the letters array and capitalise it
        const firstLetter = letters.shift().toUpperCase()

        // join all the letters into a single array and turn that array into a string
        return [firstLetter, ...letters].join("")
    })

    //  join the first word and the remanining words into an array and turn that array into a string
    return [firstWord, ...words].join("")
}