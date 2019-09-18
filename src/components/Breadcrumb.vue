<template>
    <div class="breadcrumb" v-if="show">
        <!-- <label>Back to</label> -->
        <ul>
            <template v-for="(item, index) in breadcrumb">
                <li>
                    <router-link :to="{name:item.name, params:$route.params, query:$route.query}">
                        <span>{{item.meta.title}}</span>
                        <fluro-icon icon="angle-right" v-if="index < breadcrumb.length-1"/>
                    </router-link>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
import BreadcrumbMixin from '@/mixins/BreadcrumbMixin';


export default {
    mixins: [BreadcrumbMixin],
    computed:{
        show() {
            return this.breadcrumb.length && !(this.$route.meta && this.$route.meta.disableBreadcrumb)
        }
    },
    methods: {
        clicked() {

        }
    },

}
</script>
<style scoped lang="scss">
.breadcrumb {
    display: block;
    // padding: 5px 10px;

    label {
        font-size: 12px;
        font-weight: 400;
        opacity: 0.3;
        display: inline-block;
        margin:0 5px 0 0;
        padding-right:5px;
        // border-right: 1px solid rgba(#000,0.3);
    }

    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: inline;

        li {
            display: inline;
            margin: 0;
            padding: 0;

            a {
                display: inline-block;
                text-decoration: none;
                color: inherit;

                font-size: 12px;
                font-weight: 400;
                padding: 5px 0 5px;
                text-transform: none;
                letter-spacing: 0;

                svg {
                    opacity: 0.2;
                    font-size: 0.8em;
                }

                span {
                    opacity: 0.5;
                }

                &:hover span {
                    opacity: 0.8;
                }
            }
        }
    }
}


/**
.breadcrumb {
    display: block;
    // @extend .border-top;
    // @extend .border-bottom;
   padding: 2px 0;

    $dark: #f0f0f0;
    background: $dark;
    $breadcrumb-height: 14px;
    $breadcrumb-bg: #fff;//#eee;
    $breadcrumb-arrow-right: $breadcrumb-bg;
    $breadcrumb-arrow-left: $dark;
    $hover-color: #fff;

    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: inline;

        li {
            margin: 0;
            padding: 0;

            &:first-child a {
                &:before {
                    display: none;
                }

                padding-left: $breadcrumb-height;
            }

            a {
                border-radius: 4px 0 0 4px;
                display: inline-block;
                text-decoration: none;
                color: inherit;
                padding: 0 ($breadcrumb-height) 0 ($breadcrumb-height * 1.8);
                position: relative;
                margin: 0 3px 0 0;
                line-height: $breadcrumb-height * 2;
                background: $breadcrumb-bg;
                font-size: 12px;
                font-weight: 500;
                // box-shadow: 0 0 4px rgba(#000, 0.2);


                &:after {
                    content: "";
                    border-top: $breadcrumb-height solid transparent;
                    border-bottom: $breadcrumb-height solid transparent;
                    border-left: $breadcrumb-height solid $breadcrumb-arrow-right;
                    position: absolute;
                    right: -$breadcrumb-height;
                    top: 0;
                    z-index: 1;
                    // box-shadow: 0 0 4px rgba(#000, 0.2);
                }

                &:before {
                    content: "";
                    border-top: $breadcrumb-height solid transparent;
                    border-bottom: $breadcrumb-height solid transparent;
                    border-left: $breadcrumb-height solid $breadcrumb-arrow-left;
                    position: absolute;
                    left: 0;
                    top: 0;
                }

                &:hover {
                    background: $hover-color;
                    color: #555;

                    &:after {
                        border-left: $breadcrumb-height solid $hover-color;
                    }
                }
            }
        }
    }
}
/**/
</style>