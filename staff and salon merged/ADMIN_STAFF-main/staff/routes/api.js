const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Staff = require('../models/Staff');
const Client = require('../models/Client');
const Service = require('../models/Service');
const InventoryRequest = require('../models/InventoryRequest');

// --- STAFF ROUTES ---
router.get('/staff', async (req, res) => {
  try {
    let staff;
    if (mongoose.connection.readyState === 1) {
      staff = await Staff.find();
    } else {
      staff = req.app.get('localDb').staff;
    }
    // Convert array of objects to key-value map as expected by frontend
    const staffMap = {};
    staff.forEach(s => {
      const sObj = typeof s.toObject === 'function' ? s.toObject() : s;
      staffMap[sObj.staffId] = sObj;
    });
    res.json(staffMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/staff', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newStaff = new Staff(req.body);
      const saved = await newStaff.save();
      res.json(saved);
    } else {
      const localDb = req.app.get('localDb');
      localDb.staff.push(req.body);
      req.app.get('saveLocal')();
      res.json(req.body);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/staff/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await Staff.findOneAndUpdate(
        { staffId: req.params.id }, 
        req.body, 
        { new: true, upsert: true }
      );
      res.json(updated);
    } else {
      const localDb = req.app.get('localDb');
      const idx = localDb.staff.findIndex(s => s.staffId === req.params.id);
      if (idx !== -1) {
        localDb.staff[idx] = { ...localDb.staff[idx], ...req.body };
      } else {
        localDb.staff.push({ staffId: req.params.id, ...req.body });
      }
      req.app.get('saveLocal')();
      const updatedStaff = localDb.staff.find(s => s.staffId === req.params.id);
      res.json(updatedStaff);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CLIENT ROUTES ---
router.get('/clients', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const clients = await Client.find();
      res.json(clients);
    } else {
      res.json(req.app.get('localDb').clients);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/clients', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newClient = new Client(req.body);
      const saved = await newClient.save();
      res.json(saved);
    } else {
      const localDb = req.app.get('localDb');
      localDb.clients.push(req.body);
      req.app.get('saveLocal')();
      res.json(req.body);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SERVICE ROUTES ---
router.get('/services', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const services = await Service.find();
      res.json(services);
    } else {
      res.json(req.app.get('localDb').services);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- INVENTORY REQUEST ROUTES ---
router.get('/inventory-requests', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const requests = await InventoryRequest.find().sort({ createdAt: -1 });
      res.json(requests);
    } else {
      const reqs = req.app.get('localDb').inventoryRequests || [];
      const sorted = [...reqs].sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
      res.json(sorted);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/inventory-requests', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newRequest = new InventoryRequest(req.body);
      const saved = await newRequest.save();
      res.json(saved);
    } else {
      const localDb = req.app.get('localDb');
      const newReq = {
        _id: 'req-' + Date.now(),
        ...req.body,
        status: req.body.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.inventoryRequests.push(newReq);
      req.app.get('saveLocal')();
      res.json(newReq);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/inventory-requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'fulfilled', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    if (mongoose.connection.readyState === 1) {
      const updated = await InventoryRequest.findByIdAndUpdate(
        req.params.id, 
        { status, updatedAt: Date.now() }, 
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Request not found' });
      res.json(updated);
    } else {
      const localDb = req.app.get('localDb');
      const idx = localDb.inventoryRequests.findIndex(r => r._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Request not found' });
      localDb.inventoryRequests[idx].status = status;
      localDb.inventoryRequests[idx].updatedAt = new Date().toISOString();
      req.app.get('saveLocal')();
      res.json(localDb.inventoryRequests[idx]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
