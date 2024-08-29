import React, { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { Node, Edge } from "reactflow";
import { Query } from "../utils/types";
import Flow from "./Flow";
import About from "./About";
import Legend from "./Legend";
import { CustomNodeData } from "./CustomNode";

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

  const uniqueEdgeTypes = Array.from(
    new Set(edges.map((edge) => edge.type || ""))
  ).filter(Boolean);

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
        <About firstNodeData={firstNodeData} aiFact={aiFact} />
        <Legend uniqueEdgeTypes={uniqueEdgeTypes} />
      </div>
    </div>
  );
}
