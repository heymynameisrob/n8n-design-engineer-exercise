import { NodeDialog } from "@/components/node/node-dialog";
import { Nodes } from "@/components/node/node-group";
import { ResetButton } from "@/components/reset-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function App() {
  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <main
        className={cn(
          "flex-1 relative grid place-items-center overflow-hidden",
          "after:pointer-events-none after:absolute after:inset-0",
          "bg-[radial-gradient(var(--pattern-fg)_1px,transparent_0)] bg-size-[10px_10px] bg-fixed [--pattern-fg:var(--border)]",
        )}
      >
        <Nodes />
      </main>
      <footer className="fixed bottom-2 right-2 flex items-center gap-1 z-max">
        <ResetButton />
        <ThemeToggle />
      </footer>
      <NodeDialog />
    </div>
  );
}
