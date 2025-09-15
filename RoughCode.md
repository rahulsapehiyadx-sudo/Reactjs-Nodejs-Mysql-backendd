const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = require("../model/UserModel");

// Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;

  user.getUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email" }); // ✅ email check
    }

    const dbUser = results[0]; // found user
    const validPassword = await bcrypt.compare(password, dbUser.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" }); // ✅ password check
    }

    // generate token
    const token = jwt.sign({ id: dbUser.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful!", token });
  });
};


<!-- old code  -->

// if (results.length > 0) {


    //  const validPassword =await bcrypt.compareSync(password, results[0].password);
    //     console.log(validPassword);
        
    // if (!validPassword)
    //   return res.status(401).json({ error: "Invalid password" });

    // const token = jwt.sign({ id: results[0].id }, process.env.SECRET_KEY, {
    //   expiresIn: "1h",

    // });

    //   res.json({ message: "Login Successful !", token });
    // } else {

    //   res.status(401).json({ message: "Invalid email or password " });
    // }

    const bcrypt = require("bcrypt");
const user = require("../model/UserModel");

// Reset Password Controller
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
    // Check if user exists
    user.getUserByEmail(email, async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in DB
      user.updatePassword(email, hashedPassword, (err2, result) => {
        if (err2) return res.status(500).json({ error: err2.message });

        res.json({ message: "Password updated successfully!" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// // Reset password controller
// exports.updatePassword = (req, res) => {
//   const { email, oldPassword, newPassword } = req.body;
//     console.log(email, oldPassword, newPassword);

//   if (!email || !oldPassword || !newPassword) {
//     return res
//       .status(400)
//       .json({ error: "Email, old password and new password are required" });
//   }

//   try {
//     user.loginUser(email, async (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });

//       if (results.length === 0) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const dbUser = results[0];

//       const validPassword = await bcrypt.compare(oldPassword, dbUser.password);

//       if (!validPassword) {
//         return res.status(401).json({ error: "Old password is incorrect" });
//       }

//       const salt = 8;
//       const hashPassword = await bcrypt.hash(newPassword, salt);

//       user.resetPassword(email, hashPassword, (err2, result) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         res.json({ message: "Your password is changed successfully" });
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };