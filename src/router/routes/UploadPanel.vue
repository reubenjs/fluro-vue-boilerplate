<template>
    <div class="bleed-panel" :class="{uploading:state == 'uploading'}">
        <div class="bleed-header border-bottom">
            <v-toolbar color="white" flat>
                <v-btn @click="close()" icon>
                    <v-icon>close</v-icon>
                </v-btn>
                <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
                <v-toolbar-title>
                    <div v-if="!files.length">Please select photos</div>
                    <div v-if="files.length && state == 'uploading'">Uploading <span class="text-muted">{{progress}}%</span></div>
                    <div v-if="files.length && state != 'uploading'">{{files.length}} photos for <span class="text-muted">'{{event.title}}'</span></div>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- <v-btn icon>
                    <v-icon>search</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>apps</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>refresh</v-icon>
                </v-btn> -->
                <div class="selection-info" v-if="files.length && state != 'uploading'">
                    {{selection.length}} of {{files.length}} Selected
                </div>
                <v-btn @click="addMore" icon v-if="files.length && state != 'uploading'">
                    <v-icon>add</v-icon>
                </v-btn>
                <v-menu v-if="files.length && state != 'uploading'" :nudge-width="250" :nudge-bottom="5" offset-y>
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-btn icon>
                                <v-icon>more_vert</v-icon>
                            </v-btn>
                            <!-- <fluro-avatar slot="activator" class="md" :id="user._id" type="user"></fluro-avatar>     -->
                        </div>
                    </template>
                    <v-card tile>
                        <v-list>
                            <v-list-tile @click="selectAll()">
                                <v-list-tile-title>Select All</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="deselectAll()">
                                <v-list-tile-title>Deselect All</v-list-tile-title>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile @click="clearSelection()">
                                <v-list-tile-title>Remove {{selection.length}} selected photos</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="clearAll()">
                                <v-list-tile-title>Remove all photos</v-list-tile-title>
                            </v-list-tile>
                            <!-- <v-list-tile> -->
                            <!-- </v-list-tile> -->
                            <!-- <v-list-tile @click="logout()">
                                <v-list-tile-title>Logout</v-list-tile-title>
                            </v-list-tile> -->
                        </v-list>
                        <!-- <div v-id="files.length">
                            {{selection.length}} of {{files.length}} Selected
                        </div>
                        <v-btn icon>
                            <v-icon>more_vert</v-icon>
                        </v-btn> -->
                    </v-card>
                </v-menu>
                <v-btn @click="start()" color="primary" v-if="canStart()">
                    Upload All
                    <font-awesome-icon right :icon="['far', 'arrow-up']" />
                </v-btn>
                <v-btn @click="cancel()" color="error" v-if="state == 'uploading'">
                    Cancel
                    <font-awesome-icon right :icon="['far', 'ban']" />
                </v-btn>
            </v-toolbar>
        </div>
        <div class="bleed-body">
            <v-progress-linear class="total-progress" color="primary" v-model="progress"></v-progress-linear>
            <div class="dropbox" v-show="!files.length">
                <input ref="file" type="file" multiple name="fileinput" @change="filesChange($event.target.name, $event.target.files);" accept="image/*" class="input-file">
                <!-- <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="input-file"> -->
                <div>
                    <font-awesome-icon right :icon="['far', 'file-download']" />
                    <h1>{{event.title}}</h1>
                    <h2>{{event | readableEventDate}}</h2>
                    <p>Click or drop your photos here to continue</p>
                </div>
            </div>
            <!--  <v-container fluid class="page-header">
            </v-container> -->
            <div v-if="files.length" class="upload-tools">
                <v-layout row wrap class="flex-wrapper">
                    <v-flex xs12 sm4 lg3 class="sidebar">
                        <div class="block border-bottom">
                            <div class="form-group">
                                <label>Event</label>
                                <h3>{{event.title}}</h3>
                                <div>{{event.realms | comma('title')}}</div>
                                <h5 class="text-muted">{{event | readableEventDate}}</h5>
                            </div>
                        </div>
                        <div v-if="files.length && state != 'uploading'">
                            <div class="block border-bottom">
                                <div class="form-group">
                                    <label>Realms</label>
                                    <treeselect v-model="realms" :flat="true" :multiple="true" :options="realmOptions"></treeselect>
                                </div>
                            </div>
                            <div class="block border-bottom">
                                <div class="form-group">
                                    <label>Tags</label>
                                    <v-combobox multiple v-model="tags" label="Type here and press enter to add tags" append-icon chips deletable-chips class="tag-input" :search-input.sync="search" @keyup.tab="updateTags" @keyup.enter="updateTags" @paste="updateTags">
                                    </v-combobox>
                                </div>
                            </div>
                        </div>
                    </v-flex>
                    <v-flex xs12 sm8 lg9 class="main-column">
                        <!-- <v-layout row wrap class="action-bar">
                            <v-flex xs12 sm6>
                                {{selection.length}} of {{files.length}} Selected
                            </v-flex>
                            <v-flex xs12 sm6 class="text-sm-right">
                                Select All
                            </v-flex>
                        </v-layout> -->
                        <div class="thumbnails">
                            <!-- md9 lg10 xl11> -->
                            <v-layout row wrap class="clickthrough">
                                <div class="backdrop" @click="deselectAll()"></div>
                                <v-flex xs12 sm4 md3 xl2 v-for="(file, $index) in files">
                                    <div @click="toggle(file, $event, $index)" :class="{selected:isSelected(file), progress:file.state == 'progress', complete:file.state == 'complete'}" class="thumbnail">
                                        <v-btn dark fab small class="remove" @click.stop="remove(file)">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                        <div class="thumb-container">
                                            <local-thumbnail :url="file.local" @promise="promiseReceived(file, $event)"></local-thumbnail>
                                            <v-progress-circular v-if="file.state == 'progress'" :value="file.progress" color="white"></v-progress-circular>
                                        </div>
                                        <div class="inline-tags">
                                            <span class="inline-tag" v-for="tag in file.tags" @click.stop="removeTag(file, tag)">
                                                {{tag}}
                                                <font-awesome-icon right :icon="['far', 'times']" />
                                            </span>
                                        </div>
                                        <div class="caption" v-if="file.state == 'progress'">
                                            <v-flex d-flex>
                                                <div>
                                                    <font-awesome-icon spin :icon="['far', 'spinner-third']" />
                                                    {{file.name}}</div>
                                                <div class="text-muted small text-xs-right">{{file.size | filesize}}</div>
                                            </v-flex>
                                            <v-progress-linear v-model="file.progress"></v-progress-linear>
                                        </div>
                                        <div class="caption" v-else-if="file.state == 'complete'">
                                            <v-flex d-flex>
                                                <div>
                                                    <font-awesome-icon :icon="['far', 'check']" />
                                                    {{file.result.title}}</div>
                                                <div class="text-muted small text-xs-right">{{file.result.filesize | filesize}}</div>
                                            </v-flex>
                                        </div>
                                        <div class="caption" v-else>
                                            <v-flex d-flex>
                                                <div>
                                                    <font-awesome-icon :icon="['far', 'circle']" />
                                                    {{file.name}}</div>
                                                <div class="text-muted small text-xs-right">{{file.size | filesize}}</div>
                                            </v-flex>
                                        </div>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </div>
                    </v-flex>
                </v-layout>
                <!-- <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <v-flex xs12 sm4 md3 lg2 v-for="file in files">
                            <div class="thumbnail">
                                <local-thumbnail :url="file.local"></local-thumbnail>
                                <v-flex class="caption" d-flex>
                                    <div>{{file.name}}</div>
                                    <div class="text-muted small text-xs-right">{{file.size | filesize}}</div>
                                </v-flex>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container> -->
            </div>
        </div>
    </div>
