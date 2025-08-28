
const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    // we dont need to pass the port here like the above 
})

db.connect((err) => {
    if(err) {
        console.log("not connected to the Mysql database " ,  + err.message);
        return;
    }
    console.log('Connected to Mysql database');
    
    
})

module.exports = db; 
