const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const productSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    } ,
    category: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,
        required: true,
    },
//     availability: {
//     type: String,
//     enum: ["available", "sold out"],
//     default: "available",
//   }

}, { timestamps: true }) ;

const ProductModel = model("Product", productSchema)

module.exports = ProductModel
