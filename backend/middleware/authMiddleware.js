const jwt = require('jsonwebtoken')
const Admin = require('../models/adminModel')
const mongoose = require('mongoose')
const { generateToken } = require('../helpers/generateToken')

//  a middleware is just a function. We can set this function to run on any number of routes. When set, this function will run between when the server receives a request and before it runs the main controller function.
async function protect(req, res, next) {
    // check for the token in the header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization.split(' ')[1]

        try {
            // verify that the token is valid 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)


            // get admin's id which was put in the token when it was first created and use that to get the admin from the database
            const admin = await Admin.findById(new mongoose.Types.ObjectId(decoded.id))

            req.admin = { username: admin.username }
            req.token = token

            req.decodedToken = decoded
            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: err.message })
        }

    } else {
        // prevent user from accessing data if he/she did not send a token along with the request
        return res.status(401).json({ success: false, message: 'No token' })
    }
}


function tokenAboutToExpire(decodedToken) {
    const expTimeInSec = decodedToken.exp;
    const nowInSec = Date.now()/1000;

    const remainingTimeInSec = Math.round(Math.abs(nowInSec - expTimeInSec))

    // console.log("remainingTime", remainingTimeInSec)
    if (remainingTimeInSec < 120) {
        return true;
    }
    return false;
}

function tokenExpire(req, res, next) {
    if (tokenAboutToExpire(req.decodedToken) === true) {
        return res.json({ success: true, aboutToExpire: true })
    } else {
        return res.json({ success: true, aboutToExpire: false })
    }

}

module.exports = { protect, tokenExpire }            