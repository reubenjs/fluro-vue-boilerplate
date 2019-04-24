

<template>
	<div class="teaser">
		<v-card @click="open()">
			<v-card-title>
				
				<div>
					<h3>{{item.title}}</h3>
					<span class="text-muted small">{{item.count}} Photos</span><br>
					
					<!-- <span>Whitsunday Island, Whitsunday Islands</span> -->
				</div>
				<fluro-avatar right class="lg" :id="item._id" type="contact"></fluro-avatar>
				
			</v-card-title>

			<!-- <v-img :src="url" :lazy-src="smallUrl" aspect-ratio="1.6"> 
			</v-img> -->

			<v-layout row wrap>
				<v-flex d-flex xs4 v-for="image in item.sample">
					<v-img :src="url(image)" :lazy-src="smallUrl(image)" aspect-ratio="1"> 
					</v-img>
				</v-flex>
			</v-layout>

			
			<v-card-actions>
				<v-btn flat>
					<span>Explore</span>
					<font-awesome-icon right :icon="['far', 'arrow-right']"/>
				</v-btn>
			</v-card-actions>


		</v-card>
	</div>


	<!-- <div class="wrap">
		<v-img :src="url":lazy-src="smallUrl":aspect-ratio="aspectRatio"@load="onLoad"@error="onError">
			<template v-slot:placeholder>
				<v-layout fill-height align-center justify-center >
					<v-progress-circular :size="20" v-if="loading" indeterminate color="grey lighten-5"></v-progress-circular>
				</v-layout>
			</template>
		</v-img>
		<div class="info">

			<v-list>
				<v-list-tile avatar>
					<fluro-avatar class="xl" :id="item._id" type="contact"></fluro-avatar>
				</v-list-tile>
				<v-list-tile-content>
					                  <v-list-tile-title>{{item.title}}</v-list-tile-title>
					                  <v-list-tile-sub-title>{{item.count}} photos</v-list-tile-sub-title>
				                </v-list-tile-content>
			</v-list>

		</div>
	</div> -->
</template>

<script>
export default {
	props:['item'],
	computed:{	
		// smallUrl() {
		// 	return this.$fluro.asset.avatarUrl(this.item, 'contact', {w:50});
  //       },
		// url() {
		// 	return this.$fluro.asset.avatarUrl(this.item, 'contact', {w:320});
		// },
		
		// aspectRatio() {
		// 	var image = this.item.cover;
		// 	return image.width / image.height;
		// }
	},
	data() {
		return {
			loading:true,
		}
	},
	methods:{
		smallUrl(image) {
			return this.$fluro.asset.imageUrl(image, 50);
		},
		url(image) {
			return this.$fluro.asset.imageUrl(image, 320);
		},
		open() {
			this.$router.push({
				name: 'photographer',
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
	
	margin-bottom: 35px;
}

.small {
	font-size: 0.8em;
}


</style>
