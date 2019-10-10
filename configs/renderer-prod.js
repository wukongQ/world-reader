const Base = require('./renderer-base')
const merge = require('webpack-merge')

module.exports = merge(Base, {
  devtool: 'cheap-source-map'
})
