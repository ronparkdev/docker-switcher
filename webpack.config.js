const path = require('path')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const phase = process.env.PHASE

module.exports = {
  mode: phase === 'production' ? 'production' : 'development',
  entry: './src/index.ts',
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: 'ts-loader',
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json'),
      }),
    ],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'index.js',
  },
}
