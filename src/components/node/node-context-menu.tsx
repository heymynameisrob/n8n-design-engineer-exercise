import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/primitives/ContextMenu";
import { NodeDeleteDialog } from "@/components/node/node-delete-dialog";
import { getNodeTypeIcon } from "@/components/node/node-icons";
import { Key } from "@/components/primitives/Key";
import { keyboardShortcuts, nodeTypes, typeNames } from "@/lib/constants";
import type { Node, NodeType } from "@/lib/types";
import { NodeFieldsMap } from "@/lib/types";
import { useNodesContext } from "@/components/provider/provider-node";
import {
  CopyIcon,
  PlayIcon,
  PowerIcon,
  PowerOffIcon,
  RefreshCwIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";

export function NodeContextMenu({
  children,
  node,
}: {
  children: React.ReactNode;
  node?: Node;
}) {
  const {
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    setRunningNode,
  } = useNodesContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const isSelected = node?.id === selectedNode;

  const handleDelete = () => {
    if (!node) return;
    setNodes(nodes.filter((n) => n.id !== node.id));
    setDeleteDialogOpen(false);
  };

  const handleTypeChange = (newType: NodeType) => {
    if (!node) return;
    setNodes(
      nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              type: newType,
              title: typeNames[newType],
              fields: NodeFieldsMap[newType].map((field) => ({
                [field.id]: field,
              })),
            }
          : n,
      ),
    );
  };

  const handleToggleActive = () => {
    if (!node) return;
    setNodes(
      nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              isActive: !n.isActive,
            }
          : n,
      ),
    );
  };

  const handleDuplicate = () => {
    if (!node) return;
    const maxId = Math.max(...nodes.map((n) => n.id));
    const newNode: Node = {
      ...node,
      id: maxId + 1,
      title: `${node.title} (Copy)`,
    };
    setNodes([...nodes, newNode]);
    return newNode;
  };

  const handleRun = () => {
    if (!node) return;
    setRunningNode({ nodeId: node.id, status: "running" });
  };

  useHotkeys(
    keyboardShortcuts.run.key,
    () => {
      if (!node) return;
      handleRun();
    },
    { enabled: isSelected, preventDefault: true },
  );

  useHotkeys(
    keyboardShortcuts.toggleActive.key,
    () => {
      if (!node) return;
      handleToggleActive();
    },
    { enabled: isSelected, preventDefault: true },
  );

  useHotkeys(
    keyboardShortcuts.duplicate.key,
    () => {
      if (!node) return;
      const newNode = handleDuplicate();
      if (newNode) {
        setSelectedNode(newNode.id);
      }
    },
    { enabled: isSelected, preventDefault: true },
  );

  useHotkeys(
    keyboardShortcuts.delete.key,
    () => {
      if (!node) return;
      setDeleteDialogOpen(true);
    },
    { enabled: isSelected, preventDefault: true },
  );

  if (!node) return <>{children}</>;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent
          className="w-72"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <ContextMenuItem
            className="gap-2 justify-between"
            onSelect={handleRun}
          >
            <div className="flex items-center gap-2">
              <PlayIcon className="size-4 opacity-70" />
              <span className="font-medium">{keyboardShortcuts.run.label}</span>
            </div>
            <ContextMenuShortcut>
              <Key>{keyboardShortcuts.run.display}</Key>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            className="gap-2 justify-between"
            onSelect={handleToggleActive}
          >
            <div className="flex items-center gap-2">
              {node.isActive ? (
                <PowerOffIcon className="size-4 opacity-70" />
              ) : (
                <PowerIcon className="size-4 opacity-70" />
              )}
              <span className="font-medium">
                {node.isActive ? "Deactivate" : "Activate"}
              </span>
            </div>
            <ContextMenuShortcut>
              <Key>{keyboardShortcuts.toggleActive.display}</Key>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <NodeTypeSwitch node={node} onTypeChange={handleTypeChange} />
          <ContextMenuItem className="gap-2 justify-between">
            <div className="flex items-center gap-2">
              <SquarePenIcon className="size-4 opacity-70" />
              <span className="font-medium">
                {keyboardShortcuts.convert.label}
              </span>
            </div>
            <ContextMenuShortcut>
              {Array.isArray(keyboardShortcuts.convert.display) ? (
                keyboardShortcuts.convert.display.map((key, i) => (
                  <Key key={i}>{key}</Key>
                ))
              ) : (
                <Key>{keyboardShortcuts.convert.display}</Key>
              )}
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            className="gap-2 justify-between"
            onSelect={() => {
              const newNode = handleDuplicate();
              if (newNode) {
                setSelectedNode(newNode.id);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <CopyIcon className="size-4 opacity-70" />
              <span className="font-medium">
                {keyboardShortcuts.duplicate.label}
              </span>
            </div>
            <ContextMenuShortcut>
              {Array.isArray(keyboardShortcuts.duplicate.display) ? (
                keyboardShortcuts.duplicate.display.map((key, i) => (
                  <Key key={i}>{key}</Key>
                ))
              ) : (
                <Key>{keyboardShortcuts.duplicate.display}</Key>
              )}
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="gap-2 justify-between"
            onSelect={() => setDeleteDialogOpen(true)}
          >
            <div className="flex items-center gap-2 text-red-500">
              <Trash2Icon className="size-4 opacity-70" />
              <span className="font-medium">
                {keyboardShortcuts.delete.label}
              </span>
            </div>
            <ContextMenuShortcut>
              <Key>{keyboardShortcuts.delete.display}</Key>
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <NodeDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        nodeName={node.title}
      />
    </>
  );
}

function NodeTypeSwitch({
  node,
  onTypeChange,
}: {
  node: Node;
  onTypeChange: (type: NodeType) => void;
}) {
  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger className="gap-2">
        <RefreshCwIcon className="size-4 opacity-70" />
        <span className="font-medium">Replace with...</span>
      </ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-52">
        <ContextMenuRadioGroup
          value={node.type}
          onValueChange={(value) => onTypeChange(value as NodeType)}
        >
          {nodeTypes.map((type) => (
            <ContextMenuRadioItem key={type} value={type} className="gap-2">
              {getNodeTypeIcon(type)}
              <span className="font-medium">{typeNames[type]}</span>
            </ContextMenuRadioItem>
          ))}
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
