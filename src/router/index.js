import Vue from 'vue'
import Router from 'vue-router'
import Home from './routes/Home.vue'
import Search from './routes/Search.vue'
import store from '../store'

///////////////////////////////////

//User Authentication Routes
import UserLogin from './routes/UserLogin.vue'
import UserSignup from './routes/UserSignup.vue'
import UserForgot from './routes/UserForgot.vue'
import UserReset from './routes/UserReset.vue'
import UserAccounts from './routes/UserAccounts.vue'

///////////////////////////////////

//Use the router
Vue.use(Router)

///////////////////////////////////

//Create an event bus so we can reuse the search bar in the toolbar for different routes
var $globalSearch = new Vue();
Vue.prototype.$globalSearch = $globalSearch;

///////////////////////////////////



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

//////////////////////////////////////

array.push({
    name: 'user.login',
    path: '/user/login',
    meta: {
        title: 'Login',
        denyUser: true,
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
        denyUser: true,
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
        denyUser: true,
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
        denyUser: true,
        disableHeader:true,
        disableFooter:true,
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
        search: {
            disabled: true,
            //         label: 'Search accounts',
            //         component: $globalSearch,
        }
    },
})

//////////////////////////////////////


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
    //Close the drawer whenever we change route
    store.commit('ui/drawer', false)

    if (to.meta) {
        //Get the user session from fluro
        var user = store.getters['fluro/user'];

        //If the route doesn't allow logged in users
        if(to.meta.requireUser) {
            if(user) {
                return next();
            }

            console.log('Route is only accessible to logged in users')
            return next('/user/login')
        }

        //If the route only allows logged in users
        if(to.meta.denyUser) {
            if(!user) {
                return next();
            }

            console.log('Route is not accessible to logged in users')
            return next('/')
        }
    }


    return next();
})





///////////////////////////////////

export default router;

///////////////////////////////////