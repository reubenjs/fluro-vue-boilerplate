import _ from 'lodash';
import UserMixin from './UserMixin';

var cached;

export default {
    mixins: [UserMixin],
    head: {
        title: function() {
            var seoTitle = this.seoTitle;

            return {
                separator: '-',
                inner: seoTitle,
            }
        },
        meta: function() {
            return this.seoMeta;
        },
    },

    //Include the current user and the application
    //so we can use the variables in our head tags
    computed: {
        //Your default SEO Page Title
        seoTitle() {
            return _.get(this.$router, 'currentRoute.meta.title');
        },
        //Your default SEO Meta tags
        //this should be overridden on each of your routes
        seoMeta() {

            var self = this;

            ///////////////////////////////////////////////////

            var pieces = [];

            ///////////////////////////////////////////////////

            //Get the page title
            var title = _.compact([
                _.get(self, '$route.meta.title'),
                _.get(self, 'application.title'),
                process.env.VUE_APP_TITLE,
            ])[0];


            ///////////////////////////////////////////////////

            //Get the description
            var description = _.compact([
                _.get(self, '$route.meta.description'),
                _.get(self, 'application.description'),
                process.env.VUE_APP_DESCRIPTION
            ])[0];

            ///////////////////////////////////////////////////

            //Get the image defined on the route
            var routeImageURL = _.get(self, '$route.meta.image');
            var iconImageURL = `${this.$fluro.domain}/fluro/image?w=600`;
           
            ///////////////////////////////////////////////////

            //Get the best match for an image
            var imageURL = routeImageURL || iconImageURL;

           
            ///////////////////////////////////////////////////

            pieces.push({ name: 'application-name', content: title });
            pieces.push({ name: 'twitter:title', content: title });
            pieces.push({ property: 'og:title', content: title });

            if (description && description.length) {
                pieces.push({ name: 'og:description', content: description });
                pieces.push({ name: 'description', content: description });
                pieces.push({ name: 'twitter:description', content: title });
            }

            pieces.push({ property: 'fb:app_id', content: '387340101438406' });
            pieces.push({ property: 'og:type', content: 'website' });
            pieces.push({ property: 'og:url', content: window.location.href });
            pieces.push({ property: 'og:image', content: imageURL });

            ///////////////////////////////////////////////////

            return pieces;


        },
    }
}