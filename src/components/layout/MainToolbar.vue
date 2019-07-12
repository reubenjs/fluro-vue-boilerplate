<template>
    <v-toolbar class="main-toolbar elevation-0" :class="{expanded:drawer}" app fixed>
        <v-toolbar-title>
            <v-btn icon @click.stop="toggle()">
                <v-icon>{{drawer ? 'close' : 'menu' }}</v-icon>
            </v-btn>
            <v-btn v-if="backEnabled && $vuetify.breakpoint.smAndUp" @click="back()">
                <fluro-icon library="far" icon="arrow-left" left /> Back
            </v-btn>
            <!-- <v-toolbar-side-icon @click.stop="toggle()"></v-toolbar-side-icon> -->
            <router-link :to="{name:'home'}" v-if="!backEnabled">
                <span class="hidden-sm-and-down">{{title}}</span>
            </router-link>
        </v-toolbar-title>
        <!-- <v-spacer /> -->
        <!-- <div class="icons">
            <router-link to="home">
                <fluro-icon library="fas" icon="user" />
            </router-link>
            <router-link to="home">
                <fluro-icon library="fas" icon="calendar" />
            </router-link>
            <router-link to="home">
                <fluro-icon library="fas" icon="check" />
            </router-link>
            <router-link to="home">
                <fluro-icon library="fas" icon="exchange-alt" />
            </router-link>
            <router-link to="home">
                <fluro-icon library="fas" icon="file" />
            </router-link>
            <router-link to="home">
                <fluro-icon library="fas" icon="dollar-sign" />
            </router-link>
        </div> -->
        <!-- <v-spacer /> -->
         <div class="search-wrapper" v-if="!searchDisabled">
            <transition name="fade">
                <v-text-field ref="search"  flat solo hide-details prepend-inner-icon="search" :label="searchLabel" @focus="searchFocus" class="mainsearch" v-model="keywords" v-on:keyup.enter="submit"></v-text-field>
            </transition>
        </div>
        <v-spacer v-if="searchDisabled" />


        <v-toolbar-items v-if="!user" class="hidden-xs-only">
            <router-link :ripple="false" :to="{name:'user.login'}" class="link">Login</router-link>
            <router-link :ripple="false" :to="{name:'user.signup'}" class="link">Signup</router-link>
        </v-toolbar-items>
        <!-- <v-spacer/> -->
        <v-toolbar-items v-if="user">
            <!-- <v-btn :to="{name:'create'}" color="primary" class="hidden-xs-only"> -->
            <!-- <router-link tag="button" color="primary" flat :ripple="false" :to="{name:'add'}"> -->
            <!-- <span v-if="!$vuetify.breakpoint.xsOnly">New</span> -->
            <!-- <fluro-icon right icon="plus"/> -->
            <!-- </router-link> -->
            <!-- </v-btn> -->
            <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">
                {{accountTitle}}
            </v-toolbar-title>
            <v-menu :nudge-width="250" :nudge-bottom="5" offset-y>
                <template v-slot:activator="{ on }">
                    <div v-on="on" style="margin-left: 15px;">
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
                                <v-list-tile-sub-title v-if="$vuetify.breakpoint.xsOnly">
                                    {{accountTitle}}
                                </v-list-tile-sub-title>
                                <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list>
                        <!--  <v-list-tile active-class router-link-exact-active :to="{ name: 'user.edit'}">
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
        </v-toolbar-items>
    </v-toolbar>
</template>
<script>
import _ from 'lodash';

import UserMixin from '@/mixins/UserMixin';
import UIMixin from '@/mixins/UIMixin';
import RouterHistory from '@/router/history';


export default {
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
            // this.$store.commit('app/drawer', !this.drawer);
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
        mobile() {

            return this.$vuetify.breakpoint.smAndDown;
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
$toolbar-height: 48px;


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



.main-toolbar.v-toolbar {
    // z-index: 10;
    background: #fff;
    border-bottom: 1px solid rgba(#000, 0.05);
    vertical-align: top;

    a:not(.v-btn) {
        text-decoration: none;
        color: inherit;
    }



    .v-toolbar__title {
        font-weight: 700;
        letter-spacing: 0.05em;
        font-size: 13px;
        line-height: $toolbar-height;
        padding-right: 15px;
        text-transform: uppercase;
        color: inherit;
        text-decoration: none;
        transition: opacity 0.2s;

        @media(max-width: 768px) {
            padding-right: 0 !important;
        }

    }

    & /deep/ .v-toolbar__content {
        padding-left: 10px;
        padding-right: 10px;
    }

    &.expanded {
        .v-toolbar__title {
            opacity: 0;
        }
    }

    & /deep/ .v-toolbar__items {
        align-items: center;
        justify-content: center;

        a.link {
            text-decoration: none;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: inherit;
            line-height: $toolbar-height;
            padding: 0 15px;
            height: $toolbar-height;
            font-size: 13px;

            @media(max-width: 768px) {
                padding: 0;
            }
        }

        a.v-btn {
            margin: 0;
            line-height: 1;
            padding: 10px 0;
            height: auto;

        }
    }

    .logo {
        width: $toolbar-height;
        height: $toolbar-height;
        padding: 1px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
    }


    .search-wrapper {
        flex: 1;
        text-align: center;
        justify-content: center;
        display: flex;
    }


    .icons {
        font-size: 20px;

        a {
            padding: 10px;
        }
    }

    & /deep/ .mainsearch {
        flex: 1;
        max-width: 450px;

        &.theme--light.v-text-field--solo>.v-input__control {


            @media(max-width: 768px) {
                min-height: 44px;
            }

            &>.v-input__slot {
                transition: all 0.3s;
                border-radius: 5px;
                overflow: hidden;
                background: darken(#f1f3f4, 2%);


                &.v-input--is-focused.theme--light.v-text-field--solo>.v-input__control>.v-input__slot {
                    background: #fff;
                    box-shadow: 0 3px 5px rgba(#000, 0.2);
                }
            }
        }
    }

}
</style>