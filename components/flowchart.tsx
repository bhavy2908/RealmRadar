import React, {
  useState,
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
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
  useReactFlow,
  ReactFlowProvider,
  addEdge,
} from "reactflow";
import { Crown, Plus, ChevronDown, ChevronUp } from "lucide-react";
import dagre from "dagre";
import { motion, AnimatePresence } from "framer-motion";
import "reactflow/dist/style.css";
import { Query } from "../utils/types";

type CustomNodeData = {
  label: string;
  isCrowned?: boolean;
  info?: string;
  imageUrl?: string;
  id: string;
  isExpanded?: boolean;
  type: string;
  setFirstNodeData?: React.Dispatch<React.SetStateAction<CustomNodeData>>;
  onPlusClick?: (label: string, type: string) => void;
  gender?: string;
  culture?: string;
  born?: string;
  coat_of_arms?: string;
  words?: string;
  region?: string;
};

const typeToColor = {
  owns_weapon: "#C80036",
  holds_title: "#03C988",
  has_seat: "#FF8F8F",
  has_alias: "#776AE3",
  child_of: "#FF9100",
};

const CustomNode = memo(({ data, id }: NodeProps<CustomNodeData>) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [crownSize, setCrownSize] = useState(24);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    const updateCrownSize = () => {
      if (nodeRef.current) {
        const nodeWidth = nodeRef.current.offsetWidth;
        const newCrownSize = Math.max(18, Math.min(nodeWidth * 0.2, 40));
        setCrownSize(newCrownSize);
      }
    };

    updateCrownSize();
    window.addEventListener("resize", updateCrownSize);

    return () => {
      window.removeEventListener("resize", updateCrownSize);
    };
  }, [expanded]);

  useEffect(() => {
    if (data.isCrowned && data.setFirstNodeData) {
      data.setFirstNodeData(data);
    }
  }, [data, data.isCrowned, data.setFirstNodeData]);

  const toggleExpanded = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setExpanded(!expanded);
    },
    [expanded]
  );

  const handlePlusClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.onPlusClick) {
        data.onPlusClick(data.label, data.type);
      }
    },
    [data]
  );

  return (
    <motion.div
      ref={nodeRef}
      className={`custom-node ${expanded ? "expanded" : ""} ${
        hovered ? "hovered" : ""
      } data-type=${data.type}`}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Handle type="target" position={Position.Top} />
      {data.isCrowned && (
        <Crown
          className="crown-icon"
          size={18}
          color="#FFD700"
          style={{
            position: "absolute",
            top: "-25px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
      <div
        className="node-content"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {data.type !== "relationship" && (
          <div>
            <div className={`hover-content ${hovered ? "visible" : ""}`}>
              <div className="node-actions-container">
                <div className="node-actions-type">{data.type}</div>
                <div className="node-actions">
                  <button onClick={toggleExpanded}>
                    {expanded ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
              </div>
            </div>
            <div className="label-wrapper">
              <div className="node-label">{data.label}</div>
            </div>
          </div>
        )}
        {data.type == "relationship" && (
          <div className="label-wrapper2">
            <div className="node-label2">{data.label}</div>{" "}
            <Plus className="ChevronDown" width={16} />
          </div>
        )}

        {expanded && (
          <div className="expanded-content">
            <div className="data">
              {data.gender && (
                <div className="data-row">
                  <b>Gender: </b>
                  {data.gender}
                </div>
              )}
              {data.culture && (
                <div className="data-row">
                  <b>Culture: </b>
                  {data.culture}
                </div>
              )}
              {data.born && (
                <div className="data-row">
                  <b>Born: </b>
                  {data.born}
                </div>
              )}
              {data.coat_of_arms && (
                <div className="data-row">
                  <b>Symbol: </b>
                  {data.coat_of_arms}
                </div>
              )}
              {data.words && (
                <div className="data-row">
                  <b>Words: </b>
                  {data.words}
                </div>
              )}
              {data.region && (
                <div className="data-row">
                  <b>Region: </b>
                  {data.region}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {(data.type === "character" ||
        data.type === "house" ||
        data.type === "seat") &&
      !data.isCrowned ? (
        <div className="child-counter" onClick={handlePlusClick}>
          <Plus style={{ marginBottom: "-1px", marginRight: "0px" }} />
        </div>
      ) : (
        <></>
      )}

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
});

const getRandomOffset = () => ({
  // offsetX: Math.random() * 20 - 10,
  // offsetY: Math.random() * 20 - 10,
});

type CustomEdgeData = {
  label?: string;
  type: string;
  sourceNodeExpanded?: boolean;
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = { strokeWidth: 3, stroke: "#36C2CE" },
}: EdgeProps<CustomEdgeData>) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const textX = (sourceX + targetX) / 2;
  const textY = (sourceY + targetY) / 2;

  const strokeColor = typeToColor[data?.type] || style.stroke;

  const edgeStyle = { strokeWidth: 2, stroke: strokeColor };

  return (
    <>
      <path
        id={`${id}-static`}
        style={{ strokeWidth: 1, stroke: "gray" }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path animated-overlay"
        d={edgePath}
        strokeDasharray="5,5"
      />
      {data && data.type && (
        <text
          x={textX}
          y={textY}
          fill="#000"
          fontSize="12"
          dominantBaseline="middle"
          textAnchor="middle"
          className="edge-text"
          style={{ "--glow-color": strokeColor } as React.CSSProperties}
        >
          {/* {data.type} */}
        </text>
      )}
    </>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const calculateNodeDimensions = (node: Node) => {
    const baseWidth = 120;
    const baseHeight = 120;
    const contentLength = 20;

    const width = Math.max(baseWidth, contentLength * 2);
    const height = baseHeight;

    return { width, height };
  };

  const isHorizontal = direction === "RL";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    const { width, height } = calculateNodeDimensions(node);
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const dimensions = calculateNodeDimensions(node);
    return {
      ...node,
      type: "custom",
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
      width: dimensions.width,
      height: dimensions.height,
    };
  });
};

const Flow = ({
  initialNodes,
  initialEdges,
  onNodeClick,
  setFirstNodeData,
  onPlusClick,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  setFirstNodeData: React.Dispatch<React.SetStateAction<CustomNodeData>>;
  onPlusClick: (label: string, type: string) => void;
}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateLayout = useCallback(() => {
    const layoutedNodes = getLayoutedElements(nodes, edges);
    setNodes(
      layoutedNodes.map((node) => ({
        ...node,
        position: {
          x: node.position.x,
          y: node.position.y,
        },
      }))
    );
  }, [nodes, edges, setNodes]);

  useLayoutEffect(() => {
    const layoutedNodes = getLayoutedElements(initialNodes, initialEdges);
    const updatedNodes = layoutedNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        setFirstNodeData: (data: CustomNodeData) => {
          setFirstNodeData(data);
        },
        onPlusClick: onPlusClick,
      },
    }));

    setNodes(updatedNodes);

    const updatedEdges = initialEdges.map((edge) => ({
      ...edge,
      type: "custom",
      data: { type: edge.type, sourceNodeExpanded: false },
    }));
    setEdges(updatedEdges);

    window.requestAnimationFrame(() => {
      fitView();
    });

    // Find the crowned node and set it as the first node data
    const crownedNode = updatedNodes.find((node) => node.data.isCrowned);
    if (crownedNode) {
      setFirstNodeData(crownedNode.data);
    }
  }, [
    initialNodes,
    initialEdges,
    setNodes,
    setEdges,
    fitView,
    setFirstNodeData,
    onPlusClick,
  ]);

  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        return {
          ...edge,
          data: {
            ...edge.data,
            sourceNodeExpanded: sourceNode?.data.isExpanded,
          },
        };
      })
    );
  }, [nodes, setEdges]);

  const onNodeAdd = useCallback(
    (parentId: string) => {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: "custom",
        data: { label: "New Node", id: `node-${Date.now()}` },
        position: { x: 0, y: 0 },
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [
        ...eds,
        {
          id: `edge-${Date.now()}`,
          source: parentId,
          target: newNode.id,
          type: "custom",
        },
      ]);

      setTimeout(updateLayout, 50);
    },
    [setNodes, setEdges, updateLayout]
  );

  const onNodeRemove = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );

      setTimeout(updateLayout, 50);
    },
    [setNodes, setEdges, updateLayout]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      onNodeClick={(event, node) => {
        if (onNodeClick) onNodeClick(event, node);
      }}
    >
      <AnimatePresence />
    </ReactFlow>
  );
};

