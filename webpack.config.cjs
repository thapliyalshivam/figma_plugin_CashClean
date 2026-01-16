const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    code: "./src/code.ts",
    ui: "./src/ui/index.tsx"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "ui.html",
      template: "src/ui/template.html",
      chunks: ["ui"],
      cache: false,
      inject: "body"
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/])
  ],
  mode: "development",
  devtool: "inline-source-map"
};


