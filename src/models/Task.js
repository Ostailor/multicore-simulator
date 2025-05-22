class Task {
  constructor(id, duration, priority = 1, memoryAccessPattern = []) {
    this.id = id;
    this.duration = duration; // Number of cycles needed
    this.priority = priority; // For priority scheduling
    this.state = 'waiting';   // 'waiting', 'running', 'blocked', 'finished'
    this.memoryAccessPattern = memoryAccessPattern; // Array of memory addresses
    this.progress = 0;        // How much of the task is done
    this.stats = {
      waitTime: 0,
      startTime: null,
      endTime: null,
      memoryAccesses: 0,
    };
  }
}

export default Task;