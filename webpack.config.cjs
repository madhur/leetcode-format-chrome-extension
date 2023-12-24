// webpack.config.js

const path = require('path');

module.exports = {
    entry: {
        background: './src/background.js',
        options: './src/options.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
        ],
    },
};