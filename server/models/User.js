const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 24,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
