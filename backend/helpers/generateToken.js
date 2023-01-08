const jwt = require('jsonwebtoken')
// generates the token admin will use to access private routes
function generateToken(payload) {
    
    // const expirationTime = Math.abs(payload.generatedAt + new Date(process.env.JWT_DURATION));
    // payload = { ...payload }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURATION });
}

module.exports = { generateToken }
