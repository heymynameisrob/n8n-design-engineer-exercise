import * as React from "react";
import { NodeItem } from "@/components/node/node-item";
import { useNodesContext } from "@/components/provider/provider-node";

/**
 * TODO: This is where we'll add react-flow later to make things look real
 * Dont worry about making it work well though as its OOS for the challenge
 */
export function Nodes() {
  const { nodes, selectedNode, setSelectedNode } = useNodesContext();
  const nodeRefsMap = React.useRef(new Map<number, HTMLButtonElement>());

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only check if we're inside an interactive element, not if one exists
      const target = event.target as Element;
      const isInDialog = target?.closest('[role="dialog"]');
      const isInMenu = target?.closest('[role="menu"]');
      const tagName = (target as HTMLElement)?.tagName;
      const isInInput =
        tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
      const isContentEditable = (target as HTMLElement)?.isContentEditable;

      if (isInDialog || isInMenu || isInInput || isContentEditable) {
        return;
      }

      if (!nodes || nodes.length === 0) return;

      const currentIndex = nodes.findIndex((node) => node.id === selectedNode);
      let newIndex = currentIndex;

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : nodes.length - 1;
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        newIndex = currentIndex < nodes.length - 1 ? currentIndex + 1 : 0;
      }

      if (newIndex !== currentIndex) {
        const newNode = nodes[newIndex];
        setSelectedNode(newNode.id);
        nodeRefsMap.current.get(newNode.id)?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [nodes, selectedNode, setSelectedNode]);

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
