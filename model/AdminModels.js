const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }

});

const AdminModels = model("User", adminSchema)

module.exports = AdminModels
