import { mapGetters, mapMutations } from 'vuex';
import PhotoThumbnail from '@/components/PhotoThumbnail.vue';
import Photo from '@/components/Photo.vue';
// import InfiniteScroll from '@/components/InfiniteScroll.vue';
import PagedContent from '@/components/PagedContent.vue';



// define a mixin object
export default {

    props: {
        currentPage: {
            type: Number,
            default: 1,
        },
        photo: {
            type: String,
        }
    },
    components: {
        photo: Photo,
        thumbnail: PhotoThumbnail,
        // infiniteScroll:InfiniteScroll,
        pagedContent: PagedContent,
    },
    data() {
        return {
            item: null,
            meta: null,
            images: [],
            loaded: false,
        }
    },
    computed: {
        definition() {
            return this._.get(this, 'item.definition');
        },
        ...mapGetters([
            'user',
            'accessToken',
            'refreshToken',
        ]),
    },
    created() {
        console.log('CREATED!')

       
        this.routeChanged();
    },
    watch: {
        // call again the method if the route changes
        '$route.params.id': 'routeChanged'
    },
    methods: {
        next() {
            var self = this;
            var photoID = self.photo;

            var currentIndex = self._.findIndex(self.images, { _id: photoID });
            var total = self.images.length;
            var targetIndex = currentIndex + 1;

            ///////////////////////////////////////////

            if (targetIndex >= total) {
                targetIndex = 0;
            }

            var target = self.images[targetIndex];

            if (target) {
                self.view(target);
            }

        },
        previous() {

            var self = this;
            var photoID = self.photo;

            var currentIndex = self._.findIndex(self.images, { _id: photoID });
            var total = self.images.length;
            var targetIndex = currentIndex - 1;

            ///////////////////////////////////////////

            if (targetIndex < 0) {
                targetIndex = total - 1;
            }

            var target = self.images[targetIndex];

            if (target) {
                self.view(target);
            }

        },
        pageChanged(index) {
            var self = this;
            
            this.$router.push({ query: Object.assign({}, this.$route.query, { page: index }) });

            
            // this.$router.push({query:{
            //     page:index
            // }})
        },
        view(image) {

            console.log('view photo', image)
            var params = {
                query: {
                    photo: image._id,
                    page: this.$route.query.page,
                }
            }

            if (this.$route.query.photo) {
                this.$router.replace(params);
            } else {
                this.$router.push(params);
            }

        },
        // view(image) {

        //     console.log('VIEW THE IMAGE PLEASE!!')
        //     var params = {
        //         query: {
        //             photo: image._id,
        //             page: this.$route.query.page,
        //         }
        //     }

        //     if(this.$route.query.photo) {
        //         this.$router.replace(params);
        //     } else {
        //         this.$router.push(params);
        //     }

        // },
    }
}