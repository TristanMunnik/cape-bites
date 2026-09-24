require('dotenv').config();

const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

const seedRestaurants = [
    {
        id: 1,
        name: 'Kumo House',
        cuisine: 'Japanese',
        neighborhood: 'Gardens',
        priceRange: '$$',
        rating: 4.7,
        accent: 'saffron',
        description: 'A cozy ramen and sushi spot known for rich broths, crisp gyoza, and warm late-night vibes.',
        image: '',
        tags: ['ramen', 'sushi', 'bowls'],
        featured: true,
    },
    {
        id: 2,
        name: 'Lotus Lane',
        cuisine: 'Vietnamese',
        neighborhood: 'De Waterkant',
        priceRange: '$$',
        rating: 4.8,
        accent: 'coral',
        description: 'Fresh herbs, noodle bowls, and banh mi classics served in a bright, lively setting.',
        image: '',
        tags: ['pho', 'noodles', 'fresh'],
        featured: true,
    },
    {
        id: 3,
        name: 'Seoul Bird',
        cuisine: 'Korean',
        neighborhood: 'Woodstock',
        priceRange: '$$$',
        rating: 4.5,
        accent: 'jade',
        description: 'Korean barbecue, fried chicken, and family-style platters made for sharing.',
        image: '',
        tags: ['bbq', 'fried chicken', 'sharing'],
        featured: false,
    },
    {
        id: 4,
        name: 'Mango & Rice',
        cuisine: 'Thai',
        neighborhood: 'Sea Point',
        priceRange: '$$',
        rating: 4.6,
        accent: 'indigo',
        description: 'Fragrant curries, noodle dishes, and colourful lunch specials with a Cape Town crowd.',
        image: '',
        tags: ['curry', 'street food', 'lunch'],
        featured: false,
    },
    {
        id: 5,
        name: 'Saffron Lantern',
        cuisine: 'Indian',
        neighborhood: 'Mowbray',
        priceRange: '$$',
        rating: 4.4,
        accent: 'amber',
        description: 'A welcoming Indian restaurant serving butter chicken, dosas, and comforting spice blends.',
        image: '',
        tags: ['curry', 'dosa', 'family'],
        featured: false,
    },
    {
        id: 6,
        name: 'Golden Wok',
        cuisine: 'Chinese',
        neighborhood: 'Muizenberg',
        priceRange: '$$',
        rating: 4.2,
        accent: 'red',
        description: 'Classic Cantonese favourites and dim sum done with a casual beachfront energy.',
        image: '',
        tags: ['dumplings', 'noodles', 'dim sum'],
        featured: false,
    },
    {
        id: 7,
        name: 'Harbor Nami',
        cuisine: 'Japanese',
        neighborhood: 'Green Point',
        priceRange: '$$$',
        rating: 4.9,
        accent: 'teal',
        description: 'Refined sushi, sashimi, and omakase-inspired plates with harbour views and warm service.',
        image: '',
        tags: ['sushi', 'fine dining', 'omakase'],
        featured: true,
    },
    {
        id: 8,
        name: 'Bamboo & Bean',
        cuisine: 'Malaysian',
        neighborhood: 'Rondebosch',
        priceRange: '$$',
        rating: 4.3,
        accent: 'lime',
        description: 'A modern café-style spot serving laksa, nasi lemak, and comforting noodle dishes.',
        image: '',
        tags: ['laksa', 'breakfast', 'comfort'],
        featured: false,
    },
    {
        id: 9,
        name: 'Sunset Kimchi',
        cuisine: 'Korean',
        neighborhood: 'Claremont',
        priceRange: '$$$',
        rating: 4.7,
        accent: 'rose',
        description: 'Slow-cooked stews, bibimbap, and creative Korean small plates with a polished feel.',
        image: '',
        tags: ['bibimbap', 'stew', 'shared'],
        featured: false,
    },
    {
        id: 10,
        name: 'Bali Bowl Co.',
        cuisine: 'Indonesian',
        neighborhood: 'Observatory',
        priceRange: '$$',
        rating: 4.4,
        accent: 'orange',
        description: 'Fresh rice bowls, satay skewers, and vibrant tropical flavours with a casual lunch vibe.',
        image: '',
        tags: ['satay', 'bowls', 'tropical'],
        featured: false,
    },
    {
        id: 11,
        name: 'Tiger Chili',
        cuisine: 'Thai',
        neighborhood: 'Long Street',
        priceRange: '$$',
        rating: 4.5,
        accent: 'crimson',
        description: 'An energetic Thai spot with fiery curries, noodle soups, and lively downtown energy.',
        image: '',
        tags: ['curries', 'soups', 'late-night'],
        featured: false,
    },
    {
        id: 12,
        name: 'Dragon Pearl',
        cuisine: 'Chinese',
        neighborhood: 'Tamboerskloof',
        priceRange: '$$$',
        rating: 4.6,
        accent: 'gold',
        description: 'Elegant Cantonese classics, aromatic roasted meats, and a polished dinner experience.',
        image: '',
        tags: ['roast', 'fine dining', 'classic'],
        featured: true,
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');

        await Restaurant.deleteMany({});
        const restaurants = await Restaurant.insertMany(seedRestaurants);

        console.log(`${restaurants.length} restaurants seeded successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedDatabase();
