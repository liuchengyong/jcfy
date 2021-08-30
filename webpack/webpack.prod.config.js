const path = require('path')
const merge = require("webpack-merge");
const webpack = require("webpack");

let commonConfig = require('./webpack.comm.config.js');

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: '#source-map',
  plugins:[

  ]
})
