const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ENV = process.env.NODE_ENV

const styleRule = {
  loader: 'style-loader'
}

const cssModuleRule = {
  loader: 'css-loader',
  options: {
    modules: {
      context: __dirname,
      localIdentName: '[folder]-[local]-[hash:base64:5]'
    }
  }
}

const cssRule = {
  loader: 'css-loader',
  options: {
    import: true
  }
}

const postCssRule = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: [
      require('postcss-import')(),
      require('autoprefixer')()
    ]
  }
}

const scssRule = {
  loader: 'sass-loader'
}

const lessRule = {
  loader: 'less-loader',
  options: {
    javascriptEnabled: true
  }
}

const jsRule = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: '.cache'
  }
}

const staticRule = [{
  test: /\.(ttf|eot|woff)/,
  use: {
    loader: 'file-loader',
    options: {
      name: 'font/[name]-[hash:16].[ext]'
    }
  },
  exclude: /node_modules/
},
{
  test: /\.(png|jpg|gif|svg)$/,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 8192,
      name: 'assets/[name]-[hash:16].[ext]'
    }
  }]
}]

module.exports = {
  mode: ENV,
  entry: {
    renderer: './src/renderer'
  },
  output: {
    path: path.resolve(__dirname, '..', 'app', 'dist'),
    filename: '[name].js'
  },
  target: 'electron-renderer',
  context: path.resolve(__dirname, '..'),
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '.sass', '.less', '.json']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      title: '',
      template: './template.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: jsRule
      },
      {
        test: /\.css$/,
        use: [styleRule, cssRule, postCssRule]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [styleRule, cssModuleRule, postCssRule, scssRule]
      },
      {
        test: /\.less$/,
        use: [styleRule, cssRule, postCssRule, lessRule]
      },
      ...staticRule
    ]
  }
}
