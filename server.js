// server.js (main entry file)
require("dotenv").config();

// required packages
const express = require("express");
const mysql = require("mysql2");
const db = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("../backend/routes/productRoutes");
const categoryRoutes = require("../backend/routes/categoryRoutes");
const {productTable} = require('../backend/models/productModel')
const {categoriesTable} = require('../backend/models/categoriesModel')

const dotenv = require("dotenv");
dotenv.config();

// initializing app

const app = express();
// productTable();
// categoriesTable();

// middleware for parsing into json objects

app.use(
  cors({
    origin: "http://localhost:5173", // frontend/react side URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);

// start the server
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("chal raha hai bhai");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
