const assert = require('node:assert/strict');
const { once } = require('node:events');
const test = require('node:test');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { createApp } = require('../app');

process.env.SESSION_SECRET = 'test-session-secret-that-is-at-least-32-characters';

function createTestUsers() {
    const users = new Map();
    let nextId = 1;

    return {
        users,
        async create(details) {
            const duplicate = [...users.values()].some(
                (user) => user.email === details.email || user.username === details.username
            );
            if (duplicate) {
                const error = new Error('Duplicate user');
                error.code = 11000;
                throw error;
            }

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

async function startTestServer(t) {
    const UserModel = createTestUsers();
    const app = createApp({
        sessionStore: new session.MemoryStore(),
        UserModel,
    });
    const server = app.listen(0);
    await once(server, 'listening');
    t.after(() => new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    }));

    return {
        UserModel,
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
        setCookie,
    };
}

test('registers a user with a hashed password and a persistent HttpOnly session', async (t) => {
    const { baseUrl, UserModel } = await startTestServer(t);
    const registration = await sendRequest(baseUrl, '/api/auth/register', {
        method: 'POST',
        body: {
            username: 'CapeDiner',
            email: 'Diner@example.com',
            password: 'password-123',
        },
    });

    assert.equal(registration.response.status, 201);
    assert.deepEqual(registration.data.user, {
        id: '1',
        username: 'capediner',
        email: 'diner@example.com',
    });
    assert.match(registration.setCookie, /HttpOnly/i);
    assert.notEqual(UserModel.users.get('1').passwordHash, 'password-123');
    assert.equal(await bcrypt.compare('password-123', UserModel.users.get('1').passwordHash), true);

    const currentUser = await sendRequest(baseUrl, '/api/auth/me', {
        cookie: registration.cookie,
    });
    assert.equal(currentUser.data.user.id, '1');
});

test('logs in, rejects invalid credentials, and clears the session on logout', async (t) => {
    const { baseUrl } = await startTestServer(t);
    const registration = await sendRequest(baseUrl, '/api/auth/register', {
        method: 'POST',
        body: {
            username: 'diner_2',
            email: 'diner@example.com',
            password: 'password-123',
        },
    });
    const invalidLogin = await sendRequest(baseUrl, '/api/auth/login', {
        method: 'POST',
        body: { email: 'diner@example.com', password: 'incorrect' },
    });
    assert.equal(invalidLogin.response.status, 401);

    const login = await sendRequest(baseUrl, '/api/auth/login', {
        method: 'POST',
        body: { email: 'DINER@example.com', password: 'password-123' },
    });
    assert.equal(login.response.status, 200);
    assert.equal(login.data.user.id, '1');

    const logout = await sendRequest(baseUrl, '/api/auth/logout', {
        method: 'POST',
        cookie: login.cookie,
    });
    assert.equal(logout.response.status, 200);

    const currentUser = await sendRequest(baseUrl, '/api/auth/me', {
        cookie: login.cookie,
    });
    assert.equal(currentUser.data.user, null);
});

test('rejects invalid registration data and duplicate accounts', async (t) => {
    const { baseUrl } = await startTestServer(t);
    const invalid = await sendRequest(baseUrl, '/api/auth/register', {
        method: 'POST',
        body: { username: 'x', email: 'not-an-email', password: 'short' },
    });
    assert.equal(invalid.response.status, 400);

    const validDetails = {
        username: 'first_diner',
        email: 'diner@example.com',
        password: 'password-123',
    };
    await sendRequest(baseUrl, '/api/auth/register', {
        method: 'POST',
        body: validDetails,
    });
    const duplicate = await sendRequest(baseUrl, '/api/auth/register', {
        method: 'POST',
        body: { ...validDetails, username: 'another_diner' },
    });
    assert.equal(duplicate.response.status, 409);
});
