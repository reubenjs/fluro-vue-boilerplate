import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

///////////////////////////////////////

Vue.config.productionTip = false

///////////////////////////////////////

//Include Lodash, and add it globally because it's awesome
import _ from 'lodash';
Vue.prototype._ = _;

/////////////////////////////////////////////////////

import Fluro from 'fluro-vue';
Vue.use(Fluro, { store });

//Listen for when the user session changes
var fluro = Vue.prototype.$fluro;
fluro.auth.addEventListener('change', userUpdated);

/////////////////////////////////////////////////////

function userUpdated(user) {
    // var user = fluro.auth.getCurrentUser();
    store.commit('user', user);


    /////////////////////////////////////////////////////

    function loadRelevantDefinitions() {
        //Retrieve the definitions from this account
        //that are relevant for this app eg. defined realms, events, tags etc
        //and store them with vuex so we can use their titles in the menu
        fluro.types.retrieve([
            'image',
            'realm',
            'tag',
            'event',
        ], { flat: true }).then(function(res) {
            store.commit('definitions', res.data);
        });
    }

    /////////////////////////////////////////////////////

    //If there is no user
    //then we don't have any definitions
    if (user) {
        loadRelevantDefinitions();
    } else {

        //If there is an app
        if (fluro.applicationToken) {
            loadRelevantDefinitions();
        } else {
            store.commit('definitions', {});
        }
    }
}

///////////////////////////////////////

//Helper for validating form input and login form
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

//Helper for local fuzzy search in javascript
import VueFuse from 'vue-fuse';
Vue.use(VueFuse)

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
//         'arrow-left': {
//             component: FontAwesomeIcon,
//             props: {
//                 icon: ['far', 'arrow-left']
//             }
//         }
//     }
// })




///////////////////////////////////////

//Include filters globally
Vue.prototype.$filters = Vue.options.filters

///////////////////////////////////////


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')