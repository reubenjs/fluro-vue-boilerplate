import Vue from 'vue';

import { mapGetters } from 'vuex';

// import { mapGetters } from 'vuex';

// define a mixin object
export default {



    data() {

        var pinStore = this.$fluro.stats.getStore('pinned', true);

        return {
            pinning: false,
            pinned: false,
            pinStore: pinStore,
        }
    },
    created() {
        var self = this;
        var pinStore = this.$fluro.stats.getStore('pinned', true);
        pinStore.refresh().then(refreshComplete, refreshComplete);

        function refreshComplete() {
            self.pinning = pinStore.isStatting(self.itemID);
            self.pinned = pinStore.isStatted(self.itemID)
        }
    },
    computed: {
        ...mapGetters([
            'user',
        ]),
        itemID() {
            var itemID = this.item;

            if (itemID._id) {
                itemID = itemID._id;
            }

            return itemID;
        },
        pinIcon() {
            if (!this.itemID) {
                return ['far', 'thumbtack'];
            }

            if (this.pinning) {
                return ['far', 'spinner-third']
            }

            if (this.pinned) {
                return ['fas', 'thumbtack']
            } else {
                return ['far', 'thumbtack']
            }
        },
    },
    methods: {
        togglePin() {

            var self = this;
            self.pinning = true;
            self.pinStore.toggle(self.itemID).then(success, failed);

            function success(res) {

                self.pinned = self.pinStore.isStatted(self.itemID);
                self.pinning = false;

                if(res.data.total) {
                    // console.log('TOTAL', res.data)
                    self.$toasted.show(`Pinned`, {
                        // icon:'pin',
                        // duration:1000,
                        type:'success',
                    })
                } else {
                    self.$toasted.show(`Unpinned`, {
                        // icon:'pin',
                        // duration:1000,
                        type:'info',
                    })
                }

                
            }

            function failed(err) {
                self.pinned = self.pinStore.isStatted(self.itemID);
                self.pinning = false;

                self.$toasted.show(`Error!`, {
                    icon:'exclamation',
                    duration:1000,
                    type:'warning',
                })

                
            }
        },
    }
}