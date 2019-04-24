
<template>
    <div>
        <v-container fluid class="page-header">
            <h1>Explore <span class="text-muted">// {{plural}}</span></h1>
            <div v-if="loaded">Found {{items.length}} events</div>
            <div v-if="!loaded">
                <v-progress-circular indeterminate></v-progress-circular>
                <div>Loading...</div>
            </div>
        </v-container>
        <div v-if="loaded">
            <v-container fluid grid-list-md>
                <paged-content :items="items" :startPage="currentPage" @change="pageChanged" :per-page="60">
                    <template slot-scope="props">
                        <v-layout row wrap>
                            <v-flex d-flex xs12 sm6 md4 v-for="item in props.page">
                                <event-teaser :item="item"></event-teaser>
                            </v-flex>
                            <!-- <v-flex d-flex @click="view(image)" xs12 sm6 md4 lg2 xl2 v-for="image in props.page">
                                <thumbnail  :image="image"></thumbnail>
                            </v-flex> -->
                        </v-layout>
                    </template>

                </paged-content>
            </v-container>
        </div>

    </div>
</template>

<script>

import ExploreMixin from '@/mixins/ExploreMixin';
import SEOMixin from '@/mixins/SEOMixin';


export default {
    mixins:[ExploreMixin, SEOMixin],
    data() {
        return {
            items:[]
        }
    },
    computed:{
        plural() {
            if(this.definition) {
                return this.definitions[this.definition].plural;
            }

            return 'Events';
        },

    //         var lookup = _.chain()
    //         if (this.definition) {

    //             console.log('FIND', this.definition, this.definitions);

    //             return  _.find(this.definitions, {definitionName:this.definition});
    //             // return actual.plural;
    //         }
    //     }
    // },
    //     grouped() {

    //         var self = this;
    //         return self._.chain(self.items)
    //         .reduce(function(set, event) {

    //             var date = new Date(event.startDate) 
    //             var key = this.$options.filters.formatDate(date, 'MMM YYYY');

    //             var entry = set[key];

    //             if(!entry) {
    //                 entry =
    //                 set[key] = {
    //                     key:key,
    //                     date:date,
    //                     events:[],
    //                 }
    //             }

    //             //Add to the set
    //             entry.events.push(event);


    //             return set;
    //         }, {})
    //         .value();
    //     }
    },
    methods:{
        fetchData() {
            
            var self = this;

            var promise = this.$fluro.api.get(`/photos/event/list`, {
                params:{
                    limit:self.limit,
                    definition:self.definition,
                },
                cache:self.cacheKey,
            });

            promise.then(function(res) {
                self.items = res.data;
                self.loaded = true;
                
            }, function(err) {
                console.log('ERROR!', err);
                self.loaded = true;
            })

        },
    }
   

}



</script>

<style>
</style>
