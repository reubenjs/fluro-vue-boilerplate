import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _ from 'lodash'

///////////////////////////////////////

Vue.config.productionTip = false

/////////////////////////////////////////////////////

import FluroVue from 'fluro-vue';
import FluroVueUI from 'fluro-vue-ui';

Vue.use(FluroVue, { store });
Vue.use(FluroVueUI);

import GlobalComponents from '@/components/global';
Vue.use(GlobalComponents);

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


        //Load the new terminology
        fluro.types.reloadTerminology();

    } else {

        //We are not logged in
        previousLoggedInUser = null;


        if (fluro.applicationToken) {
            //We are authenticated as a static application
            fluro.types.reloadTerminology();
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
        }


        var homeRoute = _.find(router.options.routes, { path: '/' })
        if (homeRoute.meta && homeRoute.meta.requireUser) {
            router.push({ name: 'user.login' });
        } else {
            router.push({ name: 'home' });
        }


    }
}


/////////////////////////////////////////////////////

//Use Fluro as a global singleton 
//So we can easily view/edit/delete content from any component
//usually this would change to a certain route

fluro.global.view = function(partial, modal) {

    //Check if there is an ID on the 
    //object we are trying to navigate to
    //if there is none we can't do much
    if (!partial._id) {
        return;
    }

    //////////////////////////////////////////////

    //Here we check what kind of content it is
    //for example if it's an 'event' we can navigate the user to the
    //'event' page
    if (partial._type) {
        return navigateToItem(partial);
    }

    //////////////////////////////////////////////

    //We need to load some more information about the
    //content we are trying to access before we know where to take the user
    //so load the item then we will have enough info about it to know
    //where to go
    fluro.content.get(partial._id)
        .then(navigateToItem)
        .catch(function(err) {
            //An error occurred so just dispatch globally
            return fluro.error(err);
        })

    //////////////////////////////////////////////

    function navigateToItem(item) {
        //Choose which route depending on what item
        //we are asking to open
        switch (item.definition) {
            // case 'form':
            //Add extra cases here for different definitions
            // break;
            default:

                //No definition
                switch (item._type) {
                    //     case 'event':
                    //         return router.push({
                    //             name: 'events.view',
                    //             params: {
                    //                 id: item._id,
                    //                 slug:item.slug,
                    //             }
                    //         })
                    //         break;
                    //     case 'contact':
                    //         return router.push({
                    //             name: 'people.contacts.view',
                    //             params: {
                    //                 id: item._id,
                    //                 slug:item.slug,
                    //             }
                    //         })
                    //         break;
                    default:
                        // Go to a generic 'view page'
                        router.push({
                            name: 'view',
                            params: {
                                id: item._id,
                                slug: item.slug,
                            }
                        })
                        break;
                }

                break;
        }
    }
}

//fluro.global.edit = function(item, model) {}
//fluro.global.delete = function(item, model) {}

/////////////////////////////////////////////////////

//We don't have to do this but it means that the app
//will make a call to the server just in case permissions
//have changed for the user or the token has changed after loading
//from local storage
fluro.auth.sync();

/////////////////////////////////////////////////////

//Listen for general Fluro errors and print them to screen
//then you can thow an error from anywhere like this this.$fluro.error(err)
fluro.addEventListener('error', function(message) {
    vm.$toasted.show(message, {
        type: 'error',
    })

});

/////////////////////////////////////////////////////

//Use Fluro as an event bus for notifications
//this.$fluro.notication('some message', options) it means we can swap
//out the component we use to render the notifications easily
fluro.addEventListener('notification', function(details) {
    console.log('Notification event', details);
    vm.$toasted.show(details.message, details.options)
});

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
var trackingIDs = _.compact([trackingCode, 'UA-53150761-23']);

var isProduction = (process.env.NODE_ENV === 'production');
//Initialize analytics
Vue.use(VueAnalytics, {
    id: trackingIDs,
    router,
    debug: {
        // enabled:!isProduction,
        sendHitTask: isProduction,
    }
})


///////////////////////////////////////

//Include the Fuse fuzzy searching library
import VueFuse from 'vue-fuse'
Vue.use(VueFuse)

///////////////////////////////////////

//Include Toast notifications for rendering notification
//messages to the screen, feel free to swap this out for another
//component of your choice
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

//Font Awesome Pro
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
library.add(far, fas);

Vue.component('font-awesome-icon', FontAwesomeIcon)
fluro.global.defaultIconLibrary = 'far';

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