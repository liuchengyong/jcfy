<template>
  <div class="container" @scroll="handleScroll" ref="wrapper">
	<my-header v-if="isWx"></my-header>
	<keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
	</keep-alive>
	<router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
	import myHeader from '../component/header.vue'
  import util from '../common/util.js'
	import { mapState } from 'vuex'
	export default {
		components:{myHeader},
		data(){
			return{
        timer:undefined,
        isWx: util.isWeixin
			}
		},
    mounted(){
      this.$nextTick(()=>{
        this.$refs.wrapper.addEventListener('touchstart',event =>{
          event._target = event._target || '.container';
        })
      })
    },
		computed: mapState(['loadMore']),
	  	methods:{
	    	handleScroll(event){
	    		clearTimeout(this.timer);
	    		this.timer = setTimeout(()=>{
	    			if(this.loadMore.scrollStatu != 'unload') return;
	    			let height = event.target.scrollHeight;
	    			if(this.$route.name == 'list') util.setSessionStorage('listScroll',event.target.scrollTop);
          			let top = event.target.scrollTop + event.target.offsetHeight;
      				if( height - top < 50 && this.loadMore.scrollStatu == 'unload'){
      					this.$store.commit('changeLoadMore',{scrollStatu:'load'});
      				}
        		},50)
	    	}
	  }
	}
</script>

<style lang="scss" src="../styles/normalize.css"></style>
<style lang="scss" src='../styles/_base.scss'></style>
<style lang="scss" src='../styles/_dailog.scss'></style>
<style lang="css" src='../styles/select.scss'></style>
<style lang="css" src='swiper/dist/css/swiper.css'></style>


