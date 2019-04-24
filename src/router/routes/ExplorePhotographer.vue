
<template>
    <div>

        <!-- <pre>{{items}}</pre> -->
        <!-- <photo v-if="photo" :id="photo"></photo> -->

        <v-container fluid class="page-header">
            <h1>Explore <span class="text-muted">// Photographers</span></h1>
            <div v-if="loaded">Found {{items.length}} photographers</div>
            <div v-if="!loaded">
                <v-progress-circular indeterminate></v-progress-circular>
                <div>Loading...</div>
            </div>
        </v-container>
        <div v-if="loaded">
            <v-container fluid grid-list-md>
                <paged-content :items="items" :startPage="currentPage" @change="pageChanged" :per-page="24">
                    <template slot-scope="props">
                        <v-layout row wrap>
                            <v-flex d-flex xs12 sm6 md4 v-for="item in props.page">
                                <photographer-teaser :item="item"></photographer-teaser>
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
    created() {
        var self = this;

        var promise = this.$fluro.api.get(`/photos/photographer/list`, {
            params:{
                limit:self.limit
            },
        });

        promise.then(function(res) {
            self.items = self._.orderBy(res.data, function(item) {
                return item.title;
            })
            self.loaded = true;
            
        }, function(err) {
            console.log('ERROR!', err);
            self.loaded = true;
        })
    }

}



</script>

<style>
</style>
