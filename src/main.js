import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

///////////////////////////////////////

Vue.config.productionTip = false


/////////////////////////////////////////////////////

import FluroVue from 'fluro-vue';
Vue.use(FluroVue, { store });

//Include the Fuse fuzzy searching library
import VueFuse from 'vue-fuse'
Vue.use(VueFuse)

/////////////////////////////////////////////////////

//Listen for when the user session changes
var fluro = Vue.prototype.$fluro;
fluro.auth.addEventListener('change', userUpdated);

/////////////////////////////////////////////////////

//Keep track of whether the user is logged in
var previousLoggedInUser;
var vm;

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
            vm.$toasted.show(`See you next time ${wasLoggedInAs.firstName}!`, {
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

//Use Fluro as a global singleton 
//So we can easily view/edit/delete content from any component
//usually this would change to a certain route
fluro.global.view = function(item, modal) {

    //Choose which route depending on what item
    //we are asking to open
    switch (item.definition) {
        case 'forum':
            var firstCategory = _.find(item.realms, { definition: 'forumCategory' });
            router.push({
                name: 'forum.post',
                params: {
                    category: firstCategory.slug,
                    post: item.slug,
                }

            })
            break;
        default:

            //Navigate to the page
            router.push({
                name: 'view',
                params: {
                    slug: item.slug,
                }
            })
            break;
    }
}

//fluro.global.edit = function(item, model) {}
//fluro.global.delete = function(item, model) {}


/////////////////////////////////////////////////////

//Don't have to do this
//but it means that the app
//will make a call to the server just in case permissions
//have changed
fluro.auth.sync();

/////////////////////////////////////////////////////

//Listen for Fluro errors and print them to screen
fluro.addEventListener('error', function(message) {

    vm.$toasted.show(message, {
        type: 'error',
    })

});



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



///////////////////////////////////////

//Include the AsyncComputed Plugin
//because it makes life easy!
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)


//////////////////////////////////////


//Use Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)


//Font Awesome Free
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);

//Font Awesome Pro
// import { fas } from '@fortawesome/pro-solid-svg-icons'
// import { far } from '@fortawesome/pro-regular-svg-icons'
// library.add(far, fas);




///////////////////////////////////////


import Vuetify from 'vuetify'
import '@/styles/vuetify.styl';
Vue.use(Vuetify, {
    customProperties: true,
    // iconfont: 'far',
    theme: {
        dark: '#33373e',
        primary: '#1bc3fe',
        secondary: '#d1f18a',
    }
});



///////////////////////////////////////

//Include filters globally
Vue.prototype.$filters = Vue.options.filters

///////////////////////////////////////


vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')