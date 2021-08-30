const path = require('path')
const merge = require("webpack-merge");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let commonConfig = require('./webpack.comm.config.js');

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: '#source-map',
  plugins:[
    new BundleAnalyzerPlugin()
  ]
})
