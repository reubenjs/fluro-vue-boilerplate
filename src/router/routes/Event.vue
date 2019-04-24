<template>
    <div>
        <photo v-if="photo" :id="photo" @next="next" @previous="previous"></photo>
        <v-container v-if="meta" fluid class="page-header">
            <h1>{{item.title}} <span class="text-muted">// {{item.definition || 'Event'}}</span></h1>
            <h4>{{item | readableEventDate}}</h4>
            <h5>{{realms}}</h5>
            <div>{{images.length}} photos</div>
        </v-container>
        <v-container fluid v-if="!loaded">
            <v-progress-circular indeterminate></v-progress-circular>
            <div>Loading...</div>
        </v-container>
        <div v-if="loaded">
            <v-container fluid grid-list-md>
                <paged-content :items="images" :startPage="currentPage" @change="pageChanged" :per-page="48">
                    <template slot-scope="props">
                        <v-layout row wrap>
                            <v-flex d-flex @click="view(image)" xs12 sm6 md4 lg2 xl2 v-for="image in props.page">
                                <thumbnail :image="image"></thumbnail>
                            </v-flex>
                        </v-layout>
                    </template>
                </paged-content>
            </v-container>
        </div>
    </div>
</template>
<script>
import BrowseMixin from '@/mixins/BrowseMixin';
import SEOMixin from '@/mixins/SEOMixin';


export default {
    mixins: [BrowseMixin, SEOMixin],
    computed: {
        realms() {
            return this._.map(this.item.realms, 'title').join(', ');
        },
        seoTitle() {
            return this.item ? this.item.title : 'Event';
        },
    },
    // created() {
    //     var self = this;
    //     console.log('BEFORE loaded now!', self.$route.query)
    //     console.log('All loaded now!', self.$route.query)
    // },
    methods: {
        routeChanged() {
            console.log('Route changed', this.$route.query);
            // console.log('RETRIEVE THE DATA COS THE ROUTE CHANGED')
            var self = this;


            var promise = this.$fluro.api.get(`/photos/event/${self.$route.params.id}`, {
                params: {
                    // populate:[
                    //     'data.event',
                    //     'data.photographer',
                    // ],
                    verbose: true,
                    simple: 'false',
                    select: [
                        'title',
                        'managedAuthor',
                        'created',
                        'data.photographer',
                        'data.event',
                        'width',
                        'colors',
                        'height',
                    ],
                    limit: 10000,
                }
            });

            promise.then(function(res) {
                self.item = res.data.item;
                self.images = res.data.photos;
                self.meta = res.data;
                self.loaded = true;

                 // console.log('Route changed', self.$route.query);

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