<template>
  <div class="home">
   	<div class="header">
      <swiper class="home-swiper" :options="swiperOption" ref="mySwiper">
        <swiper-slide><img src="../images/home-bg-header.jpg" /></swiper-slide>
        <swiper-slide><img src="../images/home-bg-header-1.png" /></swiper-slide>
        <swiper-slide><img src="../images/home-bg-header-2.png" /></swiper-slide>
        <swiper-slide><img src="../images/home-bg-header-3.png" /></swiper-slide>
        <swiper-slide><img src="../images/home-bg-header-4.png" /></swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
   		<div class="search" v-if="false">
   			<svgicon name="search" width=".3rem" height=".3rem" ></svgicon>
   			<input class="search-input" type="text" placeholder="输入小区或商圈开始找房咯~">
   		</div>
   	</div>
   	<div class="nav">
   		<router-link class="catagery" to='/list/2'>
   			<svgicon name="secondhandhouse" width="1rem" height="1rem" ></svgicon>
   			<span class="catagery-title">二手房</span>
   		</router-link>
   		<router-link class="catagery" to='/xingfang/list'>
   			<svgicon name="newhouse" width="1rem" height="1rem" ></svgicon>
   			<span class="catagery-title">新房</span>
   		</router-link>
   		<router-link class="catagery" to='/list/3'>
   			<svgicon name="renthouse" width="1rem" height="1rem" ></svgicon>
   			<span class="catagery-title">租房</span>
   		</router-link>
   	</div>
    <div class="house-tianjian">
      <house-item v-for="(house,index) in list" :key="index" :house="house" type="2" @handleHosue="handleHosue"></house-item>
    </div>

  </div>
</template>
<script>
  import util from '../common/util.js'
  import houseItem from '../component/houseItem.vue'
  import actions from '../common/actions.js'
  export default {
    components:{houseItem},
    data(){
      return {
        list:[],
        swiperOption: {
          autoplay: 5000,
          direction: "horizontal",
          pagination: ".swiper-pagination",
        },
      }
    },
    created(){
      this.$store.commit('changeTitle','首页');
      util.hideLoading();
      this.getHouseList();
    },
    methods:{
      getHouseList(page){
        let data = {
          page_size:5,
          page_number:1,
          type: 2,
          is_zd_fang:'yes'
        };
        actions.getHouseList(data).then(res=>{
          if(res.is_success == 0){
            this.list = res.content;
          }
        });
      },
      handleHosue(type,house){
        if(type == 'detail'){
          this.$router.push({name:'detail',params:{id:house.id,type:2}})
        }
      },
    }

  }
</script>


<style lang="scss">
	.home{
		position:relative;
		display:flex;
		flex-direction:column;
		.header{
			width: 100%;
			height: 4.5rem;
      .home-swiper{
        position:relative;
        height:4.5rem;
        width:100%;
        img{
          display:block;
          width:100%;
          height:100%;
        }
      }
			.search{
				position:relative;
				display:flex;
				background-color:#fff;
				border-radius: 0.05rem;
				height: 0.72rem;
				padding:0.2rem;
			}
			.search-input{
				flex:1;
				padding-left: 0.2rem;
				font-size:0.28rem;
				color:#666;
			}
		}
		.nav{
			background-color: #fff;
			padding: 0 .25rem .4rem;
			width:100%;
			border-bottom:1px solid #eee;
			.catagery{
				position:relative;
				display:block;
				float: left;
				width: 33%;
				text-align: center;
				margin-top: 0.4rem;
			}
			.catagery-title{
				display:block;
				color: #333;
				font-size: 0.26rem;
				line-height: 0.4rem;
			}
		}
    .house-tianjian{
      margin-top:0.3rem;
      padding-left:0.4rem;
      background-color:#fff;
    }
	}
</style>
