// Handler for creating rectangles

/**
 * Creates two rectangles with different colors and positions them on the canvas
 */
export function handleCreateRectangles(): void {
  const rect1 = figma.createRectangle();
  rect1.resize(150, 100);
  rect1.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 0.86 } }];
  rect1.x = 0;
  rect1.y = 0;

  const rect2 = figma.createRectangle();
  rect2.resize(150, 100);
  rect2.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.4, b: 0.3 } }];
  rect2.x = rect1.x + rect1.width + 40;
  rect2.y = rect1.y;

  figma.currentPage.selection = [rect1, rect2];
  figma.viewport.scrollAndZoomIntoView([rect1, rect2]);
}
