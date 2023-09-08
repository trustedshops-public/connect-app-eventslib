const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = ({ development }) => ({
  entry: "./src/eventsLib.ts",
  devtool: development ? "cheap-module-source-map" : false,
  mode: development ? "development" : "production",
  output: {
    filename: "eventsLib.js",
    path: path.resolve(__dirname, "dist"),
    library: "eventsLib",
    libraryExport: "default",
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: "typeof self === 'undefined' ? this : self",
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({ extensions: ["ts"] }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  optimization: {
    minimize: !development,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            drop_console: true, 
          },
        },
      }),
    ],
  },
  cache: {
    type: "filesystem",
  },
});
