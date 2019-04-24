<template>
    <div class="view" :style="{backgroundColor:backgroundColor}">
        <div class="header" :style="{backgroundColor:backgroundColor}">
            <div class="left">
                <v-btn large dark icon v-if="isMobile" @click="close()">
                    <font-awesome-icon :icon="['far', 'arrow-left']" />
                </v-btn>
                <v-btn large dark flat v-if="!isMobile" @click="close()">
                    <font-awesome-icon left :icon="['far', 'arrow-left']" />
                    <span>Back</span>
                </v-btn>
            </div>
            <div class="right">
                <div class="header-actions">
                    <v-btn large dark icon @click="previous()">
                        <font-awesome-icon :icon="['far', 'arrow-left']" />
                    </v-btn>
                    <v-btn large dark icon @click="next()">
                        <font-awesome-icon :icon="['far', 'arrow-right']" />
                    </v-btn>
                </div>
                <v-btn large dark flat v-if="!isMobile" :href="downloadUrl" target="_blank">
                    <span>Download</span>
                    <font-awesome-icon right :icon="['fas', 'cloud-download']" />
                </v-btn>
                <v-btn large dark icon v-if="isMobile" :href="downloadUrl" target="_blank">
                    <font-awesome-icon :icon="['fas', 'cloud-download']" />
                </v-btn>
                <v-btn large dark icon @click="togglePin()" v-if="user">
                    <!-- Favorite -->
                    <font-awesome-icon :icon="pinIcon" v-bind="{[`spin`]: pinning}" />
                </v-btn>
            </div>
        </div>
        <!-- <div v-if="isMobile">
                <div class="image">
                    <v-img :src="largeUrl" :lazy-src="smallUrl" :aspect-ratio="aspectRatio" @load="onLoad" @error="onError" contain>
                        <template v-slot:placeholder>
                            <v-layout fill-height align-center justify-center>
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-layout>
                        </template>
                    </v-img>
                </div>

            </div> -->
        <!-- style="padding-top:0;" -->
        <v-container v-if="image" grid-list-sm fluid class="image-container">
            <v-layout row wrap>
                <!-- v-if="!isMobile" -->
                <v-flex d-flex v-bind="{[`xs12 lg9`]: landscape, [`xs12 md6`]: !landscape}">
                    <div class="image" v-touch="{left:previous, right:next, }">
                        <div class="actions">
                            <a class="previous" @click="previous()">
                                <font-awesome-icon :icon="['far', 'arrow-left']" />
                            </a>
                            <a class="next" @click="next()">
                                <font-awesome-icon :icon="['far', 'arrow-right']" />
                            </a>
                        </div>
                        <fluro-image contain :item="image" :spinner="true" @load="onLoad" @error="onError"></fluro-image>
                        <!-- <v-img :src="largeUrl" :lazy-src="smallUrl" :aspect-ratio="aspectRatio" @load="onLoad" @error="onError" contain>
                            <template v-slot:placeholder>
                                <v-layout fill-height align-center justify-center>
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                            </template>
                        </v-img> -->
                    </div>
                </v-flex>
                <v-flex d-flex v-bind="{[`xs12 lg3`]: landscape, [`xs12 md6`]: !landscape}">
                    <v-container grid-list-sm fluid>
                        <div class="metadata">
                            <div class="form-group">
                                <h1>{{title}}</h1>
                                <h3>{{subtitle}}</h3>
                            </div>
                            <div class="form-group" v-if="event" @click="goto(event, 'event')">
                                <label>Event</label>
                                <div class="event-btn">
                                    <h5>{{event.title}}</h5>
                                    <div>
                                        {{event | readableEventDate}}
                                    </div>
                                </div>
                            </div>
                            <div v-if="realms.length">
                                <div class="form-group" v-for="group in realms">
                                    <label>{{group.title}}</label>
                                    <div class="tags">
                                        <a class="tag" @click="goto(realm._id, 'realm')" v-for="realm in group.items">
                                            {{realm.title}}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div v-if="tags.length">
                                <div class="form-group" v-for="group in tags">
                                    <label>{{group.title}}</label>
                                    <div class="tags">
                                        <a class="tag" @click="goto(tag, 'tag')" v-for="tag in group.items">
                                            {{tag.title}}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" v-if="keywords.length">
                                <label>Keywords</label>
                                <div class="tags">
                                    <a class="tag" @click="goto(keyword, 'keyword')" v-for="keyword in keywords">
                                        {{keyword}}
                                    </a>
                                </div>
                            </div>
                            <v-layout row wrap>
                                <v-flex d-flex xs12 sm6 md4 lg6>
                                    <div class="form-group">
                                        <label>Taken</label>
                                        {{image.created | formatDate('h:mma dddd D MMM YYYY')}}

                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6>
                                    <div class="form-group">
                                        <label>Uploaded</label>
                                        {{image._id | dateFromID('h:mma dddd D MMM YYYY')}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6>
                                    <div class="form-group" @click="goto(photographer, 'photographer')" v-if="photographer">
                                        <label>Photographer</label>
                                        <div>
                                            <fluro-avatar :id="photographer._id" type="contact"></fluro-avatar> {{photographer.title}}
                                        </div>
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6>
                                    <div class="form-group" v-if="uploader">
                                        <label>Uploaded by</label>
                                        <fluro-avatar :id="uploader._id" type="persona"></fluro-avatar>{{uploader.title}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12>
                                    <div class="form-group" v-if="copyright">
                                        <label>Copyright</label>
                                        <div>{{copyright}}</div>
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6 v-if="cameraMake">
                                    <div class="form-group">
                                        <label>Camera Make</label>
                                        {{cameraMake}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6 v-if="cameraModel">
                                    <div class="form-group">
                                        <label>Camera Model</label>
                                        {{cameraModel}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6 v-if="cameraFocalLength">
                                    <div class="form-group">
                                        <label>Focal Length</label>
                                        {{cameraFocalLength}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6 v-if="cameraAperture">
                                    <div class="form-group">
                                        <label>Aperture</label>
                                        {{cameraAperture}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6 v-if="cameraISO">
                                    <div class="form-group">
                                        <label>ISO</label>
                                        {{cameraISO}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6 v-if="cameraLens">
                                    <div class="form-group">
                                        <label>Lens</label>
                                        {{cameraLens}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6>
                                    <div class="form-group">
                                        <label>Dimensions</label>
                                        {{image.width}}x{{image.height}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6>
                                    <div class="form-group">
                                        <label>Filename</label>
                                        {{image.filename}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6>
                                    <div class="form-group">
                                        <label>Filesize</label>
                                        {{image.filesize | filesize}}
                                    </div>
                                </v-flex>
                                <v-flex d-flex xs12 sm6 md4 lg6>
                                    <div class="form-group">
                                        <label>Filetype</label>
                                        {{image.mimetype}}
                                    </div>
                                </v-flex>
                            </v-layout>
                        </div>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
import ResponsiveMixin from '@/mixins/ResponsiveMixin.js';
import PinnableMixin from '@/mixins/PinnableMixin';
import { mapGetters } from 'vuex'


export default {
    mixins: [
        ResponsiveMixin,
        PinnableMixin,
    ],
    data() {
        var self = this;
        return {
            image: null,
            loading: true,
            isLoading: true,
        }
    },
    created() {
        this.idChanged();
    },
    props: {
        id: {
            type: String,
        },
    },
    watch: {
        // call again the method if the route changes
        'id': 'idChanged'
    },
    methods: {
        next() {
            this.$emit('next', this.id);

        },
        previous() {
            this.$emit('previous', this.id);

        },
        download() {
            window.open(this.downloadUrl);

        },
        goto(itemID, type) {

            if (!itemID) {
                return;
            }

            if (!type) {
                return;
            }

            if (itemID._id) {
                itemID = itemID._id;
            }

            switch (type) {
                case 'photo':

                    this.$router.push({
                        name: 'photo',
                        params: { id: itemID },
                    })
                    break;
                case 'event':

                    this.$router.push({
                        name: 'event',
                        params: { id: itemID },
                    })
                    break;
                case 'tag':

                    this.$router.push({
                        name: 'tag',
                        params: { id: itemID },
                    })
                    break;
                case 'keyword':
                    this.$router.push({
                        name: 'keyword',
                        params: { id: itemID },
                    })
                    break;
                case 'photographer':

                    this.$router.push({
                        name: 'photographer',
                        params: { id: itemID },
                    })
                    break;
                case 'realm':

                    //console.log('Going', itemID);
                    this.$router.push({
                        name: 'realm',
                        params: { id: itemID },
                    })
                    break;

                default:
                    //console.log(type);
                    break;
            }

        },
        toggleShowInfo() {

            var currentState = this.$store.state.showInformation;
            this.$store.commit('showInformation', !currentState)
        },
        close() {

            console.log('Go back', window.history.length)
            if (window.history.length) {

                this.$router.go(-1)
            } else {


                this.$router.push({ query: Object.assign({}, this.$route.query, { photo: undefined }) });

                // var currentQuery = _.clone(this.$route.query);
                // delete currentQuery.photo;
                // this.$router.push({ query: currentQuery })
            }
        },
        onLoad() {
            //console.log('LOADED!')
            this.loading = false;
        },
        onError() {
            //console.log('ERROR!')
            this.loading = false;
        },
        idChanged() {
            var self = this;

            // //If we're already loading
            // if (self.loading) {
            //     //Do nothing
            //     return;
            // }

            self.loading = true;
            self.isLoading = true

            /////////////////////////////////////

            // //console.log('ROUTE', self.$route)
            //Load the interaction tickets
            var promise = self.$fluro.api.get(`/content/get/${self.id}`);

            //Update the data
            promise.then(function(res) {
                self.image = res.data;
                self.isLoading = false;
            }, function(err) {
                self.isLoading = false;
            });

            /////////////////////////////////////



        },
    },
    computed: {
        ...mapGetters([
            'user',
        ]),
        landscape() {
            return parseInt(_.get(this, 'image.width')) >= parseInt(_.get(this, 'image.height'));
        },
        itemID() {
            return this.id;
        },
        copyright() {
            return this._.get(this, 'image.data.exif.tags.Copyright')
        },
        cameraMake() {
            return this._.get(this, 'image.data.exif.tags.Make')
        },
        cameraModel() {
            return this._.get(this, 'image.data.exif.tags.Model')
        },
        cameraFocalLength() {
            var focal = this._.get(this, 'image.data.exif.tags.FocalLength');
            if (!focal) {
                return;
            }

            return focal + 'mm'
        },
        cameraAperture() {
            return this._.get(this, 'image.data.exif.tags.FNumber')
        },
        // cameraShutterSpeed() {
        //     return this._.get(this, 'image.data.exif.tags.Model')
        // },
        cameraISO() {
            return this._.get(this, 'image.data.exif.tags.ISO')
        },
        cameraLens() {
            return this._.get(this, 'image.data.exif.tags.LensModel')
        },
        photographer() {
            var photographer = this._.get(this, 'image.data.photographer');

            if (photographer && photographer.title) {
                return photographer;
            }
        },
        uploader() {

            var uploader = this._.get(this, 'image.managedAuthor');
            if (uploader && uploader.title) {
                return uploader;
            }
        },

        showInfo() {
            return this.$store.state.showInformation;
        },
        title() {
            return this._.get(this, 'image.data.event.title') || this._.get(this, 'image.title');
        },
        subtitle() {

            var event = this._.get(this, 'image.data.event');
            if (!event) {
                return;
            } else {
                return this.$filters.readableEventDate(event);
            }

            return
        },
        backgroundColor() {
            if (!this.image) {
                return;
            }

            var matchColor = this._.find(this.image.colors, function(originalColor) {

                var color = originalColor;

                ////////////////////////////////////////////

                // Variables for red, green, blue values
                var r, g, b, hsp;

                // Check the format of the color, HEX or RGB?
                if (color.match(/^rgb/)) {

                    // If HEX --> store the red, green, blue values in separate variables
                    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

                    r = color[1];
                    g = color[2];
                    b = color[3];
                } else {

                    // If RGB --> Convert it to HEX: http://gist.github.com/983661
                    color = +("0x" + color.slice(1).replace(
                        color.length < 5 && /./g, '$&$&'));

                    r = color >> 16;
                    g = color >> 8 & 255;
                    b = color & 255;
                }

                // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
                hsp = Math.sqrt(
                    0.299 * (r * r) +
                    0.587 * (g * g) +
                    0.114 * (b * b)
                );

                // Using the HSP value, determine whether the color is light or dark
                if (hsp > 127.5) {
                    return;
                } else {
                    return originalColor;
                }



            })


            return matchColor || '#333';

        },
        aspectRatio() {
            if (!this.image) {
                return;
            }

            return this.image.width / this.image.height;
        },
        event() {
            return this._.get(this, 'image.data.event');
        },
        keywords() {
            return this._.get(this, 'image.keywords');
        },
        tags() {
            return this._.chain(this)
                .get('image.tags')
                .reduce(function(set, item) {

                    var _type = item.definition || 'tag';
                    if (!set[_type]) {
                        set[_type] = {
                            title: _type,
                            items: [],
                        }
                    }

                    set[_type].items.push(item);

                    return set;
                }, {})
                .values()
                .value();
        },
        realms() {

            return this._.chain(this)
                .get('image.realms')
                .reduce(function(set, realm) {

                    var _type = realm.definition || 'realm';
                    if (!set[_type]) {
                        set[_type] = {
                            title: _type,
                            items: [],
                        }
                    }

                    set[_type].items.push(realm);

                    return set;
                }, {})
                .values()
                .value();

        },
        smallUrl() {
            return this.$fluro.asset.imageUrl(this.id, 50);
        },
        largeUrl() {
            return this.$fluro.asset.imageUrl(this.id);
        },
        downloadUrl() {
            if (!this.image) {
                return;
            }
            var url = this.$fluro.asset.downloadUrl(this.image, { filename: this.image.filename });
            return url;
        }
    }
}
</script>
<style scoped lang="scss">
div {
    transition: all 0.3s;
}

.actions {
    position: absolute;
    left: 0;
    top: 50%;
    right: 0;
    width: 100%;
    margin-top: -35px;
    z-index: 10;
    opacity: 0;
    transition: all 0.3s;



    a {
        height: 70px;
        width: 70px;
        position: absolute;
        display: block;
        background: rgba(#000, 0.5);
        color: #fff;
        text-align: center;
        line-height: 70px;
        font-size: 25px;
        border-radius: 100%;
    }

    .previous,
    .next {

        @media(max-width: 768px) {
            &:active {
                background: #fff;
                color: #000;
            }
        }

        @media(min-width: 769px) {
            &:hover {
                background: #fff;
                color: #000;
            }
        }
    }

    .previous {
        left: 15px;
    }

    .next {
        right: 15px;
    }
}

.image {
    position: relative;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    flex: 1;
    overflow: hidden;
    max-height: 90vh;

    &:hover .actions {
        opacity: 1;
    }

    &>div {
        height: 100%;
    }
}

.sidebar {
    padding: 25px;
    width: 450px;
    flex: none;
}

.form-group {
    margin-bottom: 15px;
    color: rgba(#fff, 0.7);

    h1,
    h2,
    h3,
    h4,
    h5 {
        color: #fff;
    }

    label {
        color: #fff;
        display: block;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.03em;
        font-size: 0.8em;
        margin-bottom: 5px;

    }
}


.header,
.footer {
    left: 0;
    right: 0;
    position: fixed;
    z-index: 1000000;
    padding: 5px 15px;
    display: flex;

    .right,
    .left {
        flex: 1;
    }

    .right {
        text-align: right;
    }
}

svg * {
    fill: currentColor !important;
}

.header {
    top: 0;


}

.footer {
    bottom: 0;
}

.tags {
    line-height: 1;

    .tag {
        display: inline-block;
        border-radius: 50px;
        padding: 4px 10px;
        background: rgba(#444, 0.3);
        color: #fff;
        margin: 0 4px 7px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.8em;
        line-height: 1;
        vertical-align: top;
        font-weight: 700;
        text-transform: capitalize;

        &:hover {
            background: #000;
            color: #fff;
        }
    }
}



.event-btn {
    padding: 5px 10px;
    position: relative;
    border-radius: 2px;
    cursor: pointer;

    &:before {
        content: '';
        border-radius: inherit;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }

    &:hover {
        &:before {
            background-color: currentColor;
            opacity: 0.12;
        }
    }
}

.view {
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    z-index: 10000;
    display: flex;
    // justify-content: center;
    // align-items: center;
    padding: 60px 15px;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    transition: all 0.3s;
    -webkit-overflow-scrolling: touch;

    .image-container {
        padding-top: 0;
    }

    .header-actions {
        display: inline-block;
    }

    @media(max-width: 768px) {
        padding: 60px 0;

        .header-actions {
            display: none;
        }

        .metadata {
            padding: 25px;
        }

        h1 {
            font-size: 1.3em;
        }

        .container {
            padding: 0;
        }
    }

}
</style>