<template>
  <div class="video-container">
    <video :src="$route.query.url" controls="controls"></video>
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
      this.$store.commit('changeTitle','视频讲盘');
      util.hideLoading();
    },
    methods:{

    }

  }
</script>


<style lang="scss">
  .video-container{
    video{
      width: 100vw;
      height: auto;
    }
  }
</style>
