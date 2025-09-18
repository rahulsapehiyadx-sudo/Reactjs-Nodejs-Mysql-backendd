const db = require('../config/db')

const product = {
    getAll: (callback) => db.query(" SELECT * FROM product", callback),

    getById: (id, callback) => db.query(" SELECT * FROM product WHERE id = ? ",[id], callback),

    create: (data, callback) => db.query("INSERT INTO product (name, category_id, price, description) VALUES (?,?,?,?) ",[data.name, data.category_id || null, data.price, data.description],  callback ),

    update: (id, data, callback) => db.query("UPDATE product SET name=? , category_id=?, price=?, description=? WHERE  id = ? ", [data.name, data.category_id, data.price, data.description, id ], callback ),

    remove: (id, callback) => db.query("DELETE FROM product WHERE id = ?",[id] , callback),

}


module.exports = {product};           