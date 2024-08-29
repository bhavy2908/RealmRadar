import React from "react";
import { EdgeProps, getBezierPath } from "reactflow";

export type CustomEdgeData = {
  label?: string;
  type: string;
  sourceNodeExpanded?: boolean;
};

const typeToColor: { [key: string]: string } = {
  owns_weapon: "#C80036",
  holds_title: "#03C988",
  has_seat: "#FF8F8F",
  has_alias: "#776AE3",
  child_of: "#FF9100",
};

const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = { strokeWidth: 3, stroke: "#36C2CE" },
}) => {
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

  const strokeColor =
    data?.type && typeToColor[data.type]
      ? typeToColor[data.type]
      : style.stroke;

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

export default CustomEdge;
