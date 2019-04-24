<template>
    <div>
        <v-container fluid class="page-header">
            <h1>Explore <span class="text-muted">// Keywords</span></h1>
            <div v-if="loaded">Found {{items.length}} keywords</div>
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
                            <v-flex d-flex xs12 sm4 md3 xl2 v-for="item in props.page">
                                <keyword-teaser :item="item"></keyword-teaser>
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
    mixins: [ExploreMixin, SEOMixin],
    methods: {
        fetchData() {
            var self = this;

            var promise = this.$fluro.api.get(`/photos/keyword/list`, {
                params: {
                    definition: self.definition,
                    //     limit:self.limit
                },
            });

            promise.then(function(res) {
                self.items = res.data;
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