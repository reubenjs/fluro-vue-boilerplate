
<template>
    <div>
      <transition name="slide-right">
       <photo v-if="photo" :id="photo" @next="next" @previous="previous" ></photo>
   </transition>

     <!-- <v-container fluid class="page-header">
         <v-layout row wrap>
            <v-flex d-flex xs12 md8>
                <h1>Latest <span class="text-muted">// Photos</span></h1>

            </v-flex>
            <v-flex d-flex xs12 md4>
                <h1>Recent <span class="text-muted">// Events</span></h1>

            </v-flex>
        </v-layout> -->

        <v-container fluid class="page-header">
            <h1>Latest <span class="text-muted">// Photos</span></h1>
            <!-- <div v-if="loaded">Found {{images.length}} photos</div> -->
            <div v-if="!loaded">
                <v-progress-circular indeterminate></v-progress-circular>
                <div>Loading...</div>
            </div>
        </v-container>

        
        <!-- </v-container> -->


        <div v-if="loaded">


            <v-container fluid grid-list-md>

                <infinite-scroll :items="images">

                    <template slot-scope="props">
                        <v-layout row wrap>
                            <v-flex d-flex @click="view(item)" xs12 sm6 md4 lg3 v-for="item in props.page">
                                <thumbnail  :image="item"></thumbnail>
                            </v-flex>
                        </v-layout>
                    </template>

                </infinite-scroll>
            </v-container>

        </div>
    </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
import Photo from '@/components/Photo.vue';
import PhotoThumbnail from '@/components/PhotoThumbnail.vue';
import InfiniteScroll from '@/components/InfiniteScroll.vue';
import SEOMixin from '@/mixins/SEOMixin';




export default {
    mixins:[SEOMixin],
	props:{
        photo:{
            type:String,
        }
    },
    components:{
        photo:Photo,
        thumbnail:PhotoThumbnail,
        infiniteScroll:InfiniteScroll,
    },
    data() {
        return {
        	currentPage:1,
        	totalPages:1,
            images:[],
            loaded:false,
        }
    },
    computed:{
        ...mapGetters([
            'user',
            'accessToken',
            'refreshToken',
            ]),
    },
    created() {
        this.retrieve();
    },
    methods:{
    	next() {
            console.log('GET NEXT');
            var self = this;
            var photoID = self.photo;

            var currentIndex = self._.findIndex(self.images, {_id:photoID});
            var target = self.images[currentIndex+1];
            if(target) {
                self.view(target);
            }

        },
        previous() {
            console.log('GET PREVIOUS');
            var self = this;
            var photoID = self.photo;

            var currentIndex = self._.findIndex(self.images, {_id:photoID});
            var target = self.images[currentIndex-1];
            if(target) {
                self.view(target);
            }

        },
        view(image) {

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
        getImageUrl(imageObject, width) {
            if(!imageObject) {
                return;
            }

            var id = imageObject;
            if(id._id) {
                id = id._id;
            }

            if(!width) {
                width= 100;
            }
            
            var url = `${this.$fluro.api.defaults.baseURL}/get/${id}?&w=${width}&access_token=${this.$store.getters.accessToken}`;

            return url;
            
        },
        retrieve() {

            var self = this;
            
            self.loaded = false;

            var promise = this.$fluro.api.get('/content/photo', {
                params:{
                    //allDefinitions:true,
                    sort:'-created',
                    fields:[
                    'title',
                    'managedAuthor',
                    // 'data',
                    'created',
                    'data.photographer',
                    'data.event',
                    'width',
                    'colors',
                    'height',
                    // 'keywords',
                    ],
                    //limit:12,
                }
            });
            promise.then(function(res) {
                self.images = res.data;
                self.loaded = true;
                
            }, function(err) {
                console.log('ERROR!', err);
                self.loaded = true;
            })
        }
    }
}



</script>

<style>
</style>
