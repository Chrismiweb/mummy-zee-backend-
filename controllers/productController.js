const path = require('path');
const productModel = require('../model/ProductModel');
const fs = require('fs');


const allowedCategories = ["abaya", "jalabiya", "gown", "shoe", "bag", "cap", "scarve", "hijab", "underwear", "veil", "all"]; // Define allowed categories


// add new product
const addProduct = async (req, res) => {
  const { productName ,price, size,  category} = req.body;

  // Validate required fields
  if (!productName || !category || !size || !price) {
    return res.status(400).json({ error: "Please fill all credentials" });
  }

    // Validate category
  if (!allowedCategories.includes(category.toLowerCase())) {
    return res.status(400).json({
      error: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
    });
  }

  // Check if a file was uploaded
  if (!req.files || !req.files.productImage) {
    return res.status(400).json({ error: "Product image is required" });
  }

  /* -------- handle image upload exactly like before ---------- */
  const imageFile   = req.files.productImage;
  const uploadsDir  = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  const fileName   = `${Date.now()}-${imageFile.name}`;
  const uploadPath = path.join(uploadsDir, fileName);

  await imageFile.mv(uploadPath);
  // Construct image URL (THIS IS KEY)
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

  /* -------- save new product ---------- */
  const newProduct = await productModel.create({
    productName,
    price,
    category,
    size,
    productImage: imageUrl,           
  });

  return res
    .status(201)
    .json({ message: "Product uploaded successfully", newProduct });
};


// get all product
 const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });;
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// get product by category
const getProductsByCategory = async (req, res) => {
  const category = req.params.category?.toLowerCase();

  try {
    const products = await productModel.find({ category });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: `No products found in category: ${category}` });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


// delete a product using product id
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Extract the image filename from the full URL
    const imageUrl = product.productImage;
    const imageFileName = imageUrl.split("/").pop(); // get file name from URL
    const imagePath = path.join(__dirname, "../uploads", imageFileName);

    // Delete the image file if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the product
    await productModel.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


// delete all products
const deleteAllProducts = async (req, res) => {
  try {
    // Find all products
    const allProducts = await productModel.find();

    // Delete all image files associated with products
    allProducts.forEach((product) => {
      if (product.productImage) {
        const imageFileName = product.productImage.split("/").pop();
        const imagePath = path.join(__dirname, "../uploads", imageFileName);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    // Delete all products from the database
    await productModel.deleteMany({});

    res.status(200).json({ message: "All products deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



// update product
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { productName, price, category, size } = req.body;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // If a new image was uploaded, delete old one and save the new
    if (req.files && req.files.productImage) {
      const oldFileName = product.productImage.split("/").pop();
      const oldImagePath = path.join(__dirname, "../uploads", oldFileName);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      const imageFile = req.files.productImage;
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(uploadsDir, fileName);
      await imageFile.mv(uploadPath);

      product.productImage = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
    }

    // Update other fields
    if (productName) product.productName = productName;
    if (price) product.price = price;
    if (category) product.category = category;
    if (size) product.size = size;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



module.exports = {
    addProduct,
    getAllProduct,
    deleteProduct,
    getProductsByCategory,
    deleteAllProducts,
    updateProduct
}

