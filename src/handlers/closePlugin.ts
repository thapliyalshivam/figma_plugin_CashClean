// Handler for closing the plugin

declare const figma: any;

/**
 * Closes the plugin window
 */
export function handleClosePlugin(): void {
  figma.closePlugin();
}
