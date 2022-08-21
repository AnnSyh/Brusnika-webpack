const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

module.exports = {
  entry: {
    index: './src/index.js', 
    brand: './src/brand.js',
    card: './src/brand.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    publicPath: '',
  },
  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    compress: true,
    port: 8080
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
      exclude: '/node_modules/'
    },
    {
      test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'images/[name].[hash][ext]',
      }
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        }
      },
        'postcss-loader'
      ]
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        "style-loader",
        // Translates CSS into CommonJS
        "css-loader",
        // Compiles Sass to CSS
        "sass-loader",
      ],
    },
    {
      test: /\.pug$/,
      use: [
        {
          loader: 'simple-pug-loader'
        }
      ]
    }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      path: path.resolve(__dirname, 'src/js/plugins'),
      $: 'jquery',
      jQuery: 'jquery',
    }),

    new HtmlWebpackPlugin({
      template: './src/index.pug',
      chunks: ['index'],
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/brand.pug',
      chunks: ['brand'],
      filename: 'brand.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/card.pug',
      chunks: ['card'],
      filename: 'card.html',
    }),



    

    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),

  ]
} 