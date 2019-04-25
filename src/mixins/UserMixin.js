
/**
 * Adds the 'user' and 'application' properties from vuex to your component
 * Really helpful when you want to know whether a user is logged in or not 
 * in your route components
 */

import { mapFields } from 'vuex-map-fields';

export default {
    computed: {
        ...mapFields('fluro', [
            'application', //The Fluro application and all of it's permissions and data
            'user', //The authenticated user if they log in
        ]),
    }
}