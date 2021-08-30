const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

let packageJson = require("../package.json");

module.exports = {
  entry:{
    index: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../build/'),
    publicPath: '/',
    filename: `js/[name].${packageJson.version}.js`
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    },{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },{
      test: /\.(png|jpg|gif|svg)$/i,
      loader: 'url-loader',
      options: {
        esModule: false,
        limit: 1024,
        name: 'images/[name].[ext]'
      }
    },{
      test: /\.sass$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            indentedSyntax: true,
            sassOptions: {
              indentedSyntax: true
            }
          }
        }
      ]
    },{
      test: /\.scss$/,
      use: [
        // 'vue-style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              require('autoprefixer')(),
            ]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            resources: path.resolve(__dirname, '../src/styles/_variable.scss'),
          }
        }
      ]
    },{
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    },{
      test: /\.(ttf|woff)$/,
      loader: 'file-loader',
    }]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: true,
      cleanOnceBeforeBuildPatterns: ['!dll*'],
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/[name].${packageJson.version}.css`
    }),
    new HtmlWebpackPlugin({
      title: '京西找房',
      filename: 'index.html',
      template: 'start.ejs',
      chunks: ['index'],
      chunksSortMode: 'manual',
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      },
    }),
    new FriendlyErrorsPlugin(),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '../'),
      manifest: require('../build/dll/vue.manifest.json'),
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '../'),
      manifest: require('../build/dll/vendor.manifest.json'),
    })
  ],
}
