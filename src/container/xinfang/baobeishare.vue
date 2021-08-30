<template>
  <div class="xingfang-baobei-share">
    <div class="success" v-if="$route.query.type == 'share'">
      <div class="title">报备成功</div>
      <div class="btn-share" @click="showShareCover=true">立即分享</div>
    </div>
    <div class="result" v-if="$route.query.type == 'result'">
      <div class="item">
        <span class="lable">渠道公司：</span>
        <span class="content">京西找房</span>
      </div>
      <div class="item">
        <span class="lable">项目名称：</span>
        <span class="content">{{$route.query.xmmc}}</span>
      </div>
      <div class="item">
        <span class="lable">客户姓名：</span>
        <span class="content">{{$route.query.khmc}}</span>
      </div>
      <div class="item">
        <span class="lable">联系电话：</span>
        <span class="content">{{$route.query.khdh}}</span>
      </div>
      <div class="item">
        <span class="lable">经纪人区域/门店：</span>
        <span class="content">{{$route.query.jjrqy}}</span>
      </div>
      <div class="item">
        <span class="lable">经纪人姓名：</span>
        <span class="content">{{$route.query.jjrxm}}</span>
      </div>
      <div class="item">
        <span class="lable">经纪人电话：</span>
        <span class="content">{{$route.query.jjrdh}}</span>
      </div>
      <div class="item">
        <span class="lable">预计到访时间：</span>
        <span class="content">{{$route.query.dfsj}}</span>
      </div>
    </div>

    <div class="share-cover" v-if="showShareCover" @click="showShareCover = false">
      <img src="../../images/share-it.png">
    </div>
  </div>
</template>
<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';

  export default {
    components:{},
    data(){
      return {
        showShareCover: false
      }
    },
    created(){
      this.$store.commit('changeTitle','报备成功');
      util.hideLoading();
      setTimeout(()=>{
        if(util.isWeixin){
          let shareOption = {
            title:'[报备成功]' + this.$route.query.xmmc,
            desc: this.$route.query.khmc + this.$route.query.dfsj,
            link: location.href.replace('type=share','type=result'),
            imgUrl: "http://phone.jcfyht.cc/logo.png", // 分享图标
          }
          wx.onMenuShareAppMessage(shareOption);
          wx.onMenuShareTimeline(shareOption);
        }
      },500);
      if(this.$route.query.type == 'result'){
        actions.bb_fx({
          bb_id: this.$route.query.bbid,
          fx_user: this.$route.query.fx_user,
          add_user: util.getLocalStorage('openid')
        })
      }
    },
    methods:{

    }

  }
</script>


<style lang="scss">
  .xingfang-baobei-share{
    .success{
      .title{
        padding-top: 1rem;
        font-size: .6rem;
        text-align: center;
        color: #24e24d;
      }
      .btn-share{
        display: flex;
        align-items: center;
        justify-content:center;
        height: 0.8rem;
        background-color: #007aff;
        border-color: #007aff;
        color:#fff;
        margin: 1rem 1rem 0;
        border-radius:0.05rem;
        font-size: 0.3rem;
      }
    }
    .result{
      padding: .3rem;
      background-color: #fff;
      .item{
        display:flex;
        align-items: center;
        height: .8rem;
        .lable{
          color: #666;
          min-width: 2rem;
        }

      }
    }
    .share-cover{
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      top:0;
      background-color:rgba(0,0,0,0.6);
      z-index:1000;
      >img{
        position:absolute;
        display:block;
        right:0.4rem;
        top:0.4rem;
        width: 2rem;
        height:auto;
      }
    }
  }
</style>
