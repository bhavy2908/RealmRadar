import { Node, Edge } from "reactflow";
import dagre from "dagre";

export const getLayoutedElements = (
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
