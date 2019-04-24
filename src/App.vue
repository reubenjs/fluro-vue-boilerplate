<template>
    <v-app id="fluro">

        <login v-if="!authenticated"></login>
        <application v-if="authenticated"></application>
    </v-app>
</template>
<script>
import Login from './components/Login.vue';
import Application from './components/layout/Application.vue';
// import Masthead from './components/Masthead.vue';
import { mapGetters } from 'vuex'



export default {
    components: {
        login: Login,
        application: Application,
    },
    computed: {
        ...mapGetters([
            'user',
            'application',
        ]),
        authenticated() {

            var isUser = (this.user);
            var isApplication = (this.application && this.application.authenticationStyle == 'application');
            if (isUser || isApplication) {
                return true;
            }

            return false;
        }
    },
    methods: {},
    created() {

        // if (this.user) {
        //     this.$toasted.show(`Welcome back ${this.user.firstName}!`, {
        //         // icon: 'smiley'
        //     })
        // }



        //   /////////////////////////////////////////////////////


        // //   var instance= this;
        //   console.log('GET API USER', this.$fluro)
        //   var promise = this.$fluro.api.get('session');

        // //   //////////////////////////////////

        //   promise.then(refreshSuccess, refreshFailed);

        // //   //////////////////////////////////

        //   function refreshSuccess(res) {

        // //     var currentUser = instance.$store.session.user;
        //     console.log('SERVER USER', res);

        // //     instance.$store.commit('user', res.data);
        //   }

        // //   //////////////////////////////////

        //   function refreshFailed(err) {
        //     console.log('ERROR!', err);
        // //     instance.$store.dispatch('logout');
        //   }




    },

}
</script>
<style lang="scss">
@import '@/styles/index.scss';

// /* Remove in 1.2 */
// .v-datatable thead th.column.sortable i {
//   vertical-align: unset;
// }
</style>