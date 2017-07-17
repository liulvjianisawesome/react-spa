const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3001',
      'webpack/hot/only-dev-server',
      './src/index.js',
    ],
  },

  output: {
    filename: '[name].js',
    publicPath: '/',
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  resolve: {
    alias: { _: path.join(__dirname, 'src') },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['es2015', { 'modules': false }],
              'react',
            ],
            plugins: [
              'react-hot-loader/babel',
              'react-require',
              'transform-object-rest-spread',
            ],
          },
        },
      },

      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },

          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]-[local]',
            },
          },

          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  autoprefixer,
                ]
              },
            },
          },

          {
            loader: 'sass-loader',
          },
        ],
      },

      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
}
