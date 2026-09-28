const express = require("express");

const {
  register,
  login,
  getMe,
  refreshAccessToken,
  logout,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.get("/me", authenticateToken, getMe);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", authenticateToken, logout);

module.exports = router;