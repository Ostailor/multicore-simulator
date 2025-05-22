import React from 'react';

function CoreCard({ core }) {
  const stateColors = {
    idle: 'bg-gray-200 text-gray-700',
    running: 'bg-green-200 text-green-800',
    waiting: 'bg-yellow-200 text-yellow-800',
    blocked: 'bg-red-200 text-red-800',
  };
  const stateIcons = {
    idle: '⏸️',
    running: '▶️',
    waiting: '⏳',
    blocked: '⛔',
  };
  const stateClass = stateColors[core.status] || 'bg-gray-100';
  const stateIcon = stateIcons[core.status] || '';

  return (
    <div className={`rounded shadow p-4 w-60 ${stateClass} hover:shadow-xl transition-shadow`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-lg">Core {core.id}</h4>
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white">
          <span>{stateIcon}</span>
          {core.status}
        </span>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Task:</span>{' '}
        {core.currentTask ? (
          <span className="bg-blue-100 px-2 py-1 rounded font-mono">
            #{core.currentTask.id}
          </span>
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </div>
      <div className="mb-2 space-y-1">
        <div className="text-xs text-gray-600">Executed: <span className="font-bold">{core.stats.executed}</span></div>
        <div className="text-xs text-gray-600">Utilization: <span className="font-bold">{core.stats.utilization}</span></div>
        <div className="text-xs text-gray-600">Cache Hits: <span className="font-bold">{core.stats.cacheHits}</span></div>
        <div className="text-xs text-gray-600">Cache Misses: <span className="font-bold">{core.stats.cacheMisses}</span></div>
      </div>
      {core.currentTask && (
        <div className="w-full bg-gray-300 rounded h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded transition-all duration-300"
            style={{
              width: `${Math.min(
                (core.currentTask.progress /
                  (core.currentTask.progress + core.currentTask.duration)) *
                  100,
                100
              )}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default CoreCard;