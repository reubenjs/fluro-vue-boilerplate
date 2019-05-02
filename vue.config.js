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
switch(process.env.NODE_ENV) {
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
// runtimeCompiler: true,
	 chainWebpack: config => config.resolve.symlinks(false),
	configureWebpack: {
		plugins: [
            new webpack.ProvidePlugin({
                _: "lodash",
            })
        ],
		module:{
			
			rules:[
				{
					
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
	}
}
    // plugins: [
    //   new webpack.ProvidePlugin({
    //     _: "underscore"
    // })
    // ]
  // }





// module.exports = {
	// chainWebpack: function(config) {

	// 	config
	// 	.plugin('html')
	// 	.tap(function(opts) {

	// 		opts.loader = 'ejs-loader';

	// 		// module.rules = [{
	// 		//     test: /\.html/,
	// 		//     loader: 'ejs-loader',
	// 		//     query: {
	// 		//         interpolate: /<\$=([\s\S]+?)\$>/g,
	// 		//         evaluate: /<\$([\s\S]+?)\$>/g,
	// 		//     }
	// 		// }


	// 	});
	// }
		// 	module.rules = [{
		//     test: /\.html/,
		//     loader: 'ejs-loader',
		//     query: {
		//         interpolate: /<\$=([\s\S]+?)\$>/g,
		//         evaluate: /<\$([\s\S]+?)\$>/g,
		//     }
		// }


//         // if (process.env.NODE_ENV === 'production') {
//             config.plugin('html').tap((opts) => {

//             	console.log('TEMPLATE OPTIONS', opts[0]);
//                 // opts[0].filename = './dist/dapp.html';
//                 return opts;
//             });
//         // }
//      },
// };





// module.exports = {
// config
// }



// configureWebpack: {
    // plugins: [
//       new MyAwesomeWebpackPlugin()
//     ]
//   }



// vue.config.js
// module.exports = {
//     chainWebpack: function(config) {
        
//         config
//             .plugin('html')
//             .tap(args => {
//                 return [{
//                     'meta': {
//                         'Content-Security-Policy': {
//                             'http-equiv': 'Content-Security-Policy',
//                             'content': 'default-src https:',
//                         },
//                         'example':'testing',
//                         // 		      // Will generate: <meta http-equiv="Content-Security-Policy" content="default-src https:">
//                         // 		      // Which equals to the following http header: `Content-Security-Policy: default-src https:`
//                         // 		      'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
//                         // 		      // Will generate: <meta http-equiv="set-cookie" content="value; expires=date; path=url">
//                         // 		      // Which equals to the following http header: `set-cookie: value; expires=date; path=url`
//                     }
//                 }]
//             })
//     }
// }