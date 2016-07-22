var webpack = require('webpack');
var config = require('./webpack.base.config.js')

module.exports = Object.assign({}, config, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
});
