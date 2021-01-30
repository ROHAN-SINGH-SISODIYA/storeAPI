const express = require("express");
const router = express.Router();
const { createProduct, getProduct, listProducts, deleteProduct, updateProduct } = require("../controllers/product");
const { requireSignin, isAdmin, jwtVerification } = require("../controllers/auth");

router.use(jwtVerification);

// only admin can create,delete,update product
router.post("/create-product", requireSignin, isAdmin, createProduct);

router.post("/delete-product/:productId", requireSignin, isAdmin, deleteProduct);

router.post("/update-product", requireSignin, isAdmin, updateProduct);

// these two routes can accessable by user also
router.get("/get-product/:productId", requireSignin, getProduct);

router.get("/list-product", requireSignin, listProducts);

module.exports = router;
