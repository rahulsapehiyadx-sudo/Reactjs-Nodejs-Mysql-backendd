// server.js (main entry file)
require("dotenv").config();

// required packages
const express = require('express')
const mysql = require('mysql2')
const db = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')

// initializing app

const app = express();

// middleware for parsing into json objects

app.use(cors({ 
    origin: "http://localhost:5173",  // frontend/react side URL 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true

}))
app.use(express.json())
app.use('/api',authRoutes)




// start the server 
const PORT = process.env.PORT || 5000;

app.get('/',(req, res) => {
    res.send("chal raha hai bhai");
    
})

app.listen(PORT, ()=>{
        console.log(`Server listening on https://localhost: ${PORT}`);
        
})