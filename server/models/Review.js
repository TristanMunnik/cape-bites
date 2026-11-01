const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, trim: true, maxlength: 1000, default: '' },
        // True for demo content created by seed-demo.js, so it can be labelled and removed.
        isSample: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// One review per user per restaurant
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
