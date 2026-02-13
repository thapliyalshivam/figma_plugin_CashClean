// Copy and Des: apply document copy (from Google Doc URL or paste) to selected design using Gemini mapping.

declare const figma: any;

import {
  geminiService,
  type DesignNodeDescriptor,
} from "../../services/gemini";

type AnyNode = SceneNode | PageNode | DocumentNode;

function collectTextNodes(roots: readonly SceneNode[]): TextNode[] {
  const textNodes: TextNode[] = [];
  function walk(node: AnyNode) {
    if (node.type === "TEXT") textNodes.push(node as TextNode);
    if ("children" in node && Array.isArray(node.children)) {
      for (const child of node.children) walk(child as AnyNode);
    }
  }
  for (const root of roots) walk(root as AnyNode);
  return textNodes;
}

function getFontsForNode(node: TextNode, length: number): { family: string; style: string }[] {
  let fontNames: { family: string; style: string }[] = [];
  if (length > 0) {
    try {
      fontNames = node.getRangeAllFontNames(0, length);
    } catch (_) {
      const fn = node.fontName;
      if (fn !== figma.mixed && typeof fn === "object" && fn !== null) {
        fontNames = [fn as { family: string; style: string }];
      }
    }
  }
  if (fontNames.length === 0) fontNames = [{ family: "Inter", style: "Regular" }];
  return fontNames;
}

async function setTextWithFonts(node: TextNode, newText: string): Promise<boolean> {
  const len = node.characters.length;
  const fontNames = getFontsForNode(node, len);
  if (newText.length > 0 && fontNames.length === 0) return false;
  try {
    await Promise.all(fontNames.map((font) => figma.loadFontAsync(font)));
  } catch (e) {
    console.error("Copy and Des: failed to load font", e);
    return false;
  }
  try {
    if (len > 0) node.deleteCharacters(0, len);
    if (newText.length > 0) node.insertCharacters(0, newText);
    return true;
  } catch (e) {
    try {
      node.characters = newText;
      return true;
    } catch {
      return false;
    }
  }
}

/** Get a simple color hint from Figma solid fill (hex or description). */
function getColorHint(node: TextNode): string | undefined {
  try {
    const fills = node.fills;
    if (fills === figma.mixed || !Array.isArray(fills) || fills.length === 0) return undefined;
    const fill = fills[0];
    if (fill?.type === "SOLID" && fill.color) {
      const { r, g, b } = fill.color;
      const hex = [r, g, b]
        .map((c) => {
          const h = Math.round(c * 255).toString(16);
          return h.length === 1 ? "0" + h : h;
        })
        .join("");
      return `#${hex}`;
    }
  } catch (_) {}
  return undefined;
}

/** Build design node descriptor from a Figma TextNode (font size, bold, color, etc.). */
function describeNode(node: TextNode, index: number): DesignNodeDescriptor {
  const len = node.characters.length;
  let fontSize = 12;
  let fontFamily = "Inter";
  let fontStyle = "Regular";
  let fontWeight: number | undefined;
  if (len > 0) {
    try {
      const fs = node.getRangeFontSize(0, 1);
      if (typeof fs === "number") fontSize = fs;
    } catch (_) {}
    try {
      const fn = node.getRangeFontName(0, 1);
      if (fn !== figma.mixed && typeof fn === "object" && fn !== null) {
        fontFamily = (fn as { family: string }).family ?? fontFamily;
        fontStyle = (fn as { style: string }).style ?? fontStyle;
      }
    } catch (_) {
      const fn = node.fontName;
      if (fn !== figma.mixed && typeof fn === "object" && fn !== null) {
        fontFamily = (fn as { family: string }).family ?? fontFamily;
        fontStyle = (fn as { style: string }).style ?? fontStyle;
      }
    }
    try {
      if ("getRangeFontWeight" in node && typeof node.getRangeFontWeight === "function") {
        const fw = node.getRangeFontWeight(0, len);
        if (typeof fw === "number") fontWeight = fw;
      }
    } catch (_) {}
  }
  return {
    index,
    currentText: node.characters,
    fontSize,
    fontFamily,
    fontStyle,
    fontWeight,
    colorHint: getColorHint(node),
  };
}

function formatApiError(error: { status: number; code?: number; message?: string }): string {
  if (error.status === 429) return "Rate limit hit (429). Wait a minute and try again.";
  const parts: string[] = [];
  if (error.status) parts.push(`Status ${error.status}`);
  if (error.code != null && error.code !== error.status) parts.push(`Code ${error.code}`);
  parts.push(error.message?.slice(0, 80) ?? "Unknown error");
  return parts.join(" · ");
}

/** Extract Google Doc ID from URL. Returns null if not a docs URL. */
function extractGoogleDocId(url: string): string | null {
  const trimmed = (url || "").trim();
  const m = trimmed.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

/** Try to fetch plain text from a Google Doc (may fail without auth). */
async function tryFetchGoogleDocText(docId: string): Promise<string | null> {
  const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim().length > 0 ? text.trim() : null;
  } catch (_) {
    return null;
  }
}

export async function handleCopyAndDesAction(
  docContent: string,
  docUrl?: string
): Promise<void> {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Select a frame or group with text, then run Copy and Des.");
    return;
  }
  if (!geminiService.isConfigured) {
    figma.notify("Set GEMINI_API_KEY in .env and rebuild the plugin.");
    return;
  }

  let raw = (docContent || "").trim();
  if (!raw && docUrl) {
    const docId = extractGoogleDocId(docUrl);
    if (docId) {
      figma.notify("Copy and Des: fetching document...");
      const fetched = await tryFetchGoogleDocText(docId);
      if (fetched) raw = fetched;
      else figma.notify("Could not fetch doc from URL. Paste content below.", { timeout: 4000 });
    }
  }
  if (!raw) {
    figma.notify("Paste document content (from your Google Doc) or use a doc URL and try again.");
    return;
  }

  const textNodes = collectTextNodes(selection);
  const withContent = textNodes.filter((n) => !("hasMissingFont" in n && n.hasMissingFont));
  if (withContent.length === 0) {
    figma.notify("No text nodes found in selection. Select a frame or group that contains text.");
    return;
  }

  figma.notify(`Copy and Des: mapping ${withContent.length} node(s)...`);

  const designNodes: DesignNodeDescriptor[] = withContent.map((node, i) =>
    describeNode(node, i)
  );
  const result = await geminiService.mapDocContentToDesign(raw, designNodes);

  if (!result.ok) {
    figma.notify(`Copy and Des: ${formatApiError(result.error)}`, {
      error: true,
      timeout: 5000,
    });
    return;
  }

  let updated = 0;
  let failed = 0;
  for (const m of result.mapping) {
    const text = result.contentBlocks[m.contentIndex];
    const node = withContent[m.nodeIndex];
    if (text === undefined || !node) continue;
    const ok = await setTextWithFonts(node, text);
    if (ok) updated++;
    else failed++;
  }

  if (failed > 0) {
    figma.notify(
      `Copy and Des: updated ${updated}, ${failed} failed (font/missing font).`,
      { error: true }
    );
  } else if (updated === 0) {
    figma.notify("Copy and Des: no nodes updated (check mapping).");
  } else {
    figma.notify(`Copy and Des: updated ${updated} of ${result.mapping.length} text node(s).`);
  }
}
