<template>
    <page>
        <flex-column>
            <flex-column-body>
                <v-container>
                    <wrapper>
                        <constrain sm>
                            <!-- <pre>{{application}}</pre> -->
                            <div title>
                                <h1 v-if="!user">Why, hello there!</h1>
                                <h1 v-if="user">Hey {{user.firstName}}!</h1>
                                <p>
                                    If you can see this then you are successfully running the Fluro Vue Boilerplate!
                                </p>
                            </div>
                            <wrapper>
                                <h2 title>
                                    Next Steps
                                </h2>
                                <ol class="lg">
                                    <li>
                                        <strong>Create your application in Fluro</strong><br />
                                        Create your application in the <a href="https://admin.fluro.io/application" target="_blank">Fluro admin panel</a> and configure it's settings.<br />
                                    </li>
                                    <li>
                                        <strong>Allow Origin</strong><br />
                                        Make sure to add 'http://localhost:8080' as an Allowed Origin in your Application Authentication settings so that you can authenticate while you're developing
                                    </li>
                                    <li>
                                        <strong>Update your Development Environment</strong><br />
                                        Edit and update the VUE_APP_REMOTE_URL in the <strong>vue.config.js</strong> file variable to match the domain of your application in Fluro.
                                    </li>
                                    <li>
                                        Make sure you checkout the <a target="_blank" href="https://fluro-developers.github.io/fluro-vue/#/">Fluro Vue documentation</a>
                                    </li>
                                </ol>
                            </wrapper>
                            <wrapper sm>
                                <h3 title>
                                    Other goodies and options
                                </h3>
                                <ul>
                                    <li>
                                        <strong>Font Awesome Icons</strong><br />
                                        If you want to use the FontAwesome Pro Library update the '.npmrc' file with your license number
                                    </li>
                                </ul>
                            </wrapper>
                            <wrapper sm>
                                <h4>Here's an example of how to render an image</h4>
                                <fluro-image contain item="5bd6340d1a289a5dfac59369" :spinner="true" />
                            </wrapper>
                            <wrapper sm>
                                <h5>Just for fun, let's load your definitions and spit out some forms</h5>
                                <template v-for="type in types">
                                    <!-- v-if="definition._id != '5cca06b411399d3a111d7f19'" -->
                                    <template v-for="definition in type.definitions">
                                        <h2>{{definition.title}}</h2>
                                        <fluro-content-form v-model="blankModel" :fields="definition.fields"></fluro-content-form>
                                    </template>
                                </template>
                            </wrapper>
                        </constrain>
                    </wrapper>
                </v-container>
            </flex-column-body>
        </flex-column>
    </page>
</template>
<script>
/////////////////////////////////////////

//Mixin SEO and head
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';

//Get our components from FluroVue
import { Layout, FluroContentForm, FluroContentRenderField } from 'fluro-vue-ui';

/////////////////////////////////////////


export default {
    components: {
        FluroContentForm,
        FluroContentRenderField,
    },
    methods: {

    },
    mixins: [SEOMixin, UserMixin, Layout],
    data() {
        return {
            // form:{
            //     fields:[{maximum:1, type:'reference', minimum:0, key:'team', title:'This is the field'}],
            // },

            blankModel: {},
            //     mainImage: {
            //         _id: '5bd6340d1a289a5dfac59369',
            //         _type: 'image',
            //         title: 'Test image',
            //     }
            // },
            // examples: {
            //     image: '<fluro-image contain item="5bd6340d1a289a5dfac59369" :width="1920" :height="1280" :spinner="true" />',
            // },
            // text: '',
        }
    },

    asyncComputed: {
        types: {
            default: [],
            get() {
                var self = this;
                return new Promise(function(resolve, reject) {

                    self.$fluro.api.post('/defined', {
                            types: ['article'],
                        })
                        .then(function(res) {


                            return resolve(res.data);
                        }, reject);
                });
            }
        }
    }
}
</script>
<style>
</style>