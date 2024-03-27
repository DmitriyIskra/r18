const path = require('path')
const webpack = require('webpack');
const miniCss = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devServer: {
        port: 8800,
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: 'js/main.js',
        assetModuleFilename: (data) => {
            return `${/^.*content\.(png|jpg|jpeg|gif)$/i.test(data.filename) ? (
              `img/content/[name][ext]`
            ) : 
            /\.(mov)$/i.test(data.filename) ? (
              `video/[name][ext]`
            ) : 
            /^.*icon\.(png|jpg|jpeg|gif)$/i.test(data.filename) ? (
              `img/icon/[name][ext]`
            ) : 
            /\.(svg)$/i.test(data.filename) ? (
              `svg/[name][ext]`
            ) : 
            (
              `img/[name][ext]`
            ) }`
        }, // [name] или [hash], путь куда сохранять изображения
        clean: true, // очищает папку dist
    },
    module: {
        rules: [
            {
              test: /\.(png|jpg|jpeg|gif|svg|mov|mpeg4)$/i,
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
        }),
        new CopyWebpackPlugin({
          patterns: [  
            { from: 'src/img/content/espresso-colombia-andino-content.png', to: 'img/content' },
            { from: 'src/img/content/espresso-colombia-excelso-decaf-content.png', to: 'img/content' },
            { from: 'src/img/content/espresso-guatemala-blue-ayarsa-content.png', to: 'img/content' },
            { from: 'src/img/content/espresso-honduras-otilo-garsias-content.png', to: 'img/content' },
            { from: 'src/img/content/espresso-kenya-anfdb-kibendo-content.png', to: 'img/content' },
            { from: 'src/img/content/filter-burundi-muranga-content.png', to: 'img/content' },
            { from: 'src/img/content/filter-columbia-punch-content.png', to: 'img/content' },
            { from: 'src/img/content/filter-ethiopia-banko-gotete-content.png', to: 'img/content' },
            { from: 'src/img/content/drip-pack.png', to: 'img/content' },
            

            { from: 'src/img/content/t-shirt-white-1-front_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-white-1-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-black-1-front_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-black-1-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/t-shirt-white-2-front_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-white-2-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-black-2-front_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-black-2-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/t-shirt-white-3-front_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-white-3-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-black-3-front_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-black-3-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/t-shirt-white-4-front_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-white-4-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-black-4-front_content.png', to: 'img/content' },
            { from: 'src/img/content/t-shirt-black-4-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/hoodies-black-1-front_content.png', to: 'img/content' },
            { from: 'src/img/content/hoodies-black-1-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/hoodies-black-2-front_content.png', to: 'img/content' },
            { from: 'src/img/content/hoodies-black-2-rear_content.png', to: 'img/content' },


            { from: 'src/img/content/serviette-white-1-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-white-1-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-1-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-1-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/serviette-white-2-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-white-2-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-2-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-2-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/serviette-white-3-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-white-3-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-3-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-3-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/serviette-white-4-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-white-4-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-4-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-4-rear_content.png', to: 'img/content' },

            { from: 'src/img/content/serviette-white-5-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-white-5-rear_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-5-front_content.png', to: 'img/content' },
            { from: 'src/img/content/serviette-black-5-rear_content.png', to: 'img/content' },
          ],
        }),
    ]
}