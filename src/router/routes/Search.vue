
<template>
    <div>
      <transition name="slide-right">
       <photo v-if="photo" :id="photo" @next="next" @previous="previous" ></photo>
   </transition>


   <v-container fluid class="page-header" v-if="keywords.length">

    <!-- <div> -->
        <!-- <v-btn icon @click="previousPage()">
            <font-awesome-icon :icon="['far', 'arrow-left']" />
        </v-btn>

        <v-btn icon @click="nextPage()">
            <font-awesome-icon :icon="['far', 'arrow-right']" />
        </v-btn> -->
    <!-- </div> -->
    
    <h1>Searching <span class="text-muted">// {{keywords}}</span></h1>
    <div v-if="loaded">Found {{images.length}} images</div>
    <div v-if="!loaded">
        <v-progress-circular indeterminate></v-progress-circular>
        <div>Finding results...</div>
    </div>
</v-container>

<v-container fluid class="page-header" v-if="!keywords.length">
    <h1>Search</h1>
    <div>
        Please type some keywords to continue
    </div>
</v-container>



<div v-if="loaded">
    <v-container fluid grid-list-md>
        <paged-content :items="images" :startPage="currentPage" @change="pageChanged" :per-page="48">
            <template slot-scope="props">
                <v-layout row wrap>
                    <v-flex d-flex @click="view(image)" xs12 sm6 md4 xl2 v-for="image in props.page">
                        <!-- <pre>{{image}}</pre> -->
                        <thumbnail  :image="image"></thumbnail>
                    </v-flex>
                </v-layout>
            </template>

        </paged-content>
    </v-container>
</div>

     <!-- <v-container fluid grid-list-md>
        <infinite-scroll :items="images">

            <template slot-scope="props">
                <v-layout row wrap>
                    <v-flex d-flex @click="view(item)" xs12 sm6 md4 lg2 xl2 v-for="item in props.page">
                        <thumbnail  :image="item"></thumbnail>
                    </v-flex>
                </v-layout>
            </template>

        </infinite-scroll>
    </v-container> -->



</div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
import Photo from '@/components/Photo.vue';
import PhotoThumbnail from '@/components/PhotoThumbnail.vue';
// import InfiniteScroll from '@/components/InfiniteScroll.vue';
import PagedContent from '@/components/PagedContent.vue';
import SEOMixin from '@/mixins/SEOMixin';


export default {
    mixins:[SEOMixin],
	props:{
        keywords:{
            type:String,
        },
        photo:{
            type:String,
        }
    },
    components:{
        photo:Photo,
        thumbnail:PhotoThumbnail,
        pagedContent:PagedContent,
    },
    data() {

        return {
        	currentPage:parseInt(this.$route.query.page) || 1,
            images:[],
            loaded:false,
        }
    },
    watch:{
        'keywords':'search',
    },
    created() {
        this.search()
    },
    computed:{
        ...mapGetters([
            'user',
            ]),
    },
    methods:{
        // nextPage() {

        //     console.log('Next Page');
        //     var total = this.total; 
        //     this.currentPage < total ? this.currentPage++ : this.currentPage = total;
        // },
        // previousPage() {

        //     console.log('Previous Page');
        //     var total = this.total;             
        //     this.currentPage > 1 ? this.currentPage-- : this.currentPage = 1;
        // },
        total() {
            return this.images.length;
        },
    	// next() {
     //        var self = this;
     //        var photoID = self.photo;

     //        var currentIndex = self._.findIndex(self.images, {_id:photoID});
     //        var target = self.images[currentIndex+1];
     //        if(target) {
     //            self.view(target);
     //        }

     //    },
     //    previous() {
     //        var self = this;
     //        var photoID = self.photo;

     //        var currentIndex = self._.findIndex(self.images, {_id:photoID});
     //        var target = self.images[currentIndex-1];
     //        if(target) {
     //            self.view(target);
     //        }

     //    },
        // pageChanged(index) {
        //     this.currentPage = index;
        //     this.$router.push({query:{
        //         page:index,
        //         keywords:this.keywords,
        //     }})
        // },

        // view(image) {

        //     var params = {
        //         query: {
        //             photo: image._id,
        //             page: this.$route.query.page,
        //         }
        //     }

        //     if (this.$route.query.photo) {
        //         this.$router.replace(params);
        //     } else {
        //         this.$router.push(params);
        //     }

        // },

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
            console.log('Next', self, self.images, total, targetIndex, target);

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
            console.log('Previous', self.images, targetIndex, target);
            
            if (target) {
                self.view(target);
            }

        },

        pageChanged(index) {
            this.$router.push({ query: Object.assign({}, this.$route.query, { page: index }) });

            // this.$router.push({query:{
            //     page:index
            // }})
        },
        view(image) {

            // console.log('View', image)
            // var params = {
            //     query: {
            //         photo: image._id,
            //         page: this.$route.query.page,
            //     }
            // }

            if(this.$route.query.photo) {
                // this.$router.replace(params);
                this.$router.replace({ query: Object.assign({}, this.$route.query, { photo: image._id }) });
            } else {
                // this.$router.push(params);
                this.$router.push({ query: Object.assign({}, this.$route.query, { photo: image._id }) });
            }

        },



        search() {

            var self = this;
            self.loaded = false;

            var keywords = this.keywords;
            if(!keywords || !keywords.length) {
                self.images = [];
                self.loaded = true;
                return;
            }

            ///////////////////////////////////////////////

            var criteria = {};

            var promise = this.$fluro.api.get('photos/search/' + keywords, {
                params:criteria,
                cache:false,
            })

            promise.then(function(res) {
                // console.log('GOt the sturffff!', res);
                self.images = res.data;
                self.loaded = true;

            }, function(err) {
                self.images = [];
                console.log('ERROR!', err);
                self.loaded = true;
            })
        }
    }
}



</script>

<style>
</style>
