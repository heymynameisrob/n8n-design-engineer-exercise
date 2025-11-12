import * as React from "react";
import { BoxIcon, Code2Icon, GlobeIcon, WebhookIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { TYPE_NAMES } from "@/lib/constants";
import type { Node } from "@/lib/types";
import { useNodesContext } from "@/components/provider/provider-node";
import { NodeContextMenu } from "@/components/node/node-context-menu";

export const NodeItem = React.forwardRef<HTMLButtonElement, { node: Node }>(
  ({ node }, ref) => {
    const { selectedNode, setSelectedNode } = useNodesContext();

    return (
      <NodeContextMenu node={node}>
        <button
          ref={ref}
          className={cn(
            "flex items-center gap-2 p-2 rounded-2xl bg-gray-1 border w-fit max-w-64 transition-shadow ring-0 ring-offset-0 ring-offset-background ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            selectedNode === node.id && "ring-2 ring-offset-2",
          )}
          onClick={() => setSelectedNode(node.id)}
          onFocus={() => setSelectedNode(node.id)}
        >
          <NodeTypeIcon type={node.type} />
          <div className="flex-1 flex flex-col items-start overflow-hidden pr-2">
            <span className="text-gray-12 font-medium text-sm truncate w-full">
              {node.title}
            </span>
            <span className="capitalize text-gray-10 font-medium text-sm">
              {TYPE_NAMES[node.type]}
            </span>
          </div>
        </button>
      </NodeContextMenu>
    );
  },
);

NodeItem.displayName = "NodeItem";

function NodeTypeIcon({ type }: { type: Node["type"] }) {
  const content = React.useMemo(() => {
    switch (type) {
      case "http":
        return <GlobeIcon className="size-6 opacity-70" />;
      case "code":
        return <Code2Icon className="size-6 opacity-70" />;
      case "webhook":
        return <WebhookIcon className="size-6 opacity-70" />;
      default:
        return <BoxIcon className="size-6 opacity-70" />;
    }
  }, [type]);

  const styleMap = {
    http: "bg-blue-300 text-blue-800 dark:blue-500/20 dark:text-white",
    code: "bg-orange-300 text-orange-800 dark:orange-500/20 dark:text-white",
    webhook: "bg-cyan-300 text-cyan-800 dark:cyan-500/20 dark:text-white",
  };

  return (
    <div
      className={cn(
        "shrink-0 size-10 grid place-items-center rounded-xl",
        styleMap[type],
      )}
      aria-label={type}
    >
      {content}
    </div>
  );
}
