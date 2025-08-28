const db = require('../config/db')

// Insert new user into the database 
exports.registerUser = ( username ,email,  password, callback) => {
    const sql = "INSERT INTO users ( username, email, password) VALUES (?,?,?)";
    db.query(sql, [username, email, password], callback);
};

// Find user by email and password 
exports.loginUser = (email, password, callback) => {

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email, password], callback); 
}; 

// Check if email already exists 
exports.checkUserExists = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ? ";
    db.query(sql, [email], callback)
}


