var config = require('./webpack.base.config.js')

module.exports = Object.assign({}, config, {
  devtool: 'source-map'
});
