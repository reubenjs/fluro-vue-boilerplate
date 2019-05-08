<template>

    <!-- <wrapper> -->
        <v-container>
        <constrain class="text-xs-center" xs v-if="!user">
            <p>This page is only available to authenticated users</p>
        </constrain>
        <constrain v-if="user">
            <v-container class="page-header">
                <h1>Change Account</h1>
                <p>Select an account below</p>
                <div v-if="!loaded">
                    <v-progress-circular indeterminate></v-progress-circular>
                    <div>Loading...</div>
                </div>
            </v-container>
            <v-container v-if="accounts.length">
                <v-card>
                    <v-card-title>
                        Accounts
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                    </v-card-title>
                    <v-data-table :rows-per-page-items="pageOptions" :headers="headers" :items="filtered" class="elevation-1">
                        <template v-slot:items="props">
                            <td><strong>{{ props.item.title }}</strong></td>
                            <td class="text-xs-right">
                                <v-btn flat color="primary" @click="changeAccount(props.item)">
                                    <span>Sign In</span>
                                    <font-awesome-icon right :icon="['fas', 'arrow-right']" />
                                </v-btn>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-container>
        </constrain>
    </v-container>
    <!-- </wrapper> -->
</template>
<script>
// import { mapGetters, mapMutations } from 'vuex';
import _ from 'lodash';

import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
import PagedMixin from '@/mixins/PagedMixin';
import { Layout } from 'fluro-vue';


export default {
    mixins: [SEOMixin, PagedMixin, UserMixin, Layout],
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

        if (self.routeSearch && self.routeSearch.component) {
            self.routeSearch.component.$on('search', (keywords) => {
                // do something with the data
                self.search = keywords
            });
        }

        return self.retrieveAccounts()
    },
    computed: {
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
                            // console.log('RES', res);
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
            if (currentAccountID == account._id) {
                return complete();
            }

            //////////////////////////////////

            var promise = self.$fluro.auth.changeAccount(account);

            //////////////////////////////////

            promise.then(complete, function(err) {

                console.log('ERROR', err)
                var message = self.$fluro.utils.errorMessage(err);
            })

            //////////////////////////////////

            function complete() {

                console.log('Switched into', account.title);

                //Go to the home page
                self.$router.push({
                    name: 'home',
                })
            }
        },
        retrieveAccounts() {

            var self = this;

            if (!self.user) {
                return;
            }

            self.loaded = false;





            var promise = self.$fluro.api.get('/user/accounts', {

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