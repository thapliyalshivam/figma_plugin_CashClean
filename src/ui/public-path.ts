/**
 * Set webpack public path before any other code runs.
 * Required for Figma plugin UI where automatic publicPath is not supported.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__webpack_public_path__ = "";
