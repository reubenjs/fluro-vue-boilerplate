<template>
    <div class="main-header">
        <v-layout>
            <v-flex shrink d-flex align-center v-if="$vuetify.breakpoint.smAndDown">
                <v-btn icon @click.stop="toggle()">
                    <fluro-icon v-if="!drawer" icon="bars" />
                    <fluro-icon v-else icon="times" />
                </v-btn>
            </v-flex>
            <v-flex class="application-title" shrink d-flex align-center v-else-if="!drawer">
                <!-- {{title}} -->
                <breadcrumb />
            </v-flex>
            <v-spacer v-if="searchDisabled" />
            <v-flex class="search-wrapper">
                <div style="max-width:350px; width:100%; " d-flex v-if="!searchDisabled">
                    <transition name="fade">
                        <v-text-field ref="search" flat solo hide-details prepend-inner-icon="search" :label="searchLabel" @focus="searchFocus" class="mainsearch" v-model="keywords" v-on:keyup.enter="submit"></v-text-field>
                    </transition>
                </div>
            </v-flex>
            <v-spacer v-if="searchDisabled" />
            <v-flex shrink d-flex align-center v-if="user">
                
                <v-menu :nudge-width="250" :nudge-bottom="5" left offset-y>
                    <template v-slot:activator="{ on }">
                        <div class="avatar-wrap" v-on="on" style="margin-left: 5px;">
                            <div class="avatar-badge">4</div>
                            <fluro-avatar md slot="activator" :id="user.persona" v-if="user.persona" type="persona"></fluro-avatar>    
                            <fluro-avatar md slot="activator" :id="user" v-if="!user.persona" type="user"></fluro-avatar> 
                        </div>
                    </template>
                    <v-card tile>
                        <v-list>
                            <v-list-tile avatar>
                                <v-list-tile-avatar>
                                    <fluro-avatar xl slot="activator" :id="user.persona" v-if="user.persona" type="persona"></fluro-avatar>    
                                    <fluro-avatar xl slot="activator" :id="user" v-if="!user.persona" type="user"></fluro-avatar>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{user.firstName}} {{user.lastName}}</v-list-tile-title>
                                    <v-list-tile-sub-title v-if="$vuetify.breakpoint.smAndDown">
                                        {{accountTitle}}
                                    </v-list-tile-sub-title>
                                    <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <v-divider></v-divider>
                        <v-list dense>
                           <!--  <v-list-tile active-class router-link-exact-active :to="{ name: 'notifications'}">
                                <v-list-tile-title>4 New Notifications</v-list-tile-title>
                            </v-list-tile> -->
                            <!-- <v-list-tile active-class router-link-exact-active :to="{ name: 'user.edit'}">
                                <v-list-tile-title>My Account</v-list-tile-title>
                            </v-list-tile> -->
                            <v-list-tile v-if="user.accountType != 'managed'" active-class router-link-exact-active :to="{ name: 'user.accounts'}">
                                <v-list-tile-title>Switch Account</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="logout()">
                                <v-list-tile-title>Logout</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-menu>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import _ from 'lodash';

import Vue from 'vue';
import UserMixin from '@/mixins/UserMixin';
import UIMixin from '@/mixins/UIMixin';
import RouterHistory from '@/router/history';

import Breadcrumb from '@/components/Breadcrumb.vue';



