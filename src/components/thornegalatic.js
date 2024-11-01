import React, { useState, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { AlertCircle, Rocket, Star, CircleDot } from "lucide-react";

const PlanetIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M7 12a5 5 0 0 1 5-5" />
    <path d="M15.5 9.5a6.5 6.5 0 0 1 0 5" />
  </svg>
);

const CustomNode = ({ data }) => {
  const getNodeContent = () => {
    switch (data.cellType) {
      case "A":
        return <AlertCircle size={24} className="text-white" />;
      case "S":
        return <Star size={24} className="text-white" />;
      case "O":
        return <CircleDot size={24} className="text-blue-500" />;
      case "T":
        return <Rocket size={24} className="text-white" />;
      default:
        if (data.cellType.match(/\d/)) {
          return (
            <>
              <PlanetIcon size={24} />
              <span className="absolute -top-1 -right-1 bg-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {data.cellType}
              </span>
            </>
          );
        }
        return null;
    }
  };

  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${
        data.isCurrentPosition ? "ring-4 ring-green-400 ring-opacity-50" : ""
      }`}
      style={{ background: data.background }}
    >
      {getNodeContent()}
      {data.probability > 0 && (
        <span className="absolute bottom-0 text-xs bg-black/50 text-white px-1 rounded">
          {(data.probability * 100).toFixed(1)}%
        </span>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const GalacticMaze = () => {
  const [maze] = useState([
    ["O", "O", "A", "S"],
    ["T", "1", "O", "A"],
    ["A", "O", "1", "O"],
    ["S", "A", "O", "O"],
  ]);

  const [probabilities, setProbabilities] = useState({});
  const [thornePosition, setThornePosition] = useState({ x: 0, y: 1 });
  const [isMoving, setIsMoving] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const calculateProbabilities = () => {
    const newProbs = {};
    maze.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== "A") {
          newProbs[`${i}-${j}`] = Math.random() * 0.5;
        }
      });
    });
    setProbabilities(newProbs);
  };

  const initializeGraph = () => {
    const newNodes = maze.flatMap((row, i) =>
      row.map((cell, j) => ({
        id: `${i}-${j}`,
        position: { x: j * 150, y: i * 150 },
        type: "custom",
        data: {
          cellType: cell,
          probability: probabilities[`${i}-${j}`] || 0,
          isCurrentPosition: i === thornePosition.y && j === thornePosition.x,
          background:
            cell === "A"
              ? "#ef4444"
              : cell === "S"
              ? "#9333ea"
              : cell === "T"
              ? "#22c55e"
              : cell.match(/\d/)
              ? "#eab308"
              : "#bfdbfe",
        },
      }))
    );

    setNodes(newNodes);
    createEdges();
  };

  const createEdges = () => {
    const newEdges = [];
    maze.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (j < maze[0].length - 1 && maze[i][j + 1] !== "A") {
          newEdges.push({
            id: `e${i}-${j}-${i}-${j + 1}`,
            source: `${i}-${j}`,
            target: `${i}-${j + 1}`,
            animated: true,
            style: { stroke: "#aaaaaa", strokeWidth: 1.5 },
          });
        }
        if (i < maze.length - 1 && maze[i + 1][j] !== "A") {
          newEdges.push({
            id: `e${i}-${j}-${i + 1}-${j}`,
            source: `${i}-${j}`,
            target: `${i + 1}-${j}`,
            animated: true,
            style: { stroke: "#aaaaaa", strokeWidth: 1.5 },
          });
        }
      });
    });

    setEdges(newEdges);
  };

  const findValidMoves = (pos) => {
    const moves = [];
    const directions = [
      { x: 0, y: 1 }, // right
      { x: 1, y: 0 }, // down
      { x: 0, y: -1 }, // left
      { x: -1, y: 0 }, // up
    ];

    directions.forEach((dir) => {
      const newX = pos.x + dir.x;
      const newY = pos.y + dir.y;
      if (
        newX >= 0 &&
        newX < maze[0].length &&
        newY >= 0 &&
        newY < maze.length &&
        maze[newY][newX] !== "A"
      ) {
        moves.push({ x: newX, y: newY });
      }
    });

    return moves;
  };

  const moveThorne = () => {
    const validMoves = findValidMoves(thornePosition);
    const sortedMoves = validMoves
      .map((move) => ({
        ...move,
        probability: probabilities[`${move.y}-${move.x}`] || 0,
      }))
      .sort((a, b) => b.probability - a.probability);

    if (sortedMoves.length > 0 && !isMoving) {
      setIsMoving(true);
      const nextMove = sortedMoves[0];

      setTimeout(() => {
        setThornePosition(nextMove);
        setIsMoving(false);
        initializeGraph();
        updateEdgeStyles(sortedMoves);
      }, 500);
    }
  };

  const updateEdgeStyles = (sortedMoves) => {
    const bestMove = sortedMoves[0];
    const worstMove = sortedMoves[sortedMoves.length - 1];

    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        // Update edge styles for best and worst moves
        if (
          (edge.source === `${thornePosition.y}-${thornePosition.x}` &&
            edge.target === `${bestMove.y}-${bestMove.x}`) ||
          (edge.source === `${bestMove.y}-${bestMove.x}` &&
            edge.target === `${thornePosition.y}-${thornePosition.x}`)
        ) {
          return { ...edge, style: { stroke: "green", strokeWidth: 4 } };
        } else if (
          (edge.source === `${thornePosition.y}-${thornePosition.x}` &&
            edge.target === `${worstMove.y}-${worstMove.x}`) ||
          (edge.source === `${worstMove.y}-${worstMove.x}` &&
            edge.target === `${thornePosition.y}-${thornePosition.x}`)
        ) {
          return { ...edge, style: { stroke: "red", strokeWidth: 2 } };
        }
        return edge;
      })
    );
  };

  const resetMaze = () => {
    setThornePosition({ x: 0, y: 1 });
    calculateProbabilities();
    initializeGraph();
  };

  useEffect(() => {
    calculateProbabilities();
    initializeGraph();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thorne's Galactic Maze
        </h1>
        <p className="text-gray-600">
          Watch Thorne navigate through the maze to find a Star Gate!
        </p>
      </div>

      <div style={{ height: 600 }} className="mb-6">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={moveThorne}
          disabled={isMoving}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          Move Thorne
        </button>
        <button
          onClick={resetMaze}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reset Maze
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="bg-green-500 rounded-full p-1">
            <Rocket className="text-white" size={16} />
          </div>
          <span>Thorne</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 rounded-full p-1">
            <Star className="text-white" size={16} />
          </div>
          <span>Star Gate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-red-500 rounded-full p-1">
            <AlertCircle className="text-white" size={16} />
          </div>
          <span>Asteroid Field</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500 rounded-full p-1">
            <PlanetIcon size={16} />
          </div>
          <span>Gas Giant Portal</span>
        </div>
      </div>
    </div>
  );
};

export default GalacticMaze;
