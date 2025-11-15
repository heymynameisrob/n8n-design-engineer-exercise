import * as React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NodeItem } from "@/components/node/node-item";
import { NodeContextMenu } from "@/components/node/node-context-menu";
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
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Focus the node when it's selected via keyboard navigation
  React.useEffect(() => {
    if (selectedNode === typedData.node.id && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [selectedNode, typedData.node.id]);

  return (
    <NodeContextMenu node={typedData.node}>
      <div>
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
        <NodeItem ref={buttonRef} node={typedData.node} />

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
    </NodeContextMenu>
  );
});

CustomFlowNode.displayName = "CustomFlowNode";
