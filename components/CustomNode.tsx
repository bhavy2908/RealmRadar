import React, { useState, useCallback, useRef, useEffect } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { Crown, Plus, ChevronDown, ChevronUp } from "lucide-react";

export type CustomNodeData = {
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

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, id }) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [crownSize, setCrownSize] = useState(24);

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
};

export default React.memo(CustomNode);
