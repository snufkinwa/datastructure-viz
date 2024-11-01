import React, { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";

const HashTableVisualizer = () => {
  const [tableSize] = useState(8);
  const [items, setItems] = useState({});
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [lastOperation, setLastOperation] = useState(null);
  const [collisionAlert, setCollisionAlert] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  // Simple hash function that shows its work
  const hash = (key) => {
    let total = 0;
    const calculation = [];

    for (let i = 0; i < key.length; i++) {
      const charCode = key.charCodeAt(i);
      calculation.push(`${key[i]}(${charCode})`);
      total += charCode;
    }

    const index = total % tableSize;
    return {
      index,
      calculation: `${calculation.join(
        " + "
      )} = ${total} % ${tableSize} = ${index}`,
    };
  };

  const handleAdd = () => {
    if (inputKey && inputValue) {
      const hashResult = hash(inputKey);
      const index = hashResult.index;

      // Check for collision
      const isCollision = items[index]?.length > 0;

      const newItems = { ...items };
      if (!newItems[index]) newItems[index] = [];

      // Check if key already exists
      const existingItemIndex = newItems[index].findIndex(
        (item) => item.key === inputKey
      );
      if (existingItemIndex !== -1) {
        // Update existing item
        newItems[index][existingItemIndex].value = inputValue;
      } else {
        // Add new item
        newItems[index].push({ key: inputKey, value: inputValue });
      }

      setItems(newItems);
      setHighlightedIndex(index);

      if (isCollision) {
        setCollisionAlert({
          index,
          calculation: hashResult.calculation,
          existingKeys: items[index].map((item) => item.key),
          newKey: inputKey,
        });
      } else {
        setLastOperation({
          type: "insert",
          index,
          key: inputKey,
          value: inputValue,
          calculation: hashResult.calculation,
        });
      }

      setInputKey("");
      setInputValue("");

      // Clear highlight after animation
      setTimeout(() => setHighlightedIndex(null), 2000);
    }
  };

  const handleDelete = (index, itemKey) => {
    const newItems = { ...items };
    newItems[index] = newItems[index].filter((item) => item.key !== itemKey);
    if (newItems[index].length === 0) delete newItems[index];
    setItems(newItems);
    setLastOperation({ type: "delete", index, key: itemKey });
    setCollisionAlert(null);
  };

  // Clear collision alert after 5 seconds
  useEffect(() => {
    if (collisionAlert) {
      const timer = setTimeout(() => setCollisionAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [collisionAlert]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-black text-green-400 rounded-lg shadow-lg space-y-6">
      <div className="text-2xl font-bold text-center mb-6">
        Hash Table Collision Handler
      </div>

      {/* Input Controls */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Enter key"
          className="bg-black border border-green-400 rounded px-3 py-2 w-1/3"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="bg-black border border-green-400 rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-black px-4 py-2 rounded hover:bg-green-500"
        >
          <Plus size={16} /> Insert
        </button>
      </div>

      {/* Collision Alert */}
      {collisionAlert && (
        <div className="p-4 border-2 border-yellow-400 rounded bg-yellow-400/10 text-yellow-400 mb-4">
          <div className="font-bold mb-2">⚡ Collision Detected! ⚡</div>
          <div className="text-sm space-y-1">
            <div>Hash Calculation: {collisionAlert.calculation}</div>
            <div>
              Pod {collisionAlert.index} already contains:{" "}
              {collisionAlert.existingKeys.join(", ")}
            </div>
            <div>
              New key "{collisionAlert.newKey}" hashed to the same location
            </div>
            <div className="font-bold mt-2">
              Resolution: Using chaining to store multiple items in the same pod
            </div>
          </div>
        </div>
      )}

      {/* Hash Table Visualization */}
      <div className="space-y-2 bg-matrix-pattern">
        {Array.from({ length: tableSize }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 border ${
              highlightedIndex === index
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-green-400"
            } rounded transition-all duration-300`}
          >
            <div className="w-8 font-mono">{index}</div>
            <div className="flex-1 flex gap-2 flex-wrap">
              {items[index]?.map((item, chainIndex) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-2 ${
                    items[index].length > 1
                      ? "bg-red-900/30 border border-red-400/50"
                      : "bg-green-900/30"
                  } px-3 py-1 rounded`}
                >
                  {chainIndex > 0 && <div className="text-yellow-400">→</div>}
                  <span className="font-mono">
                    {item.key}: {item.value}
                  </span>
                  <button
                    onClick={() => handleDelete(index, item.key)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {!items[index] && (
                <div className="text-green-600/50 italic">Empty pod</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Operation Log */}
      {lastOperation && !collisionAlert && (
        <div className="mt-4 p-4 border border-green-400/50 rounded">
          <div className="text-sm space-y-1">
            <div>Operation: {lastOperation.type.toUpperCase()}</div>
            {lastOperation.type === "insert" && (
              <>
                <div>Hash Calculation: {lastOperation.calculation}</div>
                <div>
                  Added "{lastOperation.key}: {lastOperation.value}" to pod{" "}
                  {lastOperation.index}
                </div>
              </>
            )}
            {lastOperation.type === "delete" && (
              <div>
                Removed "{lastOperation.key}" from pod {lastOperation.index}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="text-xs space-y-2 border border-green-400/30 p-4 rounded">
        <div className="font-bold mb-2">Matrix Glitch Resolution System:</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-900/30 border border-green-400 rounded"></div>
          <span>Normal Entry</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-900/30 border border-red-400/50 rounded"></div>
          <span>Collision Chain Entry</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-yellow-400">→</div>
          <span>Chain Link</span>
        </div>
      </div>
    </div>
  );
};

export default HashTableVisualizer;
