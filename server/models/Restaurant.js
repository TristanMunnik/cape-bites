const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        cuisine: {
            type: String,
            required: true,
            trim: true,
        },
        neighborhood: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
            default: '',
        },
        website: {
            type: String,
            trim: true,
            default: '',
        },
        sourceUrl: {
            type: String,
            trim: true,
            default: '',
        },
        priceRange: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
        },
        accent: {
            type: String,
            default: 'orange',
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
