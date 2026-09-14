// Run with: node seed.js
// Populates the database with an admin user, a regular user, and sample products.
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Product.deleteMany();

  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  await User.create({
    name: "Test User",
    email: "user@example.com",
    password: "user1234",
    role: "user",
  });

  const products = [
    {
      name: "Wireless Headphones",
      description: "Noise-cancelling over-ear wireless headphones with 30hr battery life.",
      price: 89.99,
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      stock: 25,
      createdBy: admin._id,
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard with blue switches.",
      price: 59.99,
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      stock: 40,
      createdBy: admin._id,
    },
    {
      name: "Running Shoes",
      description: "Lightweight breathable running shoes for daily training.",
      price: 74.5,
      category: "Footwear",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      stock: 60,
      createdBy: admin._id,
    },
    {
      name: "Ceramic Coffee Mug",
      description: "350ml ceramic mug, microwave and dishwasher safe.",
      price: 12.99,
      category: "Home",
      imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
      stock: 100,
      createdBy: admin._id,
    },
    {
      name: "Backpack",
      description: "Water-resistant 25L backpack with laptop compartment.",
      price: 45.0,
      category: "Accessories",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      stock: 35,
      createdBy: admin._id,
    },
    {
      name: "Yoga Mat",
      description: "Non-slip 6mm thick yoga mat with carry strap.",
      price: 24.99,
      category: "Fitness",
      imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80",
      stock: 50,
      createdBy: admin._id,
    },
  ];

  await Product.insertMany(products);

  console.log("Seed data created:");
  console.log("  Admin login -> admin@example.com / admin123");
  console.log("  User login  -> user@example.com / user1234");
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
