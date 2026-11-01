// Adds clearly labelled sample accounts and reviews so the app does not look empty in a demo.
//   npm run seed:demo            add (safe to run more than once)
//   npm run seed:demo -- --remove   delete all sample accounts and reviews
require('dotenv').config();

const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Review = require('./models/Review');
const User = require('./models/User');
const updateRatingSummary = require('./lib/updateRatingSummary');

const sampleUsernames = [
    'demo_foodie',
    'demo_noodle_fan',
    'demo_sushi_lover',
    'demo_brunch_buddy',
    'demo_night_owl',
    'demo_city_walker',
];

// [restaurant id, username index, rating, comment, days ago]
// Comments are deliberately generic: they are sample content, not real opinions.
const sampleReviews = [
    [1, 0, 5, 'A lovely spot for a special occasion.', 41],
    [1, 2, 4, 'Relaxed atmosphere and friendly staff. Would visit again.', 18],
    [2, 1, 4, 'Good place to share a few dishes with friends.', 33],
    [2, 4, 5, 'Plenty of choice on the menu and quick service.', 12],
    [3, 3, 4, 'Solid all-rounder and easy to find.', 27],
    [3, 5, 3, 'Decent meal. Not the cheapest, but a fair experience.', 9],
    [4, 2, 4, 'Large menu with something for everyone.', 22],
    [5, 4, 5, 'Great atmosphere for a night out.', 15],
    [5, 0, 4, 'Nice little plates, perfect for sharing.', 6],
    [5, 5, 5, 'One of my favourite spots in the city centre.', 3],
    [6, 1, 5, 'Worth booking ahead. A fun way to eat with a group.', 29],
    [6, 3, 4, 'Good for sharing, and the balcony is a nice touch.', 11],
    [7, 0, 5, 'Friendly service and good value.', 38],
    [7, 2, 4, 'A nice stop after a walk along the seafront.', 20],
    [8, 5, 4, 'Good value for the portion sizes.', 25],
    [8, 1, 4, 'Easy lunch spot with plenty of choice.', 7],
    [10, 3, 3, 'Good value, though it can get busy.', 31],
    [10, 4, 4, 'Friendly staff and a relaxed room.', 14],
    [12, 2, 4, 'Quick, casual and filling.', 19],
    [12, 0, 3, 'Does the job when you want something fast.', 5],
];

function daysAgo(days) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function recalculateAll() {
    for (const restaurant of await Restaurant.find({}, '_id')) {
        await updateRatingSummary({ Restaurant, Review }, restaurant._id);
    }
}

async function addSampleData() {
    const users = [];

    for (const username of sampleUsernames) {
        let user = await User.findOne({ username });

        if (!user) {
            // Nobody needs to sign in as a sample user, so the password is random and thrown away.
            const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
            user = await User.create({
                username,
                email: `${username}@example.invalid`,
                passwordHash,
                isSample: true,
            });
        }

        users.push(user);
    }

    let created = 0;

    for (const [restaurantId, userIndex, rating, comment, days] of sampleReviews) {
        const restaurant = await Restaurant.findOne({ id: restaurantId });
        if (!restaurant) continue;

        const user = users[userIndex];
        const exists = await Review.exists({ restaurant: restaurant._id, user: user._id });
        if (exists) continue;

        const createdAt = daysAgo(days);
        await Review.create(
            [{ restaurant: restaurant._id, user: user._id, rating, comment, isSample: true, createdAt, updatedAt: createdAt }],
            { timestamps: false }
        );
        created += 1;
    }

    await recalculateAll();
    console.log(`Sample data ready: ${users.length} accounts, ${created} new reviews.`);
}

async function removeSampleData() {
    const reviews = await Review.deleteMany({ isSample: true });
    const users = await User.deleteMany({ isSample: true });

    await recalculateAll();
    console.log(`Removed ${users.deletedCount} sample accounts and ${reviews.deletedCount} sample reviews.`);
}

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        if (process.argv.includes('--remove')) {
            await removeSampleData();
        } else {
            await addSampleData();
        }

        process.exit(0);
    } catch (error) {
        console.error('Sample data error:', error.message);
        process.exit(1);
    }
}

run();
