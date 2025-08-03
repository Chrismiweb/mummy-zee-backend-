const express = require('express');
const connectDb = require('./database/connectDB');
const port = process.env.PORT || 1040; // <-- Use Render's dynamic PORT if set
const route = require('./routes/routes');
const path = require("path");
const dotenv = require('dotenv').config();
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// --- Root Route for Render Health Check ---
app.get('/', (req, res) => {
    res.send('Mummy Zee Backend is Running!');
});

// --- API Routes ---
app.use('/api', route);

// --- Start Server ---
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await connectDb(`Database is connected`);
});
