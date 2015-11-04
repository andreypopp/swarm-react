module.exports = {
  entry: './browser.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel?stage=0'}
    ]
  }
};
