import { Dialog, DialogContent } from "@/components/primitives/Dialog";
import { useNodesContext } from "@/components/provider/provider-node";

export function NodeDialog() {
  const { selectedNode, setSelectedNode } = useNodesContext();

  return (
    <Dialog
      open={Boolean(selectedNode)}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedNode(null);
        }
      }}
      modal={false}
    >
      <DialogContent
        position="top-right"
        showOverlay={false}
        size="md"
        className="shadow-popover"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <p>Panel</p>
        <p>Selected:{selectedNode}</p>
      </DialogContent>
    </Dialog>
  );
}
