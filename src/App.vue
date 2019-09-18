<template>
    <v-app id="fluro">
        <template v-if="!sidebarDisabled">
            <main-sidebar></main-sidebar>
        </template>
        <div class="main-content" :class="mutedClass" @click="hideDrawers()">
            <flex-column>
                <flex-column-header v-if="!headerDisabled">
                    <main-header></main-header>
                </flex-column-header>
                <keep-alive>
                    <router-view :key="routeCacheKey"></router-view>
                </keep-alive>
                <flex-column-footer>
                    <div class="footer">
                        <!-- Optional Fixed Footer -->
                    </div>
                </flex-column-footer>
            </flex-column>
        </div>
        <!-- <template v-if="!actionCartDisabled">
            <action-cart></action-cart>
        </template> -->
    </v-app>
</template>
<script>
//Get the state from our Vuex store
// import { mapGetters } from 'vuex'

//Get the UI components
import MainSidebar from '@/components/layout/MainSidebar.vue';
import MainHeader from '@/components/layout/MainHeader.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';

//Include our SEO Mixin
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
import UIMixin from '@/mixins/UIMixin';
import BreadcrumbMixin from '@/mixins/BreadcrumbMixin';
import { Layout } from 'fluro-vue-ui';


////////////////////////////////

export default {
    components: {
        MainSidebar,
        MainHeader,
        Breadcrumb,
    },
    mixins: [SEOMixin, BreadcrumbMixin, UIMixin, UserMixin, Layout],
    data() {
        return {
            cacheKey: Math.random(),
        }
    },
    created() {
        this.$fluro.addEventListener('cache.reset', this.resetCacheKey);
    },
    beforeDestroy() {
        this.$fluro.removeEventListener('cache.reset', this.resetCacheKey);
    },
    methods: {
        resetCacheKey() {
            
            this.cacheKey = Math.random();
        },
        hideDrawers() {
            this.drawer = false;
        },
    },
    computed: {
        routeCacheKey() {
            //This ensures when we change something in Fluro
            //or we switch user then we can clear out the content on the pages
            var accountID = this.user ? this.$fluro.utils.getStringID(this.user.account) : '';
            return `${this.cacheKey}-${accountID}-${this.$route.name}`;
        },
        mutedClass() {
            if (this.mobile && this.drawer) {
                return 'faded';
            }
        },
        bleed() {
            //Whether a page should be full bleed (no header or sidebar)
            var self = this;
            return _.get(self, '$route.meta.bleed');
        },
        sidebarDisabled() {
            var self = this;
            return self.bleed || !self.user;
        },
        headerDisabled() {
            var self = this;
            return self.bleed || _.get(self, '$route.meta.disableHeader');
        },
        footerDisabled() {
            var self = this;
            return self.bleed || _.get(self, '$route.meta.disableFooter');
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
@import '@/styles/styles.scss';


.breadcrumb-bar {
    padding-left: 10px;
    background: linear-gradient(rgba(#fff, 0), #fff);
}

</style>