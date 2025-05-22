import React from 'react';

/**
 * @param {Object} props
 * @param {Array} props.cores - Array of Core instances
 * @param {Array} props.tasks - Array of Task instances
 * @param {number} props.time - Current simulation time
 */
function StatsPanel({ cores = [], tasks = [], time = 0 }) {
  const finishedTasks = tasks.filter(t => t.state === 'finished');
  const avgWaitTime =
    finishedTasks.length > 0
      ? (
          finishedTasks.reduce(
            (sum, t) =>
              sum +
              (typeof t.stats.startTime === 'number'
                ? t.stats.startTime
                : 0),
            0
          ) / finishedTasks.length
        ).toFixed(2)
      : 0;

  const throughput =
    time > 0 ? (finishedTasks.length / time).toFixed(2) : 0;

  const avgUtilization =
    cores.length > 0
      ? (
          cores.reduce((sum, c) => sum + c.stats.utilization, 0) /
          (cores.length * (time || 1))
        ).toFixed(2)
      : 0;

  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-2">Simulation Statistics</h4>
      <div className="flex flex-wrap gap-4">
        <div className="p-2 bg-blue-100 rounded">
          <strong>Throughput:</strong> {throughput} tasks/cycle
        </div>
        <div className="p-2 bg-green-100 rounded">
          <strong>Avg. Wait Time:</strong> {avgWaitTime} cycles
        </div>
        <div className="p-2 bg-yellow-100 rounded">
          <strong>Avg. Core Utilization:</strong> {avgUtilization}
        </div>
        <div className="p-2 bg-gray-100 rounded">
          <strong>Finished Tasks:</strong> {finishedTasks.length}
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;