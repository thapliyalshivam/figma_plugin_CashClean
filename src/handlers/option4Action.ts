// Handler for Option 4 action
// Normalizes SVG/vector anchor points by snapping nearby anchors
// together so coincident points align perfectly, without rounding
// coordinates to whole numbers.

declare const figma: any;

type AnyNode = SceneNode | PageNode | DocumentNode;

/**
 * Recursively walk the node tree and run a callback on each node.
 */
function walk(node: AnyNode, callback: (node: AnyNode) => void) {
  callback(node);
  if ("children" in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child as AnyNode, callback);
    }
  }
}

/**
 * Helper types and global snapping logic
 */
type VertexRef = {
  node: AnyNode;
  vertexIndex: number;
  x: number;
  y: number;
};

function collectVectorVertices(roots: AnyNode[]): {
  perNode: Map<AnyNode, { network: any; vertices: any[] }>;
  refs: VertexRef[];
} {
  const perNode = new Map<AnyNode, { network: any; vertices: any[] }>();
  const refs: VertexRef[] = [];

  for (const root of roots) {
    walk(root, (node) => {
      if (!("vectorNetwork" in node) || !node.vectorNetwork) {
        return;
      }

      const currentNetwork = (node as any).vectorNetwork;
      const existing = perNode.get(node);

      let entry: { network: any; vertices: any[] };

      if (existing) {
        entry = existing;
      } else {
        const verticesCopy = currentNetwork.vertices.map((v: any) => ({ ...v }));
        entry = { network: currentNetwork, vertices: verticesCopy };
        perNode.set(node, entry);
      }

      entry.vertices.forEach((v: any, index: number) => {
        refs.push({
          node,
          vertexIndex: index,
          x: v.x,
          y: v.y,
        });
      });
    });
  }

  return { perNode, refs };
}

function snapVerticesGlobally(roots: AnyNode[]): number {
  const { perNode, refs } = collectVectorVertices(roots);

  if (!refs.length) {
    return 0;
  }

  const EPSILON = 0.35; // how close points must be (in px) to be considered the same
  const epsilonSquared = EPSILON * EPSILON;

  type Group = {
    refs: VertexRef[];
    x: number;
    y: number;
  };

  const groups: Group[] = [];

  // Group vertices that are very close together across ALL shapes
  refs.forEach((ref) => {
    let targetGroup: Group | null = null;

    for (const group of groups) {
      const dx = ref.x - group.x;
      const dy = ref.y - group.y;
      const distSq = dx * dx + dy * dy;
      if (distSq <= epsilonSquared) {
        targetGroup = group;
        break;
      }
    }

    if (targetGroup) {
      // Incremental average to keep group center updated
      const n = targetGroup.refs.length;
      targetGroup.x = (targetGroup.x * n + ref.x) / (n + 1);
      targetGroup.y = (targetGroup.y * n + ref.y) / (n + 1);
      targetGroup.refs.push(ref);
    } else {
      groups.push({
        refs: [ref],
        x: ref.x,
        y: ref.y,
      });
    }
  });

  // Snap each group to a common coordinate and apply to all its vertices
  groups.forEach((group) => {
    const snappedX = group.x;
    const snappedY = group.y;

    group.refs.forEach((ref) => {
      const entry = perNode.get(ref.node);
      if (!entry) {
        return;
      }
      const v = entry.vertices[ref.vertexIndex];
      if (!v) {
        return;
      }
      v.x = snappedX;
      v.y = snappedY;
    });
  });

  // Assign updated networks back to their nodes
  perNode.forEach((entry, node) => {
    (node as any).vectorNetwork = {
      ...entry.network,
      vertices: entry.vertices,
    };
  });

  // Number of distinct nodes whose anchors were updated
  return perNode.size;
}

/**
 * Handles Option 4 tool action.
 *
 * NOTE: The style parameter is currently unused but kept for
 * compatibility with the UI message contract.
 */
export function handleOption4Action(_style: "fill" | "stroke"): void {
  const selection = figma.currentPage.selection;

  // If there is a selection, operate within that subtree.
  // Otherwise, operate on the entire current page.
  const roots: AnyNode[] =
    selection.length > 0 ? (selection as AnyNode[]) : [figma.currentPage as AnyNode];

  const processedNodes = snapVerticesGlobally(roots);

  if (processedNodes === 0) {
    figma.notify(
      "No vector anchor points found. Select vector shapes or imported SVGs and try again."
    );
  } else {
    figma.notify(
      `Normalized anchor points on ${processedNodes} vector node${processedNodes === 1 ? "" : "s"}.`
    );
  }
}

