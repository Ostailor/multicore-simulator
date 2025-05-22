import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import Core from '../models/Core';
import Task from '../models/Task';
import { scheduleTasks } from '../utils/scheduler';
import MemoryVisualizer from './MemoryVisualizer';
import StatsPanel from './StatsPanel';
import CoreCard from './CoreCard';
import GanttChart from './GanttChart';

const DEFAULT_CORES = 4;
const DEFAULT_TASKS = 10;

function generateTasks(num) {
  return Array.from({ length: num }, (_, i) =>
    new Task(
      i,
      Math.ceil(Math.random() * 5) + 2,
      Math.ceil(Math.random() * 5),
      Array.from({ length: 3 }, () => Math.floor(Math.random() * 100))
    )
  );
}

function generateCores(num) {
  return Array.from({ length: num }, (_, i) => new Core(i));
}

function MultiCoreSimulator() {
  const [numCores, setNumCores] = useState(DEFAULT_CORES);
  const [numTasks, setNumTasks] = useState(DEFAULT_TASKS);
  const [cores, setCores] = useState(generateCores(DEFAULT_CORES));
  const [tasks, setTasks] = useState(generateTasks(DEFAULT_TASKS));
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [quantum, setQuantum] = useState(2);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [memory, setMemory] = useState({});
  const [history, setHistory] = useState([]);
  const [rrPointer, setRrPointer] = useState(0); // Add this line

  // 1) Wrap step in useCallback so it always sees the latest state
  const step = useCallback(() => {
    // bump the clock and capture the new value for stats
    const newTime = time + 1;
    setTime(newTime);

    // clone
    const tasksClone = tasks.map(t => ({ ...t, stats: { ...t.stats } }));
    const coresClone = cores.map(c => ({
      ...c,
      cache: { ...c.cache },
      stats: { ...c.stats },
      currentTask: c.currentTask ? { ...c.currentTask } : null,
    }));

    // execute cycle, memory, finish, etc...
    const finishedIds = [];
    coresClone.forEach(core => {
      const t = core.currentTask && tasksClone.find(x => x.id === core.currentTask.id);
      if (!t) return;

      // 1) count this core as busy for utilization
      core.stats.utilization++;

      // 2) record task startTime on first run
      if (t.stats.startTime === null) {
        t.stats.startTime = newTime;
      }

      // 3) Round Robin: handle quantum countdown and preemption
      if (algorithm === 'roundRobin') {
        if (core.stats.sliceRemaining == null) {
          core.stats.sliceRemaining = quantum;
        }
        core.stats.sliceRemaining--;
        // Preempt if quantum expired and task not finished
        if (core.stats.sliceRemaining <= 0 && t.duration > 1) {
          t.state = 'waiting';
          core.currentTask = null;
          core.status = 'idle';
          core.stats.sliceRemaining = null;
          return; // Skip progress/memory for this cycle
        }
      }

      // progress the task
      t.progress += 1;
      t.duration -= 1;

      // memory accesses
      t.memoryAccessPattern.forEach(addr => {
        setMemory(prev => {
          const val = prev[addr] || 0;
          if (core.cache[addr] === val) core.stats.cacheHits++;
          else {
            core.stats.cacheMisses++;
            core.cache[addr] = val;
          }
          return { ...prev, [addr]: val + 1 };
        });
      });

      // if finished
      if (t.duration <= 0) {
        t.state = 'finished';
        finishedIds.push(t.id);
        core.currentTask = null;
        core.status = 'idle';
        core.stats.executed++;
        core.stats.sliceRemaining = null; // Reset slice on finish
      }
    });

    // schedule
    let scheduled, newPointer;
    if (algorithm === 'roundRobin') {
      [scheduled, newPointer] = scheduleTasks(coresClone, tasksClone, {
        algorithm,
        quantum,
        rrPointer,
      });
      setRrPointer(newPointer);
    } else {
      scheduled = scheduleTasks(coresClone, tasksClone, {
        algorithm,
        quantum,
      });
    }

    // fix task states, record history, commit
    tasksClone.forEach(t => {
      if (t.state === 'finished') return;
      const isRunning = scheduled.some(c => c.currentTask?.id === t.id);
      t.state = isRunning ? 'running' : 'waiting';
    });

    setHistory(h => [
      ...h,
      scheduled.map(c => ({
        coreId: c.id,
        taskId: c.currentTask?.id ?? null,
      })),
    ]);

    setCores(scheduled);
    setTasks(tasksClone);

    // 3) stop the run loop when everything’s done
    if (tasksClone.every(t => t.state === 'finished')) {
      setRunning(false);
    }
  }, [
    cores,
    tasks,
    algorithm,
    quantum,
    time,
    setRunning,
    rrPointer,
  ]);

  // 2) Move your setInterval into a useEffect so that each time
  //    `step` or `running` changes it clears or re-starts correctly.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, 1000);
    return () => clearInterval(id);
  }, [running, step]);

  // now start / pause simply flip `running`
  const start = () => setRunning(true);
  const pause = () => setRunning(false);

  const reset = () => {
    setCores(generateCores(numCores));
    setTasks(generateTasks(numTasks));
    setTime(0);
    setMemory({});
    setHistory([]);
    setRunning(false);
    setRrPointer(0); // Add this line
  };

  // Handle config changes
  const handleCoreChange = e => setNumCores(Number(e.target.value));
  const handleTaskChange = e => setNumTasks(Number(e.target.value));
  const handleAlgorithmChange = e => setAlgorithm(e.target.value);
  const handleQuantumChange = e => setQuantum(Number(e.target.value));

  // Apply config changes
  const applyConfig = () => {
    setCores(generateCores(numCores));
    setTasks(generateTasks(numTasks));
    setTime(0);
    setMemory({});
    setRunning(false);
    setRrPointer(0); // Add this line
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <header className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block bg-blue-500 text-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h3m4 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h1 className="text-3xl font-extrabold text-gray-800">Multi-Core Processor Simulator</h1>
          </div>
          <p className="text-gray-500 text-lg">Visualize advanced scheduling, memory, and cache in real time.</p>
        </header>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Advanced Multi-Core Processor Simulation</h2>
          <div className="flex gap-4 mb-4">
            <label>
              Cores:
              <input
                type="number"
                min={1}
                max={16}
                value={numCores}
                onChange={handleCoreChange}
                disabled={running}
                className="ml-1 w-16"
              />
            </label>
            <label>
              Tasks:
              <input
                type="number"
                min={1}
                max={100}
                value={numTasks}
                onChange={handleTaskChange}
                disabled={running}
                className="ml-1 w-16"
              />
            </label>
            <label>
              Algorithm:
              <select value={algorithm} onChange={handleAlgorithmChange} disabled={running} className="ml-1">
                <option value="fcfs">FCFS</option>
                <option value="priority">Priority</option>
                <option value="roundRobin">Round Robin</option>
              </select>
            </label>
            {algorithm === 'roundRobin' && (
              <label>
                Quantum:
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantum}
                  onChange={handleQuantumChange}
                  disabled={running}
                  className="ml-1 w-16"
                />
              </label>
            )}
            <button
              onClick={applyConfig}
              disabled={running}
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded active:bg-blue-700 focus:bg-blue-700 transition"
            >
              Apply
            </button>
            <button
              onClick={step}
              disabled={running}
              className="ml-2 px-2 py-1 bg-gray-500 text-white rounded active:bg-gray-700 focus:bg-gray-700 transition"
            >
              Step
            </button>
            <button
              onClick={start}
              disabled={running}
              className="ml-2 px-2 py-1 bg-green-500 text-white rounded active:bg-green-700 focus:bg-green-700 transition"
            >
              Run
            </button>
            <button
              onClick={pause}
              disabled={!running}
              className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded active:bg-yellow-700 focus:bg-yellow-700 transition"
            >
              Pause
            </button>
            <button
              onClick={reset}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded active:bg-red-700 focus:bg-red-700 transition"
            >
              Reset
            </button>
          </div>
          <div className="mb-2">Time: {time}</div>
          <MemoryVisualizer memory={memory} cores={cores} />
          <StatsPanel cores={cores} tasks={tasks} time={time} />
          <GanttChart history={history} numCores={numCores} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
            {cores.map(core => (
              <CoreCard key={core.id} core={core} />
            ))}
          </div>
          <div className="mb-4">
            <h4 className="font-semibold">Tasks</h4>
            <div className="flex flex-wrap gap-2">
              {tasks.map(task => {
                const total = task.progress + task.duration;
                const percent = total > 0 ? (task.progress / total) * 100 : 100;
                return (
                  <div key={task.id} className="flex flex-col items-start bg-white rounded shadow px-2 py-1">
                    <span
                      className={`text-xs font-semibold mb-1
                        ${task.state === 'finished' ? 'line-through bg-gray-400 text-white px-2 py-1 rounded' :
                          task.state === 'running' ? 'bg-green-400 text-white px-2 py-1 rounded' :
                          task.state === 'waiting' ? 'bg-yellow-300 text-yellow-900 px-2 py-1 rounded' :
                          'bg-red-300 text-red-900 px-2 py-1 rounded'}`}
                    >
                      Task {task.id} (P{task.priority}, D{task.duration}, {task.state})
                    </span>
                    {/* Progress bar */}
                    <div className="w-32 h-2 bg-gray-200 rounded">
                      <div
                        className={`h-2 rounded transition-all duration-300
                          ${task.state === 'finished' ? 'bg-gray-600' : 'bg-blue-500'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiCoreSimulator;