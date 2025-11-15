import * as React from "react";
import { useLocalStorage } from "react-use";
import type { UseFormReturn } from "react-hook-form";

import type { Node } from "@/lib/types";
import { initialNodes } from "@/lib/initial-nodes";
import { toast } from "@/components/primitives/Toast";

type NodeContextValue = {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  selectedNode: number | null;
  setSelectedNode: (nodeId: number | null) => void;
  runningNode: RunningState | null;
  setRunningNode: (state: RunningState) => void;
  setFormInstance: (nodeId: number, form: UseFormReturn<any> | null) => void;
};

type NodeProviderProps = {
  children: React.ReactNode;
};

type RunningState = {
  nodeId: number;
  status: "running" | "success" | "error" | "idle";
  error?: string;
};

const NodeContext = React.createContext<NodeContextValue | null>(null);

/**
 * NOTE @heymynameisrob
 * For this prototype, I'm using a provider for global state.
 * In production, this would be better server with an async state manager that linked with the server (e.g React Query)
 * We would handle optimistic mutations on the client that sync up with the server
 */

export function NodesProvider({ children }: NodeProviderProps) {
  const [nodes, setNodesStorage] = useLocalStorage<Node[]>(
    "nodes",
    initialNodes,
  );
  const [selectedNode, setSelectedNode] = React.useState<number | null>(1);
  const [runningNode, setRunningNodeState] =
    React.useState<RunningState | null>(null);
  const formInstancesRef = React.useRef<Map<number, UseFormReturn<any>>>(
    new Map(),
  );

  const setFormInstance = React.useCallback(
    (nodeId: number, form: UseFormReturn<any> | null) => {
      if (form) {
        formInstancesRef.current.set(nodeId, form);
      } else {
        formInstancesRef.current.delete(nodeId);
      }
    },
    [],
  );

  /**
   * NOTE @heymynameisrob
   * Simulate running the node and returning different states
   */
  const handleSetRunningNode = React.useCallback(
    async (state: RunningState) => {
      // Validate form before running
      const form = formInstancesRef.current.get(state.nodeId);
      if (form) {
        const isValid = await form.trigger();
        if (!isValid) {
          // Set running state to error to show validation failed
          setRunningNodeState({
            nodeId: state.nodeId,
            status: "error",
            error: "Validation failed. Please fix the errors in the form.",
          });

          setTimeout(() => {
            setRunningNodeState(null);
          }, 3_000);
          return;
        }
      }

      toast({
        title: "Running...",
      });
      setRunningNodeState(state);
      setTimeout(() => {
        if (state.nodeId === 2) {
          toast({
            title: "Something went wrong",
          });
          setRunningNodeState({
            nodeId: state.nodeId,
            status: "error",
            error: "Something went wrong. Try again.",
          });
        } else {
          toast({
            title: "Run successful!",
          });
          setRunningNodeState({
            nodeId: state.nodeId,
            status: "success",
          });
        }

        setTimeout(() => {
          setRunningNodeState(null);
        }, 3_000);
      }, 5_000);
    },
    [],
  );

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
      runningNode,
      setRunningNode: handleSetRunningNode,
      setFormInstance,
    }),
    [
      memoizedNodes,
      memoizedSelectedNode,
      setNodesStorage,
      setSelectedNode,
      runningNode,
      handleSetRunningNode,
      setFormInstance,
    ],
  );

  return <NodeContext.Provider value={value}>{children}</NodeContext.Provider>;
}

export function useNodesContext() {
  const context = React.useContext(NodeContext);
  if (!context) {
    throw new Error("useNode must be used within a NodeProvider");
  }
  return context;
}
