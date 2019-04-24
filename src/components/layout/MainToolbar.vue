<template>
    <v-toolbar class="main-toolbar elevation-0" app fixed>
        <!-- style="width: 300px" class="ml-0 pl-3" -->
        <v-toolbar-title>
            <div class="hidden-sm-and-down">
                {{title}}
            </div>
            <!--" -->
            <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="toggleDrawer()"></v-toolbar-side-icon>
        </v-toolbar-title>
        <div class="search-wrapper">
            <v-text-field flat solo hide-details prepend-inner-icon="search" :label="searchLabel" @focus="searchFocus" class="mainsearch" v-model="keywords" v-on:keyup.enter="submit"></v-text-field>
        </div>
        <div v-if="canUpload">
            <v-btn color="success" :to="{name:'upload'}">
                <span>Upload</span>
                <font-awesome-icon right :icon="['far', 'arrow-up']" />

            </v-btn>
        </div>
        <v-menu v-if="user" :nudge-width="250" :nudge-bottom="5" offset-y>
            <template v-slot:activator="{ on }">
                <div v-on="on" style="margin-left: 15px;">
                    <fluro-avatar slot="activator" class="md" :id="user._id" type="user"></fluro-avatar>    
                </div>
            </template>
            <v-card tile>
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <fluro-avatar slot="activator" class="xl" :id="user._id" type="user"></fluro-avatar>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{user.firstName}} {{user.lastName}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{user.account.title}}</v-list-tile-sub-title>
                            <!-- <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title> -->
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                    <v-list-tile active-class router-link-exact-active :to="{ name: 'user.accounts'}">
                        <v-list-tile-title>Switch Account</v-list-tile-title>
                    </v-list-tile>
                    <!-- <v-list-tile> -->
                    <!-- </v-list-tile> -->
                    <v-list-tile @click="logout()">
                        <v-list-tile-title>Logout</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-menu>
    </v-toolbar>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex'

export default {
    // props:['items'],
    data() {

        var initialKeywords = this.$route.query.keywords || '';

        return {
            keywords: initialKeywords,
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

            if (self.isMobile) {
                self.closeDrawer();
            }

            if (to.name != 'search') {

                if (self.keywords && self.keywords.length) {
                    self.keywords = null;
                }

            }
        },
        toggleDrawer() {
            this.$store.commit('drawer', !this.$store.state.app.drawer);
        },
        closeDrawer() {
            this.$store.commit('drawer', false);
        },
        searchFocus() {

            if(this.routeSearch) {
                return;
            }

            this.$router.push({
                name: 'search',
                query: {
                    keywords: this.keywords,
                }
            })
        },
        logout: function() {

            var self = this;
            var user = this.user;

            this.$fluro.auth.logout();
            self.$toasted.show(`See you next time!`, {
                // icon:'check'
                duration:2000,
                type:'success',
            })

        },
        keywordsChanged: _.debounce(function(keywords) {
            //console.log('Search activated')
            this.submit();
        }, 500),

        submit() {

            //If the search should be context sensitive to the page its on
            if(this.routeSearch) {
                //Fire an event so the route can hear it
                return this.routeSearch.component.$emit('search', this.keywords);
            }

            if (this.keywords && this.keywords.length) {
                this.$router.push({
                    query: {
                        keywords: this.keywords
                    }
                })
            } else {
                this.$router.push({ query: {} })
            }

        }
    },
    computed: {
        ...mapGetters([
            'application',
            'user',
        ]),
        canUpload() {
            if(_.startsWith(this.$route.name, 'upload')) {
                return;
            }
            return this.$fluro.access.can('create', 'photo', 'image');
        },
        routeSearch() {
            return _.get(this, '$route.meta.search');
        },
        searchLabel() {

            var label = 'Search for photos';
            if(this.routeSearch) {
                label = this.routeSearch.label;
            }

            return label;
        },
        title() {

            //console.log(this);
            if (this.user) {
                return this.user.account.title;
            }

            if (this.application) {
                return this.application.title;
            }

        },
        isMobile() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return true;
                    break;
            }
        },
        allowUpload() {
            return this.$route.name != 'search';
        },
    }
}
</script>
<style lang="scss">
.theme--light.v-toolbar {
    background: #fafafa;

    .v-toolbar__title {
        font-weight: 700;
        letter-spacing: -0.02em;
        padding-right: 15px;
    }
}

.search-wrapper {
    flex: 1;
    text-align: center;
    justify-content: center;
    display: flex;
}

.mainsearch {
    flex: 1;
    max-width: 450px;


    &.theme--light.v-text-field--solo>.v-input__control {


        @media(max-width: 768px) {
            min-height: 36px;
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
</style>