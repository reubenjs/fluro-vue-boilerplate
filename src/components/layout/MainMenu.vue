<template>
    <!-- fixed app stateless floating light -->
    <v-navigation-drawer class="main-menu" v-model="drawer" dark :temporary="mobile" :mini-variant="drawerMini" fixed app stateless light>
        <!-- <v-navigation-drawer class="main-menu" v-model="drawer"> -->
        <v-toolbar class="elevation-0">
            <v-toolbar-title>
                <v-toolbar-side-icon @click.stop="toggle()"></v-toolbar-side-icon>
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
                                    <font-awesome-icon right :icon="['fas', item.icon]" />
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ item.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </template>
                        <v-list-tile v-for="(child, i) in item.children" :key="i" :to="{ name: child.route, query:child.routeParams}">
                            <v-list-tile-action v-if="child.icon">
                                <font-awesome-icon right :icon="['fas', child.icon]" />
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ child.text }}
                                    <pre>{{child}}</pre>
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile exact v-if="item.route" :key="item.text" :to="{ name: item.route, params:item.routeParams}">
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
                        <v-list-tile :key="item.text" :to="{ name: item.route, params:item.routeParams}" active-class>
                            <v-list-tile-action>
                                <font-awesome-icon right :icon="['fas', item.icon]" />
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
        },
    },
    created() {
        //Close on create
        // this.$store.commit('drawer', false);
    },
    computed: {
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
                    icon: 'sign-in',
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
            if(this.user) {

                //If we are an actual Fluro user
                //and not a whitelabelled managed persona
                if(this.user.accountType != 'managed') {

                    //Add a link to the switch accounts page
                    menu.push({
                        icon: 'user',
                        text: 'Switch Accounts',
                        route: 'user.accounts',
                    })
                }
            }

            ////////////////////////////////

            return menu;
        },
    },



}
</script>
<style lang="scss">

.main-menu {
    z-index: 20;
}
</style>