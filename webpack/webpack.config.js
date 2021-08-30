var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var autoprefixer = require('autoprefixer');
var config = require('./package.json');

var webpackConfig = {
  entry:{
    index: './src/index.js',
    vue: ['vue','vue-router','vuex'],
    vendor: ['weixin-jsapi', 'axios','vue-awesome-swiper']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },{
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: 'images/[name].[ext]'
      }
    }]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
};
if (process.env.NODE_ENV === 'development') {
  webpackConfig.output = {
    path: path.resolve(__dirname, './dist/'),
    publicPath: '',
    filename: 'js/[name].js'
  };
  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      postcss: [require('autoprefixer')()],
      loaders: {
        'scss': ['vue-style-loader', {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        }, 'sass-loader', {
          loader: 'sass-resources-loader',
          options: {
            resources: './src/styles/_variable.scss',
          },
        }],
        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
        'css' : 'vue-style-loader!css-loader'
      }
    }
  });
  webpackConfig.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vue','vendor'],
    }),
    new HtmlWebpackPlugin({
      title: '京西找房',
      filename: 'index.html',
      template: 'start.ejs',
      inject: true
    }),
  ];
}






//  ========================  生产环境  ===============================
//
if (process.env.NODE_ENV === 'production') {
  webpackConfig.devtool = '#source-map';
  webpackConfig.output = {
    path: path.resolve(__dirname, './dist/'),
    publicPath: '',
    filename: `js/[name].${config.version}.js`
  };
  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      postcss: [require('autoprefixer')()],
      loaders: {
        'scss': ExtractTextPlugin.extract({
          use: 'css-loader!sass-loader',
          fallback: 'vue-style-loader',
          publicPath:'../'
        }),
      }
    }
  });
  webpackConfig.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vue','vendor'],
    }),
    new ExtractTextPlugin({filename: `css/style.${config.version}.css`}),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new HtmlWebpackPlugin({
      title: '京西找房',
      filename: 'index.html',
      template: 'start.ejs',
      inject: true,
      minify: {
        "caseSensitive": false,
        "collapseBooleanAttributes": true,
        "collapseInlineTagWhitespace": false,
        "collapseWhitespace": true,
        "html5": true,
        "removeComments": true,
        "removeEmptyAttributes": true
      },
      chunksSortMode: 'dependency'
    })
  ]
}

module.exports = webpackConfig;
