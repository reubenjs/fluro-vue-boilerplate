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
                <ul>
                    <li>
                        Make sure you checkout the <a target="_blank" href="https://fluro-developers.github.io/fluro-vue/#/">Fluro Vue API documentation</a>
                    </li>
                    <li>
                        <strong>Updating your application url</strong><br />
                        Create an application in Fluro and Update the VUE_APP_REMOTE_URL in the 'vue.config.js' file variable to match it's domain
                    </li>
                    <li>
                        <strong>Allow Origin</strong><br />
                        Make sure to add 'http://localhost:8080' as an Allowed Origin in your Application settings so that you can authenticate while you're developing
                    </li>
                    <li>
                        <strong>Font Awesome Icons</strong><br />
                        If you want to use the FontAwesome Pro Library update the '.npmrc' file with your license number
                    </li>
                </ul>
            </p>
            <div>
                <!-- REALM SELECT -->
                <fluro-realm-select v-model="realms"></fluro-realm-select>
            </div>
            <div v-for="type in types">
                <h2>{{type.title}}</h2>
                <!-- <form v-for="definition in type.definitions">
                    <formly-form :form="form" :model="model" :fields="definition.fields"></formly-form>
                    <button type="submit">Submit</button>
                </form> -->
                <div v-for="definition in type.definitions">
                    <fluro-content-form v-model="model" :fields="definition.fields"></fluro-content-form>
                    <!-- <pre>{{model}}</pre> -->
                </div>
            </div>
        </constrain>
    </wrapper>
</template>
<script>
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
// import {Layout} from 'fluro-vue';
import { Layout, FluroContentForm } from 'fluro-vue';
// import Contain from '@/components/Contain';


export default {
    components: {
        FluroContentForm,
    },
    mixins: [SEOMixin, UserMixin, Layout],
    data() {
        return {
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