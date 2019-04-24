import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'


////////////////////////////////////////

//Modules
// import counter from './modules/counter';
import session from './modules/session';
import app from './modules/app';


//Initiate Vuex
Vue.use(Vuex)

////////////////////////////////////////

//Create the store
const store = new Vuex.Store({
    plugins: [createPersistedState()],
    // state:{},
    // mutations:{},
    // getters:{},
    // actions:{},
    modules:{
      app,
      session,
    },
    state: {
        showInformation:false,
    //     counter: 0,
    },
    mutations: {
        showInformation(state, data) {
            state.showInformation = data;
        },
    },
    //     counter(state, data) {
    //         state.counter = data;
    //     },
    // },
    // getters: {
    //     user(state) {
    //         return state.user;
    //     },
    //     accessToken(state) {
    //         if (!state.user) {
    //             return;
    //         }

    //         return state.user.token;
    //     },
    //     refreshToken(state) {
    //         if (!state.user) {
    //             return;
    //         }

    //         return state.user.refreshToken;
    //     },
    // },
    // actions: {
    //     logout({commit}) {
    //       commit('user', null);
    //     }
        
    // }
})

///////////////////////////////////////
//Add to the root
Vue.$store = store;


////////////////////////////////////////

//Export it
export default store;