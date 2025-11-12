export const nodeTypes = ["http", "code", "webhook"] as const;

export const typeNames = {
  http: "HTTP Request",
  code: "Codeblock",
  webhook: "Webhook",
};

// Keyboard shortcuts
export const keyboardShortcuts = {
  run: {
    key: "enter",
    display: "↩",
    label: "Run step",
  },
  toggleActive: {
    key: "d",
    display: "D",
    label: "Toggle active",
  },
  convert: {
    key: "alt+x",
    display: ["⌥", "X"],
    label: "Convert to subworkflow",
  },
  duplicate: {
    key: "mod+d",
    display: ["⌘", "D"],
    label: "Duplicate",
  },
  delete: {
    key: "del",
    display: "Del",
    label: "Delete",
  },
} as const;

export type KeyboardShortcutKey = keyof typeof keyboardShortcuts;
export type KeyboardShortcut = (typeof keyboardShortcuts)[KeyboardShortcutKey];
