const user = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Register controller
exports.register = (req, res) => {
  const { username, email, password } = req.body;
  // console.log("Username value:", username, "Type:", typeof username);

  // Hash password before starting
  const hashPassword = bcrypt.hashSync(password, 8);

  user.checkUserExists(email, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      // email already exists
      return res.status(400).json({ message: "Email already taken" });
    }

    // if not exsits proceed with registration
    user.registerUser(username, email, hashPassword, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User Registered successfully!" });
    });
  });
};

// Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;

  user.loginUser(email, password, async(err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // console.log(results); //  for debugging purposes

    if (results.length > 0) {


     const validPassword =await bcrypt.compareSync(password, results[0].password);
        console.log(validPassword);
        
    if (!validPassword)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: results[0].id }, process.env.SECRET_KEY, {
      expiresIn: "1h",

    });

      res.json({ message: "Login Successful !", token });
    } else {

      res.status(401).json({ message: "Invalid email or password " });
    }
  });
};
