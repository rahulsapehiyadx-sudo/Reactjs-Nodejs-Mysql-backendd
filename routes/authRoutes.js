const express = require('express');
const router = express.Router();
const authController =  require('../controllers/authController')


// API routes 

router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/request-otp',authController.resetwithOTP)
router.post('/reset-pwd',authController.updatePassword)
router.post('/forgot-pwd/req-otp',authController.forgetPasswordRequestOtp)
router.post('/forgot-pwd/reset-pwd',authController.forgetPasswordReset)


module.exports = router;