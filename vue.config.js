process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_TITLE = require('./package.json').title
process.env.VUE_APP_DESCRIPTION = require('./package.json').description

// process.env.VUE_APP_REMOTE_URL = 'https://photos.staging.fluro.io';

//API URLS
process.env.VUE_APP_API_LIVE = 'https://api.fluro.io';
process.env.VUE_APP_API_STAGING = 'https://api.staging.fluro.io';
process.env.VUE_APP_API_LOCAL = 'http://api.fluro.localhost:3000';

///////////////////////////////////////////////////////////

//API URLS
switch (process.env.NODE_ENV) {
    case 'development':
        // process.env.VUE_APP_FLURO_ENV = 'local';
        process.env.VUE_APP_FLURO_ENV = 'staging';
        process.env.VUE_APP_REMOTE_URL = 'https://boilerplate.fluro.io';
        break;
    default:
        process.env.VUE_APP_FLURO_ENV = 'staging';
        process.env.VUE_APP_REMOTE_URL = '';
        break;
}

///////////////////////////////////////////////////////////

var webpack = require('webpack');


///////////////////////////////////////////////////////////

module.exports = {
    runtimeCompiler: true,
    chainWebpack: config => config.resolve.symlinks(false),
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                _: "lodash",
            })
        ],
        module: {

            rules: [{

                    test: /\.html/,
                    loader: 'ejs-loader',
                    query: {
                        interpolate: /<\$=([\s\S]+?)\$>/g,
                        evaluate: /<\$([\s\S]+?)\$>/g,
                        escape: /<\$:([\s\S]+?)\$>/g,
                    }

                    // interpolate: /<\-([\s\S]+?)\>/g, 
                    // evaluate: /<\([\s\S]+?)\>/g, 
                    // escape: /<\\:-(.*?)\:\\>/g,


                },

            ]
        }
    },
}