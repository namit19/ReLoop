import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import Conversation from '../src/models/Conversation.js';

test('ReLoop Backend Full API Test Suite', async (t) => {
  // Setup DB before running tests
  await connectDB();

  let userOneToken = '';
  let userTwoToken = '';
  let userOneId = '';
  let userTwoId = '';
  let createdProductId = '';
  let conversationId = '';

  // Clean test db
  await User.deleteMany({});
  await Product.deleteMany({});
  await Conversation.deleteMany({});

  await t.test('1. Auth: Register User One with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Buyer',
      email: 'buyer@test.com',
      password: 'password123',
      city: 'Bengaluru',
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, 'buyer@test.com');
    userOneToken = res.body.token;
    userOneId = res.body.user._id;
  });

  await t.test('2. Auth: Register Duplicate Email should fail with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Duplicate Guy',
      email: 'buyer@test.com',
      password: 'password123',
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  await t.test('3. Auth: Register User Two (Seller)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Seller',
      email: 'seller@test.com',
      password: 'password123',
      city: 'Mumbai',
    });

    assert.equal(res.status, 201);
    userTwoToken = res.body.token;
    userTwoId = res.body.user._id;
  });

  await t.test('4. Auth: Login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'buyer@test.com',
      password: 'password123',
    });

    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  await t.test('5. Auth: Login with wrong password should fail with 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'buyer@test.com',
      password: 'wrongpassword',
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  await t.test('6. Products: Unauthorized listing creation without token should fail with 401', async () => {
    const res = await request(app).post('/api/products').send({
      title: 'Should Fail Phone',
      price: 10000,
      category: 'Mobiles and Tablets',
      condition: 'Good',
      city: 'Delhi',
    });

    assert.equal(res.status, 401);
  });

  await t.test('7. Products: Create listing with missing fields should fail with 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userTwoToken}`)
      .send({
        title: 'Only title',
      });

    assert.equal(res.status, 400);
  });

  await t.test('8. Products: Create listing with valid data as Seller', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userTwoToken}`)
      .send({
        title: 'Vintage Film Camera Minolta X-700',
        description: 'Classic 35mm SLR camera with 50mm f/1.7 prime lens in excellent working condition.',
        price: 12500,
        category: 'Electronics',
        condition: 'Good',
        city: 'Mumbai',
        locality: 'Bandra',
        negotiable: true,
        imageUrls: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32'],
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.product._id);
    createdProductId = res.body.product._id;
  });

  await t.test('9. Products: Search and filter products', async () => {
    const res = await request(app).get('/api/products?search=Minolta&category=Electronics');
    assert.equal(res.status, 200);
    assert.equal(res.body.products.length, 1);
    assert.equal(res.body.products[0].title, 'Vintage Film Camera Minolta X-700');
  });

  await t.test('10. Products: Update listing rejected if not the owner (Buyer tries to update Seller product)', async () => {
    const res = await request(app)
      .patch(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({
        title: 'Hacked Title by Unauthorized User',
      });

    assert.equal(res.status, 403);
  });

  await t.test('11. Products: Update listing allowed by owner', async () => {
    const res = await request(app)
      .patch(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${userTwoToken}`)
      .send({
        title: 'Vintage Film Camera Minolta X-700 - Mint Condition',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.product.title, 'Vintage Film Camera Minolta X-700 - Mint Condition');
  });

  await t.test('12. Products: Change status to reserved by owner', async () => {
    const res = await request(app)
      .patch(`/api/products/${createdProductId}/status`)
      .set('Authorization', `Bearer ${userTwoToken}`)
      .send({
        status: 'reserved',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.product.status, 'reserved');
  });

  await t.test('13. Favorites: Add to favorites and verify persistence', async () => {
    const addRes = await request(app)
      .post(`/api/users/me/favorites/${createdProductId}`)
      .set('Authorization', `Bearer ${userOneToken}`);

    assert.equal(addRes.status, 200);

    const getRes = await request(app)
      .get('/api/users/me/favorites')
      .set('Authorization', `Bearer ${userOneToken}`);

    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.favorites.length, 1);
  });

  await t.test('14. Favorites: Remove from favorites', async () => {
    const remRes = await request(app)
      .delete(`/api/users/me/favorites/${createdProductId}`)
      .set('Authorization', `Bearer ${userOneToken}`);

    assert.equal(remRes.status, 200);

    const getRes = await request(app)
      .get('/api/users/me/favorites')
      .set('Authorization', `Bearer ${userOneToken}`);

    assert.equal(getRes.body.favorites.length, 0);
  });

  await t.test('15. Chat: User cannot message self on own listing', async () => {
    const res = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${userTwoToken}`) // Seller trying to chat on own item
      .send({ productId: createdProductId });

    assert.equal(res.status, 400);
  });

  await t.test('16. Chat: Buyer starts conversation with Seller', async () => {
    const res = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({ productId: createdProductId });

    assert.equal(res.status, 200);
    assert.ok(res.body.conversation._id);
    conversationId = res.body.conversation._id;
  });

  await t.test('17. Chat: Send and retrieve message with authorization check', async () => {
    // Send message as Buyer
    const sendRes = await request(app)
      .post(`/api/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({ text: 'Hi! Is this still available?' });

    assert.equal(sendRes.status, 201);
    assert.equal(sendRes.body.message.text, 'Hi! Is this still available?');

    // Retrieve messages as Seller
    const getRes = await request(app)
      .get(`/api/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${userTwoToken}`);

    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.messages.length, 1);
  });

  await t.test('18. Reports: Submit report on listing', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({
        productId: createdProductId,
        reason: 'Duplicate Listing',
        details: 'Testing report functionality',
      });

    assert.equal(res.status, 201);
  });

  await t.test('19. Products: Delete listing rejected for non-owner', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${userOneToken}`);

    assert.equal(res.status, 403);
  });

  await t.test('20. Products: Delete listing succeeds for owner', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${userTwoToken}`);

    assert.equal(res.status, 200);
  });

  // Teardown
  await closeDB();
});
