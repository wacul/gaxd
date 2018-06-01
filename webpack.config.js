module.exports = {
  entry: {
    "gaxd.source": "./src/source.ts",
    "gaxd.destination": "./src/destination.ts"
  },
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