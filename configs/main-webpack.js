const path = require('path')
const ENV = process.env.NODE_ENV

module.exports = {
  mode: ENV,
  context: path.resolve(__dirname, '..'),
  entry: {
    main: './src/main'
  },
  output: {
    path: path.resolve(__dirname, '../app'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      }
    ]
  },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false
  }
}
