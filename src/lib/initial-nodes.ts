import type { Node } from "./types";
import { NodeFieldsHttp, NodeFieldsCode } from "./types";

export const initialNodes: Node[] = [
  {
    id: 1,
    type: "http",
    title: "Read Google Sheet",
    isActive: true,
    fields: NodeFieldsHttp.map((field) => ({ [field.id]: field })),
    metadata: [],
  },
  {
    id: 2,
    type: "code",
    title: "Run analysis on data",
    isActive: false,
    fields: NodeFieldsCode.map((field) => ({ [field.id]: field })),
    metadata: [],
  },
];
