import * as React from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node as FlowNode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useNodesContext } from "@/components/provider/provider-node";
import { useNodeNavigation } from "@/components/node/use-node-navigation";
import { CustomFlowNode, type CustomNodeData } from "@/components/node/node-flow-custom";

const nodeTypes = {
  custom: CustomFlowNode,
};

export function Nodes() {
  const { nodes, selectedNode, setSelectedNode } = useNodesContext();

  useNodeNavigation(nodes || [], selectedNode, setSelectedNode);

  const flowNodes: FlowNode<CustomNodeData>[] = React.useMemo(() => {
    if (!nodes) return [];

    return nodes.map((node, index) => ({
      id: String(node.id),
      type: "custom",
      position: { x: index * 300, y: 200 },
      data: { node },
    }));
  }, [nodes]);

  const initialEdges: Edge[] = React.useMemo(() => {
    if (!nodes || nodes.length <= 1) return [];

    return nodes.slice(0, -1).map((node, index) => ({
      id: `e${node.id}-${nodes[index + 1].id}`,
      source: String(node.id),
      target: String(nodes[index + 1].id),
      animated: true,
      style: { strokeWidth: 2 },
    }));
  }, [nodes]);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setRfNodes(flowNodes);
  }, [flowNodes, setRfNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = React.useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = React.useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      setSelectedNode(Number(node.id));
    },
    [setSelectedNode],
  );

  if (!nodes) return null;

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.5}
      maxZoom={1}
    ></ReactFlow>
  );
}
