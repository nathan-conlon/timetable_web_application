const path = require("path");

module.exports = {
  mode: "development", // or 'production'
  entry: {
    getExcelFile: "./getExcelFile.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
