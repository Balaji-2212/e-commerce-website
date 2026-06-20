require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const Product = require('./models/Product');
const Expense = require('./models/Expense');
const Budget = require('./models/Budget');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Database URL
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/venture';
const DB_JSON_PATH = path.join(__dirname, 'db.json');

// Mock Data
const MOCK_PRODUCTS = [
  { id: 1, name: 'Apple Vision Pro', price: 349900, rentPrice: 15000, rating: 4.8, category: 'Electronics', color: '#6366f1', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Segway Ninebot S', price: 45000, rentPrice: 4500, rating: 4.5, category: 'Mobility', color: '#10b981', image: 'https://images.unsplash.com/photo-1593006509935-77a8342416b7?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Apple AirPods Max', price: 59900, rentPrice: 5000, rating: 4.9, category: 'Audio', color: '#f59e0b', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Samsung Freestyle Projector', price: 55000, rentPrice: 4000, rating: 4.2, category: 'Electronics', color: '#ec4899', image: 'https://images.unsplash.com/photo-1585862705497-b952f4477df5?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'bHaptics TactSuit X40', price: 49999, rentPrice: 4000, rating: 4.7, category: 'Gaming', color: '#3b82f6', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'DJI Mini 4 Pro', price: 79999, rentPrice: 7000, rating: 4.6, category: 'Cameras', color: '#8b5cf6', image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400' },
  { id: 7, name: 'Sony PlayStation 5', price: 54990, rentPrice: 3500, rating: 4.9, category: 'Gaming', color: '#0ea5e9', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400' },
  { id: 8, name: 'Apple iPhone 15 Pro Max', price: 159900, rentPrice: 8000, rating: 4.8, category: 'Electronics', color: '#8b5cf6', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400' },
  { id: 9, name: 'Dyson V15 Detect', price: 65900, rentPrice: 4500, rating: 4.7, category: 'Smart Home', color: '#f43f5e', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400' },
  { id: 10, name: 'LG C3 65" OLED TV', price: 169990, rentPrice: 12000, rating: 4.9, category: 'Electronics', color: '#64748b', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=400' },
  { id: 11, name: 'Apple Watch Ultra 2', price: 89900, rentPrice: 5000, rating: 4.8, category: 'Wearables', color: '#fb923c', image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&q=80&w=400' },
  { id: 12, name: 'Nintendo Switch OLED', price: 34990, rentPrice: 2000, rating: 4.8, category: 'Gaming', color: '#ef4444', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?auto=format&fit=crop&q=80&w=400' }
];

const DEFAULT_EXPENSES = [
  { id: 'exp-1', name: 'Apple Vision Pro (Rental)', amount: 180000, type: 'Rental', date: '2026-06-01' },
  { id: 'exp-2', name: 'Custom Drone Alpha (Buy)', amount: 241000, type: 'Purchase', date: '2026-06-05' },
  { id: 'exp-3', name: 'Segway Ninebot S (Rental)', amount: 4000, type: 'Rental', date: '2026-06-10' }
];

let useLocalJSON = false;

// Ensure db.json exists with defaults
if (!fs.existsSync(DB_JSON_PATH)) {
  fs.writeFileSync(DB_JSON_PATH, JSON.stringify({
    products: MOCK_PRODUCTS,
    expenses: DEFAULT_EXPENSES,
    budget: { limit: 500000, alertAt80: true, alertAt100: true }
  }, null, 2));
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    seedDatabase();
  })
  .catch((err) => {
    console.warn('⚠️ Local MongoDB not found. Falling back to local JSON database (db.json).');
    useLocalJSON = true;
  });

async function seedDatabase() {
  try {
    const pCount = await Product.countDocuments();
    if (pCount === 0) {
      await Product.insertMany(MOCK_PRODUCTS);
      console.log('Seeded default products into database.');
    }

    const bCount = await Budget.countDocuments();
    if (bCount === 0) {
      await Budget.create({ limit: 500000, alertAt80: true, alertAt100: true });
      console.log('Seeded default budget limits.');
    }

    const eCount = await Expense.countDocuments();
    if (eCount === 0) {
      await Expense.insertMany(DEFAULT_EXPENSES);
      console.log('Seeded default transaction expenses.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// REST Endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const normalizedEmail = email.toLowerCase().trim();

    if (useLocalJSON) {
      const data = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
      if (!data.users) data.users = [];
      const userExists = data.users.some(u => u.email === normalizedEmail);
      if (userExists) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      const newUser = {
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        name,
        email: normalizedEmail,
        password,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        tier: 'Pro Tier',
        createdAt: new Date().toISOString()
      };
      data.users.push(newUser);
      fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));
      
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json({ user: userWithoutPassword, token: 'mock-jwt-token-for-' + newUser.id });
    } else {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      const newUser = new User({
        name,
        email: normalizedEmail,
        password,
        avatar: avatar || undefined
      });
      await newUser.save();
      const userWithoutPassword = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        tier: newUser.tier,
        createdAt: newUser.createdAt
      };
      return res.status(201).json({ user: userWithoutPassword, token: 'mock-jwt-token-for-' + newUser._id });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (useLocalJSON) {
      const data = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
      if (!data.users) data.users = [];
      const user = data.users.find(u => u.email === normalizedEmail);
      if (!user || user.password !== password) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword, token: 'mock-jwt-token-for-' + user.id });
    } else {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user || user.password !== password) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const userWithoutPassword = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        tier: user.tier,
        createdAt: user.createdAt
      };
      return res.json({ user: userWithoutPassword, token: 'mock-jwt-token-for-' + user._id });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    if (useLocalJSON) {
      const data = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
      return res.json(data.products);
    }
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/budget', async (req, res) => {
  try {
    if (useLocalJSON) {
      const data = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
      return res.json(data.budget);
    }
    let budget = await Budget.findOne({});
    if (!budget) {
      budget = await Budget.create({ limit: 500000, alertAt80: true, alertAt100: true });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budget configurations' });
  }
});

app.post('/api/budget', async (req, res) => {
  try {
    const { limit, alertAt80, alertAt100 } = req.body;
    if (useLocalJSON) {
      const data = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
      if (limit !== undefined) data.budget.limit = limit;
      if (alertAt80 !== undefined) data.budget.alertAt80 = alertAt80;
      if (alertAt100 !== undefined) data.budget.alertAt100 = alertAt100;
      fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));
      return res.json(data.budget);
    }
    let budget = await Budget.findOne({});
    if (!budget) {
      budget = new Budget();
    }
    if (limit !== undefined) budget.limit = limit;
    if (alertAt80 !== undefined) budget.alertAt80 = alertAt80;
    if (alertAt100 !== undefined) budget.alertAt100 = alertAt100;
    
    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget limits' });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    if (useLocalJSON) {
      const data = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
      return res.json(data.expenses);
    }
    const expenses = await Expense.find({}).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction logs' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { name, amount, type, date } = req.body;
    const newExpense = {
      id: 'exp-' + Math.random().toString(36).substr(2, 9),
      name,
      amount,
      type,
      date: date || new Date().toISOString().split('T')[0]
    };
    if (useLocalJSON) {
      const data = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
      data.expenses.unshift(newExpense);
      fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));
      return res.status(201).json(newExpense);
    }
    const dbExpense = new Expense(newExpense);
    await dbExpense.save();
    res.status(201).json(dbExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add transaction log' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    if (useLocalJSON) {
      const data = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));
      const removedItem = data.expenses.find(e => e.id === req.params.id);
      data.expenses = data.expenses.filter(e => e.id !== req.params.id);
      fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));
      return res.json({ message: 'Deleted successfully', item: removedItem });
    }
    const result = await Expense.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ error: 'Expense log not found' });
    }
    res.json({ message: 'Expense deleted successfully', item: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction log' });
  }
});

// Socket.io Real-Time Synchronization Events
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket client ${socket.id} joined room: ${roomId}`);
  });

  socket.on('sync-cart', ({ roomId, cart }) => {
    socket.to(roomId).emit('sync-cart', cart);
  });

  socket.on('sync-wishlist', ({ roomId, wishlist }) => {
    socket.to(roomId).emit('sync-wishlist', wishlist);
  });

  socket.on('sync-collaborators', ({ roomId, collaborators }) => {
    socket.to(roomId).emit('sync-collaborators', collaborators);
  });

  socket.on('sync-theme', ({ roomId, theme }) => {
    socket.to(roomId).emit('sync-theme', theme);
  });

  socket.on('sync-budget-limit', ({ roomId, budgetLimit }) => {
    socket.to(roomId).emit('sync-budget-limit', budgetLimit);
  });

  socket.on('sync-expenses', ({ roomId, totalExpenses, expensesHistory }) => {
    socket.to(roomId).emit('sync-expenses', { totalExpenses, expensesHistory });
  });

  socket.on('simulated-collaborator-action', ({ roomId, collaboratorName, product, isRental, duration }) => {
    socket.to(roomId).emit('simulated-collaborator-action', { collaboratorName, product, isRental, duration });
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
