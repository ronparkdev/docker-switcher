const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')
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
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new CopyPlugin({
        patterns: [{ from: path.resolve(__dirname, 'images') }],
      }),
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json'),
      }),
    ],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'electron.js',
  },
  stats: 'verbose',
}
