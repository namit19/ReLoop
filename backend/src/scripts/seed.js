import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Report from '../models/Report.js';
import { sampleUsers, sampleProducts } from '../utils/seedData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting ReLoop Database Seeding...');
    await connectDB();

    // Clear existing collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Report.deleteMany({});
    console.log('🧹 Cleared existing users, products, conversations, messages, and reports.');

    // Create users (passwords will be hashed automatically by pre-save hook)
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(` Created ${createdUsers.length} seed users.`);

    // Distribute products among created users
    const createdProducts = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const productInfo = sampleProducts[i];
      const seller = createdUsers[i % createdUsers.length];

      const product = await Product.create({
        ...productInfo,
        seller: seller._id,
        thumbnail: productInfo.images[0].url,
      });
      createdProducts.push(product);
    }
    console.log(` Created ${createdProducts.length} seed product listings.`);

    // Add some mutual favorites
    if (createdUsers.length > 1 && createdProducts.length > 2) {
      createdUsers[0].favorites.push(createdProducts[1]._id, createdProducts[3]._id);
      await createdUsers[0].save();

      createdUsers[1].favorites.push(createdProducts[0]._id, createdProducts[2]._id);
      await createdUsers[1].save();
      console.log('❤️ Seeded favorite listings.');
    }

    // Create a demo conversation and message between User 0 and User 1
    if (createdUsers.length >= 2 && createdProducts.length >= 1) {
      const buyer = createdUsers[0];
      const seller = createdUsers[1];
      const product = createdProducts.find(
        (p) => p.seller.toString() === seller._id.toString()
      ) || createdProducts[1];

      const conversation = await Conversation.create({
        participants: [buyer._id, seller._id],
        product: product._id,
        lastMessage: 'Hi Priya, is the price slightly negotiable if I pick it up tomorrow?',
        lastMessageAt: new Date(),
      });

      await Message.create({
        conversation: conversation._id,
        sender: buyer._id,
        text: 'Hello Priya, I saw your listing for the Sony headphones. Are they still available?',
      });

      await Message.create({
        conversation: conversation._id,
        sender: seller._id,
        text: 'Hi Aarav! Yes, they are available in pristine condition with original box and cable.',
      });

      await Message.create({
        conversation: conversation._id,
        sender: buyer._id,
        text: 'Hi Priya, is the price slightly negotiable if I pick it up tomorrow?',
      });

      console.log('💬 Seeded demo buyer-seller conversation & messages.');
    }

    console.log('🎉 Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Test Accounts (Password: password123 for all):');
    sampleUsers.forEach((u) => console.log(`- ${u.name}: ${u.email}`));
    console.log('----------------------------------------------------');

    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
