// Handler for Option 2 action (Aligner)

/**
 * Calculates the median value from an array of numbers
 */
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  

  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

/**
 * Checks if a node contains an image fill
 */
function hasImageFill(node: any): boolean {
  if (!node.fills || !Array.isArray(node.fills)) {
    return false;
  }
  
  return node.fills.some((fill: any) => fill.type === "IMAGE");
}

/**
 * Handles Option 2 tool action (Aligner):
 * 1. Finds median height and width from selected images
 * 2. Creates frames with those dimensions (clipping=true, fill parent, center aligned)
 * 3. Aligns all frames using tidy command
 */
export function handleOption2Action(): void {
  const selection = figma.currentPage.selection;

  // Check if there are any selected elements
  if (selection.length === 0) {
    figma.notify("Please select at least one image to process");
    return;
  }

  // Filter for nodes that have image fills or are images
  const imageNodes: any[] = [];
  
  for (const node of selection) {
    // Check if node has width and height properties
    if ("width" in node && "height" in node && typeof node.width === "number" && typeof node.height === "number") {
      // Check if it's an image node or has image fills
      if (node.type === "RECTANGLE" && hasImageFill(node)) {
        imageNodes.push(node);
      } else if (node.type === "VECTOR" && hasImageFill(node)) {
        imageNodes.push(node);
      } else if (node.type === "ELLIPSE" && hasImageFill(node)) {
        imageNodes.push(node);
      } else if (node.type === "POLYGON" && hasImageFill(node)) {
        imageNodes.push(node);
      } else if (node.type === "STAR" && hasImageFill(node)) {
        imageNodes.push(node);
      }
    }
  }

  if (imageNodes.length === 0) {
    figma.notify("No images found in selection. Please select nodes with image fills.");

    return;
  }

  // Collect all widths and heights
  const widths: number[] = [];
  const heights: number[] = [];

  for (const node of imageNodes) {
    widths.push(node.width);
    heights.push(node.height);
  }

  // Calculate median dimensions
  const medianWidth = calculateMedian(widths);
  const medianHeight = calculateMedian(heights);

  // Create frames and move images into them
  const createdFrames: any[] = [];

  for (const imageNode of imageNodes) {
    // Store original position
    const originalX = imageNode.x;
    const originalY = imageNode.y;
    
    // Create a frame with median dimensions
    const frame = figma.createFrame();
    frame.name = imageNode.name || "Image Frame";
    frame.resize(medianWidth, medianHeight);
    frame.cornerRadius = 20;
    frame.x = originalX;
    frame.y = originalY;

    
    // Set frame properties
    frame.clipsContent = true; // Clipping set to true
    
    // Move the image node into the frame
    frame.appendChild(imageNode);
    
    // Calculate how to resize image to fill frame while maintaining aspect ratio
    const imageAspectRatio = imageNode.width / imageNode.height;
    const frameAspectRatio = medianWidth / medianHeight;
    
    let newWidth: number;
    let newHeight: number;
    
    // Fill parent: resize to cover the frame (maintain aspect ratio, fill entire frame)
    if (imageAspectRatio > frameAspectRatio) {
      // Image is wider - fit to height, width will overflow (clipped)
      newHeight = medianHeight;
      newWidth = medianHeight * imageAspectRatio;
    } else {
      // Image is taller - fit to width, height will overflow (clipped)
      newWidth = medianWidth;
      newHeight = medianWidth / imageAspectRatio;
    }
    
    // Resize image to fill parent (cover mode - maintains aspect ratio, fills frame)
    imageNode.resize(newWidth, newHeight);
    
    // Center align the image in the frame
    imageNode.x = (medianWidth - newWidth) / 2;
    imageNode.y = (medianHeight - newHeight) / 2;
    
    // Set constraints: children set to fill parent with center alignment
    // Using STRETCH to fill parent, but we've already sized it to fill
    // CENTER constraints will keep it centered if frame is resized
    imageNode.constraints = {
      horizontal: "CENTER",
      vertical: "CENTER"
    };
    
    createdFrames.push(frame);
  }

  // Select all created frames
  figma.currentPage.selection = createdFrames;

  // Use tidy command to align frames
  // Note: Figma's tidy command is accessed via the selection
  // We'll use the layout plugin API if available, otherwise arrange manually
  try {
    // Try to use Figma's built-in tidy functionality
    if (createdFrames.length > 1) {
      // Arrange frames in a grid-like pattern
      // Calculate grid dimensions
      const cols = Math.ceil(Math.sqrt(createdFrames.length));
      const spacing = 20;
      
      let currentX = createdFrames[0].x;
      let currentY = createdFrames[0].y;
      let row = 0;
      let col = 0;
      
      for (const frame of createdFrames) {
        frame.x = currentX + col * (medianWidth + spacing);
        frame.y = currentY + row * (medianHeight + spacing);
        
        col++;
        if (col >= cols) {
          col = 0;
          row++;
        }
      }
      
      // Scroll to view all frame
      figma.viewport.scrollAndZoomIntoView(createdFrames);
    }
    
    figma.notify(`Created ${createdFrames.length} frame(s) with median dimensions (${Math.round(medianWidth)}×${Math.round(medianHeight)})`);
  } catch (error) {
    figma.notify(`Created frames but encountered an error during alignment: ${error}`);
  }
}
