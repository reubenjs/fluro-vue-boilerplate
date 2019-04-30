// Import the `getField` getter and the `updateField`
// mutation function from the `vuex-map-fields` module.
import { getField, updateField } from 'vuex-map-fields';

///////////////////////////////////

const state = {
    drawer: false,
    drawerMini: false,
    
}

///////////////////////////////////

const mutations = {
    updateField,
    drawer(state, payload) {
        state.drawer = payload;
    },
    

    // drawer(state, payload) {
    //     state.drawer = payload;
    // },
    // drawerMini(state, payload) {
    //     state.drawerMini = payload;
    // },
    // keywords(state, payload) {
    //     state.keywords = payload;
    // },
}

///////////////////////////////////

const getters = {
    getField,
    drawer(state, getters) {
        return state.drawer;
    },
    
    // drawer(state) {
    //     return state.drawer;
    // },
    // drawerMini(state) {
    //     return state.drawerMini;
    // },
    // keywords(state) {
    //     return state.keywords;
    // },
}

///////////////////////////////////

const actions = {}

///////////////////////////////////

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}