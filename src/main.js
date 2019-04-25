import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

///////////////////////////////////////

Vue.config.productionTip = false


/////////////////////////////////////////////////////

import FluroVue from 'fluro-vue';
Vue.use(FluroVue, { store });


/////////////////////////////////////////////////////

//Listen for when the user session changes
var fluro = Vue.prototype.$fluro;
fluro.auth.addEventListener('change', userUpdated);

/////////////////////////////////////////////////////

//Keep track of whether the user is logged in
var previousLoggedInUser;

//Everytime the user changes
function userUpdated(user) {

    //Check if the user was logged in before this change
    var wasLoggedInAs = previousLoggedInUser;

    if (user) {
        //We are authenticated as a user
        previousLoggedInUser = user;
    } else {

        //We are not logged in
        previousLoggedInUser = null;


        if (fluro.applicationToken) {
            //We are authenticated as a static application
        } else {
            //We are not authenticated at all
        }

        //If we were logged in before
        //and now we aren't
        if (wasLoggedInAs) {

            self.$toasted.show(`Bye ${wasLoggedInAs.firstName}!`, {
                // icon:'check'
                duration: 3500,
                type: 'success',
            })


            //Redirect to the home page
            router.push({ name: 'home' });
            

        }
    }
}

/////////////////////////////////////////////////////

import createPersistedState from 'vuex-persistedstate'
//Add local storage persistence to vuex
//We need to do this after FluroVue has been installed
//Because it dynamically registers it's own vuex store module
createPersistedState()(store);




///////////////////////////////////////

//Helper for validating form input and login form
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)


//Helper for SEO, Page title and meta tags
import VueHead from 'vue-head'
Vue.use(VueHead, {
    separator: '-',
})

///////////////////////////////////////

//Helper for Google Analytics tracking
import VueAnalytics from 'vue-analytics';

//Get a tracking code for the application
//and include the Fluro tracking code
var trackingCode = _.get(window, 'applicationData.gaTrackingCode');
var trackingIDs = _.compact([trackingCode, 'UA-53150761-6']);

//Initialize analytics
Vue.use(VueAnalytics, {
    id: trackingIDs,
    debug: {
        sendHitTask: process.env.NODE_ENV === 'production'
    }
})


///////////////////////////////////////

//Include the AsyncComputed Plugin
//because it makes life easy!
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)


//Include Toast notifications
import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    // position: 'bottom-center',
    position: 'top-center',
    iconPack: 'far',
    type: 'info',
    singleton: true,
    // theme:'bubble',
    duration: 2000,
    // action : [
    // {
    // text : 'Cancel',
    // onClick : (e, toastObject) => {
    //     toastObject.goAway(0);
    // }
    // },
    // {
    //     text : 'Ok',
    //     onClick : (e, toastObject) => {
    //         toastObject.goAway(0);
    //     }
    // router navigation
    // push : { 
    //     name : 'somewhere',
    //     // this will prevent toast from closing
    //     dontClose : true
    //  }
    // }
    // ]
    // fullWidth:true,
    // fitToScreen:true,
})

//////////////////////////////////////

//Use Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(far, fas);

///////////////////////////////////////

import Vuetify from 'vuetify'
Vue.use(Vuetify, {
    iconfont: 'far'
});


///////////////////////////////////////

//Include filters globally
Vue.prototype.$filters = Vue.options.filters

///////////////////////////////////////


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')