// Handler for Loose point action (Layout sub-feature)
// Recursively iterates the selected design and rounds x/y of all elements
// that have decimal values to the nearest even number.

declare const figma: any;

type AnyNode = SceneNode | PageNode | DocumentNode;

/**
 * Round a number to the nearest even integer.
 * e.g. 3.7 → 4, 4.4 → 4, 5.5 → 6
 */
function roundToNearestEven(n: number): number {
  return Math.round(n / 2) * 2;
}

/**
 * Recursively walk the node tree and run a callback on each node.
 */
function walk(node: AnyNode, callback: (node: AnyNode) => void): void {
  callback(node);
  if ("children" in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child as AnyNode, callback);
    }
  }
}

/**
 * Returns true if the node has layout position (x, y).
 */
function hasPosition(node: AnyNode): node is AnyNode & { x: number; y: number } {
  return "x" in node && typeof (node as any).x === "number" && "y" in node && typeof (node as any).y === "number";
}

/**
 * Returns true if the number has a decimal part.
 */
function hasDecimal(n: number): boolean {
  return n % 1 !== 0;
}

/**
 * Handles Loose point action: round x and y of all positioned nodes
 * in the selection (or current page) to the nearest even number,
 * only when the current value has a decimal part.
 */
export function handleLoosePointAction(): void {
  const selection = figma.currentPage.selection;

  const roots: AnyNode[] =
    selection.length > 0 ? (selection as AnyNode[]) : [figma.currentPage as AnyNode];

  let updatedCount = 0;

  for (const root of roots) {
    walk(root, (node) => {
      if (!hasPosition(node)) return;
      const x = (node as any).x;
      const y = (node as any).y;
      if (!hasDecimal(x) && !hasDecimal(y)) return;

      (node as any).x = roundToNearestEven(x);
      (node as any).y = roundToNearestEven(y);
      updatedCount += 1;
    });
  }

  if (updatedCount === 0) {
    figma.notify("No loose point positioning found. All x/y are already even integers.");
  } else {
    figma.notify(`Rounded x/y to nearest even on ${updatedCount} node${updatedCount === 1 ? "" : "s"}.`);
  }
}
