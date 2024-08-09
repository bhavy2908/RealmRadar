import React, { useState, memo, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  NodeProps,
  Handle,
  Position,
  EdgeProps,
  getBezierPath,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { Crown } from "lucide-react";
import "reactflow/dist/style.css";

const CustomNode = memo(({ data, selected }: NodeProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`custom-node ${selected ? "selected" : ""} ${
        expanded ? "expanded" : ""
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <Handle type="target" position={Position.Top} />
      {data.isCrowned && (
        <Crown className="crown-icon" size={24} color="#FFD700" />
      )}
      <div className="node-content">
        <img
          src="https://seeklogo.com/images/G/game-of-thrones-logo-20E37C96FE-seeklogo.com.png"
          alt="Node"
          className="node-icon"
        />
        {data.childCount > 0 && (
          <div className="child-counter">{data.childCount}</div>
        )}
      </div>
      {expanded && (
        <div className="node-info">
          <p>{data.info}</p>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path animated-edge"
      d={edgePath}
    />
  );
};

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 500, y: 50 },
    data: {
      isCrowned: true,
      info: "Root node with 3 children",
      childCount: 3,
    },
    type: "custom",
  },
  {
    id: "2",
    position: { x: 300, y: 200 },
    data: {
      info: "Child 1 with 2 children",
      childCount: 2,
    },
    type: "custom",
  },
  {
    id: "3",
    position: { x: 500, y: 200 },
    data: {
      info: "Child 2 with no children",
      childCount: 0,
    },
    type: "custom",
  },
  {
    id: "4",
    position: { x: 700, y: 200 },
    data: {
      info: "Child 3 with 1 child",
      childCount: 1,
    },
    type: "custom",
  },
  {
    id: "5",
    position: { x: 200, y: 350 },
    data: {
      info: "Grandchild 1",
      childCount: 0,
    },
    type: "custom",
  },
  {
    id: "6",
    position: { x: 400, y: 350 },
    data: {
      info: "Grandchild 2",
      childCount: 0,
    },
    type: "custom",
  },
  {
    id: "7",
    position: { x: 700, y: 350 },
    data: {
      info: "Grandchild 3",
      childCount: 0,
    },
    type: "custom",
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "custom" },
  { id: "e1-3", source: "1", target: "3", type: "custom" },
  { id: "e1-4", source: "1", target: "4", type: "custom" },
  { id: "e2-5", source: "2", target: "5", type: "custom" },
  { id: "e2-6", source: "2", target: "6", type: "custom" },
  { id: "e4-7", source: "4", target: "7", type: "custom" },
];

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function FlowChart() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      />
      <style jsx global>{`
        .custom-node {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: white;
          border: 2px solid #ddd;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          transition: all 0.3s ease;
          overflow: visible;
        }
        .custom-node:hover {
          transform: scale(1.05);
        }
        .custom-node.selected {
          transform: scale(1.1);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        .custom-node.expanded {
          width: 200px;
          height: 200px;
          border-radius: 10px;
          color: black;
        }
        .node-content {
          position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .node-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .crown-icon {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
          z-index: 10;
        }
        .child-counter {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 24px;
          height: 24px;
          background-color: #4caf50;
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
        }
        .node-info {
          position: absolute;
          bottom: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 10px;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          font-size: 12px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .expanded .node-info {
          bottom: 0;
        }
        .animated-edge {
          stroke-width: 3;
          animation: edgeFlow 5s infinite linear;
        }
        @keyframes edgeFlow {
          0% {
            stroke: #ff00ff;
          }
          50% {
            stroke: #00ffff;
          }
          100% {
            stroke: #ff00ff;
          }
        }
      `}</style>
    </div>
  );
}
