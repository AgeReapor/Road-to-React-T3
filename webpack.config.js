const path = require("path");

module.exports = {
  // Pick NODE_ENV if it exists, otherwise use development
  mode: process.env.NODE_ENV ?? "development",

  entry: "./src/entrypoint.jsx",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
};
