import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** NOTE(@heymynameisrob): Check if keyboard events should be ignored due to open dialogs, menus, or interactive elements */
function shouldIgnoreKeyboardEvent(event: KeyboardEvent): boolean {
  event.stopPropagation();

  const hasOpenDialog = document.querySelector('[role="dialog"]');
  const hasOpenMenu = document.querySelector('[role="menu"]');

  const target = event.target as Element;
  const isInDialog = target?.closest('[role="dialog"]');
  const isInMenu = target?.closest('[role="menu"]');

  const tagName = (target as HTMLElement)?.tagName;
  const isInInput =
    tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
  const isContentEditable = (target as HTMLElement)?.isContentEditable;

  return !!(
    hasOpenDialog ||
    hasOpenMenu ||
    isInDialog ||
    isInMenu ||
    isInInput ||
    isContentEditable
  );
}

export function getDeterministicWidth(index: number) {
  const ranges = [
    { min: 200, max: 350 },
    { min: 150, max: 280 },
    { min: 180, max: 320 },
  ];

  // Use modulo to pick which range based on the index
  const rangeIndex = index % 3;
  const { min, max } = ranges[rangeIndex];

  // Simple hash function for deterministic randomness
  const seed = index * 2654435761; // Use a prime multiplier for better distribution
  const pseudo = Math.sin(seed) * 10000;
  const random = pseudo - Math.floor(pseudo);

  return Math.floor(random * (max - min + 1)) + min;
}
