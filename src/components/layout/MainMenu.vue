<template>
    <v-navigation-drawer class="main-menu" v-model="drawer" fixed app v-bind="{[`stateless`]: !isMobile}" floating light :mini-variant="collapsed">
        <v-toolbar class="elevation-0">
            <v-toolbar-title>
                <v-toolbar-side-icon @click.stop="toggle()">
                    <!-- <v-icon v-if="isMobile">close</v-icon> -->
                    <!-- <v-icon v-if="!isMobile">navicon</v-icon> -->
                </v-toolbar-side-icon>
                <!-- <span>Fluro Photos</span> -->
            </v-toolbar-title>
        </v-toolbar>
        <v-list fill-height column>
            <!-- <pre>{{definitions}}</pre> -->
            <template v-for="item in menuitems">
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


                <template v-else-if="item.children && item.children.length">
                    
                    <template v-if="item.meta.mini && collapsed">
                        <v-list-tile :key="item.text" :to="{ name: item.route, params:item.routeParams}" active-class>
                            <!-- @click="item.click()"> -->
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

                    <template v-if="!item.meta.mini && !collapsed">
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
                                        <!-- {{ item.text }} -->
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-group>
                    </template>
                </template>

                 <template v-else>

                    <template v-if="!item.meta || !item.meta.mini">
                        <v-list-tile :key="item.text" :to="{ name: item.route, params:item.routeParams}" active-class>
                           <!-- <pre>{{item.children}}</pre> -->
                            <!-- @click="item.click()"> -->
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
import { mapGetters } from 'vuex'
import _ from 'lodash';

import ResponsiveMixin from '@/mixins/ResponsiveMixin.js';

export default {
    mixins: [
        ResponsiveMixin,
    ],
    data() {

        var self = this;
        return {}
    },
    methods: {
        toggle() {
            if (this.isMobile) {
                this.toggleDrawer();
            } else {
                this.toggleCollapsed();
            }
        },
        toggleCollapsed() {
            this.$store.commit('drawerCollapsed', !this.$store.state.app.drawerCollapsed);
        },
        toggleDrawer() {
            this.$store.commit('drawer', !this.$store.state.app.drawer);
        },
        navigateTo(name) {
            this.$router.push({
                name: name,
            })
        },
        logout: function() {
            this.$fluro.auth.logout();
        }
    },
    created() {
        if (this.isMobile) {
            this.$store.commit('drawer', false);
        }
    },
    computed: {
        ...mapGetters([
            'definitions',
        ]),
        menuitems() {
            ///////////////////////////////////////

            var menu = [];
            var self = this;

            ///////////////////////////////////////

            // var lookup = {};

            // if (this.definitions.length) {
            //     //For each definition
            //     //create a lookup so we can quickly attach
            //     //the definitions to it without multiple loops
            //     lookup = _.reduce(this.definitions, function(set, type) {
            //         set[type.definitionName] = type;
            //         return set;
            //     }, {});

            // }



            ///////////////////////////////////////

            function getChildren(type, routeName) {

                return _.chain(self.definitions)
                .filter({parentType:type})
                    .map(function(definition) {
                        return {
                            text: definition.plural,
                            route: routeName,
                            routeParams: {
                                definition: definition.definitionName,
                            },
                        }
                    })
                    .value();
            }

            ///////////////////////////////////////


            //Home page
            menu.push({
                icon: 'home',
                text: 'Home',
                route: 'home',
                // children: [],
            })

            menu.push({
                icon: 'clock',
                text: 'Events',
                route: 'explore.event',
                meta: {
                    mini: false,
                },
                children: getChildren('event', 'explore.event'),
            })

            menu.push({
                icon: 'bullseye',
                text: 'Realms',
                route: 'explore.realm',
                meta: {
                    mini: false,
                },
                children: getChildren('realm', 'explore.realm'),
            })

            menu.push({
                icon: 'tag',
                text: 'Tags',
                route: 'explore.tag',
                meta: {
                    mini: false,
                },
                children: getChildren('tag', 'explore.tag'),
            })



            menu.push({
                icon: 'clock',
                text: 'Events',
                route: 'explore.event',
                meta: {
                    mini: true,
                },
                children: getChildren('event', 'explore.event'),
            })

            menu.push({
                icon: 'bullseye',
                text: 'Realms',
                route: 'explore.realm',
                meta: {
                    mini: true,
                },
                children: getChildren('realm', 'explore.realm'),
            })

            menu.push({
                icon: 'tag',
                text: 'Tags',
                route: 'explore.tag',
                meta: {
                    mini: true,
                },
                children: getChildren('tag', 'explore.tag'),
            })




            menu.push({
                icon: 'users',
                text: 'Photographers',
                route: 'explore.photographer',
            })



            // console.log('MENU!', menu)

            // {
            //     icon: 'keyboard_arrow_up',
            //     'icon-alt': 'keyboard_arrow_down',
            //     text: 'More',
            //     model: false,
            //     children: [
            //     {
            //             icon: 'thumbtack',
            //             text: 'My Pins',
            //             click: function() {
            //                 self.navigateTo('explore.pins')
            //             }
            //         },



            //     ]
            // },

            return menu;
        },
        collapsed() {
            if (this.isMobile) {
                return false;
            }

            return this.$store.state.app.drawerCollapsed;

        },
        drawer: {
            get() {
                if (this.isMobile) {
                    return this.$store.state.app.drawer
                } else {
                    return true;
                }
            },
            set(state) {
                this.$store.commit('drawer', state);
            }
        },
        user() {
            return this.$store.state.session.user || {};
        },
    },



}
</script>
<style lang="scss">
.theme--light.v-navigation-drawer {
    background-color: #fafafa;
}

.main-menu {
    //background-color: #fafafa;

    .v-toolbar__content {
        padding: 0 0 0 16px !important;
    }


    &.v-navigation-drawer--open {
        .v-list__group__header__prepend-icon {
            padding: 0;
        }
    }

    .v-list__group__header__prepend-icon {
        flex: none;
        display: block;

        i {
            margin: 0 0 0 15px;
            width: 48px;
            height: 48px;
        }
    }

    .v-list__group__items {
        .v-list__tile--link {
            padding-left: 63px;
        }
    }


    .v-list {
        padding: 0;
        color: #555;
        font-weight: 700;
        font-size: 1.1em;
        //background: #fafafa;

        // .v-list__tile--active {
        //     color: #ff0066;
        // }


        .v-list__tile__action {
            width: 48px;
            min-width: 48px;
        }

        .v-list__tile__title {
            font-weight: 600;
            font-size: 15px;
        }

    }



    svg {
        margin: auto;
    }
}
</style>