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
        <h1>Hello</h1>
      </main>
      <footer className="flex items-center justify-between h-14 px-3 border-t bg-background">
        <p>Toolbar</p>
        <ThemeToggle />
      </footer>
    </div>
  );
}
