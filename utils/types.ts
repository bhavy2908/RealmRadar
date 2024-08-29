import { Node, Edge } from "reactflow";

export interface Query {
  type: string;
  query: string;
}

export interface ExtendedNode extends Node {
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
