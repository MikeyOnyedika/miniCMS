export function isEmailValid(email){
    let match = email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gm)
    console.log(match)
    if (match === null){
        return false
    }else{
        if (match[0].length === email.length){
            return true
        }else{
            return false
        }
    }
}