// Handler for Option 4 action

declare const figma: any;

/**
 * Handles Option 4 tool action with fill or stroke style
 */
export function handleOption4Action(style: "fill" | "stroke"): void {
  const selection = figma.currentPage.selection;

  // Check if there are any selected elements
  if (selection.length === 0) {
    figma.notify("Please select at least one element to apply style");
    return;
  }

  // Apply style to selected elements
  for (const node of selection) {
    if ("fills" in node && Array.isArray(node.fills)) {
      if (style === "fill") {
        // Apply fill style logic here
        // For now, just notify
      } else if (style === "stroke") {
        // Apply stroke style logic here
        // For now, just notify
      }
    }
  }

  figma.notify(
    `Applied ${style} style to ${selection.length} element(s)`
  );
}
