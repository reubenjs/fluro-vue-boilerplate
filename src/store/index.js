import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'


////////////////////////////////////////

//Modules
import ui from './modules/ui';


//Initiate Vuex
Vue.use(Vuex)

////////////////////////////////////////

//Create the store
const store = new Vuex.Store({

    //Save state to local storage
    // plugins: [createPersistedState()],
    modules:{
      ui,
    },
    ///////////////////////////////////////

    state:{
        email: '', //For when someone is logging in/out remember it in forms
    },

    mutations:{
		email(state, payload) {
	        state.email = payload;
	    },
    },
    getters:{
    	email(state, getters) {
	        return state.email;
	    },
    },

})

///////////////////////////////////////
//Add to the root
Vue.$store = store;


////////////////////////////////////////

//Export it
export default store;


