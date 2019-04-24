<template>
    <div class="wrap" :style="style">
        <div class="thumb-top">
            <div>{{title}}</div>
            <div class="small text-muted">{{date}}</div>
        </div>
        <fluro-image cover :spinner="true" :item="image" :width="320" @load="onLoad" @error="onError"></fluro-image>

        <!-- <v-img :src="url" :lazy-src="smallUrl" :aspect-ratio="aspectRatio" @load="onLoad" @error="onError"> -->
        <!-- </v-img> -->
        <div class="shader"></div>
        <div class="thumb-bottom">
            <div class="thumb-left" v-if="photographer">
                <a @click.stop="viewPhotographer()">
                    <fluro-avatar class="md" :id="photographer._id" :type="photographer.style"></fluro-avatar>
                </a>
                {{photographer.title}}
            </div>
            <div class="thumb-right">
                <v-btn dark icon @click.stop="download()">
                    <font-awesome-icon :icon="['fas', 'cloud-download']" />
                </v-btn>
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

    props: ['image'],
    mixins: [PinnableMixin],
    data() {
        return {
            loading: true,
        }
    },
    computed: {
        ...mapGetters([
            'user',
        ]),
        itemID() {
            return this.$fluro.utils.getStringID(this.image);
        },
        style() {
            return {
                backgroundColor: this._.get(this.image, 'colors[0]') || '#ebeef0',
            }
        },
        title() {
            return this._.get(this.image, 'data.event.title') || _.get(this, 'image.title');
        },
        date() {
            var date = _.get(this, 'image.created');
            if (!date) {
                return;
            }
            return this.$filters.formatDate(date, 'D MMM YYYY');
        },
        photographer() {
            var image = this.image;

            var photographer = this._.get(image, 'data.photographer');
            var uploader = this._.get(image, 'managedAuthor');

            if (photographer && photographer.title) {
                return {
                    _id: photographer._id,
                    style: 'contact',
                    title: photographer.title
                };
            }

            if (uploader && uploader.title) {
                return {
                    _id: uploader._id,
                    style: 'persona',
                    title: uploader.title
                };
            }
        },
        smallUrl() {
            return this.$fluro.asset.imageUrl(this.image, 50);
        },
        url() {
            return this.$fluro.asset.imageUrl(this.image, 320);
        },
        aspectRatio() {
            var image = this.image;
            if (!image) {
                return;
            }
            return image.width / image.height;
        },
    },
    methods: {
        viewPhotographer() {
            var id = this.photographer._id;
            if (this.photographer.style == 'contact') {
                this.$router.push({
                    name: 'photographer',
                    params: {
                        id: id,
                    }
                })
            }
        },
        download() {
            if (!this.image) {
                return;
            }
            var url = this.$fluro.asset.downloadUrl(this.image, { filename: this.image.filename });
            window.open(url);

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
.wrap {
    position: relative;
    color: #fff;
    background: #ebeef0;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    font-size: 0.9em;
    font-weight: 600;

    .thumb-top,
    .thumb-bottom {
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 1;
        opacity: 0;
        transition: 0.1s;
        padding: 10px;

    }

    .thumb-bottom {
        display: flex;

        .thumb-left {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .shader {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000;
        opacity: 0;
    }

    .thumb-top {
        top: 0;
    }

    .thumb-bottom {
        bottom: 0;
    }

    .thumb-left {
        flex: 1;
        left: 0;
        min-height: 1px;
    }

    .thumb-right {
        // max-width: 96px;
        flex: 1;
        text-align: right;
    }

    .v-btn {
        margin: 0;
    }

    
    &:hover {
        &>.shader {
            opacity: 0.5;
        }

        &>.thumb-top,
        &>.thumb-bottom {
            opacity: 1;
        }
    }

    @media(max-width: 768px) {
        &>.shader {
            opacity:1;
            background: linear-gradient(rgba(#111, 0.9), rgba(#000, 0.1));
        }

        &>.thumb-top,
        &>.thumb-bottom {
            opacity: 1;
        }
    }

}
</style>