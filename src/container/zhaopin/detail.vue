<template>
  <div class="container-zhaopin-detail" v-if="detail">
    <div class="job-name">{{detail.title}} <div class="salary">{{detail.xinzi}}</div></div>
    <div class="tag-list">
      <span class="tag">{{detail.gzqy}}</span>
      <span class="tag">{{detail.gznx}}</span>
      <span class="tag">{{detail.xueli}}</span>
      <img class="share" src="../../images/share.png" @click="showShareCover = true"/>
    </div>
    <swiper class="swiper" :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(pic,index) in detail.pics" :key="index"><img :src="pic.pic_path" /></swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
    <div>
      <div class="title">职位详情</div>
      <div v-html="detail.content" class="job-detail"></div>
    </div>
    <div>
      <div class="title">工作地点</div>
      <div class="job-position">{{detail.gzdd}}</div>
      <div class="baidu-map" ref="map" @click="handleMap"></div>
    </div>
    <div class="btn-group">
      <div class="btn" v-if="isManager" @click="goShareList">分享列表</div>
      <div class="btn" @click="callPhone">立即沟通</div>
    </div>
    <div class="share-cover" v-if="showShareCover" @click="showShareCover = false">
        <img src="../../images/share-it.png">
      </div>
  </div>
</template>


<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  import gps from '../../common/gps.js';

  export default {
    data () {
      return {
        detail: null,
        swiperOption: {
          autoplay: 5000,
          direction: "horizontal",
          pagination: ".swiper-pagination",
        },
        showShareCover: false,
        isManager: util.getLocalStorage('manager') == "true",
      }
    },
    created(){
      this.$store.commit('changeTitle','招贤纳士');
      util.hideLoading();
      this.getDetail();
      this.exportShare();
    },
    updated(){
      if(this.detail && this.$refs.map && !this.map){
        let dom = this.$refs.map;
        let point = new BMap.Point(this.detail.x_count, this.detail.y_count);
        let marker = new BMap.Marker(point);        // 创建标注
        this.map = new BMap.Map(dom);
        this.map.centerAndZoom(point, 17);
        this.map.addOverlay(marker);
        this.map.disableDragging();
        this.map.disableDoubleClickZoom();
      }
    },
    methods:{
      exportShare(){
        let obj = util.urlGet();
        if(obj.phone && obj.userid){
          actions.insertfenxiang({
            userid: obj.userid,
            zhaopin_id: this.$route.query.id,
            pic_path: util.getLocalStorage('touxiang'),
            openid: util.getLocalStorage('openid'),
            name: util.getLocalStorage('xingming')
          })
        }
      },
      nextPage(){
        this.page += 1;
        this.getList();
      },
      getDetail(){
        actions.zhaopin_info({
          id: this.$route.query.id
        }).then(res=>{
          if(res.is_success == 0 && res.content.length > 0){
            this.detail = res.content[0]
            if(util.isWeixin){
              let shareOption = {
                title:'[招贤纳士]' + this.detail.title,
                desc: this.detail.xinzi + this.detail.md_name,
                link: location.href,
                imgUrl: "http://phone.jcfyht.cc/logo.png", // 分享图标
              }
              if(this.isManager){
                shareOption.link = location.origin + "/?" + util.stringify({
                  sharePath: location.hash,
                  userid: util.getLocalStorage('userid'),
                  phone: util.getLocalStorage('phone'),
                })
              }
              wx.onMenuShareAppMessage(shareOption);
              wx.onMenuShareTimeline(shareOption);
            }
          }
        })
      },
      handleMap(){
        if(util.isWeixin){
          let coord = gps.bd09togcj02(this.detail.y_count,this.detail.x_count);
          wx.openLocation({
            latitude: coord[0], // 纬度，浮点数，范围为90 ~ -90
            longitude:  coord[1], // 经度，浮点数，范围为180 ~ -180。
            name: this.detail.md_name, // 位置名
            address: this.detail.gzdd, // 地址详情说明
            scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
          });
        }
      },
      callPhone(){
        let obj = util.urlGet();
        if(obj.phone && obj.userid){
          location.href = 'tel:' + obj.phone;
        }else{
          location.href = 'tel:' + this.detail.lxdh;
        }
      },
      goShareList(){
        this.$router.push({name: 'zhaopindetailshare',query:{ id: this.$route.query.id}})
      }

    }
}
</script>

<style lang="scss">
  .container-zhaopin-detail{
    background-color:#fff;
    padding-bottom: .5rem;
    .job-name{
      position:relative;
      font-size: .5rem;
      line-height: .9rem;
      font-weight: bold;
      padding: .3rem .3rem 0;
      .salary{
        position: absolute;
        right: .3rem; top: .3rem;
        color: #ff725c;
      }
    }
    .tag-list{
      position:relative;
      display: flex;
      padding: .2rem .3rem 0;
      font-size: .3rem;
      line-height: .4rem;
      color: #666;
      .tag{
        padding: 0 0.1rem 0 .4rem;
        background-size: .3rem auto;
        background-repeat: no-repeat;
        background-position: left center;
        &:nth-child(1){
          background-image: url(../../images/loc.png);
        }
        &:nth-child(2){
          background-image: url(../../images/work-time.png);
        }
        &:nth-child(3){
          background-image: url(../../images/school-level.png);
        }
      }
      .share{
        position: absolute;
        display: block;
        right: .3rem; top: .1rem;
        width: auto;
        height: .5rem;
      }
    }
    .swiper{
      position:relative;
      margin-top: .3rem;
      height:4.5rem;
      width:100%;
      img{
        display:block;
        width:100%;
        height:100%;
      }
    }

    .title{
      padding: .4rem .3rem 0;
      font-size: .38rem;
      line-height: .45rem;
      font-weight: bold;
    }
    .job-detail{
      padding: .3rem;
      font-size:.3rem;
      color: #666;
      line-height: .42rem;
      p{
        margin: .3rem 0 0;
      }
      img{
        display: block;
        width: 100%;
        height: auto;
      }
    }
    .job-position{
      padding: .2rem .3rem 0;
      font-size: .3rem;
      color: #666;
    }
    .baidu-map{
      position:relative;
      height:4rem;
      width:100%;
      margin-top:0.3rem;
    }
    .btn-group{
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: .3rem;
      .btn{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content:center;
        height: 0.8rem;
        background-color: #4caf50;
        color:#fff;
        margin: 0 .1rem;
        border-radius: 0.1rem;
        font-size:0.3rem;
        color: #fff;
        &:first-child{
          background-color: #e91e63;
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
