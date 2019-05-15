<template>
    <!-- fixed app stateless floating light -->
    <v-navigation-drawer class="main-menu" dark v-model="drawer" :temporary="mobile" :mini-variant="drawerMini" fixed app stateless light>
        <!-- <v-navigation-drawer class="main-menu" v-model="drawer"> -->
        <v-toolbar class="elevation-0">
            <v-toolbar-title>
                <v-btn icon @click.stop="toggle()">
                    <v-icon>{{this.drawer ? 'close' : 'menu' }}</v-icon>
                </v-btn>
                <span>{{title}}</span>
                <!-- <v-toolbar-side-icon @click.stop="toggle()"></v-toolbar-side-icon> -->
            </v-toolbar-title>
        </v-toolbar>
        <v-list fill-height column>
            <template v-for="item in menuItems">
                <v-layout v-if="item.heading" :key="item.heading" row align-center>
                    <v-flex xs6>
                        <v-subheader v-if="item.heading">
                            {{ item.heading }}
                        </v-subheader>
                    </v-flex>
                    <v-flex xs6 class="text-xs-center">
                        <a href="#!" class="body-2 black--text">EDIT</a>
                    </v-flex>
                </v-layout>
                <template v-if="item.children && item.children.length">
                    <v-list-group :key="item.text" v-model="item.model">
                        <template v-slot:activator>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <font-awesome-icon right :icon="['far', item.icon]" />
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ item.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </template>
                        <v-list-tile v-for="(child, i) in item.children" :key="i" @click="clicked(item)" :to="{ name: child.route, query:child.routeParams}">
                            <v-list-tile-action v-if="child.icon">
                                <font-awesome-icon right :icon="['far', child.icon]" />
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ child.text }}
                                    <pre>{{child}}</pre>
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile exact v-if="item.route" :key="item.text" @click="clicked(item)" :to="{ name: item.route, params:item.routeParams}">
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    All {{item.text}}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-group>
                </template>
                <template v-else>
                    <template v-if="!item.meta || !item.meta.mini">
                        <v-list-tile :key="item.text" @click="clicked(item)" :to="{ name: item.route, params:item.routeParams}" active-class>
                            <v-list-tile-action>
                                <font-awesome-icon right :icon="['far', item.icon]" />
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </template>
            </template>
        </v-list>
        <div class="floor">
            <v-container>
                
            </v-container>
        </div>
    </v-navigation-drawer>
</template>
<script>
// import { mapGetters, mapMutations, mapState } from 'vuex';


import UserMixin from '@/mixins/UserMixin';
import UIMixin from '@/mixins/UIMixin';



export default {
    mixins: [UserMixin, UIMixin],
    methods: {
        toggle() {
            this.drawer = !this.drawer;
        },
        logout() {
            this.$fluro.auth.logout();
            this.drawer = false;
        },
        clicked(item) {


            if (item.click) {
                if (this[item.click]) {
                    this[item.click]();
                }
            }
        }
    },
    created() {
        //Close on create
        // this.$store.commit('drawer', false);
    },
    computed: {
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
        mobile() {
            return this.$vuetify.breakpoint.smAndDown;
        },
        menuItems() {
            ///////////////////////////////////////

            var menu = [];
            var self = this;

            ///////////////////////////////////////


            //Home page
            menu.push({
                icon: 'home',
                text: 'Home',
                route: 'home',
                children: [],
            })

            menu.push({
                icon: 'search',
                text: 'Search',
                route: 'search',
            })

            ////////////////////////////////

            //If we aren't logged in
            if (!this.user) {
                menu.push({
                    icon: 'sign-in-alt',
                    text: 'Login',
                    route: 'user.login',
                })

                menu.push({
                    icon: 'user',
                    text: 'Signup',
                    route: 'user.signup',
                })
            }

            ////////////////////////////////

            //If we are logged in
            if (this.user) {

                //If we are an actual Fluro user
                //and not a whitelabelled managed persona
                if (this.user.accountType != 'managed') {

                    //Add a link to the switch accounts page
                    menu.push({
                        icon: 'user',
                        text: 'Switch Accounts',
                        route: 'user.accounts',
                    })
                }


                //Add a link to the switch accounts page
                menu.push({
                    icon: 'sign-out-alt',
                    text: 'Sign Out',
                    click: 'logout',
                })
            }

            ////////////////////////////////

            return menu;
        },
    },



}
</script>
<style scoped lang="scss">

$toolbar-height: 48px;


.main-menu {
    z-index: 20;
    border-right: none !important;


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

    }

    & /deep/ .v-toolbar__content {
        padding-left: 10px;
        padding-right: 10px;
    }

    & /deep/ .v-list .v-list__tile {
        padding:0 10px;
        .v-list__tile__action {
            min-width: 0;
            width:36px;
            height:36px;
            line-height: 36px;
            margin: 5px 10px 5px 5px;

            svg {
                margin: auto;
            }
        }
    }


    .floor {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(#000, 0.1);
        color: #fff;
    }

    .v-toolbar {
        background: #33373e !important;
    }

    border-right: none !important;
    background: lighten(#33373e, 5%) !important;
}
</style>