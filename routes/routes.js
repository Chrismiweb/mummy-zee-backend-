const express = require('express');
const { registerAdmin, loginAdmin } = require('../auth/Auth');
const { addProduct, getAllProduct, getProductsByCategory, deleteProduct, deleteAllProducts, updateProduct } = require('../controllers/productController');

const router = express.Router()

router.route('/register-admin').post(registerAdmin)
router.route('/login-admin').post(loginAdmin)
router.route('/add-product').post(addProduct)
router.route('/all-product').get(getAllProduct)
router.route('/delete-all-product').delete(deleteAllProducts)
router.get("/products/category/:category", getProductsByCategory);
router.delete("/delete-product/:id", deleteProduct);
router.put("/update-products/:id", updateProduct);









module.exports = router