

<template>
	<div>
		<template >

			<!-- Scroll to top -->
			<div ref="top"></div>
			<slot v-bind:page="page"></slot>
			<div class="pager" v-if="total > 1">
				<v-pagination v-model="currentPage" :total-visible="totalVisible" @input="pageChanged()" :length="total"></v-pagination>
			</div>
		</template>
	</div>
</template>

<script>

import _ from 'lodash';

export default {
	props:{
		top:{
			type:Boolean,
		},
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
			default: 1,
		},
		click:{
			type:Function,
		},
	},
	data() {
		return {
			currentPage:this.startPage,
		}
	},
	watch:{
		'items':'checkPage',
	},
	computed:{
		totalVisible() {
			if(this.$vuetify.breakpoint.smAndDown) {
				return 0
			} else {
				return 15;
			}
		},
		total() {
			return this.availablePages.length;
		},
		availablePages() {
			return _.chunk(this.items, this.perPage);
		},
		page() {
			if(this.currentPage > this.total) {
				return _.first(this.availablePages);
			} else {
				return this.availablePages[this.currentPage-1];
			}
		}
	},
	methods:{
		checkPage() {
			this.currentPage = 1;

			
			// if(this.currentPage >= this.availablePages.length) {
			// 	this.currentPage = this.availablePages.length;
				this.pageChanged();
			// }
		},
		pageChanged() {
			var topElement = this.$refs.top;
			if(topElement) {
				topElement.scrollIntoView({
					block:'center',
					behavior:'smooth',
				});
			} else {
				console.log('No top')
			}

			// document.getElementsByTagName('h2')[3].scrollIntoView();
			this.$emit('change', this.currentPage);


		},
		nextPage() {
			var total = this.total;	
			
			this.currentPage < total ? this.currentPage++ : this.currentPage = total;
			this.pageChanged();
		},
		previousPage() {
			var total = this.total;				
			this.currentPage > 1 ? this.currentPage-- : this.currentPage = 1;
			this.pageChanged();
		},
	}
}


</script>

<style scoped lang="scss">

	.pager {
		text-align: center;
		padding: 15px 0;

		.v-pagination-item {
			font-weight:700;
		}
	}
</style>
