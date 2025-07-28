const express = require('express');
const { registerAdmin, loginAdmin } = require('../auth/Auth');
const { addProduct, getAllProduct, getProductsByCategory, deleteProduct, deleteAllProducts, updateProduct } = require('../controllers/productController');
const { isAdminLoggedIn } = require('../middleware/authenticate');

const router = express.Router()

// Public routes
router.post('/register-admin', registerAdmin);
router.post('/login-admin', loginAdmin);
router.get('/all-product', getAllProduct);
router.get("/products/category/:category", getProductsByCategory);

// Protected routes (Admin only)
router.post('/add-product', isAdminLoggedIn, addProduct);
router.delete('/delete-all-product', isAdminLoggedIn, deleteAllProducts);
router.delete('/delete-product/:id', isAdminLoggedIn, deleteProduct);
router.put('/update-products/:id', isAdminLoggedIn, updateProduct);


module.exports = router