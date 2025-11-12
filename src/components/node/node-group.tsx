import { NodeItem } from "@/components/node/node-item";
import { useNodesContext } from "@/components/provider/provider-node";

/**
 * TODO: This is where we'll add react-flow later to make things look real
 * Dont worry about making it work well though as its OOS for the challenge
 */
export function Nodes() {
  const { nodes } = useNodesContext();

  if (!nodes) return null;

  console.log("Nodes", nodes);

  return (
    <div className="flex items-center justify-center gap-2">
      {nodes.map((node) => (
        <NodeItem key={node.id} node={node} />
      ))}
    </div>
  );
}
