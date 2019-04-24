
///////////////////////////////////

const state = {
    user:null,
    email:'',
    application:null,
    pendingStats:{},
    stats:{},
}

///////////////////////////////////

const mutations = {
    email(state, payload) {
        state.email = payload;
    },
    user(state, payload) {
        state.user = payload;
    },
    application(state, payload) {
        state.application = payload;
    },
    stats(state, payload) {
        state.stats = payload;
    },
    pendingStats(state, payload) {
        state.pendingStats = payload;
    },
}

///////////////////////////////////

const getters = {
    email(state) {
        return state.email;
    },
    user(state) {
        return state.user;
    },
    application(state) {
        return state.application;
    },
    stats(state) {
        return state.stats;
    },
    pendingStats(state) {
        return state.pendingStats;
    },
    
    // accessToken(state) {
    //     if (!state.user) {
    //         return;
    //     }

    //     return state.user.token;
    // },
    // refreshToken(state) {
    //     if (!state.user) {
    //         return;
    //     }

    //     return state.user.refreshToken;
    // },
}

///////////////////////////////////

//dispatch()
const actions = {
//     logout({
//         commit
//     }) {
//         console.log('Logout!')
//         commit('user', null);
//     }
}

///////////////////////////////////

export default {
    state,
    mutations,
    getters,
    actions,
}