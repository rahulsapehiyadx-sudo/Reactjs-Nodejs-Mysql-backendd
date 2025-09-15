const db = require('../config/db')
const { productTable } = require("./productModel")
const { categoryTable } = require('./categoriesModel')

const initModels = () => {
    try {
        // initialize categories table first 
        categoryTable();

        // initialize product table (depends oon categories via FK)
        productTable();

        console.log("Models intialized & relationship established");
    // Relationship explanation:
    // One Category → Many Products
    // Implemented by: products.category_id → categories.id (FK)
        
    } catch (error) {
        console.error("Error intializing models:", error.message)
    }
}

module.exports = { db, initModels }; 