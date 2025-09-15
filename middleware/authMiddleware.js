const jwt = require('jsonwebtoken')

// middleware to check if user logged in 
const authMiddleware= (req, res, next) => {

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied!"})
    

    
    jwt.verify(token, process.env.SECRET_KEY, ( err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token"})
    req.user = user; 
    next();

    })
}

module.exports = { authMiddleware }