// Type definitions for plugin messages

export type PluginMessage = {
  type:
    | "create-rectangles"
    | "close-plugin"
    | "option1-action"
    | "option2-action"
    | "label-action";
};
