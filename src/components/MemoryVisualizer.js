import React from 'react';

/**
 * @param {Object} props
 * @param {Object} props.memory - Shared memory object (address: value)
 * @param {Array} props.cores - Array of Core instances (each with a cache)
 */
function MemoryVisualizer({ memory = {}, cores = [] }) {
  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-2">Shared Memory</h4>
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.entries(memory).map(([address, value]) => (
          <div key={address} className="px-2 py-1 bg-green-100 rounded border">
            Addr {address}: {value}
          </div>
        ))}
        {Object.keys(memory).length === 0 && (
          <div className="text-gray-500">No memory accesses yet.</div>
        )}
      </div>
      {/* Memory Usage Bar Chart */}
      {Object.keys(memory).length > 0 && (
        <div className="mt-4">
          <h5 className="font-semibold mb-1">Memory Usage Chart</h5>
          <div className="flex items-end gap-1 h-16">
            {Object.entries(memory).map(([address, value]) => (
              <div key={address} className="flex flex-col items-center">
                <div
                  className="bg-blue-400 w-4 rounded-t"
                  style={{ height: `${Math.min(value * 4, 64)}px` }}
                  title={`Addr ${address}: ${value}`}
                ></div>
                <span className="text-[10px] text-gray-500">{address}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <h4 className="font-semibold mb-2">Per-Core Cache</h4>
      <div className="flex flex-wrap gap-4">
        {cores.map(core => (
          <div key={core.id} className="border p-2 rounded bg-gray-50 w-48">
            <div className="font-semibold mb-1">Core {core.id} Cache</div>
            {Object.keys(core.cache).length === 0 ? (
              <div className="text-gray-400">Empty</div>
            ) : (
              Object.entries(core.cache).map(([address, value]) => (
                <div key={address} className="text-sm">
                  Addr {address}: {value}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemoryVisualizer;