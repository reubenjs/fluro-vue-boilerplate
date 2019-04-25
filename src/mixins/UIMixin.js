
/**
 * Adds the ui state into your components, eg whether the sidebar menu is open, closed or collapsed etc...
 */

import { mapFields } from 'vuex-map-fields';


export default {
    computed: {
        ...mapFields('ui', [
        	'drawer', //Whether the sidebar is showing
			'drawerMini', //Whether the sidebar is collapsed
			'email', //Save the users email so they don't need to remember to type it in all the time
        ]),
    }
}