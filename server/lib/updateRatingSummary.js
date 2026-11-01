// Recomputes a restaurant's average rating and review count from its reviews.
async function updateRatingSummary({ Restaurant, Review }, restaurantId) {
    const [summary] = await Review.aggregate([
        { $match: { restaurant: restaurantId } },
        { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    await Restaurant.updateOne(
        { _id: restaurantId },
        {
            rating: summary ? Math.round(summary.average * 10) / 10 : null,
            reviewCount: summary ? summary.count : 0,
        }
    );
}

module.exports = updateRatingSummary;
