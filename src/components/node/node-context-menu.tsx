import * as React from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/primitives/AlertDialog";
import { Key } from "@/components/primitives/Key";
import { NODE_TYPES, TYPE_NAMES } from "@/lib/constants";
import type { Node, NodeType } from "@/lib/types";
import { NodeFieldsMap } from "@/lib/types";
import { useNodesContext } from "@/components/provider/provider-node";
import {
  Code2Icon,
  CopyIcon,
  GlobeIcon,
  PlayIcon,
  PowerIcon,
  PowerOffIcon,
  RefreshCwIcon,
  SquarePenIcon,
  Trash2Icon,
  WebhookIcon,
} from "lucide-react";

export function NodeContextMenu({
  children,
  node,
}: {
  children: React.ReactNode;
  node?: Node;
}) {
  const { nodes, setNodes } = useNodesContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  if (!node) return <>{children}</>;

  const handleDelete = () => {
    setNodes(nodes.filter((n) => n.id !== node.id));
    setDeleteDialogOpen(false);
  };

  const handleTypeChange = (newType: NodeType) => {
    setNodes(
      nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              type: newType,
              title: TYPE_NAMES[newType],
              fields: NodeFieldsMap[newType].map((field) => ({
                [field.id]: field,
              })),
            }
          : n,
      ),
    );
  };

  const handleToggleActive = () => {
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
    const maxId = Math.max(...nodes.map((n) => n.id));
    const newNode: Node = {
      ...node,
      id: maxId + 1,
      title: `${node.title} (Copy)`,
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-72">
          <ContextMenuItem className="gap-2 justify-between">
            <div className="flex items-center gap-2">
              <PlayIcon className="size-4 opacity-70" />
              <span className="font-medium">Run step</span>
            </div>
            <ContextMenuShortcut>
              <Key>↩</Key>
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
              <Key>D</Key>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <NodeTypeSwitch node={node} onTypeChange={handleTypeChange} />
          <ContextMenuItem className="gap-2 justify-between">
            <div className="flex items-center gap-2">
              <SquarePenIcon className="size-4 opacity-70" />
              <span className="font-medium">Convert to subworkflow</span>
            </div>
            <ContextMenuShortcut>
              <Key>⌥</Key>
              <Key>X</Key>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            className="gap-2 justify-between"
            onSelect={handleDuplicate}
          >
            <div className="flex items-center gap-2">
              <CopyIcon className="size-4 opacity-70" />
              <span className="font-medium">Duplicate</span>
            </div>
            <ContextMenuShortcut>
              <Key>⌘</Key>
              <Key>D</Key>
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="gap-2 justify-between"
            onSelect={() => setDeleteDialogOpen(true)}
          >
            <div className="flex items-center gap-2 text-red-500">
              <Trash2Icon className="size-4 opacity-70" />
              <span className="font-medium">Delete</span>
            </div>
            <ContextMenuShortcut>
              <Key>Del</Key>
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DeleteAlertDialog
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
          {NODE_TYPES.map((type) => (
            <ContextMenuRadioItem key={type} value={type} className="gap-2">
              {getNodeTypeIcon(type)}
              <span className="font-medium">{TYPE_NAMES[type]}</span>
            </ContextMenuRadioItem>
          ))}
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}

function DeleteAlertDialog({
  open,
  onOpenChange,
  onConfirm,
  nodeName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  nodeName: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete node?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{nodeName}"? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction isDestructive={true} onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function getNodeTypeIcon(type: NodeType) {
  switch (type) {
    case "http":
      return <GlobeIcon className="size-4 opacity-70" />;
    case "code":
      return <Code2Icon className="size-4 opacity-70" />;
    case "webhook":
      return <WebhookIcon className="size-4 opacity-70" />;
  }
}
