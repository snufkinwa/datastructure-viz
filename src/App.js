import React, { useState } from "react";
import SushiGame from "./components/sushigame";
import HashTableVisualizer from "./components/matrix";
import GalacticMaze from "./components/thornegalatic";

const SECTIONS = {
  ARRAY: "array",
  HASHTABLE: "hashtable",
  GRAPHS: "graph",
};

const Navigation = ({ activeSection, onNavigate }) => (
  <div className="flex justify-center gap-4 mb-8">
    <button
      onClick={() => onNavigate(SECTIONS.ARRAY)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 
        ${
          activeSection === SECTIONS.ARRAY
            ? "bg-blue-500 text-white"
            : "bg-white border border-gray-300 hover:bg-gray-50"
        }`}
    >
      Array Game
    </button>
    <button
      onClick={() => onNavigate(SECTIONS.HASHTABLE)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2
        ${
          activeSection === SECTIONS.HASHTABLE
            ? "bg-blue-500 text-white"
            : "bg-white border border-gray-300 hover:bg-gray-50"
        }`}
    >
      Hash Table
    </button>
    <button
      onClick={() => onNavigate(SECTIONS.GRAPHS)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2
        ${
          activeSection === SECTIONS.GRAPHS
            ? "bg-blue-500 text-white"
            : "bg-white border border-gray-300 hover:bg-gray-50"
        }`}
    >
      Graphs
    </button>
  </div>
);

const App = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.ARRAY);

  const renderContent = () => {
    switch (activeSection) {
      case SECTIONS.ARRAY:
        return <SushiGame />;
      case SECTIONS.HASHTABLE:
        return <HashTableVisualizer />;
      case SECTIONS.GRAPHS:
        return <GalacticMaze />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          Data Structures Visualizer
        </h1>

        <Navigation
          activeSection={activeSection}
          onNavigate={setActiveSection}
        />

        {renderContent()}
      </div>
    </div>
  );
};

export default App;
