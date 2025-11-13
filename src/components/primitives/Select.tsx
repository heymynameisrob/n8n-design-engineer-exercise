import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="group/native-select relative w-fit has-[select:disabled]:opacity-50">
      <select
        data-slot="native-select"
        className={cn(
          "border placeholder:text-gray-10 selection:bg-gray-3 selection:text-gray-12 h-9 w-full min-w-0 appearance-none rounded-md bg-background px-3 py-2 pr-9 text-sm transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      <ChevronDownIcon
        className="text-gray-10 pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
        aria-hidden="true"
      />
    </div>
  );
}

function SelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option {...props} />;
}

function SelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return <optgroup className={cn(className)} {...props} />;
}

export { Select, SelectOptGroup, SelectOption };
