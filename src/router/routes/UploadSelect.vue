<template>
    <div>
        <v-container fluid class="page-header">
            <h1>Upload <span class="text-muted">Select event</span></h1>
            <div v-if="loaded">Please select an event to upload photos for</div>
            <div v-if="!loaded">
                <v-progress-circular indeterminate></v-progress-circular>
                <div>Loading events...</div>
            </div>
        </v-container>
        <div v-if="loaded">
            <!-- <pre>{{events}}</pre> -->
            <v-card>
                <v-card-title>
                    Past Events
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="search" label="Search events" single-line hide-details></v-text-field>
                </v-card-title>
                <v-data-table :rows-per-page-items="pageOptions" :disable-initial-sort="true" :headers="headers" :search="search" :items="events" class="elevation-0">
                    <template v-slot:items="props">
                        <tr @click="select(props.item)">
                            <td>
                                <div class="dots">
                                    <span class="dot" :style="{backgroundColor:realm.bgColor}" v-for="realm in props.item.realms"></span>
                                </div>
                            </td>
                            <td>
                                <strong>{{ props.item.title }}</strong>
                                <div class="small text-muted">{{props.item.firstLine}}</div>
                                <div class="small text-muted">{{props.item.realms | comma('title')}}</div>
                                <!-- <div class="small text-muted">{{props.item.realms | comma('title')}}</div> -->
                            </td>
                            <td>{{ props.item | readableEventDate }}</td>
                            <!-- <td class="text-xs-right">
                            <v-btn flat color="primary">
                                <span>Select</span>
                                <font-awesome-icon right :icon="['fas', 'arrow-right']" />
                            </v-btn>
                        </td> -->
                        </tr>
                    </template>
                </v-data-table>
            </v-card>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            search: '',
            loaded: false,
            pagination: {
                rowsPerPage: 20
            },
            pageOptions: [20, 50, 100, 200, 500],
            headers: [{
                    text: 'Realms',
                    align: 'left',
                    // sortable: false,
                    value: 'realms',
                }, ,
                {
                    text: 'Event Title',
                    align: 'left',
                    sortable: true,
                    value: 'title',
                },
                {
                    text: 'Date',
                    align: 'left',
                    sortable: true,
                    value: 'startDate',
                },
                // {
                //     text: '',
                //     align: 'right',
                //     // sortable: false,
                //     value: '_id',
                // },
            ]
        }
    },
    methods: {
        select(item) {
            // console.log(item);
            this.$router.push({
                name: 'upload.event',
                params: {
                    id: item._id,
                }
            })
            // :to="{name:'upload.event', params:{id:props.item._id}}"
        }
    },
    computed: {
        routeSearch() {
            return _.get(this, '$route.meta.search');
        },
    },
    created() {
        var self = this;

        if (self.routeSearch) {
            self.routeSearch.component.$on('search', (keywords) => {
                // do something with the data
                self.search = keywords
            });
        }
    },
    asyncComputed: {
        // filtered: {
        //     default: [],
        //     get() {

        //         var self = this;
        //         var terms = self.search;

        //         //////////////////////////////////////

        //         return new Promise(function(resolve, reject) {

        //             //////////////////////////////////////

        //             if (!terms || !terms.length) {
        //                 return resolve(self.events);
        //             }

        //             //////////////////////////////////////

        //             var options = {
        //                 shouldSort: true,
        //                 tokenize: true,
        //                 matchAllTokens: true,
        //                 findAllMatches: true,
        //                 threshold: 0.3,
        //                 location: 0,
        //                 distance: 2,
        //                 maxPatternLength: 32,
        //                 minMatchCharLength: 5,
        //                 keys: [
        //                     "title"
        //                 ]
        //             };


        //             self.$search(terms, self.events, options)
        //                 .then(function(res) {
        //                     return resolve(res);
        //                 }, function(err) {
        //                     return resolve([]);
        //                 });

        //         })
        //     },
        // },
        events: {
            default: [],
            get() {

                var self = this;

                return new Promise(function(resolve, reject) {


                    var criteria = {
                        "_type": "event",
                        "startDate": {
                            "$gte": "date('-1 years')",
                            "$lt": "date('now')"
                        },
                        "status": {
                            "$in": ["active", "archived"]
                        }
                    }


                    /////////////////////////////////////////////
                    self.$fluro.content.retrieve(criteria, {
                            select: 'title firstLine startDate endDate firstLine realms definition',
                            sort: '-startDate'
                        })
                        .then(function(results) {


                            resolve(results);
                            self.loaded = true;
                        }, reject);


                });
            }
        }
    }
}
</script>
<style>
.theme--light.v-table {
    background: none !important;
}

.dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: #000;
}
</style>