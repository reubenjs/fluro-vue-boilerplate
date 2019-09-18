<template>
    <div class="main-sidebar" :class="expandClass">
        <flex-column>
            <flex-column-header>
                <div class="header" @click.stop="toggle()">
                    <v-layout>
                        <div class="toggle">
                            <v-btn icon dark flat>
                                <fluro-icon v-if="drawer" icon="times" />
                                <fluro-icon v-else icon="bars" />
                            </v-btn>
                        </div>
                        <v-flex d-flex align-center class="application-title" v-if="drawer">{{title}}</v-flex>
                    </v-layout>
                </div>
            </flex-column-header>
            <flex-column-body>
                <ul class="menu">
                    <li v-for="item in menuItems" :class="{expanded:expanded == item && drawer}">
                        <a @click="clicked(item)">
                            <div class="icon">
                                <fluro-icon library="fas" :icon="item.icon" />
                            </div>
                            <span v-if="drawer" class="text">{{item.text}}</span>
                            <div class="caret" v-if="item.children">
                                <fluro-icon icon="angle-down" />
                            </div>
                            <!-- <pre>{{item}}</pre> -->
                            <!-- } -->
                        </a>
                        <ul class="menu" v-if="item.children">
                            <li v-for="item in item.children">
                                <a @click="clicked(item)">
                                    <!-- <router-link :to="{name:item.route}"> -->
                                    <div class="icon">
                                        <fluro-icon  :icon="item.icon" />
                                    </div>
                                    <span v-if="drawer" class="text">{{item.text}}</span>
                                    <!-- <pre>{{item}}</pre> -->
                                    <!-- } -->
                                    <!-- </router-link> -->
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </flex-column-body>
            <flex-column-footer>
                <ul class="menu small">
                    <li>
                        <router-link :to="{name:'help'}">
                            <div class="icon">
                                <fluro-icon icon="question" library="fas" />
                            </div>
                            <span v-if="drawer" class="text">Help</span>
                        </router-link>
                    </li>
                    <!-- <li>
                        <router-link :to="{name:'help'}">
                            <div class="icon">
                                <fluro-icon icon="cog" />
                            </div>
                            <span v-if="drawer" class="text">Configuration</span>
                        </router-link>
                    </li> -->
                </ul>
            </flex-column-footer>
        </flex-column>
    </div>
</template>
<script>
// import { mapGetters, mapMutations, mapState } from 'vuex';


import Vue from 'vue';
import UserMixin from '@/mixins/UserMixin';
import UIMixin from '@/mixins/UIMixin';

var previousBreakpointChange;

