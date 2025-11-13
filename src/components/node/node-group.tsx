import * as React from "react";
import { NodeItem } from "@/components/node/node-item";
import { useNodesContext } from "@/components/provider/provider-node";
import { useNodeNavigation } from "@/components/node/use-node-navigation";

export function Nodes() {
  const { nodes, selectedNode, setSelectedNode } = useNodesContext();
  const nodeRefsMap = React.useRef(new Map<number, HTMLButtonElement>());

  useNodeNavigation(nodes, selectedNode, setSelectedNode);

  React.useEffect(() => {
    if (selectedNode !== null) {
      nodeRefsMap.current.get(selectedNode)?.focus();
    }
  }, [selectedNode]);

  if (!nodes) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {nodes.map((node) => (
        <NodeItem
          key={node.id}
          node={node}
          ref={(element) => {
            if (element) {
              nodeRefsMap.current.set(node.id, element);
            } else {
              nodeRefsMap.current.delete(node.id);
            }
          }}
        />
      ))}
    </div>
  );
}
