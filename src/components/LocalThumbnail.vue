<template>
    <div class="local-preview" :style="styles">
    	<!--   -->
    	<v-progress-circular v-if="loading" indeterminate color="grey"></v-progress-circular>
        <!-- <img :src="thumbnail"> -->
        <!-- <pre>{{styles}}</pre> -->
    </div>
</template>
<script>
export default {
    props: {
        url: {
            type: String,
        },
    },
    data() {
        return {
            styles: {},
            width: 0,
            height: 0,
            layout: true,
            aspect: 0,
            thumbnail: null,
            loading:true,
        }
    },
    watch: {
        'url': 'render'
    },
    methods: {
        render() {
            //Keep a reference to the component
            var self = this;


            ///////////////////////////////////

            //Get the url
            var url = self.url;
            if (!url || !url.length) {
                return;
            }

            var promise = new Promise(function(resolve, reject) {


                //Cache the image thumbnails so we don't need to 
                //rerender them with canvas over and over again
                var cache = self.$fluro.cache.get('localImages');
                var cached = cache.get(url);

                //If we already have the thumbnail information cached
                if (cached) {
                    //Use the cached version
                    self.thumbnail = cached;
                    self.styles = {
                        backgroundImage: `url(${self.thumbnail})`,
                    }

                    // self.$emit('loaded');
                    self.loading = false;
                    resolve();

                } else {

                    //Clear the styles
                    self.styles = {}
                    self.loading = true;

                    //Create a new image
                    var img = new Image;
                    img.src = url;

                    //Once the image has loaded
                    img.onload = function() {

                        //Get the dimensions of the image
                        if (img.height >= img.width) {
                            self.layout = 'portrait';
                            self.aspect = (img.width / img.height) * 100;
                        } else {
                            self.layout = 'landscape';
                            self.aspect = (img.height / img.width) * 100;
                        }

                        //Get the thumbnail
                        var thumbnail = self.getBase64Thumb(img, 100);

                        //Cache it for later
                        cache.set(url, thumbnail);

                        self.thumbnail = thumbnail;
                        self.styles = {
                            backgroundImage: `url(${thumbnail})`,
                        }

                        self.loading = false;
                        resolve();
                    }
                }

            })

            //Emit the promise event

            self.$emit('promise', promise);
        },
        getBase64Thumb(img, width) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = canvas.width * (img.height / img.width);

            /// step 1
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            oc.width = img.width * 0.5;
            oc.height = img.height * 0.5;
            octx.drawImage(img, 0, 0, oc.width, oc.height);

            /// step 2
            octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

            ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
                0, 0, canvas.width, canvas.height);

            return canvas.toDataURL('image/jpeg', 0.5);
        },
    },
    mounted() {
        this.render()
    }





    // }
}
</script>
<style scoped lang="scss">
.local-preview {
    background-size: contain;
    // background-color: #fff;//#eee;
    background-position: center;
    overflow: hidden;
    width: 100%;
    height: 0;
    display: block;
    position: relative;
    padding-bottom: 100%;


    .v-progress-circular {
    	position: absolute;
    	left:50%;
    	top:50%;
    	transform: translate3d(-50%, -50%, 0);
    }

}
</style>