const webpack = require('webpack')
const resolve = require('path').resolve
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const frontend = {
  target:'web',
  entry:{
    'index':'index.js',
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './../dist/')
  },
  context: path.join(__dirname, './../'),
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'package.json' }
            ]
        })
    ]
}

const backend = {
    target: 'node',
    mode:'production',
    node: {
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()],
    plugins : [
        new webpack.ContextReplacementPlugin(
          /express\/lib/,
          resolve(__dirname, '../node_modules'),
          {
            'ejs': 'ejs'
          }
        )
      ],
    stats : {
        warningsFilter: /require\.extensions/
    }
}
