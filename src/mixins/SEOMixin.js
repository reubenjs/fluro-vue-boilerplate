import { mapGetters, mapMutations } from 'vuex';
import _ from 'lodash';


var cached;

export default {
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
            return [
                { name: 'application-name', content: 'Name of my application' },
                { name: 'description', content: 'A description of the page', id: 'desc' },
                // ...
                // Twitter
                { name: 'twitter:title', content: 'Content Title' },
                // with shorthand
                { n: 'twitter:description', c: 'Content description less than 200 characters' },
                // ...
                // Google+ / Schema.org
                { itemprop: 'name', content: 'Content Title' },
                { itemprop: 'description', content: 'Content Title' },
                // ...
                // Facebook / Open Graph
                { property: 'fb:app_id', content: '123456789' },
                { property: 'og:title', content: 'Content Title' },
                // with shorthand
                { p: 'og:image', c: 'https://example.com/image.jpg' },
                // ...
            ]
        },
        ...mapGetters([
            'user',
            'application',
        ]),
    }
}