import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/primitives/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu";
import { useTheme } from "@/components/provider/provider-theme";
import { Tooltip } from "@/components/primitives/Tooltip";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <Tooltip content="Toggle theme">
        <div className="flex">
          <DropdownMenuTrigger asChild>
            <Button size="icon">
              <Sun className="size-4 scale-100 rotate-0 opacity-70 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute size-4 opacity-70 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
        </div>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
