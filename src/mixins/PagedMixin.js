export default {
	props:{
		currentPage:{
			type:Number,
			default:function() {
				return parseInt(this.$route.query.page) || 1;
			}
		}
	},
    methods:{
    	pageChanged(index) {

    		this.currentPage = index;
    		//Leave all of the current router parameters and query details
    		//and update the ?page= in the url
            this.$router.push({ query: Object.assign({}, this.$route.query, { page: index }) });
    	}
    }
}