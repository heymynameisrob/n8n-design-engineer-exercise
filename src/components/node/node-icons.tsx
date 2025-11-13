import { Code2Icon, GlobeIcon, WebhookIcon } from "lucide-react";
import type { NodeType } from "@/lib/types";

export function getNodeTypeIcon(type: NodeType) {
  if (type === "http") {
    return <GlobeIcon className="size-4 opacity-70" />;
  }
  if (type === "code") {
    return <Code2Icon className="size-4 opacity-70" />;
  }
  if (type === "webhook") {
    return <WebhookIcon className="size-4 opacity-70" />;
  }
  return null;
}
