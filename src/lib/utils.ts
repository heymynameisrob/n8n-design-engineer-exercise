import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** NOTE(@heymynameisrob): Check if keyboard events should be ignored due to open dialogs, menus, or interactive elements */
export function shouldIgnoreKeyboardEvent(event: KeyboardEvent): boolean {
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
