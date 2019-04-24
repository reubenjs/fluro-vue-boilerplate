

// define a mixin object
export default {
    computed:{
        isMobile() {
            switch (this.$vuetify.breakpoint.name) {
              case 'xs': 
              case 'sm': 
              return true;
              break;
            }
          },
    },
}
