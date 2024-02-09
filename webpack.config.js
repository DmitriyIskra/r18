const path = require('path')
const webpack = require('webpack');
const miniCss = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    devServer: {
        port: 8800,
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: 'js/main.js',
        assetModuleFilename: (data) => {
            console.log(data.filename)
            return `${/^.*content\.(png|jpg|jpeg|gif)$/i.test(data.filename) ? (
              `img/content/[name][ext]`
            ) : /\.(svg)$/i.test(data.filename) ? (
              `svg/[name][ext]`
            ) : (
              `img/[name][ext]`
            ) }`
        }, // [name] или [hash], путь куда сохранять изображения
        clean: true, // очищает папку dist
    },
    module: {
        rules: [
            {
              test: /\.(png|jpg|jpeg|gif|svg)$/i,
              type: 'asset/resource',
            }, {
                test: /\.css$/, // /\.(s*)css$/
                use: [
                    miniCss.loader, 'css-loader', // sass-loader,
                ],
            }, {
                test: /\.html$/,
                use: [
                  {
                    loader: 'html-loader',
                    options: {
                      minimize: false,  // отключаем минификацию html
                    },
                  },
                ],
            }, {
              test: /\.(woff|woff2|eot|ttf|otf)$/i,
              type: 'asset/resource',
              generator: {
                filename: 'fonts/[name][ext]',  // указываем путь сборки
              }
            }, {
                test: /\.pug$/,
                // loader: 'pug-loader',
                exclude: /(node_modules|bower_components)/,
                use:[
                  {
                    loader: 'pug-loader', // чтобы нормально подтягивало картинки и собирало
                    options: {
                      exports: false,
                      pretty : true,  // не минифицировать
                    }
                  }
                  
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            // title: '....' // здесь можно указать title конкретной страницы
            template: './src/pug/index.pug',
            filename: './index.html',   // куда компилировать
            minify: {
              html: false // отключаем минификацию html, еще есть версия minify: false
            },
            scriptLoading: 'blocking', // defer | module. можно также указать inject: 'body' скрипт будет в конце body но с defer
        }),
        new miniCss({
            filename: 'css/style.css',
        })
    ]
}