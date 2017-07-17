const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    app: './src/index.js',
  },

  output: {
    path: path.join(__dirname, '/build'),
    filename: '[name].js',
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },

  plugins: [
    // webpack2 需要设置 LoaderOptionsPlugin 开启代码压缩
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    // Uglify的配置
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
      },
    }),
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
