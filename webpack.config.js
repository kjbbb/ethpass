var path = require('path');
var webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  devtool: 'eval',
  entry: [
    './src/app'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin()
    //new UglifyJsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.js?$/,
      use: ['babel-loader'],
      //include: path.join(__dirname, 'src')
    }]
  }
};
