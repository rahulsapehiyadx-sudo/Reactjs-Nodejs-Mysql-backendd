const user = require("../models/userModel");
const otpModel = require('../models/otpModel')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendOTP = require("../utils/mailer");

// Register controller
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = 8;
    const hashPassword = await bcrypt.hash(password, salt);

    user.checkUserExists(email, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already taken" });
      }

      user.registerUser(username, email, hashPassword, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User Registered successfully!" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;

  user.loginUser(email, async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const dbUser = results[0];
    const validPassword = await bcrypt.compare(password, dbUser.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: dbUser.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful!", token });
  });
};

// Request OTP 
exports.resetwithOTP = (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "email doesn't exists" });

  // generate 6  digit otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // save in DB
  otpModel.saveOTP(email, otp, (err) => {
    if (err) return res.status(500).json({ erorr: err.message })
 
  // send email for otp
  sendOTP(email, otp)
    .then(() => {
      res.json({ message: "opt sent on your mail" });
    })

    .catch((err) => {
      res
        .status(500)
        .json({ message: "mail not sent , error occured", details: err });
    });
    })
};

// reset password with otp and old password
exports.updatePassword = (req, res) => {
  const { email, oldPassword, newPassword, otp } = req.body;

  if (!email || !oldPassword || !newPassword || !otp) {
    return res
      .status(400)
      .json({ error: " email, oldPassword, newPassword , otp are required" });
  }

  try {
    // Verify OTP from DB
    otpModel.getOTP(email, (err, results) => {
      if (err) res.status(500).json({ error: err.message})
        if (results.length === 0 || results[0].otp !== otp) {
          return res.status(401).json({ error: "Invalid or expired otp " })
        }
    
// verify user 
    user.loginUser(email, async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) {
        return res.status(404).json({ error: "user not found" });
      }

      const dbUser = results[0];

      // compare old password
      const validPassword = await bcrypt.compare(oldPassword, dbUser.password);
      if (!validPassword) {
        return res.status(401).json({ error: "oldPassword is incorrect" });
      }
      // hash new password
      const hashPassword = await bcrypt.hash(newPassword, 10);

      // update password in db
      user.resetPassword(email, hashPassword, (err2) => {
        if (err2) return res.status(500).json({ error: "er2.message" });

        otpModel.deleteOTP(email, () => {}); // clear otp after success
        res.json({ message: "Password changed successfuly" });
      });
    });
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  request otp controller for forget password 

exports.forgetPasswordRequestOtp = (req, res) => {
  const { email } = req.body

  if (!email) return res.status(400).json({ error: "Valid Email is required"})

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpModel.saveOTP( email, otp, (err) => {
      if (err) return res.status(500).json({ error: err.message })

        sendOTP(email, otp)

        .then(() => {
          res.json({ message: "OTP sent to your email, for password reset."})
        })
        .catch((err) => {
          res.status(500).json({ error: "Failed to send otp", details: err })
        })
    })
}

// Reset password controller (for forget password functionality/without old password)

exports.forgetPasswordReset = (req, res) => {
   const { email, otp, newPassword } = req.body 
  //  console.log(email, otp, newPassword);
   

   if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "Email , otp and newPassword are required"})
   }

    otpModel.getOTP(email, (err, results ) => {
       if(err) return res.status(500).json({ error: err.message})


      if (results.length === 0) {
      return res.status(401).json({ error: "No OTP found for this email" });
    }

    const storedOtp = results[0].otp;
    const createdAt = new Date(results[0].created_at);
    const now = new Date();

    // check if expired (5 minutes = 300000 ms)
    if (now - createdAt > 5 * 60 * 1000) {
      return res.status(401).json({ error: "OTP expired. Request a new one." });
    }

    if (storedOtp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

      bcrypt.hash(newPassword, 10, (err, hashPassword) => {
        if (err) return res.status(500).json({ error: err.message })


        user.resetPassword(email, hashPassword, (err2) => {
          if (err2) return res.status(500).json({ error: err2.message})

          otpModel.deleteOTP(email, () => {}) //delete the otp 
          res.json({ message: "Password reset successfuly"})
        })
      })
    })
 } 