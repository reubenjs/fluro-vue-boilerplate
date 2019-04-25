<template>
    <wrapper>
        <constrain v-if="keywords.length">
            <h1>Searching <span class="text-muted">// {{keywords}}</span></h1>
            <div v-if="!loaded">
                <v-progress-circular indeterminate></v-progress-circular>
                <div>Searching...</div>
            </div>
            <div v-if="loaded">
                
                    <v-layout row wrap>
                        <v-flex d-flex xs12 sm4 v-for="column in results" v-if="column.results.length">
                            <div>
                                <h3>{{column._type}}</h3>
                                <router-link :to="{name:'view', params:{slug:item.slug}}" v-for="item in column.results">
                                    <h4>{{item.title}}</h4>
                                </router-link>

                            </div>
                        </v-flex>
                        <!-- <pre>{{results}}</pre> -->
                    </v-layout>
                
            </div>
        </constrain>
        <constrain class="text-xs-center" v-if="!keywords.length">
            <h1>Search</h1>
            <p>Type some keywords to continue</p>
        </constrain>
    </wrapper>
    <!-- <div>
        <v-container fluid class="page-header" v-if="keywords.length">
            <h1>Searching <span class="text-muted">// {{keywords}}</span></h1>
            <div v-if="loaded">Found {{results.length}} results</div>
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
                <paged-content :items="results" :startPage="currentPage" @change="pageChanged" :per-page="48">
                    <template slot-scope="props">
                        <v-layout row wrap>
                            <v-flex d-flex @click="view(image)" xs12 sm6 md4 xl2 v-for="image in props.page">
                                
                                <thumbnail :image="image"></thumbnail>
                            </v-flex>
                        </v-layout>
                    </template>
                </paged-content>
            </v-container>
        </div>
        <v-container fluid grid-list-md>
        <infinite-scroll :items="images">

            <template slot-scope="props">
                <v-layout row wrap>
                    <v-flex d-flex @click="view(item)" xs12 sm6 md4 lg2 xl2 v-for="item in props.page">
                        <thumbnail  :image="item"></thumbnail>
                    </v-flex>
                </v-layout>
            </template>

        </infinite-scroll>
    </v-container>
    </div> -->
</template>
<script>
import PagedContent from '@/components/PagedContent.vue';
import PagedMixin from '@/mixins/PagedMixin';
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
import { Layout } from 'fluro-vue';


export default {
    mixins: [SEOMixin, PagedMixin, UserMixin, Layout],
    props: {
        keywords: {
            type: String,
        },
    },
    components: {
        pagedContent: PagedContent,
    },
    data() {
        return {
            results: [],
            loaded: false,
        }
    },
    watch: {
        'keywords': 'search',
    },
    created() {

        //Run the search straight away
        this.search()
    },
    methods: {
        total() {
            return this.results.length;
        },
        search() {

            var self = this;
            self.loaded = false;


            var keywords = this.keywords;

            //If there are no keywords
            if (!keywords || !keywords.length) {
                self.results = [];
                self.loaded = true;
                return;
            }

            ///////////////////////////////////////////////

            var criteria = {};

            var promise = this.$fluro.content.search(keywords, {
                limit: 5,
                types: [
                    'article',
                    'contact',
                    'event',
                    'image',
                ],
                cache: false, //Request new results from the server every request
            })

            promise.then(function(results) {
                // console.log('GOt the sturffff!', res);
                self.results = results;
                self.loaded = true;

            }, function(err) {
                self.results = [];
                self.loaded = true;
            })
        }
    }
}
</script>
<style>
</style>