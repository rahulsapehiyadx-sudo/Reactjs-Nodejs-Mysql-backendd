const db = require("../config/db");

const categories = {
  getAll: (callback) => db.query("SELECT * FROM  categories ", callback),

  create: (data, callback) =>
    db.query(
      "INSERT INTO categories (name, category_id) VALUES(?,?) ",
      [data.name, data.category_id || null ],
      callback
    ),

  // update: (id, callback) => db.query("UPDATE categories SET name = ?  WHERE id = ? ", [id], callback)
};

module.exports = { categories };
