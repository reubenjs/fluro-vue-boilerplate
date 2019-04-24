

<template>
	<div class="teaser" @click="open()">
		
			<v-img :src="url" :lazy-src="smallUrl" aspect-ratio="1.6"> 
			
				<template v-slot:placeholder>
					<v-layout
					fill-height
					align-center
					justify-center
					>


					<v-progress-circular :size="20" v-if="loading" indeterminate color="grey lighten-5"></v-progress-circular> </v-layout>
			</template>

			</v-img>

<!-- <pre>{{item}}</pre> -->
			<div class="text">
				<div>
					<h2>{{item.title}}</h2>
					<h4>{{item.definition}}</h4>
					<h5>{{item.count}} Photos</h5>
				</div>
			</div>


			<div class="thumb-bottom">
	            <div class="thumb-right">
	                <v-btn dark icon @click.stop="togglePin()" v-if="user">
	                    <font-awesome-icon :icon="pinIcon" v-bind="{[`spin`]: pinning}" />
	                </v-btn>
	            </div>
	        </div>
		</div>

</template>

<script>


import { mapGetters } from 'vuex';
import PinnableMixin from '@/mixins/PinnableMixin';






export default {
	props:['item'],
	mixins: [PinnableMixin],
	computed:{	
		
		realms() {
			return this._.map(this.item.realms, 'title').join(', ');
		},
		smallUrl() {
			return this.$fluro.asset.coverImage(this.item, 'tag', {w:50});
        },
		url() {
			return this.$fluro.asset.coverImage(this.item, 'tag', {w:320});
		},
		aspectRatio() {
			var image = this.item.cover;
			return image.width / image.height;
		}
	},
	data() {
		return {
			loading:true,
		}
	},
	methods:{
		open() {
			this.$router.push({
                name: 'tag',
                params:{id:this.item._id},
            })
		},
		onLoad() {
			this.loading = false;
		},
		onError() {
			this.loading = false;
		},
	}
}
</script>

<style scoped lang="scss">


.teaser {
	position: relative;
	border-radius: 5px;
	background: #eee;
	overflow: hidden;


	.thumb-bottom {
		position: absolute;
		bottom:0;
		left:0;
		right:0;
		display: flex;

		.thumb-right {
			flex:1;
			text-align: right;
		}
	}

	.text {
		background: rgba(#000, 0.5);
		position: absolute;
		left:0;
		top:0;
		right:0;
		bottom:0;
		display:flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		text-align: center;
		text-transform: capitalize;

		
	}
}


</style>
