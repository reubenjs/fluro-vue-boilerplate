<template>
    <page>
        <flex-column>
            <flex-column-content>
                <wrapper>
                    <constrain sm>
                        <div title>
                            <h1>Help</h1>
                        </div>
                        <wrapper>
                            <p>Add your own help page here</p>
                        </wrapper>
                       
                    </constrain>
                </wrapper>
            </flex-column-content>
        </flex-column>
    </page>
</template>
<script>
/////////////////////////////////////////

//Mixin SEO and head
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';

//Get our components from FluroVue
import { Layout} from 'fluro-vue-ui';

/////////////////////////////////////////


export default {
    methods: {
       
    },
    mixins: [SEOMixin, UserMixin, Layout],
    data() {
        return {
        }
    },
}
</script>
<style>
</style>