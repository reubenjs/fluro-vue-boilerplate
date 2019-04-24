<template>
    <div>
        <transition name="slide-right">
            <photo v-if="photo" :id="photo" @next="next" @previous="previous"></photo>
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
            <h1 v-if="user">Hi {{user.firstName}}!</h1>
            <h1 v-if="!user">Welcome!</h1>
            <!-- <div v-if="loaded">Found {{images.length}} photos</div> -->
        </v-container>
        <div>
            <v-container fluid style="padding-top:0; padding-bottom:0;">
                <h2>Here's the latest</h2>
            </v-container>
            <div v-if="latest.length">
                <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <v-flex d-flex @click="view(item)" xs12 sm3 lg2 v-for="item in latest">
                            <thumbnail :image="item"></thumbnail>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container fluid>
                    <v-btn large @click="viewLatest()">
                        <span>
                            View more recent photos
                        </span>
                        <font-awesome-icon right :icon="['far', 'angle-right']" />
                    </v-btn>
                </v-container>
            </div>
        </div>
        <div v-for="row in pinned">
            <v-container fluid style="padding-top:0; padding-bottom:0;">
                <h2>Your pinned {{row.title}}s</h2>
            </v-container>
            <!-- <pre>{{row}}</pre> -->
            <v-container fluid grid-list-md>
                <v-layout row wrap>
                    <!-- @click="view(item)" -->
                    <v-flex d-flex xs12 sm6 md4 lg3 xl2 v-for="item in row.items">
                        <!-- <pre>{{item}}</pre> -->
                        <!-- <thumbnail :image="item"></thumbnail> -->
                        <v-flex d-flex @click="view(item)" v-if="item._type == 'image'">
                            <thumbnail :image="item"></thumbnail>
                        </v-flex>
                        <tag-teaser v-if="item._type == 'tag'" :item="item"></tag-teaser>
                        <event-teaser v-if="item._type == 'event'" :item="item"></event-teaser>
                        <realm-teaser v-if="item._type == 'realm'" :item="item"></realm-teaser>
                        <photographer-teaser v-if="item._type == 'contact'" :item="item"></photographer-teaser>
                    </v-flex>
                </v-layout>
            </v-container>
            <!-- <v-container fluid>
                    <v-btn large @click="viewLatest()">
                        <span>
                            View more
                        </span>
                        <font-awesome-icon right :icon="['far', 'angle-right']" />
                    </v-btn>
                </v-container> -->
        </div>
        <!-- <pre>{{pinned}}</pre> -->
        <!--  <v-container fluid v-if="!pinsLoaded">
            <v-progress-circular indeterminate></v-progress-circular>
            <div>Loading...</div>
        </v-container>
        <div v-if="pinsLoaded">
            <div v-for="group in grouped">
                <v-container fluid class="page-header">
                    <h1>{{group.title}} <span class="text-muted"> {{group.items.length}} pinned</span></h1>
                </v-container>
                <v-container fluid grid-list-md>
                    <!-- <pre>{{group}}</pre> -->
        <!-- <paged-content :items="group.items" :startPage="currentPage" @change="pageChanged" :per-page="24"> -->
        <!-- <template slot-scope="props"> -->
        <!-- <v-layout row wrap>
                        <v-flex d-flex @click="view(item)" xs12 sm6 md4 lg2 xl2 v-for="item in group.items">
                            <thumbnail v-if="item._type == 'image'" :image="item"></thumbnail>
                            <tag-teaser v-if="item._type == 'tag'" :item="item"></tag-teaser>
                            <event-teaser v-if="item._type == 'event'" :item="item"></event-teaser>
                            <realm-teaser v-if="item._type == 'realm'" :item="item"></realm-teaser>
                            <photographer-teaser v-if="item._type == 'contact'" :item="item"></photographer-teaser>
                            <!-- <pre>{{item }}</pre> -->
        <!-- </v-flex> -->
        <!-- </v-layout> -->
        <!-- </template> -->
        <!-- </paged-content> -->
        <!-- </v-container> -->
        <!-- </div> -->
        <!-- </div> -->
        <!--  <div v-if="!loadedEvents">
            <v-progress-circular indeterminate></v-progress-circular>
            <div>Loading events...</div>
        </div> -->
        <!-- <div v-if="loadedEvents">
            <v-layout row wrap>
                <v-flex xs12>
                    <v-container class="page-header">
                        <h1>Recent <span class="text-muted">// Events</span></h1>
                    </v-container>
                    <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <v-flex d-flex @click="view(item)" xs12 sm6 lg3 v-for="item in events">
                            <thumbnail  :image="item"></thumbnail>
                        </v-flex>
                    </v-layout>
                    </v-container>

                    <v-container >
                        
                        <v-btn large :click="viewLatest">
                            <span>
                            All recent photos
                        </span>
                        <font-awesome-icon right :icon="['far', 'angle-right']"/>
                        </v-btn>
                   
                    </v-container>
                </v-flex>
            </v-layout>
        </div>
    -->
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import Photo from '@/components/Photo.vue';
import PhotoThumbnail from '@/components/PhotoThumbnail.vue';
import InfiniteScroll from '@/components/InfiniteScroll.vue';
import SEOMixin from '@/mixins/SEOMixin';