const LegendItem = ({ type, color }: { type: string; color: string }) => (
  <div className="legend-item">
    <svg>
      <path d="M0,10 L130,10" style={{ strokeWidth: 1, stroke: "gray" }} />
      <path
        d="M0,10 L130,10"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeDasharray="5,5"
        className="animated-overlay"
      />
    </svg>
    <span>{type}</span>
  </div>
);

export default function FlowChart({
  nodes,
  edges,
  onNodeClick,
  aiFact,
  onPlusClick,
  goBack,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  aiFact: string | null;
  onPlusClick: (label: string, type: string) => void;
  goBack: (data: Query) => void;
}) {
  const [firstNodeData, setFirstNodeData] = useState<CustomNodeData>(
    {} as CustomNodeData
  );

  const uniqueEdgeTypes = [...new Set(edges.map((edge) => edge.type))];

  return (
    <div className="dotted-bg">
      <div className="flow-container">
        <ReactFlowProvider>
          <Flow
            initialNodes={nodes}
            initialEdges={edges}
            onNodeClick={onNodeClick}
            setFirstNodeData={setFirstNodeData}
            onPlusClick={onPlusClick}
          />
        </ReactFlowProvider>
      </div>
      <div className="about-container">
        <div className="about-buttons-container">
          <button
            className="about-buttons"
            onClick={() =>
              goBack({ type: firstNodeData.type, query: firstNodeData.label })
            }
          >
            Go Back
          </button>
          <button
            className="about-buttons"
            onClick={() => window.location.reload()}
          >
            Reset
          </button>
        </div>
        <div className="about">
          <h1>About</h1>
          <hr style={{ border: "1px solid #4caf50;" }}></hr>
          <div className="data">
            <div className="data-row">
              <b>Label: </b>
              {firstNodeData.label}
            </div>
            <div className="data-row">
              <b>Type: </b>
              {firstNodeData.type}
            </div>
            {firstNodeData.gender && (
              <div className="data-row">
                <b>Gender: </b>
                {firstNodeData.gender}
              </div>
            )}
            {firstNodeData.culture && (
              <div className="data-row">
                <b>Culture: </b>
                {firstNodeData.culture}
              </div>
            )}
            {firstNodeData.born && (
              <div className="data-row">
                <b>Born: </b>
                {firstNodeData.born}
              </div>
            )}
            {firstNodeData.coat_of_arms && (
              <div className="data-row">
                <b>Symbol: </b>
                {firstNodeData.coat_of_arms}
              </div>
            )}
            {firstNodeData.words && (
              <div className="data-row">
                <b>Words: </b>
                {firstNodeData.words}
              </div>
            )}
            {firstNodeData.region && (
              <div className="data-row">
                <b>Region: </b>
                {firstNodeData.region}
              </div>
            )}

            {aiFact && (
              <div>
                <div className="data-row" style={{ marginTop: "10px" }}>
                  <b>Did you know?</b>
                </div>
                <div className="data-row" style={{ textAlign: "left" }}>
                  {aiFact}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="about">
          <h1>Legend</h1>
          <hr style={{ border: "1px solid #4caf50;" }}></hr>
          <div className="legend-items">
            {uniqueEdgeTypes.map((type) => (
              <LegendItem
                key={type}
                type={type}
                color={typeToColor[type] || "#36C2CE"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
