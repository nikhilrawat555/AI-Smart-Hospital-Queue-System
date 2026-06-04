 const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  symptoms: { type: String, required: true },
  priority: { type: Number, default: 4 },
  priorityLabel: { type: String, default: 'Normal' },
  department: { type: String, default: 'General' },
  waitTime: { type: String, default: '60 min' },
  status: { type: String, default: 'Waiting' },
  tokenNumber: { type: Number },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);
