const multer = require('multer')
const path = require("path")
// const upload = multer({ dest: "uploads/"})


// stores files temporarily in /public/product_images 
const storage = multer.diskStorage({
    destination: (req, file , callback) =>{
        callback(null, path.join(__dirname, "../public/product_images"))  
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

// only allow images
const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;