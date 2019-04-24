import { mapGetters, mapMutations } from 'vuex';
import PhotoThumbnail from '@/components/PhotoThumbnail.vue';
import PhotographerTeaser from '@/components/teasers/PhotographerTeaser.vue';
import EventTeaser from '@/components/teasers/EventTeaser.vue';
import RealmTeaser from '@/components/teasers/RealmTeaser.vue';
import TagTeaser from '@/components/teasers/TagTeaser.vue';
import KeywordTeaser from '@/components/teasers/KeywordTeaser.vue';
import PagedContent from '@/components/PagedContent.vue';



// define a mixin object
export default {
    props: {
        definition: {
            type: String,
            default: '',
        },
        currentPage: {
            type: Number,
            default: 1,
        },
    },
    components: {
        // photo:Photo,
        thumbnail: PhotoThumbnail,
        // infiniteScroll:InfiniteScroll,
        pagedContent: PagedContent,
        photographerTeaser: PhotographerTeaser,
        eventTeaser: EventTeaser,
        tagTeaser: TagTeaser,
        keywordTeaser: KeywordTeaser,
        realmTeaser: RealmTeaser,
    },
    data() {
        return {
            items: [],
            loaded: false,
            limit: 10000,
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'definitions',
            // 'accessToken',
            // 'refreshToken',
        ]),
        plural() {
            if(this.definition) {
                return this.definitions[this.definition].plural;
            }
        },
        cacheKey() {
            if (this.definition) {
                return `explore.${this.definition}`;
            }

            return 'api';
        },
    },
    watch: {
        // call again the method if the route changes
        '$route': 'routeChanged'
    },

    created() {
        //Load the data when we first exist
        this.fetchData();
    },

    methods: {
        fetchData() {
            // console.log('Fetch data')
        },
        routeChanged() {
            // console.log('Changed route')
            this.fetchData();
        },
        pageChanged(index) {

            this.$router.push({ query: Object.assign({}, this.$route.query, { page: index }) });


            // this.$router.push({query:{
            //     page:index,
            // }})
        },
        //     // view(image) {
        //     //     this.$router.push({
        //     //         query:{
        //     //             photo:image._id, 
        //     //             page:this.$route.query.page,
        //     //         }
        //     //     });
        //     // },
        // getImageUrl(imageObject, width) {
        //     if(!imageObject) {
        //         return;
        //     }

        //     var id = imageObject;
        //     if(id._id) {
        //         id = id._id;
        //     }

        //     if(!width) {
        //         width= 100;
        //     }

        //     var url = `${this.$fluro.api.defaults.baseURL}/get/${id}?&w=${width}&access_token=${this.$store.getters.accessToken}`;

        //     return url;

        // },
    }
}