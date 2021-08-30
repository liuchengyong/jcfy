<template>
  <div class="vr-container">
    <iframe :src="$route.query.url"></iframe>
  </div>
</template>
<script>
  import util from '../common/util.js';
  export default {
    components:{},
    data(){
      return {
      }
    },
    created(){
      this.$store.commit('changeTitle','vr看房');
      util.hideLoading();
    },
    methods:{

    }

  }
</script>


<style lang="scss">
  .vr-container{
    iframe{
      width:100vw;
      height: calc(100vh - 1rem);
    }
  }
</style>
