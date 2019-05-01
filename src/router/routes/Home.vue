<template>
    <wrapper>
        <constrain sm>
            <h1 v-if="!user">Why, hello there!</h1>
            <h1 v-if="user">Hey {{user.firstName}}!</h1>
            <p>
                If you can see this then you are successfully running the Fluro Vue Boilerplate!
            </p>
            <p>
                A few key details you might want to know
                <ol>
                    <li>
                        Make sure you checkout the <a target="_blank" href="https://fluro-developers.github.io/fluro-vue/#/">Fluro Vue API documentation</a>
                    </li>
                    <li>
                        <strong>Create your application in Fluro</strong><br />
                        Create your application in the <a href="https://admin.fluro.io/application" target="_blank">Fluro admin panel</a> and configure it's settings.<br />
                    </li>
                    <li>
                        <strong>Allow Origin</strong><br />
                        Make sure to add 'http://localhost:8080' as an Allowed Origin in your Application Authentication settings so that you can authenticate while you're developing
                    </li>
                    If you want to use login/authentication then make sure to add <strong>http://localhost:8080</strong> to your application's while you are developing
                    </li>
                    <li>
                        and update the VUE_APP_REMOTE_URL in the <strong>vue.config.js</strong> file variable to match the domain you want to sign in on
                    </li>
                    <li>
                        <strong>Font Awesome Icons</strong><br />
                        If you want to use the FontAwesome Pro Library update the '.npmrc' file with your license number
                    </li>
                </ol>
            </p>
            <wrapper sm>
                <h4>Here's an example of how to render an image</h4>
                <!-- <fluro-image contain item="5bd6340d1a289a5dfac59369" :width="1920" :height="1280" :spinner="true" /> -->
            </wrapper>
            <div v-for="type in types">
                <h2>{{type.title}}</h2>
                <div v-for="definition in type.definitions">
                    <fluro-content-form v-model="model" :fields="definition.fields"></fluro-content-form>
                </div>
            </div>
        </constrain>
    </wrapper>
</template>
<script>
/////////////////////////////////////////

//Mixin SEO and head
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';

//Get our components from FluroVue
import { Layout, FluroContentForm, FluroCodeEditor } from 'fluro-vue';

/////////////////////////////////////////


export default {
    components: {
        FluroContentForm,
        FluroCodeEditor,
    },
    methods: {
        codeEditorInit(editor) {
            // editor.setReadOnly(true);
        }
    },
    mixins: [SEOMixin, UserMixin, Layout],
    data() {
        return {
            examples: {
                image: '<fluro-image contain item="5bd6340d1a289a5dfac59369" :width="1920" :height="1280" :spinner="true" />',
            },
            realms: [],
            model: {

            },
        }
    },
    asyncComputed: {
        types: {
            default: [],
            get() {
                var self = this;
                return new Promise(function(resolve, reject) {

                    self.$fluro.api.post('/defined', {
                            types: ['article']
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