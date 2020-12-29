const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const terser = new TerserPlugin({
  terserOptions: {
    format: {
      comments: false,
    },
  },
});

module.exports = {
  entry: {
    "excalibur-tiled": "./src/index.ts",
    "excalibur-tiled.min": "./src/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
    ],
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    contentBase: ".",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
    library: ["Extensions", "Tiled"],
    libraryTarget: "umd",
  },
  optimization: {
    minimize: true,
    minimizer: [terser],
  },
  externals: {
    excalibur: {
      commonjs: "excalibur",
      commonjs2: "excalibur",
      amd: "excalibur",
      root: "ex",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./src/**/*.ts",
      },
    }),
  ],
};
