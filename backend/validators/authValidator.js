const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name is required").bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters").bail(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required").bail()
    .isEmail()
    .withMessage("Please enter a valid email").bail()
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required").bail()
    .isLength({ min: 6, max: 64 }).withMessage("Password must be between 6 and 64 characters").bail(),
];

//login

const loginValidator = [
  body("email")
    .trim().notEmpty().withMessage("Email is required").bail()
    .isEmail().withMessage("Please enter a valid email").bail(),

  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerValidator,
  loginValidator,
};
