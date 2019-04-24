

<template>
	<div>
		<template >
			<slot v-for="page in renderPages" v-bind:page="page"></slot>
		</template>
	</div>
</template>

<script>
export default {
	props:{
		items:{
			type:Array,
			default:function() {
				return[];
			},
		},
		perPage:{
			type: Number,
			default: 24,
		},
		startPage:{
			type: Number,
			default: 3,
		},
		click:{
			type:Function,
		},
	},
	// computed:{
	// 	pages() {
	// 		var currentPage = this.currentPage;
	// 		var perPage = this.perPage;
	// 		return this.items.slice(currentPage, currentPage+perPage);
	// 	}
	// },
	beforeMount() {
		this.currentPage = this.startPage;
	},
	mounted() {
		window.addEventListener("scroll", this.checkScroll);
	},
	beforeDestroy() {
		window.removeEventListener("scroll", this.checkScroll);
	},
	data() {
		return {
			currentPage:1,
		}
	},
	computed:{
		total() {
			return this.availablePages.length;
		},
		availablePages() {
			return this._.chunk(this.items, this.perPage);
		},
		renderPages() {
			return this.availablePages.slice(0, this.currentPage)
		}
	},
	methods:{
		nextPage() {
			var totalPages = this					
			this.currentPage++;
		},
		checkScroll() {
			var self = this;
			let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
			if (bottomOfWindow) {
				self.nextPage();
			}
			
		}
	}
}


</script>

<style scoped lang="scss">

</style>
