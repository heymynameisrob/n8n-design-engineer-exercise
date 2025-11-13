import * as React from "react";
import type { Node } from "@/lib/types";

export function useNodeNavigation(
  nodes: Node[],
  selectedNode: number | null,
  setSelectedNode: (id: number) => void,
) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [nodes, selectedNode, setSelectedNode]);
}
