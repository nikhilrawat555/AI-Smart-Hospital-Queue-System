class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(patient) {
    this.heap.push(patient);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].priority <= this.heap[index].priority) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (left < length && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
      if (smallest === index) break;
      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }

  getAll() {
    return [...this.heap].sort((a, b) => a.priority - b.priority);
  }

  getByDepartment() {
    const grouped = {};
    for (const p of this.getAll()) {
      if (!grouped[p.department]) grouped[p.department] = [];
      grouped[p.department].push(p);
    }
    return grouped;
  }

  extractMinByDepartment(department) {
    const deptPatients = this.heap.filter(p => p.department === department);
    if (deptPatients.length === 0) return null;

    const next = deptPatients.reduce((min, p) => (p.priority < min.priority ? p : min), deptPatients[0]);

    this.heap = this.heap.filter(p => p.id !== next.id);
    const remaining = this.heap;
    this.heap = [];
    remaining.forEach(p => this.insert(p));

    return next;
  }

  size() {
    return this.heap.length;
  }
}

module.exports = new MinHeap();