<template>
    <v-app class="no-select">
        <main-menu></main-menu>
        <main-toolbar></main-toolbar>
        <v-content class="main-content">
            <!-- <v-container fluid> -->
            <!-- <transition name="fade" mode="out-in"> -->
                <router-view />
                </router-view>
            <!-- </transition> -->
            <!-- </v-container> -->
        </v-content>
    </v-app>
</template>
<script>

import { mapGetters } from 'vuex'


import MainMenu from '@/components/layout/MainMenu.vue';
import MainToolbar from '@/components/layout/MainToolbar.vue';

export default {
    components: {
        'mainMenu': MainMenu,
        'mainToolbar': MainToolbar,
    },

    computed: {
        ...mapGetters([
            'application',
            'user',
        ]),
        // user() {
        //     return this.$store.state.session.user || {};
        // },
    },
    data() {

        var self = this;

        return {
            dialog: false,
        }
    },
    methods: {
        // syncWithServer() {
        //     //Refresh the stats
        //     this.$fluro.stats.refresh();
        // },
        navigateTo(name) {
            this.$router.push({
                name: name,
            })
        },
        logout: function() {
            this.$fluro.auth.logout();
        }
    },
    props: {
        source: String
    }
}
</script>
<style scoped lang="scss">
$transitionTime: 0.3s;

.fade-enter {
    opacity: 0;
    transform: translateY(40px);
}

.fade-enter-active {
    transition: all $transitionTime ease;
}

.fade-leave {}

.fade-leave-active {
    transition: all $transitionTime ease;
    opacity: 0;
    transform: translateY(40px);
}



.main-content {
    padding-bottom: 100px;
}
</style>