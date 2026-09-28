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

const {
  productValidator,
  productIdValidator,
} = require("../validators/productValidator");

const router = express.Router();

router.get("/", getProducts);

router.get(
  "/:id",
  productIdValidator,
  validate,
  getProductById
);

router.post(
  "/",
  authenticateToken,
  productValidator,
  validate,
  createProduct
);

router.put(
  "/:id",
  authenticateToken,
  productIdValidator,
  productValidator,
  validate,
  updateProduct
);

router.delete(
  "/:id",
  authenticateToken,
  productIdValidator,
  validate,
  deleteProduct
);

module.exports = router;