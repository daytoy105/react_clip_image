var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
    //判断当前运行环境是开发模式还是生产模式
const nodeEnv = process.env.NODE_ENV || 'development';
const isPro = nodeEnv === 'production';

console.log("当前运行环境：", isPro ? 'production' : 'development')

var plugins = [
   
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function(module) {
            // 该配置假定你引入的 vendor 存在于 node_modules 目录中
            return module.context && module.context.indexOf('node_modules') !== -1;
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
    }),
    new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    return [require('autoprefixer')];
                }
            }
    }),
    new ExtractTextPlugin('style.css')
]

var app = [
    'babel-polyfill',
    './src/index.js'
]
var publicPath = ''
if (isPro) {
    publicPath = 'build/'
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(nodeEnv)
            }
        }) 
    )
} else {
    publicPath = 'http://localhost:8090/build/'
    app.push('webpack-hot-middleware/client?path=http://localhost:8090/__webpack_hmr&reload=true&noInfo=false&quiet=false')
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(nodeEnv)
            },
            BASE_URL: JSON.stringify('http://localhost:8090'),
        }),
        new webpack.HotModuleReplacementPlugin()
    )
}

module.exports = {
    devtool: false,
    entry: {
        app: app,
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'build'),
        publicPath: publicPath,
        chunkFilename: '[name].js'
    },
    // BASE_URL是全局的api接口访问地址
    plugins,
    // alias是配置全局的路径入口名称，只要涉及到下面配置的文件路径，可以直接用定义的单个字母表示整个路径
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.join(__dirname, './src')
        ],
        alias: {
            'actions': 'actions',
            'components': 'components',
            'css': 'assets/css',
            'js': 'assets/js',
            'images': 'assets/images',
            'reduers': 'src/reduers'
        }
    },
    
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: ['babel-loader'],
            exclude: /node_modules/,
            include: path.join(__dirname, 'src')
        },{
            test: /\.(scss|css)$/,
            use:['style-loader','css-loader','postcss-loader','sass-loader']
        } /*{
            test: /\.(scss|css)$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!postcss-loader!sass-loader',
            })
        }*/, {
            test: /\.(png|jpg|gif|md)$/,
            use: ['file-loader?limit=2048&name=images/[name].[ext]']
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: ['url-loader?limit=10000&mimetype=image/svg+xml']
        }],
    }
};
