const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");

require("dotenv").config();

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    code: "./src/code.ts",
    ui: "./src/ui/index.tsx"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
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
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/inline"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __GEMINI_API_KEY__: JSON.stringify(process.env.GEMINI_API_KEY || ""),
    }),
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


