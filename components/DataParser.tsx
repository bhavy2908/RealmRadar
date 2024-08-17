import React, { useState, useEffect, useMemo, useRef } from "react";
import FlowChart from "./flowchart";
import { Node, Edge } from "reactflow";
import axios from "axios";
import { Query } from "../utils/types";

interface DataParserProps {
  inodes: Node[];
  iedges: Edge[];
}

interface ExtendedNode extends Node {
  data: {
    label: string;
    isExpanded: boolean;
    depth: number;
    isTypeNode?: boolean;
    parentId?: string;
    type?: string;
    isCrowned?: boolean;
    fact?: string;
  };
}

const Taskbar: React.FC<{
  onSearch: (type: string, query: string) => void;
  onAISearch: (query: string) => void;
}> = ({ onSearch, onAISearch }) => {
  const [type, setType] = useState("character");
  const [query, setQuery] = useState("");
  const [isCrowClicked, setIsCrowClicked] = useState(false);
  const [crowBtnText, setCrowBtnText] = useState("Ask the Raven");
  const [searchBarValue, setSearchBarValue] = useState("");

  const handleCrowClick = () => {
    setIsCrowClicked(!isCrowClicked);
    setCrowBtnText(isCrowClicked ? "Ask the Raven" : "Search Manually");
  };

  return (
    <div className="taskbar">
      <div className="flex items-center space-x-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`taskbar-select rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
            isCrowClicked ? "crow-clicked" : ""
          }`}
        >
          <option value="character">Character</option>
          <option value="house">House</option>
          <option value="seat">Seat</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find any house, seat, or character from Westeros, and explore their lore..."
          className={`taskbar-input flex-grow rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
            isCrowClicked ? "crow-clicked" : ""
          }`}
        />
        <button
          onClick={() => onSearch(type, query)}
          className={`taskbar-button search-button text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
            isCrowClicked ? "crow-clicked" : ""
          }`}
        >
          Search
        </button>
        <button
          onClick={handleCrowClick}
          className="taskbar-button ask-crow-button text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          {crowBtnText}
        </button>
        <input
          type="text"
          value={searchBarValue}
          onChange={(e) => setSearchBarValue(e.target.value)}
          placeholder="Ask the Three-Eyed Crow anything; he knows all from the Red Keep to the secrets beyond the Wall..."
          className={`taskbar-input2 flex-grow rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
            isCrowClicked ? "crow-clicked" : ""
          }`}
        />
        <button
          onClick={() => onAISearch(searchBarValue)}
          className={`taskbar-button new-button text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
            isCrowClicked ? "crow-clicked" : ""
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const DataParser: React.FC<DataParserProps> = ({ inodes, iedges }) => {
  const [nodes, setNodes] = useState(inodes);
  const [edges, setEdges] = useState(iedges);
  const [graphNodes, setGraphNodes] = useState<ExtendedNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<Edge[]>([]);
  const [aiFact, setAiFact] = useState<string | null>(null);
  const history = useRef<Query[]>([]);

  const mainNode = useMemo(() => {
    const characterNodes = nodes.filter(
      (node) => node.data.type === "character" && node.data.isCrowned
    );
    return characterNodes.length > 0 ? characterNodes[0] : nodes[0];
  }, [nodes]);

  const formatText = (text?: string): string => {
    if (!text) return "";
    if (text === "has_alias") return "Aliases";
    if (text === "child_of") return "Parents";
    if (text === "married_to") return "Spouse";
    if (text === "holds_title") return "Titles";
    if (text === "belongs_to") return "House";
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getUniqueEdgeTypes = (nodeId: string): string[] => {
    const nodeEdges = edges.filter((edge) => edge.source === nodeId);
    return Array.from(new Set(nodeEdges.map((edge) => edge.type ?? ""))).sort();
  };

  const createTypeNodes = (
    parentNode: ExtendedNode,
    depth: number
  ): { nodes: ExtendedNode[]; edges: Edge[] } => {
    const uniqueEdgeTypes = getUniqueEdgeTypes(parentNode.id);

    const typeNodes: ExtendedNode[] = uniqueEdgeTypes.map((type, index) => ({
      id: `type-${parentNode.id}-${type}`,
      data: {
        label: formatText(type),
        isExpanded: false,
        depth: depth + 1,
        isTypeNode: true,
        parentId: parentNode.id,
        type: "relationship",
      },
      position: { x: 200 * (depth + 1), y: 100 * (index + 1) },
    }));

    const typeEdges: Edge[] = uniqueEdgeTypes.map((type) => ({
      id: `edge-${parentNode.id}-to-${type}`,
      source: parentNode.id,
      target: `type-${parentNode.id}-${type}`,
      type: type,
      data: { type: "initial" },
    }));

    return { nodes: typeNodes, edges: typeEdges };
  };

  const toggleNode = (nodeId: string) => {
    let updatedNodes = [...graphNodes];
    let updatedEdges = [...graphEdges];

    const node = updatedNodes.find((n) => n.id === nodeId);
    if (!node) return;

    node.data.isExpanded = !node.data.isExpanded;

    if (node.data.isExpanded) {
      if (node.data.isTypeNode) {
        const [, parentId, expandedType] = nodeId.split("-");
        const childEdges = edges.filter(
          (edge) => edge.source === parentId && edge.type === expandedType
        );
        const childNodeIds = new Set(childEdges.map((edge) => edge.target));
        const childNodes: ExtendedNode[] = nodes
          .filter((n) => childNodeIds.has(n.id))
          .map((n) => ({
            ...n,
            data: {
              ...n.data,
              isExpanded: false,
              depth: node.data.depth + 1,
              parentId: nodeId,
            },
          }));

        updatedNodes.push(...childNodes);

        const newChildEdges = childNodes.map((childNode) => ({
          id: `child-edge-${nodeId}-${childNode.id}`,
          source: nodeId,
          target: childNode.id,
          type: expandedType,
          data: { type: expandedType },
        }));

        updatedEdges.push(...newChildEdges);
      } else {
        const edgeTypes = getUniqueEdgeTypes(nodeId);
        if (edgeTypes.length > 1) {
          const { nodes: typeNodes, edges: typeEdges } = createTypeNodes(
            node,
            node.data.depth
          );
          updatedNodes.push(...typeNodes);
          updatedEdges.push(...typeEdges);
        } else if (edgeTypes.length === 1) {
          const childEdges = edges.filter((edge) => edge.source === nodeId);
          const childNodeIds = new Set(childEdges.map((edge) => edge.target));
          const childNodes: ExtendedNode[] = nodes
            .filter((n) => childNodeIds.has(n.id))
            .map((n) => ({
              ...n,
              data: {
                ...n.data,
                isExpanded: false,
                depth: node.data.depth + 1,
                parentId: nodeId,
              },
            }));

          updatedNodes.push(...childNodes);

          const newChildEdges = childEdges.map((edge) => ({
            ...edge,
            id: `child-edge-${nodeId}-${edge.target}`,
            source: nodeId,
            data: { type: edgeTypes[0] },
          }));

          updatedEdges.push(...newChildEdges);
        }
      }
    } else {
      const descendantIds = new Set<string>();
      const nodesToRemove = [nodeId];

      while (nodesToRemove.length > 0) {
        const currentId = nodesToRemove.pop()!;
        if (currentId !== nodeId) descendantIds.add(currentId);

        const childEdges = updatedEdges.filter(
          (edge) => edge.source === currentId
        );
        childEdges.forEach((edge) => {
          if (!descendantIds.has(edge.target)) {
            nodesToRemove.push(edge.target);
          }
        });
      }

      updatedNodes = updatedNodes.filter((n) => !descendantIds.has(n.id));
      updatedEdges = updatedEdges.filter(
        (edge) => !descendantIds.has(edge.target)
      );
    }

    setGraphNodes(updatedNodes);
    setGraphEdges(updatedEdges);
  };

  useEffect(() => {
    if (mainNode) {
      const initialGraph = createTypeNodes(
        {
          ...mainNode,
          data: { ...mainNode.data, isExpanded: true, depth: 0 },
        },
        0
      );
      setGraphNodes([
        { ...mainNode, data: { ...mainNode.data, isExpanded: true, depth: 0 } },
        ...initialGraph.nodes,
      ]);
      setGraphEdges(initialGraph.edges);
    }
  }, [nodes, edges, mainNode]);

  const handleHistory: (
    data: Query,
    direction: "forward" | "backward"
  ) => void = async (data, direction) => {
    if (direction === "forward") {
      history.current.push(data);
    } else {
      history.current.pop();
      const data = history.current[history.current.length - 1];
      console.log(history);

      if (!data) {
        setNodes(inodes);
        setEdges(iedges);
        return;
      }

      switch (data.type) {
        case "character":
          await searchCharacter(data.query);
          break;
        case "house":
          await searchHouse(data.query);
          break;
        case "seat":
          await searchSeat(data.query);
          break;
        default:
          throw new Error("Invalid type");
      }
    }
  };

  const handleSearch = async (type: string, query: string) => {
    try {
      let data;
      switch (type) {
        case "character":
          data = await searchCharacter(query);
          break;
        case "house":
          data = await searchHouse(query);
          break;
        case "seat":
          data = await searchSeat(query);
          break;
        default:
          throw new Error("Invalid search type");
      }

      if (data) {
        const newMainNode: ExtendedNode = {
          id: data.id,
          data: {
            label: data.name,
            isExpanded: true,
            depth: 0,
            type: type,
          },
          position: { x: 0, y: 0 },
        };

        const { nodes: typeNodes, edges: typeEdges } = createTypeNodes(
          newMainNode,
          0
        );

        setGraphNodes([newMainNode, ...typeNodes]);
        setGraphEdges(typeEdges);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    }
  };

  const searchCharacter = async (characterName: string) => {
    const response = await axios.get(
      `https://realm.visanexa.com/api/character/${characterName}`
    );
    setNodes(response.data.nodes);
    setEdges(response.data.edges);
    return response.data;
  };

  const searchHouse = async (houseName: string) => {
    const response = await axios.get(
      `https://realm.visanexa.com/api/house/${houseName}`
    );
    setNodes(response.data.nodes);
    setEdges(response.data.edges);
    return response.data;
  };

  const searchSeat = async (seatName: string) => {
    const response = await axios.get(
      `https://realm.visanexa.com/api/seat/${seatName}`
    );
    setNodes(response.data.nodes);
    setEdges(response.data.edges);
    return response.data;
  };

  const handlePlusClick = async (label: string, type: string) => {
    try {
      let data;
      switch (type) {
        case "character":
          data = await searchCharacter(label);
          break;
        case "house":
          data = await searchHouse(label);
          break;
        case "seat":
          data = await searchSeat(label);
          break;
        default:
          throw new Error("Invalid type");
      }
      handleHistory({ query: label, type }, "forward");
    } catch (error) {
      console.error("Error fetching data:", error);
      // alert("Error fetching data. Please try again.");
    }
  };

  const handleAISearch = async (query: string) => {
    try {
      const response = await axios.get(`https://realm.visanexa.com/ai/${query}`);
      const { type, name, fact } = response.data;

      setAiFact(fact);

      // Trigger the appropriate search based on the AI response
      await handleSearch(type, name);

      // Update the main node with the AI fact
      setGraphNodes((prevNodes) => {
        const updatedNodes = [...prevNodes];
        const mainNodeIndex = updatedNodes.findIndex(
          (node) => node.data.depth === 0
        );
        if (mainNodeIndex !== -1) {
          updatedNodes[mainNodeIndex] = {
            ...updatedNodes[mainNodeIndex],
            data: {
              ...updatedNodes[mainNodeIndex].data,
              fact: fact,
            },
          };
        }
        return updatedNodes;
      });
    } catch (error) {
      console.error("Error fetching AI data:", error);
      alert("Error fetching AI data. Please try again.");
    }
  };

  return (
    <div>
      <Taskbar onSearch={handleSearch} onAISearch={handleAISearch} />
      <FlowChart
        nodes={graphNodes}
        edges={graphEdges}
        onNodeClick={(event, node) => toggleNode(node.id)}
        aiFact={aiFact}
        onPlusClick={handlePlusClick}
        goBack={(data: Query) => handleHistory(data, "backward")}
      />
    </div>
  );
};

export default DataParser;
