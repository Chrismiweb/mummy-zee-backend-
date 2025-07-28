const jwt = require("jsonwebtoken");
const adminModel = require("../model/adminModel");

const isAdminLoggedIn = async (req, res, next) => {
  const auth = req.headers.authorization || "";

  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing from header" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    console.log("Decoded JWT:", decoded);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const admin = await adminModel.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ error: "Admin not found. Please log in again." });
    }

    req.admin = admin; // Attach admin info to request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token", details: err.message });
  }
};

module.exports = { isAdminLoggedIn };
