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
                        <strong>Updating your application url</strong><br/>
                        Create an application in Fluro and Update the VUE_APP_REMOTE_URL in the 'vue.config.js' file variable to match it's domain
                    </li>
                    <li>
                        <strong>Font Awesome Icons</strong><br/>
                        If you want to use the FontAwesome Pro Library update the '.npmrc' file with your license number
                    </li>
                </ul>
            </p>


        </constrain>
    </wrapper>
</template>
<script>
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
import {Layout} from 'fluro-vue';
// import Contain from '@/components/Contain';


export default {
    mixins: [SEOMixin, UserMixin, Layout],
    // asyncComputed: {
    //     latest: {
    //         default: [],
    //         get() {
    //             var self = this;
    //             return new Promise(function(resolve, reject) {

    //                 self.$fluro.api.get('/content/photo', {
    //                     params: {
    //                         //allDefinitions:true,
    //                         sort: '-created',
    //                         fields: [
    //                             'title',
    //                             'managedAuthor',
    //                             // 'data',
    //                             'created',
    //                             'data.photographer',
    //                             'data.event',
    //                             'width',
    //                             'colors',
    //                             'height',
    //                             // 'keywords',
    //                         ],
    //                         limit: 12,
    //                     }
    //                 }).then(function(res) {

    //                     return resolve(res.data);
    //                 }, reject);
    //             })
    //         }
    //     },
    //     pinned: {
    //         default: [],
    //         get() {
    //             var self = this;
    //             return new Promise(function(resolve, reject) {

    //                 self.$fluro.api.post('/stat/my/pinned', {
    //                     // params: {
    //                     //     //allDefinitions:true,
    //                     //     sort: '-created',
    //                     //     fields: [
    //                     //         'title',
    //                     //         'managedAuthor',
    //                     //         // 'data',
    //                     //         'created',
    //                     //         'data.photographer',
    //                     //         'data.event',
    //                     //         'width',
    //                     //         'colors',
    //                     //         'height',
    //                     //         // 'keywords',
    //                     //     ],
    //                     //     limit: 4,
    //                     // }
    //                 }).then(function(res) {

    //                     var grouped = _.chain(res.data)
    //                         .filter(function(item) {
    //                             // console.log('ITEM', item);

    //                             var type = item.type;
    //                             var definition = item.definition;

    //                             switch (item._type) {
    //                                 case 'tag':
    //                                 case 'realm':
    //                                 case 'event':
    //                                 case 'collection':
    //                                     return true;
    //                                     break;
    //                                 default:
    //                                     if (item.definition == 'photo') {
    //                                         return true;
    //                                     }
    //                                     break;
    //                             }
    //                         })
    //                         .reduce(function(set, item) {
    //                             var definedType = item.definition || item._type;

    //                             //////////////////////////////////////////////

    //                             var existing = set[definedType];
    //                             if (!existing) {
    //                                 existing = set[definedType] = {
    //                                     title: self._.startCase(definedType),
    //                                     items: [],
    //                                 }
    //                             }
    //                             //////////////////////////////////////////////

    //                             switch (item._type) {
    //                                 case 'image':
    //                                     existing.items.push(item);
    //                                     break;
    //                                 case 'event':
    //                                     item.cover = {};
    //                                     existing.items.push(item);
    //                                     break;
    //                                 case 'realm':
    //                                     item.cover = {};
    //                                     existing.items.push(item);
    //                                     break;
    //                                 case 'tag':
    //                                     item.cover = {};
    //                                     existing.items.push(item);
    //                                     break;
    //                             }

    //                             //////////////////////////////////////////////


    //                             return set;
    //                         }, {})
    //                         .values()
    //                         .value();


    //                     return resolve(grouped);
    //                 }, reject);
    //             })
    //         }
    //     }
    // },
}
</script>
<style>
</style>