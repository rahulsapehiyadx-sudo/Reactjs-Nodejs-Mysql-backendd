const db = require('../config/db')

// save OTP for email 
exports.saveOTP = (email, otp, callback) => {
    const sql = "INSERT INTO users (email, otp, created_at) VALUES (?,?, NOW()) ON DUPLICATE KEY UPDATE otp = VALUES(otp), created_at = NOW() ";
    db.query(sql, [email, otp], callback);
}

// get latest OTP for email 
exports.getOTP = (email, callback) => {
    const sql = "SELECT otp, created_at FROM users WHERE email = ? ORDER BY created_at DESC LIMIT 1";
    db.query(sql, [email], callback)
};

// delete OTP after use 
exports.deleteOTP = (email, callback) => {
    const sql = "DELETE otp FROM users WHERE email = ?"
    db.query(sql, [email], callback)
};


