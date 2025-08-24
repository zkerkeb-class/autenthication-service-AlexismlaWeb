const express = require("express");
const { register, login, me, deleteAccount, forgotPassword, resetPassword, verifyEmail} = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.delete("/delete/:userId", authMiddleware, deleteAccount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);


module.exports = router;
  