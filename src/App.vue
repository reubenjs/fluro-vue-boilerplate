<template>
    <v-app id="fluro">
        <main-menu></main-menu>
        <main-toolbar v-if="!headerDisabled"></main-toolbar>
        <v-content class="main-content">
            <router-view />
        </v-content>
        <wrapper class="footer" xs v-if="!footerDisabled">
            <constrain sm>
                <v-layout>
                    <div class="footer-links">
                        <a href="https://www.fluro.io" target="_blank">Powered by Fluro</a>
                    </div>
                    <v-spacer></v-spacer>
                    <div>&copy; {{ new Date().getFullYear() }}</div>
                </v-layout>
            </constrain>
        </wrapper>
    </v-app>
</template>
<script>
//Get the state from our Vuex store
// import { mapGetters } from 'vuex'

//Get the UI components
import MainMenu from '@/components/layout/MainMenu.vue';
import MainToolbar from '@/components/layout/MainToolbar.vue';

//Include our SEO Mixin
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
import { Layout } from 'fluro-vue';

////////////////////////////////

export default {
    components: {
        MainMenu,
        MainToolbar,
    },
    mixins: [SEOMixin, UserMixin, Layout],
    computed: {
        footerDisabled() {
            var self = this;
            return _.get(self, '$route.meta.disableHeader');
        },
        headerDisabled() {
            var self = this;
            return _.get(self, '$route.meta.disableFooter');
        },
        authenticated() {

            //Returns true if we are running as an app or logged in as a user
            var isUser = (this.user);
            var isApplication = (this.application && this.application.authenticationStyle == 'application');

            if (isUser || isApplication) {
                return true;
            }

            //We're not authenticated at all
            return false;
        }
    },
}
</script>
<style lang="scss">
@import '@/styles/index.scss';
</style>