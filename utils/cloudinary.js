// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,        // Replace with your actual cloud name
  api_key: process.env.api_key ,              // Replace with your actual API key
  api_secret: process.env.api_secret          // Replace with your actual API secret
});

module.exports = cloudinary;
