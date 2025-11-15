import * as React from "react";
import { cn } from "@/lib/utils";

export function Key({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "shrink-0 grid place-items-center h-5 min-w-5! p-0.5 rounded-md bg-gray-3 text-gray-11 text-xs font-semibold font-sans dark:bg-white/10",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

function Keys({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key) => (
        <Key key={key}>{key}</Key>
      ))}
    </div>
  );
}
