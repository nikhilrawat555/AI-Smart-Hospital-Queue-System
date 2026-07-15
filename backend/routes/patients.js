const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const minHeap = require('../services/minHeap');
const { analyzeSymptoms } = require('../services/aiService');

let tokenCounter = 1;

router.post('/register', async (req, res) => {
  try {
    const { name, age, symptoms } = req.body;
    if (!name || !age || !symptoms) {
      return res.status(400).json({ error: 'Name, age, symptoms required' });
    }

    const aiResult = await analyzeSymptoms(name, age, symptoms);

    const patient = new Patient({
      name,
      age,
      symptoms,
      priority: aiResult.priority,
      priorityLabel: aiResult.priorityLabel,
      department: aiResult.department,
      waitTime: aiResult.waitTime,
      tokenNumber: tokenCounter++,
      status: 'Waiting'
    });

    await patient.save();
    minHeap.insert({
      id: patient._id.toString(),
      name: patient.name,
      priority: patient.priority,
      priorityLabel: patient.priorityLabel,
      department: patient.department,
      waitTime: patient.waitTime,
      tokenNumber: patient.tokenNumber
    });

    res.json({
      success: true,
      patient,
      aiAnalysis: aiResult,
      queuePosition: minHeap.getAll().findIndex(p => p.id === patient._id.toString()) + 1
    });

    const io = req.app.get('io');
    io.emit('queueUpdate', { queue: minHeap.getAll(), byDepartment: minHeap.getByDepartment() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const patients = await Patient.find({ status: 'Waiting' }).sort({ priority: 1, registeredAt: 1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/done/:id', async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { status: 'Done' });
    res.json({ success: true });

    const io = req.app.get('io');
    io.emit('queueUpdate', { queue: minHeap.getAll(), byDepartment: minHeap.getByDepartment() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;