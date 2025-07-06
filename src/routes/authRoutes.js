const express = require("express");
const { register, login, me, deleteAccount } = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.delete("/delete/:userId", authMiddleware, deleteAccount);

module.exports = router;
  