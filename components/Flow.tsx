import React, { useCallback, useLayoutEffect, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Connection,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { AnimatePresence } from "framer-motion";
import { getLayoutedElements } from "../utils/layoutUtils";
import CustomNode, { CustomNodeData } from "./CustomNode";
import CustomEdge from "./CustomEdge";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

interface FlowProps {
  initialNodes: Node<CustomNodeData>[];
  initialEdges: Edge[];
  onNodeClick?: (event: React.MouseEvent, node: Node<CustomNodeData>) => void;
  setFirstNodeData: React.Dispatch<React.SetStateAction<CustomNodeData>>;
  onPlusClick: (label: string, type: string) => void;
}

const Flow: React.FC<FlowProps> = ({
  initialNodes,
  initialEdges,
  onNodeClick,
  setFirstNodeData,
  onPlusClick,
}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] =
    useNodesState<CustomNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateLayout = useCallback(() => {
    const layoutedNodes = getLayoutedElements(
      nodes,
      edges
    ) as Node<CustomNodeData>[];
    setNodes(layoutedNodes);
  }, [nodes, edges, setNodes]);

  useLayoutEffect(() => {
    const layoutedNodes = getLayoutedElements(
      initialNodes,
      initialEdges
    ) as Node<CustomNodeData>[];
    const updatedNodes = layoutedNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onPlusClick,
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
      onNodeClick={onNodeClick}
    >
      <AnimatePresence />
    </ReactFlow>
  );
};

export default Flow;
