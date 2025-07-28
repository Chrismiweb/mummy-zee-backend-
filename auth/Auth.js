const adminModel = require("../model/adminModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


// Register admin
const registerAdmin = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
        return res.status(409).json({ error: "Admin already exists" });
    }

    const newAdmin = new adminModel({ name, email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
};

// Login admin
const loginAdmin = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: "Email or name and password are required" });
    }

    const admin = await adminModel.findOne({
        $or: [{ email: identifier }, { name: identifier }],
    });

    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }

    if (password !== admin.password) {
        return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.jwt_secret, {
        expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, admin });
};



module.exports = {registerAdmin, loginAdmin}