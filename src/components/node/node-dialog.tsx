import * as React from "react";
import useMeasure from "react-use-measure";
import { motion } from "motion/react";
import {
  PlayIcon,
  PowerOffIcon,
  PowerIcon,
  TrashIcon,
  ChevronDownIcon,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/primitives/Tabs";
import { Tooltip } from "@/components/primitives/Tooltip";
import { Button } from "@/components/primitives/Button";
import { NodeForm } from "@/components/node/node-form";
import { NodeTypeIcon } from "@/components/node/node-type-icon";
import { NodeDeleteDialog } from "@/components/node/node-delete-dialog";
import { useNodesContext } from "@/components/provider/provider-node";
import { typeNames } from "@/lib/constants";

import type { Node } from "@/lib/types";

export function NodeDialog() {
  const [ref, bounds] = useMeasure();
  const { selectedNode, nodes } = useNodesContext();
  const fullNode = nodes.find((n) => n.id === selectedNode);

  if (!selectedNode || !fullNode) return null;

  return (
    <motion.div
      role="dialog"
      className="fixed top-4 right-4 w-96 h-auto bg-gray-1 rounded-2xl shadow-popover max-h-[clamp(4rem,80dvh,48rem)] overflow-y-scroll"
      animate={{ height: bounds.height }}
      transition={{ duration: 0.4, type: "spring", bounce: 0 }}
    >
      <NodeDialogActions node={fullNode} />
      <div className="flex flex-col" ref={ref}>
        <header className="flex flex-row items-center gap-3 p-4">
          <NodeTypeIcon node={fullNode} />
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-12">
              {typeNames[fullNode.type]}
            </h3>
            <p className="text-sm  text-gray-10">
              A description about the type here
            </p>
          </div>
        </header>
        <Tabs defaultValue="details">
          <TabsList className="px-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent
            value="details"
            className="h-full px-6 py-4 flex flex-col gap-4"
          >
            <NodeForm key={selectedNode} nodeId={selectedNode} />
            <Button
              size="sm"
              variant="ghost"
              className="justify-between gap-1.5 -mx-3"
            >
              Input
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="justify-between gap-1.5 -mx-3"
            >
              Output
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </TabsContent>
          <TabsContent value="logs">
            <p>Logs</p>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

function NodeDialogActions({ node }: { node: Node }) {
  const { nodes, setNodes, setRunningNode } = useNodesContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = () => {
    setNodes(nodes.filter((n) => n.id !== node.id));
    setDeleteDialogOpen(false);
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

  const handleRun = () => {
    setRunningNode({ nodeId: node.id, status: "running" });
  };

  return (
    <>
      <div className="absolute top-0 right-0 p-2 flex items-center justify-end gap-1">
        <Tooltip content="Run">
          <Button size="icon" variant="ghost" onClick={handleRun}>
            <PlayIcon className="size-4 opacity-70" />
          </Button>
        </Tooltip>
        <Tooltip content={node.isActive ? "Deactivate" : "Activate"}>
          <Button size="icon" variant="ghost" onClick={handleToggleActive}>
            {node.isActive ? (
              <PowerOffIcon className="size-4 opacity-70" />
            ) : (
              <PowerIcon className="size-4 opacity-70" />
            )}
          </Button>
        </Tooltip>
        <Tooltip content="Delete">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <TrashIcon className="size-4 opacity-70" />
          </Button>
        </Tooltip>
      </div>

      <NodeDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        nodeName={node.title}
      />
    </>
  );
}
