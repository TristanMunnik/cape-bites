const assert = require('node:assert/strict');
const { once } = require('node:events');
const test = require('node:test');
const session = require('express-session');
const { createApp } = require('../app');

process.env.SESSION_SECRET = 'test-session-secret-that-is-at-least-32-characters';

function createTestUsers() {
    const users = new Map();
    let nextId = 1;

    return {
        users,
        async create(details) {
            const user = { ...details, _id: String(nextId++) };
            users.set(user._id, user);
            return user;
        },
        findOne({ email }) {
            const user = [...users.values()].find((candidate) => candidate.email === email);
            return { select: async () => user || null };
        },
        async findById(id) {
            return users.get(id) || null;
        },
    };
}

function createTestRestaurants() {
    const restaurants = [
        { _id: 'r1', id: 1, name: 'Kumo House', rating: null, reviewCount: 0 },
        { _id: 'r2', id: 2, name: 'Lotus Table', rating: null, reviewCount: 0 },
    ];

    return {
        restaurants,
        find: () => ({ sort: async () => restaurants }),
        async findOne({ id }) {
            return restaurants.find((restaurant) => restaurant.id === id) || null;
        },
        async updateOne({ _id }, changes) {
            Object.assign(restaurants.find((restaurant) => restaurant._id === _id), changes);
        },
    };
}

function createTestReviews(users) {
    const reviews = [];
    let nextId = 1;

    return {
        reviews,
        async create(details) {
            const duplicate = reviews.some(
                (review) => review.restaurant === details.restaurant && review.user === details.user
            );
            if (duplicate) {
                const error = new Error('Duplicate review');
                error.code = 11000;
                throw error;
            }

            const review = {
                ...details,
                _id: String(nextId++),
                createdAt: new Date(),
                async save() {},
                async deleteOne() {
                    reviews.splice(reviews.indexOf(review), 1);
                },
            };
            reviews.push(review);
            return review;
        },
        find({ restaurant }) {
            const matches = reviews.filter((review) => review.restaurant === restaurant);
            return {
                sort: () => ({
                    populate: async () => matches.map((review) => ({
                        ...review,
                        user: { _id: review.user, username: users.get(review.user).username },
                    })),
                }),
            };
        },
        async findById(id) {
            if (id === 'not-an-object-id') {
                const error = new Error('Cast failed');
                error.name = 'CastError';
                throw error;
            }
            return reviews.find((review) => review._id === id) || null;
        },
        async aggregate([{ $match }]) {
            const matches = reviews.filter((review) => review.restaurant === $match.restaurant);
            if (matches.length === 0) return [];
            const total = matches.reduce((sum, review) => sum + review.rating, 0);
            return [{ average: total / matches.length, count: matches.length }];
        },
    };
}

async function startTestServer(t) {
    const UserModel = createTestUsers();
    const RestaurantModel = createTestRestaurants();
    const ReviewModel = createTestReviews(UserModel.users);
    const app = createApp({
        sessionStore: new session.MemoryStore(),
        UserModel,
        RestaurantModel,
        ReviewModel,
    });
    const server = app.listen(0);
    await once(server, 'listening');
    t.after(() => new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    }));

    return {
        RestaurantModel,
        ReviewModel,
        baseUrl: `http://127.0.0.1:${server.address().port}`,
    };
}

