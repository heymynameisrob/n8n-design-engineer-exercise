import * as React from "react";
import {
  BoxIcon,
  Code2Icon,
  GlobeIcon,
  PowerOffIcon,
  WebhookIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Node } from "@/lib/types";

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
    http: "bg-blue-300 text-blue-800 dark:bg-blue-500/20 dark:text-white",
    code: "bg-orange-300 text-orange-800 dark:bg-orange-500/20 dark:text-white",
    webhook: "bg-cyan-300 text-cyan-800 dark:bg-cyan-500/20 dark:text-white",
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
