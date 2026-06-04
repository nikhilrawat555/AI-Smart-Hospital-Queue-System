const express = require('express');
const router = express.Router();
const minHeap = require('../services/minHeap');

router.get('/live', (req, res) => {
  res.json({
    queue: minHeap.getAll(),
    total: minHeap.size()
  });
});

router.post('/next', (req, res) => {
  const next = minHeap.extractMin();
  if (!next) return res.json({ message: 'Queue empty' });
  res.json({ calledPatient: next });
});

module.exports = router;
