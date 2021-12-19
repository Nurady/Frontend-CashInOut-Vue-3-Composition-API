import axios from 'axios'

export default {
    namespaced : true,

    state: {
        authenticated: false,
        user: null
    },

    // Mengambil data dari state
    getters: {
        authenticated (state) {
            return state.authenticated
        },
        user (state) {
            return state.user
        }
    },

    // Merubah value dari state
    mutations: {
        SET_AUTHENTICATED(state, value) {
            state.authenticated = value
        },
        SET_USER(state, value) {
            state.user = value
        }
    },

    // Aksi untuk merubah state, dikirimkan ke mutations
    actions: {
        async login ({dispatch}, credentials) {
            await axios.get('sanctum/csrf-cookie')
            await axios.post('login', credentials) // endpoint pada config->cors->api
            dispatch('me') // mengambil semua nilai async me
        },

        async logout({commit}) {
            await axios.post('logout') // endpoint pada config->cors->api
            commit("SET_AUTHENTICATED", false)
            commit("SET_USER", null)
        },

        // Commit Mutations
        async me({commit}) {
            try {
                let {data} = await axios.get('/api/me')
                commit("SET_AUTHENTICATED", true)
                commit("SET_USER", data)
            } catch {
                commit("SET_AUTHENTICATED", false)
                commit("SET_USER", null)
            }
        }
    }    
}