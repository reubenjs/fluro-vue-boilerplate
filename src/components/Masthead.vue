<template>
  <nav>
    <router-link :to="{name:'home'}"><b-icon pack="far" icon="home" /></router-link>
    <router-link :to="{name:'about'}"><b-icon pack="far" icon="info" /></router-link>
    <a @click="logout()"><b-icon pack="fas" icon="sign-out" /></a>
  </nav>
</template>

<script>


  // import { mapActions, mapGetters, mapMutations } from 'vuex';


  export default {
    // props:['callback'],
    data() {
      return {
      }
    },
    methods:{
        logout:function() {
            this.$fluro.auth.logout();
        }
    }
  }

  </script>

  <style scoped lang="scss">
  
    nav {
      display:flex;
      background: #fff;
      // position:fixed;
      // left:0;
      // top:0;
      // right:0;
      border-bottom: 1px solid #ddd;

      a {
        line-height:50px;
        flex:1;
        text-align:center;
        color: inherit;
        border-right: 1px solid #ddd;

        &:last-child {
          border-right:none;
        }

        .icon {
          display:inline-block;
        }
      }
    }

  </style>
