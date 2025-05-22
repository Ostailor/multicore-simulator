# Multi-Core Processor Simulator

## What is this project?

This project is a **visual, interactive simulator for multi-core processor scheduling and memory/cache behavior**. It is built with React and allows users to experiment with different scheduling algorithms, observe per-core cache and memory usage, and visualize how tasks are distributed and executed across multiple cores.

## What does it do?

- **Simulates multiple CPU cores** executing a set of tasks, each with its own duration, priority, and memory access pattern.
- **Supports three scheduling algorithms:**  
  - **FCFS (First-Come, First-Served)**
  - **Priority Scheduling**
  - **Round Robin** (with configurable quantum and true preemption)
- **Visualizes:**
  - Per-core caches and cache statistics (hits/misses)
  - Shared memory usage
  - Gantt chart of task execution across cores over time
  - Per-core and per-task statistics (utilization, progress, etc.)
- **Allows configuration** of core count, task count, scheduling algorithm, and quantum (for round robin).
- **Step-by-step or continuous simulation** with controls to run, pause, reset, or step the simulation.

## Challenges Faced

### 1. **Implementing True Round Robin Scheduling**
- **Challenge:** Ensuring that only one core runs a given task at a time, and that tasks are preempted and rotated correctly after their quantum expires.
- **Solution:** Introduced a global round-robin pointer and enforced that a task cannot be assigned to multiple cores simultaneously. Carefully managed the ready queue and preemption logic to ensure correct rotation and single-core assignment.

### 2. **Accurate Cache Simulation**
- **Challenge:** Simulating realistic cache hits and misses per core, especially with random memory access patterns.
- **Solution:** Designed each core with its own cache and updated it on memory accesses, tracking hits and misses. This required careful cloning and state management to avoid shared state bugs.

### 3. **State Synchronization and React Performance**
- **Challenge:** Keeping simulation state (tasks, cores, memory, history) in sync and performant, especially when stepping or running at high speed.
- **Solution:** Used React hooks like `useState`, `useCallback`, and `useEffect` to manage state updates efficiently. Ensured deep cloning of objects to avoid mutation bugs and stale state.

### 4. **Visualization and User Experience**
- **Challenge:** Presenting complex scheduling and memory/cache data in a clear, interactive, and visually appealing way.
- **Solution:** Built custom components for Gantt charts, memory/cache tables, and per-core/task stats using Tailwind CSS for rapid, responsive UI development.

## How I Overcame the Challenges

- **Iterative development:** Built the simulator step by step, testing each feature and visualization as it was added.
- **Careful debugging:** Used console logs, React DevTools, and visual output to catch and fix logic errors, especially in scheduling and cache management.
- **Community resources:** Consulted documentation and open-source examples for React state management and scheduling algorithms.
- **User feedback:** Tweaked the UI and simulation logic based on how intuitive and informative the output was during testing.
