const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    entry: {
        site:'./src/main/webapp/js/siteUpload.js'
    },
    output: {
        path: path.join(__dirname, 'grails-app/assets/dist/'),
        publicPath: '/assets/',
        filename: '[name]-bundle.js',
        assetModuleFilename: '[name][ext]'
    },
    optimization: {
        splitChunks: {
            chunks:'all',
            // Move all of the libraries into a separate bundle, mainly because
            // the asset pipeline takes a long time to parse and compile the bundle
            // which makes for a poor dev experience.  There may be a way to service this
            // not via the asset pipeline which might be better.
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]|\/vendor-ext\/|\/vendor[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    devtool: 'inline-source-map',
    //mode:"development",
    target: ['web', 'es5'],
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/")
        },
        // add alias for libraries installed via gradle so code can import from grade/*
        // instead of ../../../../grails-app/assets/vendor-ext
        alias:{
            gradle: path.resolve( __dirname, 'grails-app/assets/vendor-ext/' )
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|woff|woff2|ttf)$/i,
                type: 'asset/resource'
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new MiniCssExtractPlugin(),
        new BundleAnalyzerPlugin(),

    ]
};
