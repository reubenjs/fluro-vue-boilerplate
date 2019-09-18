import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import RouterHistory from './history';



///////////////////////////////////

//Generic View Route
const View = () => import('./routes/View.vue');

///////////////////////////////////

//Use the router
Vue.use(Router)

///////////////////////////////////


var array = [];

///////////////////////////////////

//Routes
const Home = () => import('./routes/Home.vue');
array.push({
    name: 'home',
    path: '/',
    meta: {
        title: 'Home',
        requireUser: true,
        resetHistory: true,
        disableBreadcrumb: true,
    },
    component: Home,
    props: (route) => ({
        // photo: route.query.photo,
    })
})



///////////////////////////////////

//Routes
const Help = () => import('./routes/Help.vue');
array.push({
    name: 'help',
    path: '/help',
    meta: {
        title: 'Help',
        requireUser: true,
        resetHistory: true,
        disableBreadcrumb: true,
    },
    component: Help,
    props: (route) => ({
        // photo: route.query.photo,
    })
})

//////////////////////////////////////

array.push({
    name: 'view',
    path: '/view/:slug',
    meta: {
        title: 'View',
        disableBreadcrumb: true,
        requireUser: true,
        resetHistory: true,
    },
    props: (route) => ({
        slug: route.params.slug,
    }),
    component: View,
})

//////////////////////////////////////

//User Authentication Routes
const UserLogin = () => import('./routes/UserLogin.vue');
const UserSignup = () => import('./routes/UserSignup.vue');
const UserForgot = () => import('./routes/UserForgot.vue');
const UserReset = () => import('./routes/UserReset.vue');
const UserAccounts = () => import('./routes/UserAccounts.vue');

array.push({
    name: 'user.login',
    path: '/user/login',
    meta: {
        title: 'Login',
        bleed: true,
        denyUser: true,
        resetHistory: true,
        disableBreadcrumb: true,
        search: {
            disabled: true,
        }
    },
    component: UserLogin,
})

array.push({
    name: 'user.signup',
    path: '/user/signup',
    meta: {
        title: 'Signup',
        bleed: true,
        denyUser: true,
        resetHistory: true,
        disableBreadcrumb: true,
        search: {
            disabled: true,
        }
    },
    component: UserSignup,
})

array.push({
    name: 'user.forgot',
    path: '/user/forgot',
    meta: {
        title: 'Forgot Password',
        bleed: true,
        denyUser: true,
        disableBreadcrumb: true,
        resetHistory: true,
        search: {
            disabled: true,
        }
    },
    component: UserForgot,
})

array.push({
    name: 'user.reset',
    path: '/user/reset',
    meta: {
        title: 'Reset Your Password',
        bleed: true,
        denyUser: true,
        disableHeader: true,
        disableBreadcrumb: true,
        disableFooter: true,
        resetHistory: true,
        search: {
            disabled: true,
        }
    },
    component: UserReset,
    props: (route) => ({
        token: route.query.token,
    })
})

array.push({
    name: 'user.accounts',
    path: '/user/accounts',
    meta: {
        title: 'My Accounts',
    },
    component: UserAccounts,
    meta: {
        requireUser: true,
        resetHistory: true,
        disableBreadcrumb: true,
        search: {
            disabled: true,
        }
    },
})



//////////////////////////////////////

const Search = () => import('./routes/Search.vue');

array.push({
    name: 'search',
    path: '/search',
    meta: {
        title: 'Search',
        requireUser: true,
        disableBreadcrumb: true,
        resetHistory: true,
    },
    component: Search,
    props: (route) => ({
        keywords: route.query.keywords || '',
        photo: route.query.photo,

    })
})

///////////////////////////////////

var router = new Router({
    mode: 'history',
    routes: array,
    scrollBehavior(to, from, savedPosition) {

        //Keep track of where the user was scrolled
        //if they hit the back button
        var pos = 0;
        // Scroll to the top
        if (savedPosition) {
            pos = savedPosition.y;
        }
        document.body.scrollTop = document.documentElement.scrollTop = pos;
    },
});

///////////////////////////////////

router.beforeEach((to, from, next) => {


    //If on mobile and the menu drawer is open, 
    //then close the drawer when the users changes page
    if (Vue.prototype.$vuetify.breakpoint.smAndDown) {
        store.commit('ui/drawer', false)
    } else {
        store.commit('ui/drawer', false)
    }

    /////////////////////////////////////////

    if (to.meta) {
        //Get the user session from fluro
        var user = store.getters['fluro/user'];

        /////////////////////////////////////////

        //If the route requires the user to be logged in
        if (to.meta.requireUser) {
            if (user) {
                return next();
            }

            console.log('Route is only accessible to logged in users', to.fullPath)
            RouterHistory.intendedPath = to.fullPath;

            return next('/user/login')
        }

        /////////////////////////////////////////

        //If the route only allows logged out users
        if (to.meta.denyUser) {
            if (!user) {
                return next();
            }

            console.log('Route is not accessible to logged in users')
            return next('/')
        }
    }

    /////////////////////////////////////////


    return next();
})

///////////////////////////////////

RouterHistory.init(router);


///////////////////////////////////

export default router;

///////////////////////////////////