import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, LoaderIcon, TriangleAlertIcon } from "lucide-react";

import { useNodesContext } from "@/components/provider/provider-node";
import { NodeTypeIcon } from "@/components/node/node-type-icon";
import { cn } from "@/lib/utils";
import { typeNames } from "@/lib/constants";

import type { Node } from "@/lib/types";

function NodeRunningIcon() {
  const { runningNode } = useNodesContext();

  const content = React.useMemo(() => {
    if (!runningNode) return null;

    const { status } = runningNode;
    switch (status) {
      case "success":
        return <CheckIcon className="size-6 text-green-700" />;
      case "error":
        return <TriangleAlertIcon className="size-6 text-red-700" />;
      case "running":
        return <LoaderIcon className="size-6 animate-spin text-accent" />;
      default:
        return null;
    }
  }, [runningNode]);

  if (!runningNode) return null;

  return (
    <div
      className={cn(
        "size-10 grid place-items-center rounded-xl transition-colors ease-out",
        runningNode.status === "running" && "bg-accent/50 text-accent",
        runningNode.status === "success" && "bg-green-200",
        runningNode.status === "error" && "bg-red-200",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={runningNode.status}
          initial={{ opacity: 0, scale: 0.25, filter: "blur(3px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(3px)" }}
          transition={{
            type: "spring",
            duration: 0.2,
            bounce: 0,
          }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NodeRunningAnimation({
  nodeId,
  children,
}: {
  nodeId: number;
  children: React.ReactNode;
}) {
  const { runningNode } = useNodesContext();
  const isNodeRunning = runningNode?.nodeId === nodeId;
  if (!isNodeRunning)
    return (
      <div className="relative p-0.5 rounded-[22px] overflow-hidden">
        <div className="grid place-items-center p-1 rounded-2xl">
          {children}
        </div>
      </div>
    );

  return (
    <div className="relative p-0.5 rounded-[22px] overflow-hidden">
      {runningNode.status === "running" && (
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 1, ease: "linear", repeat: Infinity },
          }}
          className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0%,var(--color-accent)_25%,transparent_35%)]"
        />
      )}
      {runningNode.status === "success" && (
        <motion.div
          initial={{ opacity: 1, rotate: 0 }}
          animate={{
            opacity: 0,
            rotate: 360,
            transition: { duration: 1, ease: "linear" },
          }}
          className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0%,var(--color-green-500)_25%,transparent_35%)]"
        />
      )}
      {runningNode.status === "error" && (
        <motion.div
          initial={{ opacity: 1, rotate: 0 }}
          animate={{
            opacity: 0,
            rotate: 360,
            transition: { duration: 1, ease: "linear" },
          }}
          className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0%,var(--color-red-500)_25%,transparent_35%)]"
        />
      )}
      <div className="grid place-items-center p-1 rounded-2xl">{children}</div>
    </div>
  );
}

export const NodeItem = React.forwardRef<HTMLButtonElement, { node: Node }>(
  ({ node }, ref) => {
    const { selectedNode, setSelectedNode, runningNode } = useNodesContext();
    const isNodeRunning = node.id === runningNode?.nodeId;

    return (
      <NodeRunningAnimation nodeId={node.id}>
        <button
          ref={ref}
          className={cn(
            "relative flex items-center gap-2 p-2 h-[58px] rounded-2xl bg-gray-1 border w-fit max-w-64 transition-shadow ring-0 ring-offset-0 ring-offset-background ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            selectedNode === node.id && "ring-2 ring-offset-2",
          )}
          onClick={() => setSelectedNode(node.id)}
          onFocus={() => setSelectedNode(node.id)}
        >
          <div className="flex items-center gap-2">
            {isNodeRunning ? (
              <NodeRunningIcon />
            ) : (
              <NodeTypeIcon node={node} />
            )}
            <div className="flex-1 flex flex-col items-start overflow-hidden pr-2">
              <span className="text-gray-12 font-medium text-sm truncate w-full">
                {node.title}
              </span>
              <span className="capitalize text-gray-10 font-medium text-sm">
                {typeNames[node.type]}
              </span>
            </div>
          </div>
        </button>
      </NodeRunningAnimation>
    );
  },
);

NodeItem.displayName = "NodeItem";
