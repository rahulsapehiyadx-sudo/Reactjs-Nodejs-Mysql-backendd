const db = require("../config/db");

const categories = {
  getAll: (callback) => db.query("SELECT * FROM  categories ", callback),

  create: (data, callback) =>
    db.query(
      "INSERT INTO categories (name, category_id, description) VALUES(?,?,?) ",
      [data.name, data.category_id || null, data.description || null],
      callback
    ),

  update: (id, data, callback) => {


    db.query(
      "UPDATE categories SET name =?,  description =? WHERE id =? ",
      [data.name, data.description || null, id],
      callback
    );
  },
};

module.exports = { categories };
