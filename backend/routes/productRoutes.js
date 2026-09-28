const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/authMiddleware");
const productValidator = require("../validators/productValidator");

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", authenticateToken, productValidator, validate, createProduct);

router.put(
  "/:id",
  authenticateToken,
  productValidator,
  validate,
  updateProduct,
);

router.delete("/:id", authenticateToken, deleteProduct);

module.exports = router;
