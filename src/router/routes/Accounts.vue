<template>
    <div>
        <div v-if="!user">
            <p>This page is only available when you are logged in</p>
        </div>
        <div v-if="user">
            <v-container class="page-header">
                <h1>Change Account</h1>
                <p>Select an account below</p>
                <div v-if="!loaded">
                    <v-progress-circular indeterminate></v-progress-circular>
                    <div>Loading...</div>
                </div>
                
<!-- {{search}} -->
            </v-container>
            <v-container v-if="accounts.length">
                <!-- <v-flex xs12 sm6 md3>
                    <v-text-field v-model="search" label="Search Accounts" append-icon="search" placeholder=""></v-text-field>
                </v-flex> -->
                <!-- <pre>{{filtered.length}}</pre> -->
                <v-data-table :rows-per-page-items="pageOptions" :headers="headers" :items="filtered" class="elevation-1">
                    <template v-slot:items="props">
                        <td><strong>{{ props.item.title }}</strong></td>
                        <td class="text-xs-right">
                            <v-btn flat color="primary" @click="changeAccount(props.item)">
                                <span>Sign In</span>
                                <font-awesome-icon right :icon="['fas', 'arrow-right']" />
                            </v-btn>
                        </td>
                        <!-- <td class="text-xs-right">{{ props.item.created  | formatDate:'DDD MMM YYYY'}}</td> -->
                        <!-- <td class="text-xs-right">{{ props.item.created }}</td> -->
                        <!-- <td class="text-xs-right">{{ props.item.created }}</td> -->
                        <!-- <td class="text-xs-right">{{ props.item.created }}</td> -->
                        <!-- <td class="text-xs-right">{{ props.item.created }}</td> -->
                    </template>
                </v-data-table>
            </v-container>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import _ from 'lodash';
import SEOMixin from '@/mixins/SEOMixin';


export default {
    mixins:[SEOMixin],
    data() {
        return {
            search: '',
            // filtered:[],
            pageOptions: [10, 25, 50, 100],
            headers: [{
                text: 'Account Name',
                align: 'left',
                sortable: true,
                value: 'title',
            },
            {
                text: 'Actions',
                    // align:'left',
                    sortable: false,
                    value: '_id',
                },
                // {
                // text: 'Created',
                // align:'left',
                // sortable:true,
                // value:'title',
                // }
                ],
                loaded: false,
                accounts: [],
            }
        },
        created() {

            var self = this;

            if(self.routeSearch) {
                self.routeSearch.component.$on('search', (keywords) => {
                  // do something with the data
                  self.search = keywords
                });
            }
            


            return self.retrieveAccounts()
        },
        computed: {
            ...mapGetters([
                'user',
                'application',
                ]),
            routeSearch() {
                return _.get(this, '$route.meta.search');
            },
            

        },
        asyncComputed: {
            
            filtered: {
                default: [],
                get() {

                    var self = this;
                    var terms = self.search;
                //////////////////////////////////////

                return new Promise(function(resolve, reject) {



                    //////////////////////////////////////

                    if (!terms || !terms.length) {
                        return resolve(self.accounts);
                    }

                    //////////////////////////////////////

                    var options = {
                        shouldSort: true,
                        tokenize: true,
                        matchAllTokens: true,
                        findAllMatches: true,
                        threshold: 0.3,
                        location: 0,
                        distance: 2,
                        maxPatternLength: 32,
                        minMatchCharLength: 5,
                        keys: [
                        "title"
                        ]
                    };


                    self.$search(terms, self.accounts, options)
                    .then(function(res) {
                        console.log('RES', res);
                        return resolve(res);
                    }, function(err) {
                        return resolve([]);
                    });

                })
            }
        }
    },
    methods: {
        changeAccount(account) {

            var self = this;

            var currentAccountID = _.get(self, 'user.account._id');
            if(currentAccountID == account._id) {
                return complete();
            }

            //////////////////////////////////

            var promise = this.$fluro.auth.changeAccount(account);

            //////////////////////////////////

            promise.then(complete, function(err) {

                console.log('ERROR', err)
                var message = this.$fluro.utils.errorMessage(err);
                vuetifyToast.error(message);
            })

            //////////////////////////////////

            function complete() {

                
                self.$toasted.show(`Switched to ${account.title}`, {
                    // icon:'check'
                    duration:2000,
                    type:'success',
                })

                self.$router.push({
                    name: 'home',
                })
            }
        },
        retrieveAccounts() {

            var self = this;

            self.loaded = false;

            var promise = this.$fluro.api.get('/user/accounts', {

            });

            promise.then(function(res) {
                self.accounts = res.data;
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