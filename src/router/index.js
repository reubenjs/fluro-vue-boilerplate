import Vue from 'vue'
import Router from 'vue-router'
import Home from './routes/Home.vue'
import Accounts from './routes/Accounts.vue'
import Latest from './routes/Latest.vue'
import Realm from './routes/Realm.vue'
import Photographer from './routes/Photographer.vue'
import ExplorePhotographer from './routes/ExplorePhotographer.vue'
import ExploreEvent from './routes/ExploreEvent.vue'
import ExploreRealm from './routes/ExploreRealm.vue'
import ExploreTag from './routes/ExploreTag.vue'
import ExploreKeyword from './routes/ExploreKeyword.vue'
import Event from './routes/Event.vue'
import Tag from './routes/Tag.vue'
import Keyword from './routes/Keyword.vue'
import Search from './routes/Search.vue'
import Pinned from './routes/Pinned.vue'
import UploadSelect from './routes/UploadSelect.vue'
import UploadPanel from './routes/UploadPanel.vue'
// import Home from './routes/Home.vue'
// import Photo from './routes/Photo.vue'
import _ from 'lodash';

///////////////////////////////////


///////////////////////////////////

//Use the router
Vue.use(Router)

///////////////////////////////////

//Create an event bus so we can reuse the search bar on different routes
var $globalSearch = new Vue();
Vue.prototype.$globalSearch = $globalSearch;

///////////////////////////////////

var array = [];

///////////////////////////////////

array.push({
    name: 'home',
    path: '/',
    meta: {
        title: 'Welcome',
    },
    component: Home,
    props: (route) => ({
        photo: route.query.photo,
    })
})

array.push({
    name: 'upload',
    path: '/upload',
    meta: {
        title: 'Upload',
    },
    component: UploadSelect,
    // meta: {
    //     search: {
    //         label: 'Search events',
    //         component: $globalSearch,
    //     }
    // },
})



array.push({
    name: 'upload.event',
    path: '/upload/:id',
    meta: {
        title: 'Upload',
    },
    component: UploadPanel,
})


// array.push({
//     name:'home',
//     path: '/',
//     title: 'Latest',
//     component: Latest,
//     props: (route) => ({
//         photo:route.query.photo,
//     })
// })

array.push({
    name: 'latest',
    path: '/latest',
    meta: {
        title: 'Latest Photos',
    },
    component: Latest,
    props: (route) => ({
        photo: route.query.photo,
        definition: route.query.definition,
    })
})


array.push({
    name: 'user.accounts',
    path: '/user/accounts',
    meta: {
        title: 'My Accounts',
    },
    component: Accounts,
    meta: {
        search: {
            label: 'Search accounts',
            component: $globalSearch,
        }
    },
})

array.push({
    name: 'search',
    path: '/search',
    meta: {
        title: 'Search',
    },
    component: Search,
    props: (route) => ({
        keywords: route.query.keywords || '',
        photo: route.query.photo,

    })
})


array.push({
    name: 'explore.event',
    path: '/event',
    meta: {
        title: 'Events',
    },
    component: ExploreEvent,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        definition: route.query.definition,
    })
})


array.push({
    name: 'event',
    path: '/event/:id',
    meta: {
        title: 'Event',
    },
    component: Event,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        photo: route.query.photo,
        definition: route.query.definition,
    })
})


array.push({
    name: 'explore.tag',
    path: '/tag',
    meta: {
        title: 'Tags',
    },
    component: ExploreTag,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        definition: route.query.definition,
        definition: route.query.definition,
    })
})


array.push({
    name: 'tag',
    path: '/tag/:id',
    meta: {
        title: 'Tag',
    },
    component: Tag,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        photo: route.query.photo,
        definition: route.query.definition,
    })
})


array.push({
    name: 'explore.keyword',
    path: '/keyword',
    meta: {
        title: 'Keywords',
    },
    component: ExploreKeyword,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        definition: route.query.definition,
        definition: route.query.definition,
    })
})


array.push({
    name: 'keyword',
    path: '/keyword/:id',
    meta: {
        title: 'Keyword',
    },
    component: Keyword,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        photo: route.query.photo,
        definition: route.query.definition,
    })
})


// array.push({
//     name: 'explore.pins',
//     path: '/pins',
//     title: 'Pinned',
//     component: Pinned,
//     props: (route) => ({
//         currentPage: parseInt(route.query.page) || 1,
//         photo: route.query.photo,
//     })
// })



array.push({
    name: 'explore.realm',
    path: '/realm',
    meta: {
        title: 'Realms',
    },
    component: ExploreRealm,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        definition: route.query.definition,
    })
})


array.push({
    name: 'realm',
    path: '/realm/:id',
    meta: {
        title: 'Realm',
    },
    component: Realm,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        photo: route.query.photo,
    })
})

array.push({
    name: 'explore.photographer',
    path: '/photographer',
    meta: {
        title: 'Photographers',
    },
    component: ExplorePhotographer,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
    })
})


array.push({
    name: 'photographer',
    path: '/photographer/:id',
    meta: {
        title: 'Photographer',
    },
    component: Photographer,
    props: (route) => ({
        currentPage: parseInt(route.query.page) || 1,
        photo: route.query.photo,
    })
})

// array.push({
//     name:'photo',
//     path: '/photo/:id',
//     title: 'Photo',
//     component: Photo,
// })



///////////////////////////////////

export default new Router({
    mode: 'history',
    routes: array,
    scrollBehavior(to, from, savedPosition) {

        // console.log('PreviousPositon', to, from, savedPosition);
        var pos = 0;
        // Scroll to the top
        if (savedPosition) {
            pos = savedPosition.y;
        }
        document.body.scrollTop = document.documentElement.scrollTop = pos;


    }
})

///////////////////////////////////