var HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
   // devtool: "source-map",

    //   entry: "./src/scripts/app.js", //relative to root of the application
    //  output: {
    //     filename: "./dist/app.bundle.js" //relative to root of the application
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "assets", to: "assets" },
            ],
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: './index.html', //relative to root of the application,
            title: 'some title'
        })
    ],

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        //   namedModules: false,
        moduleIds: 'size'
    },

    watchOptions: {
        ignored: /\.#|node_modules|~$/,
    }

}
/*
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: `ELS`
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        namedModules: false,
        moduleIds : 'size'
    },
    watchOptions: {
        ignored: /\.#|node_modules|~$/,
    }
}*/