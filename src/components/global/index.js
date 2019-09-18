

//Import Components
import Vue from 'vue';
import Page from '../layout/Page.vue';
// import Tabset from '../tabset/Tabset.vue';
// import Tab from '../tabset/Tab.vue';

/////////////////////////////////////////////////////

export default {
    install: function(Vue, options) {
        Vue.component('page', Page);
        // Vue.component('tabset', Tabset);
        // Vue.component('tab', Tab);
    }

}


////////////////////////////////////////////////////////////////////
