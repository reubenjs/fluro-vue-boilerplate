<template>
    <v-container>
        <template v-if="!item">
            Loading...
        </template>
        <template v-if="item">
            <h1>You found something!</h1>
            <p>You are viewing a piece of content! Check it out below</p>
            <fluro-content-render :fields="item.fullDefinition.fields" v-model="item.data" />
            <pre>{{item}}</pre>
        </template>
    </v-container>
</template>
<script>
/////////////////////////////////////////

//Mixin SEO and head
import SEOMixin from '@/mixins/SEOMixin';


//Get our components from FluroVue
import { FluroContentRender } from 'fluro-vue';

/////////////////////////////////////////

export default {
    props: {
        'slug': {
            type: String,
            required: true,
        }
    },
    mixins: [SEOMixin],
    components: {
        FluroContentRender,
    },
    asyncComputed: {
        item: {
            get() {
                var self = this;
                return self.$fluro.content.slug(self.slug, { appendDefinition: true });
            }
        },
    }
}
</script>
<style scoped lang="scss">
</style>