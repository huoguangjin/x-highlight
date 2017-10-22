const path = require('path');

module.exports = {
  entry: [
    './js/main.js',
    './js/preview.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    overlay: {
      errors: true,
      warnings: true
    }
  },
  module: {
    loaders: [{
      test: path.resolve(__dirname, 'js'),
      loader: 'babel-loader',
      query: {
        presets: ["env"]
      }
    }]
  }
};
