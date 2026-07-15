const express = require('express');
const router = express.Router();
const minHeap = require('../services/minHeap');

router.get('/live', (req, res) => {
  res.json({
    queue: minHeap.getAll(),
    byDepartment: minHeap.getByDepartment(),
    total: minHeap.size()
  });
});

router.post('/next', (req, res) => {
  const next = minHeap.extractMin();
  if (!next) return res.json({ message: 'Queue empty' });

  const io = req.app.get('io');
  io.emit('queueUpdate', { queue: minHeap.getAll(), byDepartment: minHeap.getByDepartment() });

  res.json({ calledPatient: next });
});

router.post('/next/:department', (req, res) => {
  const next = minHeap.extractMinByDepartment(req.params.department);
  if (!next) return res.json({ message: `No patients waiting in ${req.params.department}` });

  const io = req.app.get('io');
  io.emit('queueUpdate', { queue: minHeap.getAll(), byDepartment: minHeap.getByDepartment() });

  res.json({ calledPatient: next });
});

module.exports = router;