export default {
    components: { Breadcrumb },
    mixins: [UIMixin, UserMixin],
    data() {
        // var initialKeywords = this.$route.query.keywords || '';
        return {
            history: RouterHistory,
            keywords: this.$route.query.keywords || '',
        }
    },
    directives: {
        focus: {
            inserted: function(el) {
                el.focus()
            }
        }
    },
    watch: {
        '$route': 'routeChange',
        'keywords': 'keywordsChanged',
    },
    methods: {
        showActions() {
            this.$actions.open(this.$selection.selection, { fromSelection: true });
        },
        routeChange(to, from) {
            var self = this;

            //Clear the search if we aren't navigating to the /search page
            if (to.name != 'search') {
                if (self.keywords && self.keywords.length) {
                    self.keywords = null;
                }
            } else {

                this.$nextTick(function() {

                    if (self.$refs.search) {
                        self.$refs.search.focus();
                    }
                })
            }
        },
        toggle() {
            this.drawer = !this.drawer;
        },
        searchFocus() {
            if (this.routeSearch) {
                return;
            }

            // //Change the route to the /search page
            // this.$router.push({
            //     name: 'search',
            //     query: {
            //         keywords: this.keywords,
            //     }
            // })
        },
        logout: function() {
            //Logout
            this.$fluro.auth.logout();
        },
        keywordsChanged: _.debounce(function(keywords) {
            //When the user has finished typing submit the search
            this.submit();

        }, 500),
        submit() {

            //If we are already on the search page
            if (this.$route.name == 'search') {

                //Replace the parameters without adding a new route to history
                // console.log('Replace current search with', this.keywords);
                if (this.keywords && this.keywords.length) {
                    this.$router.replace({ query: Object.assign({}, this.$route.query, { keywords: this.keywords }) });
                } else {
                    this.$router.back();
                }
            } else {
                //Change the route and add item to history (for back button)
                // console.log('Navigate to search', this.keywords);
                if (this.keywords && this.keywords.length) {
                    this.$router.push({ name: 'search', query: { keywords: this.keywords } });
                }

            }
        },
        back() {
            RouterHistory.back();
        }
    },
    computed: {
        backEnabled() {
            return RouterHistory.trail.length > 1;
        },
        accountTitle() {
            if (this.user) {
                return this.user.account.title;
            } else if (this.application) {
                return this.application.account.title;
            }
        },
        searchDisabled() {
            var disabled = _.get(this, '$route.meta.search.disabled');
            return disabled;
        },
        routeSearch() {
            return _.get(this, '$route.meta.search');
        },
        searchLabel() {
            var label = 'Search';

            //If the route has a better description use that
            if (this.routeSearch) {
                label = this.routeSearch.label;
            }

            return label;
        },
        title() {

            // //console.log(this);
            // if (this.user) {
            //     return this.user.account.title;
            // }

            if (this.application) {
                return this.application.title;
            }

            return 'Fluro';

        },
    }
}
</script>
<style scoped lang="scss">
.fade-enter-active {
    transition: all .3s ease;
}

.fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}




.main-header {
    background: #fff;
    border-bottom: 1px solid rgba(#000, 0.05);
    vertical-align: top;


    a:not(.v-btn) {
        text-decoration: none;
        color: inherit;
    }

    .application-title {
        padding: 0 15px;
    }

    .search-wrapper {
        flex: 1;
        text-align: center;
        justify-content: center;
        align-items: center;
        display: flex;
        padding: 5px;
        height: 59px;



        div.mainsearch {
            flex: 1;
            max-width: 450px;

            &::v-deep div.v-input__control {

                @media(max-width: 768px) {
                    min-height: 44px;
                }

                &>div.v-input__slot {
                    transition: all 0.3s;
                    border-radius: 5px;
                    overflow: hidden;
                    background: darken(#f1f3f4, 2%);


                    &div.v-input--is-focused>div.v-input__control>div.v-input__slot {
                        background: #fff;
                        box-shadow: 0 3px 5px rgba(#000, 0.2);
                    }
                }
            }
        }


    }


    .avatar-wrap {
        position: relative;
        margin-right: 10px;
        display: inline-block;

        @media(min-width: 769px) {
            margin-right: 20px;
        }

        .avatar-badge {
            top: 0;
            right: -5px;
            z-index: 10;
            position: absolute;
            background: red;
            color: #fff;
            border-radius: 100%;
            font-size: 10px;
            font-weight: 500;
            line-height: 16px;
            height: 16px;
            width: 16px;
            overflow: hidden;
            text-align: center;
        }
    }

}
</style>