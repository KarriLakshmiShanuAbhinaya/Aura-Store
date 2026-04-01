import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword, role, otp, isVerified: false }
    });
    res.json({ message: 'Registration successful', otp, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    await prisma.user.update({ where: { id: userId }, data: { isVerified: true, otp: null } });
    res.json({ message: 'Verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isVerified) return res.status(401).json({ error: 'Please verify your account' });
    if (user.role !== role) return res.status(401).json({ error: `Not authorized as ${role}` });
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Products with seller info
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { 
        category: true,
        seller: { select: { name: true } }
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { 
        category: true,
        seller: { select: { name: true } }
      }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/checkout', async (req, res) => {
  try {
    const { email, items } = req.body;
    let total = 0;
    for (const item of items) {
      const p = await prisma.product.findUnique({ where: { id: item.id } });
      if (p) total += p.price * item.quantity;
    }
    const order = await prisma.order.create({ data: { email, total } });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, stockCount, categoryId, imageUrl, sellerId } = req.body;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
    const product = await prisma.product.create({
      data: {
        name, slug, description,
        price: parseFloat(price),
        stockCount: parseInt(stockCount),
        categoryId,
        images: imageUrl ? [imageUrl] : [],
        inStock: parseInt(stockCount) > 0,
        sellerId
      }
    });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