//Other Bits
import PhotographerTeaser from '@/components/teasers/PhotographerTeaser.vue';
import EventTeaser from '@/components/teasers/EventTeaser.vue';
import RealmTeaser from '@/components/teasers/RealmTeaser.vue';
import TagTeaser from '@/components/teasers/TagTeaser.vue';
import KeywordTeaser from '@/components/teasers/KeywordTeaser.vue';





export default {
    mixins: [SEOMixin],
    props: {
        photo: {
            type: String,
        }
    },

    components: {
        photo: Photo,
        thumbnail: PhotoThumbnail,
        photographerTeaser: PhotographerTeaser,
        eventTeaser: EventTeaser,
        realmTeaser: RealmTeaser,
        tagTeaser: TagTeaser,
        keywordTeaser: KeywordTeaser,
    },


    // components: {
    //     photo: Photo,
    //     thumbnail: PhotoThumbnail,
    //     infiniteScroll: InfiniteScroll,
    // },
    data() {
        return {}
    },

    asyncComputed: {
        latest: {
            default: [],
            get() {
                var self = this;
                return new Promise(function(resolve, reject) {

                    self.$fluro.api.get('/content/photo', {
                        params: {
                            //allDefinitions:true,
                            sort: '-created',
                            fields: [
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
                            limit: 12,
                        }
                    }).then(function(res) {

                        return resolve(res.data);
                    }, reject);
                })
            }
        },
        pinned: {
            default: [],
            get() {
                var self = this;
                return new Promise(function(resolve, reject) {

                    self.$fluro.api.post('/stat/my/pinned', {
                        // params: {
                        //     //allDefinitions:true,
                        //     sort: '-created',
                        //     fields: [
                        //         'title',
                        //         'managedAuthor',
                        //         // 'data',
                        //         'created',
                        //         'data.photographer',
                        //         'data.event',
                        //         'width',
                        //         'colors',
                        //         'height',
                        //         // 'keywords',
                        //     ],
                        //     limit: 4,
                        // }
                    }).then(function(res) {

                        var grouped = _.chain(res.data)
                            .filter(function(item) {
                                // console.log('ITEM', item);

                                var type = item.type;
                                var definition = item.definition;

                                switch (item._type) {
                                    case 'tag':
                                    case 'realm':
                                    case 'event':
                                    case 'collection':
                                        return true;
                                        break;
                                    default:
                                        if (item.definition == 'photo') {
                                            return true;
                                        }
                                        break;
                                }
                            })
                            .reduce(function(set, item) {
                                var definedType = item.definition || item._type;

                                //////////////////////////////////////////////

                                var existing = set[definedType];
                                if (!existing) {
                                    existing = set[definedType] = {
                                        title: self._.startCase(definedType),
                                        items: [],
                                    }
                                }
                                //////////////////////////////////////////////

                                switch (item._type) {
                                    case 'image':
                                        existing.items.push(item);
                                        break;
                                    case 'event':
                                        item.cover = {};
                                        existing.items.push(item);
                                        break;
                                    case 'realm':
                                        item.cover = {};
                                        existing.items.push(item);
                                        break;
                                    case 'tag':
                                        item.cover = {};
                                        existing.items.push(item);
                                        break;
                                }

                                //////////////////////////////////////////////


                                return set;
                            }, {})
                            .values()
                            .value();


                        return resolve(grouped);
                    }, reject);
                })
            }
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'application',
        ]),
    },
    created() {
        this.retrieveImages();
        // this.retrieveEvents();
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


        // next() {
        //        console.log('GET NEXT');
        //        var self = this;
        //        var photoID = self.photo;

        //        var currentIndex = self._.findIndex(self.images, {_id:photoID});
        //        var target = self.images[currentIndex+1];
        //        if(target) {
        //            self.view(target);
        //        }

        //    },
        //    previous() {
        //        console.log('GET PREVIOUS');
        //        var self = this;
        //        var photoID = self.photo;

        //        var currentIndex = self._.findIndex(self.images, {_id:photoID});
        //        var target = self.images[currentIndex-1];
        //        if(target) {
        //            self.view(target);
        //        }

        //    },

        view(image) {

            console.log('IMAGe', image);

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
        viewLatest() {
            console.log('LAtest')
            this.$router.push({
                name: 'latest'
            });
        },
        retrieveImages() {

            var self = this;

            self.loadedImages = false;

            var promise = this.$fluro.api.get('/content/photo', {
                params: {
                    //allDefinitions:true,
                    sort: '-created',
                    fields: [
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
                    limit: 4,
                }
            });
            promise.then(function(res) {
                self.images = res.data;
                self.loadedImages = true;

            }, function(err) {
                console.log('ERROR!', err);
                self.loadedImages = true;
            })
        },

    }
}
</script>
<style>
</style>