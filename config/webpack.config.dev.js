var helpers = require("./helpers"),
    DefinePlugin = require("webpack/lib/DefinePlugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin");

var config = {
    entry: {
        "main": helpers.root("/src/ui/app/main.ts")
    },
    output: {
        path: helpers.root("/dist"),
        filename: "js/[name].[hash].js"
    },
    devtool: "inline-source-map",
    resolve: {
        extensions: [".ts", ".js", ".json"],
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                enforce: "pre",
                loader: "tslint-loader"
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader",
                query: {
                    configFileName: "src/ui/app/tsconfig.json",
                },
            },
            {
                test: /\.html$/,
                loader: "raw-loader",
                exclude: ["./src/index.html"]
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            "process.env": {
                "ENV": JSON.stringify(process.env.NODE_ENV),
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: helpers.root("/src/ui/app/index.html"),
            // favicon: helpers.root("/src/favicon.ico")
        })
    ],
};

module.exports = config;
