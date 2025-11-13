import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { RotateCwIcon } from "lucide-react";

export function ResetButton() {
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Tooltip content="Reset">
      <Button size="icon" onClick={handleReset}>
        <RotateCwIcon className="size-4 opacity-70" />
      </Button>
    </Tooltip>
  );
}
