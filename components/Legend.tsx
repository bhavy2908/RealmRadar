import React from "react";

type EdgeType =
  | "owns_weapon"
  | "holds_title"
  | "has_seat"
  | "has_alias"
  | "child_of";

const typeToColor: Record<EdgeType, string> = {
  owns_weapon: "#C80036",
  holds_title: "#03C988",
  has_seat: "#FF8F8F",
  has_alias: "#776AE3",
  child_of: "#FF9100",
};

interface LegendItemProps {
  type: string;
  color: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ type, color }) => (
  <div className="legend-item">
    <svg>
      <path d="M0,10 L110,10" style={{ strokeWidth: 1, stroke: "gray" }} />
      <path
        d="M0,10 L110,10"
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

interface LegendProps {
  uniqueEdgeTypes: string[];
}

const Legend: React.FC<LegendProps> = ({ uniqueEdgeTypes }) => {
  const getColor = (type: string): string => {
    return type in typeToColor ? typeToColor[type as EdgeType] : "#36C2CE";
  };

  return (
    <div className="about">
      <h1>Legend</h1>
      <hr style={{ border: "1px solid #4caf50" }}></hr>
      <div className="legend-items">
        {uniqueEdgeTypes.map((type) => (
          <LegendItem key={type} type={type} color={getColor(type)} />
        ))}
      </div>
    </div>
  );
};

export default Legend;
