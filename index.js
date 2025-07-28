const express = require('express');
const connectDb = require('./database/connectDB');
const port = 1040;
const  route  = require('./routes/routes');
const path = require("path"); 
const dotenv = require('dotenv').config()
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express()

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); 
app.use('/', route)



 app.listen(port, async()=>{
    console.log(`server is running on port ${port}`);   
    await connectDb(`database is currently running on ${port}`)
 });