const path = require('path')
const merge = require("webpack-merge");
const webpack = require("webpack");

let commonConfig = require('./webpack.comm.config.js');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: '#source-map',
  devServer:{
    contentBase: path.join(__dirname, "../build"),
    host: 'phone.jcfyht.cc',
    open: true,
    port: 20002,
    hot: true
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ]
})
