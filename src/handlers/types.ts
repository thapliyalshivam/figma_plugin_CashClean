// Type definitions for plugin messages

export type PluginMessage = {
  type:
    | "create-rectangles"
    | "close-plugin"
    | "option2-action"
    | "label-action"
    | "option4-action"
    | "option5-action"
    | "copyanddes-action"
    | "loose-point-action";
  style?: "fill" | "stroke";
  /** Document content (pasted from Google Doc). Required if URL fetch fails. */
  docContent?: string;
  /** Optional Google Doc URL to try to fetch content from. */
  docUrl?: string;
};
