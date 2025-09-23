const db = require('../config/db')

const product_images = {
    createWithImage: (product_id, image_url, callback) => db.query("INSERT INTO product_images (product_id , image_url) VALUES (?, ?)",
        [product_id, image_url], callback
    ) ,                     

 getByProductId: (product_id, callback) =>
    db.query(
      "SELECT * FROM product_images WHERE product_id = ?",
      [product_id],
      callback
    ),
};

module.exports =  product_images  ;