async function sendRequest(baseUrl, path, { method = 'GET', body, cookie } = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            ...(body ? { 'Content-Type': 'application/json' } : {}),
            ...(cookie ? { Cookie: cookie } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const setCookie = response.headers.get('set-cookie');

    return {
        response,
        data: await response.json(),
        cookie: setCookie ? setCookie.split(';')[0] : cookie,
    };
}

async function registerDiner(baseUrl, username) {
    const { cookie } = await sendRequest(baseUrl, '/api/auth/register', {
        method: 'POST',
        body: { username, email: `${username}@example.com`, password: 'password-123' },
    });
    return cookie;
}

test('lists restaurants and returns 404 for unknown or invalid ids', async (t) => {
    const { baseUrl } = await startTestServer(t);

    const list = await sendRequest(baseUrl, '/api/restaurants');
    assert.equal(list.response.status, 200);
    assert.equal(list.data.restaurants.length, 2);

    const found = await sendRequest(baseUrl, '/api/restaurants/1');
    assert.equal(found.data.restaurant.name, 'Kumo House');

    assert.equal((await sendRequest(baseUrl, '/api/restaurants/999')).response.status, 404);
    assert.equal((await sendRequest(baseUrl, '/api/restaurants/abc')).response.status, 404);
    assert.equal((await sendRequest(baseUrl, '/api/restaurants/abc/reviews')).response.status, 404);
});

test('requires sign-in to post a review', async (t) => {
    const { baseUrl, ReviewModel } = await startTestServer(t);
    const result = await sendRequest(baseUrl, '/api/restaurants/1/reviews', {
        method: 'POST',
        body: { rating: 5 },
    });

    assert.equal(result.response.status, 401);
    assert.equal(ReviewModel.reviews.length, 0);
});

test('posts reviews, lists them with usernames, and updates the average rating', async (t) => {
    const { baseUrl, RestaurantModel } = await startTestServer(t);
    const first = await registerDiner(baseUrl, 'first_diner');
    const second = await registerDiner(baseUrl, 'second_diner');

    const created = await sendRequest(baseUrl, '/api/restaurants/1/reviews', {
        method: 'POST',
        cookie: first,
        body: { rating: 5, comment: 'Great ramen.' },
    });
    assert.equal(created.response.status, 201);

    await sendRequest(baseUrl, '/api/restaurants/1/reviews', {
        method: 'POST',
        cookie: second,
        body: { rating: 4 },
    });

    const reviews = await sendRequest(baseUrl, '/api/restaurants/1/reviews');
    assert.equal(reviews.data.reviews.length, 2);
    assert.equal(reviews.data.reviews[0].user.username, 'first_diner');

    const restaurant = RestaurantModel.restaurants[0];
    assert.equal(restaurant.rating, 4.5);
    assert.equal(restaurant.reviewCount, 2);
    assert.equal(RestaurantModel.restaurants[1].reviewCount, 0);
});

test('rejects invalid ratings and comments, and duplicate reviews', async (t) => {
    const { baseUrl } = await startTestServer(t);
    const cookie = await registerDiner(baseUrl, 'picky_diner');
    const post = (body) => sendRequest(baseUrl, '/api/restaurants/1/reviews', {
        method: 'POST',
        cookie,
        body,
    });

    assert.equal((await post({ rating: 0 })).response.status, 400);
    assert.equal((await post({ rating: 6 })).response.status, 400);
    assert.equal((await post({ rating: 3.5 })).response.status, 400);
    assert.equal((await post({ rating: '5' })).response.status, 400);
    assert.equal((await post({ rating: 5, comment: 'x'.repeat(1001) })).response.status, 400);

    assert.equal((await post({ rating: 5 })).response.status, 201);
    assert.equal((await post({ rating: 1 })).response.status, 409);
});

test('only lets a user delete their own review, then recalculates the rating', async (t) => {
    const { baseUrl, RestaurantModel } = await startTestServer(t);
    const owner = await registerDiner(baseUrl, 'owner_diner');
    const other = await registerDiner(baseUrl, 'other_diner');
    const { data } = await sendRequest(baseUrl, '/api/restaurants/2/reviews', {
        method: 'POST',
        cookie: owner,
        body: { rating: 2 },
    });
    const reviewId = data.review._id;

    const anonymous = await sendRequest(baseUrl, `/api/reviews/${reviewId}`, { method: 'DELETE' });
    assert.equal(anonymous.response.status, 401);

    const forbidden = await sendRequest(baseUrl, `/api/reviews/${reviewId}`, {
        method: 'DELETE',
        cookie: other,
    });
    assert.equal(forbidden.response.status, 403);
    assert.equal(RestaurantModel.restaurants[1].reviewCount, 1);

    const missing = await sendRequest(baseUrl, '/api/reviews/not-an-object-id', {
        method: 'DELETE',
        cookie: owner,
    });
    assert.equal(missing.response.status, 404);

    const deleted = await sendRequest(baseUrl, `/api/reviews/${reviewId}`, {
        method: 'DELETE',
        cookie: owner,
    });
    assert.equal(deleted.response.status, 200);
    assert.equal(RestaurantModel.restaurants[1].rating, null);
    assert.equal(RestaurantModel.restaurants[1].reviewCount, 0);
});

test('only lets a user edit their own review, validates it, and recalculates the rating', async (t) => {
    const { baseUrl, RestaurantModel } = await startTestServer(t);
    const owner = await registerDiner(baseUrl, 'editor_diner');
    const other = await registerDiner(baseUrl, 'bystander_diner');
    const { data } = await sendRequest(baseUrl, '/api/restaurants/1/reviews', {
        method: 'POST',
        cookie: owner,
        body: { rating: 2, comment: 'Slow service.' },
    });
    const path = `/api/reviews/${data.review._id}`;
    const edit = (cookie, body) => sendRequest(baseUrl, path, { method: 'PUT', cookie, body });

    assert.equal((await edit(undefined, { rating: 5 })).response.status, 401);
    assert.equal((await edit(other, { rating: 5 })).response.status, 403);
    assert.equal(RestaurantModel.restaurants[0].rating, 2);

    assert.equal((await edit(owner, { rating: 7 })).response.status, 400);
    assert.equal((await edit(owner, { rating: 4, comment: 'x'.repeat(1001) })).response.status, 400);
    assert.equal(
        (await sendRequest(baseUrl, '/api/reviews/not-an-object-id', {
            method: 'PUT',
            cookie: owner,
            body: { rating: 4 },
        })).response.status,
        404
    );

    const updated = await edit(owner, { rating: 5, comment: 'Much better on the second visit.' });
    assert.equal(updated.response.status, 200);
    assert.equal(updated.data.review.rating, 5);
    assert.equal(updated.data.review.comment, 'Much better on the second visit.');
    assert.equal(RestaurantModel.restaurants[0].rating, 5);
    assert.equal(RestaurantModel.restaurants[0].reviewCount, 1);
});
