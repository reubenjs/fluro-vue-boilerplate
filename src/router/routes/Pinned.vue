
<template>
    <div>

       <!--  <v-container fluid class="page-header">
            <h1>My Pins</h1>
            <div>{{pins.length}} pinned items</div>
        </v-container>
 -->
        <v-container fluid v-if="!loaded">
            <v-progress-circular indeterminate></v-progress-circular>
            <div>Loading...</div>
        </v-container>
        

        <div v-if="loaded">
            <div v-for="group in grouped">
                <v-container fluid class="page-header">
                    <h1>{{group.title}} <span class="text-muted"> {{group.items.length}} pinned</span></h1>
                </v-container>
                <v-container fluid grid-list-md>
                    <!-- <pre>{{group}}</pre> -->
                    <!-- <paged-content :items="group.items" :startPage="currentPage" @change="pageChanged" :per-page="24"> -->
                    <!-- <template slot-scope="props"> -->
                        <v-layout row wrap>
                            <v-flex d-flex @click="view(item)" xs12 sm6 md4 lg2 xl2 v-for="item in group.items">
                                <thumbnail v-if="item._type == 'image'" :image="item"></thumbnail>
                                <tag-teaser v-if="item._type == 'tag'" :item="item"></tag-teaser>
                                <event-teaser v-if="item._type == 'event'" :item="item"></event-teaser>
                                <realm-teaser v-if="item._type == 'realm'" :item="item"></realm-teaser>
                                <photographer-teaser v-if="item._type == 'contact'" :item="item"></photographer-teaser>

                            <!-- <pre>{{item }}</pre> -->
                            </v-flex>
                        </v-layout>
                    <!-- </template> -->
                <!-- </paged-content> -->
            </v-container>
            </div>
           
           
        </div>

    </div>
</template>

<script>

import PhotoThumbnail from '@/components/PhotoThumbnail.vue';
import Photo from '@/components/Photo.vue';

//Other Bits
import PhotographerTeaser from '@/components/teasers/PhotographerTeaser.vue';
import EventTeaser from '@/components/teasers/EventTeaser.vue';
import RealmTeaser from '@/components/teasers/RealmTeaser.vue';
import TagTeaser from '@/components/teasers/TagTeaser.vue';
import KeywordTeaser from '@/components/teasers/KeywordTeaser.vue';



export default {
    components:{
        photo:Photo,
        thumbnail:PhotoThumbnail,
        photographerTeaser:PhotographerTeaser,
        eventTeaser:EventTeaser,
        realmTeaser:RealmTeaser,
        tagTeaser:TagTeaser,
        keywordTeaser:KeywordTeaser,
    },
    data(){

        var self = this;
       
        var pinStore = self.$fluro.stats.getStore('pinned', true);
        // pinStore.refresh().then(refreshComplete, refreshComplete);

        return {
            loaded:false,
            pinned:[],
            pinStore,
            // grouped:[],
            // pinService:self.$pinService,
            // 
        }
    },
    created() {
        this.routeChanged();
    },
    // watch:{
    //     'pinService.pinned':'routeChanged',
    // },
    computed:{
        grouped() {

            var pinned = this.pinned

            return _.chain(pinned)
                .filter(function(item) {

                    var type = item.type;
                    var definition = item.definition;

                    switch(item._type) {
                        case 'tag':
                        case 'realm':
                        case 'event':
                        case 'collection':
                            return true;
                            break;
                        default:
                            if(item.definition == 'photo') {
                                return true;
                            }
                        break;
                    }
                })
                .reduce(function(set, item) {

                    var definedType = item.definition || item._type;

                    //////////////////////////////////////////////

                    var existing = set[definedType];
                    if(!existing) {
                        existing = set[definedType] = {
                            title:self._.startCase(definedType),
                            items:[],
                        }
                    }
                    //////////////////////////////////////////////

                    switch(item._type) {
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
                    }
                    
                    //////////////////////////////////////////////

                    
                    return set;
                }, {})
                .values()
                .value();

        }
    },
    methods:{
        routeChanged() {

            console.log('ROUTE CHANGED')

            // console.log('RETRIEVE THE DATA COS THE ROUTE CHANGED')
            var self = this;

            var promise = this.$fluro.api.post(`/stat/my/pinned`, {

            });

            promise.then(function(res) {
                
                self.pinned = _.chain(res.data)
                .filter(function(item) {

                    var type = item.type;
                    var definition = item.definition;

                    switch(item._type) {
                        case 'tag':
                        case 'realm':
                        case 'event':
                        case 'collection':
                            return true;
                            break;
                        default:
                            if(item.definition == 'photo') {
                                return true;
                            }
                        break;
                    }
                })
                .value();



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
