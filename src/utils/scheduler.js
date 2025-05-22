/**
 * Schedulers supported: 'fcfs', 'priority', 'roundRobin'
 * @param {Array} cores - Array of Core instances
 * @param {Array} tasks - Array of Task instances
 * @param {Object} options - { algorithm: string, quantum: number, rrPointer: number }
 */
export function scheduleTasks(cores, tasks, options = { algorithm: 'fcfs', quantum: 2, rrPointer: 0 }) {
  const { algorithm, rrPointer = 0 } = options;
  let waitingTasks = tasks.filter(t => t.state === 'waiting');

  if (algorithm === 'priority') {
    waitingTasks = waitingTasks.sort((a, b) => b.priority - a.priority);
  } else if (algorithm === 'fcfs') {
    waitingTasks = waitingTasks.sort((a, b) => a.id - b.id);
  }

  let pointer = rrPointer;
  const assignedTaskIds = new Set();

  const scheduledCores = cores.map(core => {
    if (core.status === 'idle' && waitingTasks.length > 0) {
      let task;
      if (algorithm === 'roundRobin') {
        // Find the next waiting task not already assigned
        let found = false;
        let tries = 0;
        while (!found && tries < waitingTasks.length) {
          const idx = (pointer + tries) % waitingTasks.length;
          const candidate = waitingTasks[idx];
          if (!assignedTaskIds.has(candidate.id)) {
            task = candidate;
            pointer = (idx + 1) % waitingTasks.length;
            found = true;
          }
          tries++;
        }
      } else {
        task = waitingTasks.find(t => !assignedTaskIds.has(t.id));
      }
      if (task) {
        assignedTaskIds.add(task.id);
        task.state = 'running';
        return { ...core, status: 'running', currentTask: task };
      }
    }
    if (core.currentTask && core.status === 'running') {
      assignedTaskIds.add(core.currentTask.id);
    }
    return core;
  });

  return [scheduledCores, pointer];
}