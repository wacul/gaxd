module.exports = {
  entry: {
    "source": "./src/source.ts",
    "destination": "./src/destination.ts",
    "gaxd": "./src/index.ts"
  },
  // outDir: "dist_browser",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
}