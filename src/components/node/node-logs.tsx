import { getDeterministicWidth } from "@/lib/utils";

/** Skeleton for placeholder */
export function NodeLogs() {
  return (
    <ul className="flex flex-col gap-px">
      {Array.from({ length: 12 }).map((_, i) => (
        <li className="flex items-center gap-2 h-8">
          <div className="shrink-0 size-4 rounded-full bg-gray-3" />
          <div className="shrink-0 w-12 h-3 rounded-full bg-gray-3" />
          <div className="shrink-0 w-8 h-3 rounded-full bg-gray-3" />
          <div
            className="w-16 h-3 rounded-full bg-gray-3"
            style={{ width: getDeterministicWidth(i) }}
          />
          <div className="w-16 h-3 rounded-full bg-gray-3 ml-auto" />
        </li>
      ))}
    </ul>
  );
}