export default {
    mixins: [UserMixin, UIMixin],
    methods: {
        resize(event) {
            if (previousBreakpointChange != this.$vuetify.breakpoint.name) {
                previousBreakpointChange = this.$vuetify.breakpoint.name;


                if (this.mobile) {
                    this.drawer = false;
                }
            }
        },
        toggle() {
            this.drawer = !this.drawer;
        },
        logout() {
            this.$fluro.auth.logout();
            this.drawer = false;
        },
        clicked(item) {

            var self = this;


            if (item.children && self.drawer) {
                if (self.expanded == item) {
                    self.expanded = null
                } else {
                    self.expanded = item;
                }

                console.log('toggle expanded', item)
                return;
            }


            if (item.route) {
                this.$router.push({ name: item.route });
            }
        }
    },
    mounted() {
        previousBreakpointChange = this.$vuetify.breakpoint.name;
        window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },
    data() {
        return {
            expanded: null,
        }
    },
    computed: {
        expandClass() {

            if (this.mobile) {
                if (this.drawer) {
                    return 'expanded'
                }

                return;
            }

            ////////////////////////////

            if (this.drawer) {
                return 'expanded'
            }

            return 'mini';



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
            })

            menu.push({
                icon: 'users',
                text: 'People',
                route: 'people.contacts',
                children: [{
                        icon: 'contact',
                        text: 'Contacts',
                        route: 'people.contacts',
                    },

                    {
                        icon: 'team',
                        text: 'Groups and Teams',
                        route: 'people.groups',
                    },

                    {
                        icon: 'persona',
                        text: 'User Personas',
                        route: 'people.personas',
                    },

                ]
            })

            menu.push({
                icon: 'calendar-star',
                text: 'Events',
                route: 'events.list',
                // children: [
                //     {
                //         icon: 'event',
                //         text: 'Calendar',
                //         route: 'events',
                //     },
                //     {
                //         icon: 'event',
                //         text: 'Roster',
                //         route: 'events',
                //     },

                // ]
            })

            menu.push({
                icon: 'file-signature',
                text: 'Forms',
                route: 'forms',
            })

            menu.push({
                icon: 'exchange',
                text: 'Processes',
                route: 'processes',
            })

            menu.push({
                icon: 'paper-plane',
                text: 'Messaging',
                route: 'messaging',
            })

            menu.push({
                icon: 'box-full',
                text: 'Content',
                route: 'content',
                children: [{
                        icon: 'article',
                        text: 'Articles and Documents',
                        route: 'content.articles',
                    },

                    {
                        icon: 'media',
                        text: 'Files, Assets and Media',
                        route: 'content.files',
                    },

                    // {
                    //     icon: 'media',
                    //     text: 'Photos',
                    //     route: 'content.photos',
                    // },

                    // {
                    //     icon: 'media',
                    //     text: 'Videos',
                    //     route: 'content.videos',
                    // },

                    // {
                    //     icon: 'media',
                    //     text: 'Audio',
                    //     route: 'content.audio',
                    // },
                ],
            })



            menu.push({
                icon: 'image',
                text: 'Photos',
                route: 'photos',
                children: [
                    {
                        icon: 'clock',
                        text: 'Latest Photos',
                        route: 'photos.latest',
                    },

                    {
                        icon: 'bullseye',
                        text: 'Realms',
                        route: 'photos.realms',
                    },

                    {
                        icon: 'calendar',
                        text: 'Events',
                        route: 'photos.events',
                    },

                    {
                        icon: 'tag',
                        text: 'Tags',
                        route: 'photos.tags',
                    },

                    {
                        icon: 'camera',
                        text: 'Photographers',
                        route: 'photos.photographers',
                    },

                    

                    // {
                    //     icon: 'media',
                    //     text: 'Photos',
                    //     route: 'content.photos',
                    // },

                    // {
                    //     icon: 'media',
                    //     text: 'Videos',
                    //     route: 'content.videos',
                    // },

                    // {
                    //     icon: 'media',
                    //     text: 'Audio',
                    //     route: 'content.audio',
                    // },
                ],
            })




            menu.push({
                icon: 'usd-square',
                text: 'Finance',
                route: 'finance',
            })

            // ////////////////////////////////

            // //If we aren't logged in
            // if (!this.user) {
            //     menu.push({
            //         icon: 'sign-in-alt',
            //         text: 'Login',
            //         route: 'user.login',
            //     })

            //     menu.push({
            //         icon: 'user',
            //         text: 'Signup',
            //         route: 'user.signup',
            //     })
            // }

            ////////////////////////////////

            // //If we are logged in
            // if (this.user) {

            //     //If we are an actual Fluro user
            //     //and not a whitelabelled managed persona
            //     if (this.user.accountType != 'managed') {

            //         //Add a link to the switch accounts page
            //         menu.push({
            //             icon: 'user',
            //             text: 'Switch Accounts',
            //             route: 'user.accounts',
            //         })
            //     }


            //     //Add a link to the switch accounts page
            //     menu.push({
            //         icon: 'sign-out-alt',
            //         text: 'Sign Out',
            //         click: 'logout',
            //     })
            // }

            ////////////////////////////////

            return menu;
        },
    },



}
</script>
<style scoped lang="scss">
.main-sidebar {
    background: #33373e;//lighten(#33373e, 5%) !important;
    width: 0;
    color: #8691a5;
    transition: transform 0.2s;
    display: flex;


    @extend .no-select;

    .toggle {
        width:60px;
        text-align: center;
    }


    ul.menu {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: block;

        li {
            list-style-type: none;
            display: block;
            margin: 0;
            padding: 0;

            &.expanded {
                background: rgba(#000, 0.1);

                & > a {
                    color: #fff;
                }

                ul {
                    display: block;
                }

                .caret {
                    svg {
                        transform: rotate(180deg);
                    }
                }
            }



            a {
                // display: block;
                display: flex;
                align-items: center;
                color: inherit;
                text-decoration: none;
                white-space: nowrap;
                position: relative;
                transition: all 0.2s;
                font-weight: 500;
                color: #8691a5;//rgba(#fff, 0.5);


                &.active, 
                &:hover {
                    background: rgba(#000, 0.1);
                    color: #fff;
                }

                .icon {
                    font-size: 20px;
                    width: 60px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    // color: rgba(#fff, );
                }



            }

            ul {
                display: none;

                li {
                    a {


                        .icon {
                            width: 60px;
                            height: 30px;
                            line-height: 30px;
                        }
                    }
                }
            }


        }


        &.small {
            background: rgba(#000, 0.1);
            // padding: 10px 0;

            li {
                a {
                    .icon {
                        height: 40px;
                        line-height: 40px;
                        font-size: 13px;
                    }
                }
            }
        }
    }


    &.mini {
        width: 60px;
    }


    .caret {
        position: absolute;
        display: none;

        right: 0;
        bottom: 0;
        top: 0;
        width: 30px;
        height: 100%;
        align-items: center;
        text-align: center;

        svg {
            display: inline-block;
            transition: transform 0.3s;
        }
    }



    &.expanded {
        width: 250px;

        .caret {
            display: flex !important;
        }

        .icon {
            color: inherit !important;
        }


    }

    .header {
        height: 60px;
        // background: rgba(#000, 0.1);
        background: linear-gradient(30deg, #10bed0, #45ffa9);
        display: flex;
        align-items: center;
        justify-content: center;
        // width:1;
        flex: 1;
        color: #fff !important;

        font-weight: 500;
        font-size: 16px;
    }

    @media(max-width:768px) {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: 20;
        transform: translateX(-100%);
        width: 280px;


        &.expanded {
            transform: translateX(0);
            box-shadow: 0 0 25px 10px rgba(#000, 0.5);
        }
    }


}
</style>