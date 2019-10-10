const Base = require('./renderer-base')
const merge = require('webpack-merge')

const devServer = {
  port: 8111,
  hot: false,
  inline: false
}

module.exports = merge(Base, {
  devServer,
  devtool: 'eval-source-map'
})
