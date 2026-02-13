// Copycat: fix grammar and punctuation in all text nodes inside the selection using Gemini.

declare const figma: any;

import { geminiService } from "../../services/gemini";

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
    console.error("Copycat: failed to load font", e);
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

/** Format API error for Figma popup. 429 gets a short, actionable message. */
function formatGeminiError(error: { status: number; code?: number; message?: string }): string {
  if (error.status === 429) {
    return "Rate limit hit (429). Wait a minute and try again.";
  }
  const parts: string[] = [];
  if (error.status) parts.push(`Status ${error.status}`);
  if (error.code != null && error.code !== error.status) parts.push(`Code ${error.code}`);
  const msg = error.message?.slice(0, 80) ?? "Unknown error";
  parts.push(msg);
  return parts.join(" · ");
}

export async function handleCopycatAction(): Promise<void> {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Select a frame or group with text, then run Copycat.");
    return;
  }
  if (!geminiService.isConfigured) {
    figma.notify("Set GEMINI_API_KEY in .env and rebuild the plugin.");
    return;
  }

  const textNodes = collectTextNodes(selection);
  const withContent = textNodes.filter((n) => n.characters.trim().length > 0);
  const editable = withContent.filter((n) => !("hasMissingFont" in n && n.hasMissingFont));
  const skippedMissingFont = withContent.length - editable.length;
  if (skippedMissingFont > 0) {
    figma.notify(
      `${skippedMissingFont} text node(s) skipped (missing font). Resolve in design first.`,
      { timeout: 3000 }
    );
  }
  if (editable.length === 0) {
    figma.notify("No text found in selection. Select a frame or group that contains text.");
    return;
  }

  figma.notify(`Copycat: fixing ${editable.length} text node(s)...`);

  const originals = editable.map((n) => n.characters);
  const result = await geminiService.fixGrammarAndPunctuationBatch(originals);

  if (!result.ok) {
    const msg = formatGeminiError(result.error);
    figma.notify(`Copycat: ${msg}`, { error: true, timeout: 5000 });
    return;
  }

  let updated = 0;
  let failed = 0;
  for (let i = 0; i < editable.length; i++) {
    const ok = await setTextWithFonts(editable[i], result.corrected[i]);
    if (ok) updated++;
    else failed++;
  }

  if (failed > 0) {
    figma.notify(
      `Copycat: updated ${updated}, ${failed} failed (check font / missing font).`,
      { error: true }
    );
  } else if (updated === 0) {
    figma.notify("Nothing to fix.");
  } else {
    figma.notify(`Copycat: updated ${updated} of ${editable.length} text node(s).`);
  }
}
