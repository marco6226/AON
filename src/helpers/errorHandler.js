
function errorHandler(err, req, res, next) {
    console.error(err);
    
    // if (typeof (err) === 'string') {
    //     // custom application error
    //     return res.status(400).json({ 
    //         id: "error",
    //         message: "An error has occurred" 
    //     });
    // }

    if (err.id === 'wrong_username_or_password' || err.id === 'unauthorized') {
        return res.status(401).json(err);
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ 
            id: "invalid_token",
            message: 'Invalid Token' 
        });
    }

    // default to 500 server error
    return res.status(500).json({ 
        id: "error",
        message: "An error has occurred" 
    });
}

module.exports = errorHandler;