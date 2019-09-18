<template>
    <flex-column>
        <flex-column-body>
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

                                    <router-link :to="{name:'view', params:{_id:item._id,slug:item.slug}}" v-for="item in column.results">
                                        <!-- <pre>{{item}}</pre> -->
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
        </flex-column-body>
    </flex-column>
</template>
<script>
import PagedMixin from '@/mixins/PagedMixin';
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
import { Layout, FluroPagedContent } from 'fluro-vue-ui';


export default {
    mixins: [SEOMixin, PagedMixin, UserMixin, Layout],
    props: {
        keywords: {
            type: String,
        },
    },
    components: {
        pagedContent: FluroPagedContent,
    },
    data() {
        return {
            results: [],
            loaded: false,
            limit: 5,
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
        style(item) {
            if (this.$selection.isSelected(item)) {
                return {
                    background: 'yellow',
                }
            } else {
                return {};
            }
        },
        clicked(item) {
            this.$fluro.global.view(item);
            // this.$selection.toggle(item);
        },
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

            var types = [
                'product',
                'purchase',
                'collection',
                'policy',
                'query',
                'family',
                'persona',
                'contact',
                'contactdetail',
                'event',
                'team',
                'realm',
                'article',
                'asset',
                'image',
                'video',
                'audio',
                'interaction',
                'application',
                'definition',
            ]

            var basicFields = 'name realms slug title definition width height module description color bgColor firstLine firstName lastName gender duration filesize _type startDate endDate status assetType external extension mimetype';

            var promise = this.$fluro.content.search(keywords, {
                limit: self.limit,
                simple: true,
                select: basicFields,
                allDefinitions: true,
                populateFields: 'realms',
                populateSelect: 'color bgColor _discriminator _definition definition _discriminatorType title',
                statuses: ['active', 'archived', 'draft'],
                searchInheritable: true,
                expanded: true,
                types: types,
                cache: false, //Request new results from the server every request
            })

            promise.then(function(results) {
                // console.log('GOt the sturffff!', res);

                self.results = _.chain(results)
                    .map(function(column) {


                        return _.chain(column.results)
                            .reduce(function(set, entry) {

                                //Get the entry definitionName
                                var definitionName = entry.definition || column._type;

                                var existing = set[definitionName];

                                if (!existing) {
                                    existing =
                                        set[definitionName] = {
                                            _type: definitionName,
                                            results: [],
                                            total: 0,
                                        }
                                }

                                existing.results.push(entry);
                                existing.total++;

                                return set;

                            }, {})
                            .values()
                            .value();
                    })
                    .flatten()
                    .value();



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