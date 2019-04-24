
///////////////////////////////////

const state = {
    drawer:true,
    drawerCollapsed:true,
    keywords:'',
    definitions:[],
}

///////////////////////////////////

const mutations = {
    drawer(state, payload) {
        state.drawer = payload;
    },
    drawerCollapsed(state, payload) {
        state.drawerCollapsed = payload;
    },
    keywords(state, payload) {
        state.keywords = payload;
    },
    definitions(state, payload) {
        state.definitions = payload;
    },
}

///////////////////////////////////

const getters = {
    drawer(state) {
        return state.drawer;
    },
    drawerCollapsed(state) {
        return state.drawerCollapsed;
    },
    keywords(state) {
        return state.keywords;
    },
    definitions(state) {
        return state.definitions;
    },
}

///////////////////////////////////

const actions = {
}

///////////////////////////////////

export default {
    state,
    mutations,
    getters,
    actions,
}