const path = require('path')
const webpack = require("webpack");

module.exports = {
  entry:{
    vue: ['vue/dist/vue.esm.js','vue-router','vuex'],
    vendor: ['weixin-jsapi', 'axios','vue-awesome-swiper']
  },
  output:{
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../build/dll/'),
    library: '[name]'
  },
  plugins:[
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(__dirname, '../build/dll/', '[name].manifest.json'),
      context: path.resolve(__dirname, '../'),
    })
  ]
}
