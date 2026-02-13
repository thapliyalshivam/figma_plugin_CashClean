// Type definitions for plugin messages

export type PluginMessage = {
  type:
    | "create-rectangles"
    | "close-plugin"
    | "option1-action"
    | "option2-action"
    | "label-action"
    | "option4-action"
    | "option5-action";
  style?: "fill" | "stroke";
};
