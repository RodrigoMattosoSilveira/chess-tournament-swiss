const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const {
    NODE_ENV = 'production',
} = process.env;
module.exports = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    target: 'node',
    watch: NODE_ENV === 'development',
    externals: [ nodeExternals() ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    plugins: [
        new NodemonPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ]
            }
        ]
    },
}
