// Handler for Option 1 action - Align elements to top

/**
 * Aligns all selected elements to the top (minimum Y position)
 */
export function handleOption1Action(): void {
  const selection = figma.currentPage.selection;

  // Check if there are any selected elements
  if (selection.length === 0) {
    figma.notify("Please select at least one element to align");
    return;
  }

  // Find the minimum Y position (topmost element)
  let minY = Infinity;
  for (const node of selection) {
    if ("y" in node && typeof node.y === "number") {
      minY = Math.min(minY, node.y);
    }
  }

  // If no valid Y positions found, exit
  if (minY === Infinity) {
    figma.notify("Unable to align: selected elements don't have valid positions");
    return;
  }

  // Align all selected elements to the top
  for (const node of selection) {
    if ("y" in node && typeof node.y === "number") {
      node.y = minY;
    }
  }

  figma.notify(`Aligned ${selection.length} element(s) to top`);
}
