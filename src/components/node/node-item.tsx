import * as React from "react";
import {
  BoxIcon,
  CheckIcon,
  Code2Icon,
  GlobeIcon,
  LoaderIcon,
  PowerOffIcon,
  TriangleAlertIcon,
  WebhookIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { typeNames } from "@/lib/constants";
import type { Node } from "@/lib/types";
import { useNodesContext } from "@/components/provider/provider-node";
import { NodeContextMenu } from "@/components/node/node-context-menu";
import { AnimatePresence, motion } from "motion/react";

export const NodeItem = React.forwardRef<HTMLButtonElement, { node: Node }>(
  ({ node }, ref) => {
    const { selectedNode, setSelectedNode, runningNode } = useNodesContext();
    const isNodeRunning = node.id === runningNode?.nodeId;

    return (
      <NodeContextMenu node={node}>
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
      </NodeContextMenu>
    );
  },
);

NodeItem.displayName = "NodeItem";

function NodeInactiveIcon() {
  return (
    <div className="shrink-0 size-10 grid place-items-center rounded-xl bg-gray-5 text-gray-11">
      <PowerOffIcon className="size-6 opacity-70" />
    </div>
  );
}

export function NodeTypeIcon({ node }: { node: Node }) {
  const type = node.type;
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

  if (!node.isActive) return <NodeInactiveIcon />;

  return (
    <div
      className={cn(
        "relative z-10 shrink-0 size-10 ring-1 ring-background grid place-items-center rounded-xl",
        styleMap[type],
      )}
      aria-label={type}
    >
      {content}
    </div>
  );
}

function NodeRunningIcon() {
  const { runningNode } = useNodesContext();

  const content = React.useMemo(() => {
    if (!runningNode) return;

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
  if (!isNodeRunning) return <>{children}</>;

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
