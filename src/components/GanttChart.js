import React from 'react';

const COLORS = [
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-pink-400',
  'bg-purple-400',
  'bg-red-400',
  'bg-indigo-400',
  'bg-teal-400',
  'bg-orange-400',
  'bg-gray-400',
];

function GanttChart({ history, numCores }) {
  if (!history.length) return null;

  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2">Gantt Chart</h4>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-2 py-1 border bg-gray-100">Core</th>
              {history.map((_, t) => (
                <th key={t} className="px-1 py-1 border text-xs bg-gray-50">{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numCores }).map((_, coreIdx) => (
              <tr key={coreIdx}>
                <td className="px-2 py-1 border font-bold bg-gray-50">Core {coreIdx}</td>
                {history.map((step, t) => {
                  const entry = step[coreIdx];
                  const colorClass =
                    entry.taskId !== null
                      ? COLORS[entry.taskId % COLORS.length]
                      : 'bg-gray-200';
                  return (
                    <td
                      key={t}
                      className={`border w-8 h-6 text-center align-middle ${colorClass}`}
                      title={
                        entry.taskId !== null
                          ? `Task ${entry.taskId}`
                          : 'Idle'
                      }
                    >
                      {entry.taskId !== null ? entry.taskId : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GanttChart;