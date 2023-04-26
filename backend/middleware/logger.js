// just a middleware function that prints some info for every request
function logger(req, res, next){
    // console.log(req.method, req.url, req.httpVersion)
    next();
}

module.exports = logger