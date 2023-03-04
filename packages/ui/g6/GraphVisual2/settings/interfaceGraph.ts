import { Edge, Maybe, NodeVisual } from "@eden/package-graphql/generated";

interface clipCfg {
  show?: boolean;
  type?: string;
  r?: number;
}

interface style {
  fill?: string;
  stroke?: string;
  height?: number;
  width?: number;
}

export interface NodeVisualExtended extends NodeVisual {
  id?: string;
  x?: number;
  y?: number;
  size: number;
  label?: string;
  img?: string;
  clipCfg?: clipCfg;
  style?: style;
}

export interface Graph {
  edges: Maybe<Array<Maybe<Edge>>>;
  nodes: Array<Maybe<NodeVisualExtended>>;
}
