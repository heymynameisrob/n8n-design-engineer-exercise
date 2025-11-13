import * as React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NodeItem } from "@/components/node/node-item";
import { useNodesContext } from "@/components/provider/provider-node";
import type { Node } from "@/lib/types";

// Define the data type for our custom node
export type CustomNodeData = {
  node: Node;
};

/**
 * Custom React Flow node that wraps the existing NodeItem component
 * This allows we to use our existing node UI within React Flow
 */
export const CustomFlowNode = React.memo(({ data }: NodeProps) => {
  const typedData = data as CustomNodeData;
  const { selectedNode } = useNodesContext();
  const nodeRef = React.useRef<HTMLDivElement>(null);

  // Focus the node when it's selected via keyboard navigation
  React.useEffect(() => {
    if (selectedNode === typedData.node.id && nodeRef.current) {
      // Find the button element inside NodeItem and focus it
      const button = nodeRef.current.querySelector("button");
      if (button) {
        button.focus();
      }
    }
  }, [selectedNode, typedData.node.id]);

  return (
    <div ref={nodeRef}>
      {/* Target handle (input) - positioned at the left */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "var(--color-gray-8)",
          width: 8,
          height: 8,
          border: "2px solid var(--color-gray-1)",
        }}
        isConnectable={true}
      />

      {/* Render the existing NodeItem component */}
      <NodeItem node={typedData.node} />

      {/* Source handle (output) - positioned at the right */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "var(--color-gray-8)",
          width: 8,
          height: 8,
          border: "2px solid var(--color-gray-1)",
        }}
        isConnectable={true}
      />
    </div>
  );
});

CustomFlowNode.displayName = "CustomFlowNode";
