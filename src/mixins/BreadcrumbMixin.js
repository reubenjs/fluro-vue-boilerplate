// import RouterHistory from '../router/history';


// console.log('BREADCRUMB MIXIN', RouterHistory);

const pathToRegexp = require('path-to-regexp')



export default {
    // props:{
    // 	breadcrumb:{
    // 		type:Array,
    // 		default() {
    // 			return [];
    // 		}
    // 	}
    // },
    // created() {

    // 	var self = this;

    //     self.$watch(
    //         function() {
    //            	return RouterHistory.breadcrumb;
    //         },
    //         function(newVal, oldVal) {
    //         	console.log('BREADCRUMB CHANGE')
    //             this.breadcrumb = RouterHistory.breadcrumb;
    //         }
    //     )
    // },
    asyncComputed: {
        breadcrumb: {
        	default:[],
            get() {
                

                // var breadcrumb = RouterHistory.breadcrumb && RouterHistory.breadcrumb.length ? RouterHistory.breadcrumb[0].matched : [];
                
                // var breadcrumb = [];


                // ////////////////////////////////////////

                // function findParent(route, trail) {

                // 	console.log('FIND PARENT', route)
                // 	if(route.parent) {
                // 		findParent(route.$parent, trail);
                // 	}

                // 	trail.push(route);
                // }

                // ////////////////////////////////////////

                // findParent(this.$route, breadcrumb);

                // // this.$route.matched.slice(-1);
                // // RouterHistory.breadcrumb && RouterHistory.breadcrumb.length ? RouterHistory.breadcrumb[0].matched : [];

                // console.log('Got the breadcrumb!', breadcrumb)
                // return [{title:'hello', route:'home'}];
                

                /**
                //
                var path = this.$route.path;
                var pieces = path.split('/').map((_, i, arr) => arr.slice(0, i + 1).join("/") || "/");
                var routesHash = _.reduce(this.$router.options.routes, function(set, route) {
                    set[route.path] = route;
                    return set;
                },{});

                console.log('ROUTES MATCH', this.$router.matcher, this.$router.matcher.match(path, path));
                console.log('ROUTES HASH', routesHash);

                // var breadcrumb = _.map(pieces, function(piece) {
                //     return routesHash[piece];
                // });
                var breadcrumb = [];

                // console.log('Breadcrumb', breadcrumb);

                // var breadcrumb = _.map(pieces, function(routePath) {
                //     return
                // })

                /**/

                var self = this;
                var fullPath = this.$route.path;

                var pieces = fullPath.split('/').map((_, i, arr) => arr.slice(0, i + 1).join("/") || "/");


                

                // console.log('PIECES', pieces);
                var allMatched = _.chain(this.$router.options.routes)
                .filter(function(route) {

                    var matches = _.some(pieces, function(piece) {
                        let regexp = pathToRegexp(route.path);
                        var tested = regexp.exec(piece)
                        return tested;
                    })
                    return matches


                    // return _.some(pieces, function(piece) {
                    //     let regexp = pathToRegexp(piece);
                    //     var tested = regexp.exec(piece)

                    //     console.log('TEST', tested, piece);
                    //     return tested.length == pieces.length;
                    // })

                //     var routePath = route.path;
                //     var pieces = routePath.split('/').map((_, i, arr) => arr.slice(0, i + 1).join("/") || "/");

                //     let regexp = pathToRegexp(fullPath);

                //    _.each(pieces, function(piece) {
                //        console.log(regexp.exec(piece), piece, fullPath)
                //    })

                //     // var regexp = pathToRegexp(href)
                //     // var pieces = route.path.split('/').map((_, i, arr) => arr.slice(0, i + 1).join("/") || "/");
                //     // console.log('ROUTE', route.name);
                //     // var matches = _.filter(pieces, function(piece) {
                //     //     var tested = regexp.exec(piece)
                //     //     return tested;
                //     // });


                //     // if(matches.length) {
                //     //     return {
                //     //         route,
                //     //         matches,
                //     //     }
                //     // }
                    
                //     // var test = self.$router.match(this.$router.fullPath, route);
                //     // // var test = route.match(href);

                //     // // var test;
                //     // console.log('TESt', test, route.path);
                //     // return test;
                })
                .value()
                .slice(0, -1);
                
                // console.log('MATCHED', pieces, allMatched)
                 var breadcrumb = allMatched;//[];// this.$route.matched.slice(0, -1);

               	return Promise.resolve(breadcrumb);

            },
        }
    },
    // created() {

    // 	this.breadcrumbTrail.push({
    // 		name:this.$route.name,
    // 		value:this.$route.name,
    // 	})
    // }
}