</template>
<script>
import LocalThumbnail from '@/components/LocalThumbnail';

// // import { upload } from './file-upload.service';

// const STATUS_INITIAL = 0;
// const STATUS_SAVING = 1;
// const STATUS_SUCCESS = 2;
// const STATUS_FAILED = 3;



import Treeselect from '@riophae/vue-treeselect'
import axios from 'axios';
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'



export default {
    components: {
        Treeselect,
        LocalThumbnail,
    },

    data() {

        return {
            state: 'ready',
            tags: [],
            realms: [],
            selection: [],
            files: [],
            search: "", //sync search
            prevSelected: -1, //index of previously selected item
            bytesLoaded: 0,
            bytesTotal: 0,
            cancelTokens: [],

            //     //     uploadError: null,
            //     //     currentStatus: null,
            //     //     uploadFieldName: 'photos'
        }
    },
    computed: {
        progress() {
            var self = this;

            var percent = Math.floor((self.bytesLoaded * 100) / self.bytesTotal);
            console.log('Percent!', percent, self.bytesLoaded, self.bytesTotal);
            return percent;
        },
    },
    //     isInitial() {
    //         return this.currentStatus === STATUS_INITIAL;
    //     },
    //     isSaving() {
    //         return this.currentStatus === STATUS_SAVING;
    //     },
    //     isSuccess() {
    //         return this.currentStatus === STATUS_SUCCESS;
    //     },
    //     isFailed() {
    //         return this.currentStatus === STATUS_FAILED;
    //     }
    // },
    methods: {
        canStart() {

            var hasFiles = _.some(this.files, function(file) {
                return file.state != 'complete' && file.state != 'progress';
            })

            return hasFiles && this.state != 'uploading'
        },
        start() {

            this.deselectAll();
            this.state = 'uploading';

            this.uploadNext();
        },

        uploadNext() {

            var self = this;

            //If we aren't cancelled
            if (self.state != 'uploading') {
                return
            }


            var nextItem = _.find(this.files, function(file) {
                return file.state != 'complete' && file.state != 'progress';
            })

            if (nextItem) {
                this.upload(nextItem);
            } else {
                console.log('All files uploaded!')

                self.$toasted.show(`All photos have been uploaded`, {
                    // icon:'check'
                    duration: 10000,
                    type: 'success',
                })

                self.state = 'ready';
            }

        },
        cancel() {
            this.state = 'cancelled';
            this.cancelInflightRequests();
        },
        cancelInflightRequests() {
            _.each(this.cancelTokens, function(source) {
                source.cancel('Operation canceled by the user.');
            })

            this.cancelTokens = [];

        },
        addMore() {
            console.log('REFS', this.$refs);

            var fileInput = this.$refs.file;
            if (fileInput) {
                fileInput.click();
            }
        },
        upload(file) {

            var self = this;

            switch (file.state) {
                case 'complete':
                case 'progress':
                    //Stop here if it's already in progress or complete
                    return;
                    break;
                default:
                    break;
            }

            /////////////////////////////////////////////

            //Change the state to progress
            file.state = 'progress';

            //Create a new form object
            var formData = new FormData();
            var jsonData = {};

            // console.log('FORM', file, this);

            /////////////////////////////////////////////

            //Include the tags
            jsonData.definition = 'photo';
            jsonData.tags = file.tags;
            jsonData.data = {
                event: self.$route.params.id,
            }

            //Include the realms
            jsonData.realms = this.realms;

            /////////////////////////////////////////////

            //Add the JSON data and the binary file data
            formData.set('json', JSON.stringify(jsonData));
            formData.append('file', file.file, file.name)

            /////////////////////////////////////////////

            self.$forceUpdate();

            var body = formData;
            var config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                    // do whatever you like with the percentage complete
                    // maybe dispatch an action that will update a progress bar or something
                    file.progress = percentCompleted;

                    file.bytesLoaded = progressEvent.loaded;
                    file.bytesTotal = progressEvent.total;

                    // console.log('Force an update')

                    self.bytesLoaded = _.reduce(self.files, function(set, file) {
                        if (file.state == 'complete') {
                            set += file.size || file.bytesTotal || 0;
                        } else {
                            set += file.bytesLoaded || 0;
                        }
                        return set;
                    }, 0)

                    console.log('Bytes loaded now', self.bytesLoaded, progressEvent.loaded);

                    self.$forceUpdate();
                }
            };

            ///////////////////////////////////////////////////

            const CancelToken = axios.CancelToken;
            const source = CancelToken.source();
            config.cancelToken = source.token;

            self.cancelTokens.push(source);


            ///////////////////////////////////////////////////

            return this.$fluro.api.post('/file/upload', body, config)
                .then(function(res) {
                    console.log('RESPONSE', res);
                    file.state = 'complete';
                    file.result = res.data;

                    self.uploadNext();
                    self.$forceUpdate();
                })
                .catch(function(err) {
                    console.log('Error', err);
                    file.state = 'error';
                    self.uploadNext();
                    self.$forceUpdate();
                });

        },
        selectWithinRange(num1, num2) {

            var self = this;
            var start;
            var end;

            ///////////////////////////////////////

            if (num1 > num2) {
                start = num2;
                end = num1 + 1;
            } else {
                start = num1;
                end = num2;
            }

            ///////////////////////////////////////

            _.each(self.files, function(item, i) {

                if (_.inRange(i, start, end)) {

                    if (!item.isSuccess) {
                        self.select(item);
                    }

                }
            })
        },

        isSelected(item) {
            return _.includes(this.selection, item);
        },
        select(item) {
            if (!this.isEditable(item)) {
                return;
            }
            if (this.isSelected(item)) {
                return;
            }

            this.selection.push(item);
        },
        deselect(item) {
            var index = this.selection.indexOf(item);
            if (index != -1) {
                this.selection.splice(index, 1);
            }
        },
        clearSelection() {
            var self = this;
            _.each(this.selection, function(item) {
                self.remove(item);
            })
            this.selection.length = 0;
            this.$forceUpdate();
        },
        clearAll() {
            this.files.length = 0;
            this.selection.length = 0;
            this.$forceUpdate();
        },
        remove(item) {
            var index = this.files.indexOf(item);
            if (index != -1) {
                this.files.splice(index, 1);
                this.$forceUpdate();
            }
        },
        deselectAll() {
            console.log('Deselect all')
            this.selection.length = 0;
            this.$forceUpdate();
        },
        selectAll() {

            var self = this;

            _.each(self.files, function(item, i) {
                if (!item.isSuccess) {
                    self.select(item);
                }
            })

            this.$forceUpdate();


        },
        toggle(item, $event, $index) {



            var self = this;

            // if (item.isSuccess || $scope.uploader.isUploading) {
            //     return;
            // }

            if ($event) {
                $event.preventDefault();
            }

            //Open the result
            if (item.result) {
                return;
            }

            // shift + click listener
            if ($event.shiftKey && self.prevSelected >= 0) {
                self.selectWithinRange($index, self.prevSelected);
                self.prevSelected = $index;
                // select or deselect item
            } else {

                if ($event.metaKey) {

                    console.log('MetaKey!', )
                    //If it's selected already then deselect it
                    if (self.isSelected(item)) {

                        console.log('Deselect!');
                        self.deselect(item)
                        self.prevSelected = -1;
                    } else {
                        self.select(item)
                        // item.selected = true;
                        self.prevSelected = $index;
                    }
                } else {
                    self.prevSelected = -1;
                    _.each(self.files, function(other) {
                        if (other == item) {
                            self.select(other)
                            // other.selected = true;
                            self.prevSelected = $index;
                        } else {
                            self.deselect(other)
                            // other.selected = false;
                        }
                    })
                }
            }
        },
        isEditable(file) {

            if (this.state == 'uploading') {
                return;
            }

            switch (file.state) {
                case 'progress':
                case 'complete':
                    return;
                    break;
                default:
                    return true;
                    break;
            }

        },
        updateTags() {

            var self = this;

            var targets;

            ///////////////////////////////////

            if (self.selection.length) {
                targets = self.selection;
            } else {
                targets = self.files;
            }

            ///////////////////////////////////

            _.chain(targets)
                .filter(function(file) {
                    return self.isEditable(file);
                })
                .map(function(photo) {
                    if (!photo.tags) {
                        photo.tags = [];
                    }

                    photo.tags = photo.tags.concat(self.tags);
                })
                .value();

            ///////////////////////////////////

            self.search = "";
            self.tags = [];

        },
        removeTag(item, tag) {
            var index = item.tags.indexOf(tag);
            if (index != -1) {
                item.tags.splice(index, 1);
                this.$forceUpdate();
            }

        },
        close() {
            if (window.history.length) {
                this.$router.go(-1)
            } else {
                this.$router.push({ query: Object.assign({}, this.$route.query, { photo: undefined }) });
            }
        },
        createObjectURL(file) {
            return (window.URL) ? window.URL.createObjectURL(file) : window.webkitURL.createObjectURL(file);
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
        reset() {
            this.files.length = 0;
            this.cancelInflightRequests();

            this.state = 'ready';
            this.tags = [];
            this.realms = [];
            this.search = '';
            this.selection = [];
            this.files = [];
            this.prevSelected = -1;
            this.bytesLoaded = 0;
            this.bytesTotal = 0;
            this.cancelTokens = [];
        },
        renderNextThumbnail() {

            var nextThumbnail = _.find(this.files, function(file) {
                return !file.local;
            })

            if (nextThumbnail) {
                this.renderThumbnail(nextThumbnail);
            } else {
                console.log('All thumbnails rendered')
            }

        },

        renderThumbnail(file) {
            //Set the local url so that it start's rendering
            file.local = this.createObjectURL(file.file);
        },

        promiseReceived(file, promise) {

            var self = this;
            //Update the file
            promise.then(function(res) {
                file.loaded = true;
                self.renderNextThumbnail()
                self.$forceUpdate();
            })
            // console.log('PREVIEW LOADED EVENT', file, promise);

            // file.loaded = true;
        },


        filesChange(fieldName, fileList) {

            var self = this;
            // handle file changes


            if (!fileList.length) return;

            /////////////////////////////////////////

            _.each(fileList, function(file) {
                self.files.push({
                    name: file.name,
                    size: file.size,
                    webkitRelativePath: file.webkitRelativePath,
                    //local: self.createObjectURL(file),//do this sequentially
                    file,
                });
            })

            /////////////////////////////////////////

            //Update the total filesize of all files
            self.bytesTotal = _.reduce(self.files, function(set, file) {
                set += file.bytesTotal || file.size || 0;
                return set;
            }, 0);

            /////////////////////////////////////////

            this.renderNextThumbnail();

            // console.log('files', self.files);

            // // append the files to FormData
            // Array
            //     .from(Array(fileList.length).keys())
            //     .map(x => {
            //         formData.append(fieldName, fileList[x], fileList[x].name);
            //     });

            // save it
            // this.save(formData);

            // this.files = fileList;
        }
    },
    mounted() {
        this.reset();
    },
    beforeDestroy() {
        this.reset();

    },
    asyncComputed: {


        realmOptions: {
            default: [],
            get() {

                var self = this;
                var eventID = this.$route.params.id;

                return new Promise(function(resolve, reject) {

                    self.$fluro.access.retrieveSelectableRealms('create', 'photo', 'image').then(function(res) {


                        function mapChild(realm) {

                            realm.id = realm._id;
                            realm.label = realm.title;

                            if (realm.children && realm.children.length) {
                                _.each(realm.children, function(child) {
                                    mapChild(child);
                                })
                            } else {
                                delete realm.children;
                            }
                        }



                        var mapped = _.chain(res)
                            .reduce(function(set, realm) {

                                mapChild(realm);

                                var disc = realm._discriminator || realm._discriminatorType || realm.definition || 'realm';

                                if (!set[disc]) {
                                    set[disc] = {
                                        label: disc,
                                        id: disc,
                                        children: [],
                                        isDisabled: true,
                                    };
                                }

                                set[disc].children.push(realm);

                                return set;
                            }, {})
                            .values()
                            .value();

                        if (mapped.length == 1) {
                            mapped = mapped[0].children;
                        }



                        resolve(mapped);
                    });


                    // var options = [{
                    //         id: 'a',
                    //         label: 'a',
                    //         children: [{
                    //             id: 'aa',
                    //             label: 'aa',
                    //         }, {
                    //             id: 'ab',
                    //             label: 'ab',
                    //         }],
                    //     }, {
                    //         id: 'b',
                    //         label: 'b',
                    //     }, {
                    //         id: 'c',
                    //         label: 'c',
                    //     }]

                    // resolve(options)


                });
            }
        },
        event: {
            default: {},
            get() {

                var self = this;
                var eventID = this.$route.params.id;

                return new Promise(function(resolve, reject) {

                    /////////////////////////////////////////////

                    self.$fluro.content.get(eventID, {
                            select: 'title startDate endDate realms'
                        })
                        .then(function(event) {
                            resolve(event);

                            self.realms = self.$fluro.utils.arrayIDs(event.realms);
                            console.log('Use event realms')
                        }, reject);


                });
            }
        }

    }
}
</script>
<style lang="scss">
.bleed-panel {



    .flex-wrapper {
        overflow: hidden;
    }

    @media(max-width: 768px) {

        .selection-info {
            display: none;
        }

        .v-toolbar__title {
            display: none;
        }

        .flex-wrapper {
            overflow: visible;
        }



        .bleed-panel {
            overflow: visible;
            display: block;



            .bleed-body {
                flex: 1;
                display: block;
                overflow: auto;
                // border: 10px solid #ff0066;

                .upload-tools {
                    overflow: auto;
                    // flex:none;
                    height: auto;
                    // border: 10px solid green;

                    .sidebar {
                        height: auto !important;
                    }
                }


            }
        }

    }

    .selection-info {
        font-size: 0.8em;
        font-weight: 500;
        opacity: 0.5;
        margin-right: 15px;
    }


    &.uploading {
        .sidebar {
            // transform: translateX(-100%);//scaleX(0);//max-width: 0px;
            // position:fixed;
        }

        .total-progress {
            opacity: 1 !important;
        }
    }


    .backdrop {
        // background: #ff0066;
        position: absolute;
        left: 0;


        top: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        pointer-events: all;

        // &:hover {
        //     background: #ff0066;
        // }
    }



    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #f5f6f7;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .bleed-header {
        flex: none;
    }



    .thumbnail {
        margin: 10px;
        padding: 10px 10px 15px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        position: relative;
        pointer-events: all;
        background: #fff;
        outline: none;
        cursor: pointer;

        .remove {
            display: none;
            position: absolute;
            top: -14px;
            right: -14px;
            width: 28px;
            height: 28px;

            .v-icon {
                font-size: 14px;
            }

            z-index: 1000;
        }

        &:hover {
            .remove {
                display: block;
            }
        }


        .v-progress-linear {
            position: absolute;
            left: 3px;
            right: 3px;
            bottom: 3px;
            margin: 0;
            border-radius: 3px;
            max-width: 100%;
            width: auto;
        }

        .thumb-container {
            position: relative;

            .local-preview {
                position: relative;
                z-index: 0;
            }

            .v-progress-circular {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -50%, 0);
                z-index: 1;
            }


        }

        .inline-tags {
            display: block;
            flex: none;
            padding: 5px 0;

            .inline-tag {
                display: inline-block;
                border-radius: 3px;
                font-size: 9px;
                font-weight: 500;
                padding: 4px 8px;
                line-height: 1;
                background: rgba(darken(cyan, 10%), 0.2);
                color: darken(cyan, 30%);
                margin: 0 2px 2px 0;
                text-transform: capitalize;

                svg {
                    // height:9px;
                    width: 9px;
                    display: inline;
                }

                &:hover {
                    background: #333;
                    color: #fff;
                }

            }
        }

        .caption {
            margin-top: 10px;
            font-size: 0.7em;
        }

        &.selected,
        &.progress {
            background-color: rgba(27, 195, 254, 0.2);
            border-color: rgba(27, 195, 254, 0.3);
            color: #347e98;
        }


        &.progress,
        &.complete {
            cursor: default;
        }

        &.complete {

            background-color: rgba(#74e81c, 0.2);
            border-color: rgba(#74e81c, 0.3);
            color: darken(#74e81c, 20%);
        }


    }



    .upload-tools {
        flex: 1;
        display: flex;
        overflow: hidden;
        position: relative;

        .sidebar {
            background: #fff;
            overflow: auto;
            height: 100%;
            position: relative;
            transition: transform 0.3s;

            .v-chip .v-chip__content {
                height: 25px;
                font-size: 0.9em;
                font-weight: 500;
            }

            .block {
                padding: 25px;

                .form-group {
                    &>label {
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.05em;
                        font-size: 0.7em;
                    }
                }
            }
        }

        .main-column {
            height: 100%;
            display: flex;
            flex-direction: column;

            // .action-bar {
            //     padding: 15px 25px;
            //     font-size: 0.8em;
            //     font-weight: 500;
            // }

        }

        .thumbnails {
            padding: 20px 20px; //5px 20px 15px;
            //pointer-events: none;
            overflow: auto;
            -webkit-overflow-scroll: touch;
            position: relative;
            //border: 10px solid green;
            overflow: auto;
            height: 100%;



            .thumbnail {
                pointer-events: all;
            }
        }
    }


    .clickthrough {
        pointer-events: none;
        position: relative;
    }

    .bleed-body {

        // padding: 5%;
        .total-progress {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            margin: 0;
            opacity: 0;
            z-index: 10;
        }


        position: relative;
        flex: 1;
        display: flex;
        overflow: hidden;
        // border: 10px solid yellow;
        // overflow-y: auto;
        // overflow-x: hidden;
        // -webkit-overflow-scroll: touch;
        // display: flex;

        .dropbox {
            cursor: pointer;
            margin: 2%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            position: relative;
            text-align: center;
            background: darken(#f5f6f7, 2%);
            border: 1px dashed darken(#f5f6f7, 20%);
            border-radius: 10px;

            svg {
                width: 15vh;
                height: 15vh;
                margin-bottom: 25px;
            }

            &:hover {
                background: rgba(cyan, 0.05);
                border: 1px dashed darken(cyan, 20%);
                color: darken(cyan, 20%);
            }



            // outline-offset: -10px;
            // background: lightcyan;
            // color: dimgray;
            // padding: 10px 10px;
            // min-height: 200px;
            // /* minimum height */
            // position: relative;
            // cursor: pointer;
        }

        .input-file {
            opacity: 0;
            /* invisible but it's there! */
            width: 100%;
            height: 100%;
            // height: 200px;
            position: absolute;
            // cursor: pointer;
        }



        .dropbox p {
            font-size: 1.2em;
            text-align: center;
            padding: 50px 0;
        }
    }


}
</style>