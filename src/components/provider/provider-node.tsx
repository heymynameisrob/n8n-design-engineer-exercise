import * as React from "react";
import { useLocalStorage } from "react-use";

import type { Node } from "@/lib/types";
import { initialNodes } from "@/lib/initial-nodes";

interface NodeContextValue {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  selectedNode: number | null;
  setSelectedNode: (nodeId: number | null) => void;
}

const NodeContext = React.createContext<NodeContextValue | undefined>(
  undefined,
);

interface NodeProviderProps {
  children: React.ReactNode;
}

/**
 * NOTE @heymynameisrob
 * For this prototype, I'm using a provider for global state.
 * In production, this would be better server with an async state manager that linked with the server (e.g React Query)
 * We would handle optimistic mutations on the client that sync up with the server
 */

export function NodesProvider({ children }: NodeProviderProps) {
  const [nodes, setNodesStorage] = useLocalStorage<Node[]>("nodes", initialNodes);
  const [selectedNode, setSelectedNode] = React.useState<number | null>(null);

  /** NOTE (@heymynameisrob)
   * This is probably a little premature for our small example
   * However in production it'd be useful
   * e.g If we had many more nodes, or even tracked frequently updated state like node position -  then these large node objects would be expensive to rerender
   */
  const memoizedNodes = React.useMemo(() => nodes ?? [], [nodes]);
  const memoizedSelectedNode = React.useMemo(
    () => selectedNode,
    [selectedNode],
  );
  const value = React.useMemo(
    () => ({
      nodes: memoizedNodes,
      setNodes: (nodes: Node[]) => setNodesStorage(nodes),
      selectedNode: memoizedSelectedNode,
      setSelectedNode,
    }),
    [memoizedNodes, memoizedSelectedNode, setNodesStorage, setSelectedNode],
  );

  return <NodeContext.Provider value={value}>{children}</NodeContext.Provider>;
}

export function useNodesContext() {
  const context = React.useContext(NodeContext);
  if (context === undefined) {
    throw new Error("useNode must be used within a NodeProvider");
  }
  return context;
}
