const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const buildDirectory = path.resolve(__dirname, 'build');
const isDevelopment = process.env.NODE_ENV !== 'production';

const rules = [
  {
    test: /\.css$/,
    use: [
        //minimize css in prod build to avoid bundling newline chars in js chunk
        { loader: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader },
        { loader: 'css-loader', options: { sourceMap: true} },
        { loader: 'postcss-loader' }
      ]
  },
  {
    test: /\.html$/,
    use: [
      { loader: 'html-loader' },
      {
        loader: 'posthtml-loader',
        options: {
          plugins: [
            require('posthtml-css-modules')('./tmp/module-data.json')
          ]
        }
      }
    ]
  }
];

module.exports = {
  mode: isDevelopment ? 'development' : 'production',

  entry: {
    main: path.resolve(__dirname, 'src/js')
  },

  output: {
    path: buildDirectory,
    filename: 'js/[name].[hash:20].js'
  },

  module: {
    rules: rules
  },

  devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'style/[name].[contenthash:20].css'
    })
  ],

  devServer: {
    host: 'localhost',
    port: 8000,
    disableHostCheck: true,
    inline: true,
    hot: true,
    stats: 'errors-only',
    overlay: true
  },

  stats: 'minimal',

  watchOptions: {
    ignored: /(node_modules)/
  }
};
