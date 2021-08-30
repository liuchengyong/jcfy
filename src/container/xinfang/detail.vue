<template>
  <div class="xinfang-detail" v-if="detail">
    <div class="swiper-outer">
      <swiper class="swiper" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
        <swiper-slide v-for="pic in detail.fy_list" :key='pic.pic_path'>
          <img class="swiper-image" :src="pic.pic_path"  @click="showImagePreview(pic.pic_path,'pic')">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <img class="vr" v-if="detail.vr_url" src="../../images/icon-vr.png" @click="gotoVr(detail.vr_url)"/>
      <img class="video" v-if="detail.vedio_url" src="../../images/icon-video.png" @click="gotoVideo(detail.vedio_url)"/>
      <img class="images" src="../../images/icon-imgs.png" @click="gotoImages(detail.vr_addr)"/>
    </div>
    <div class="title">{{detail.xmmc}}</div>
    <div class="md">项目卖点：{{detail.xmmd}}</div>
    <div class="tags">
      <span class="tag red" v-if="detail.vedio_url">视频讲盘</span>
      <span class="tag blue" v-if="detail.vr_url">VR看房</span>
      <span class="tag" v-for="tag in detail.xmbq.split(',')" :key="tag">{{tag}}</span>
    </div>
    <div class="info">
      <span class="short"><span class="label">均价：</span>{{detail.xmjj}}万元/m&sup2</span>
      <span class="short"><span class="label">总价：</span>{{detail.xmzj}}万元/套</span>
      <span class="short"><span class="label">用途：</span>{{detail.yt}}</span>
      <span class="short"><span class="label">开盘：</span>{{detail.kpsj}}</span>
      <span class="short"><span class="label">户型：</span>{{detail.hx}}</span>
      <span class="short"><span class="label">建面：</span>{{detail.jzmj}}m&sup2</span>
      <span class="short"><span class="label">物业：</span>{{detail.wy}}</span>
      <span class="short"><span class="label">装修：</span>{{detail.zx}}</span>
      <span class="short"><span class="label">建筑：</span>{{detail.jzlx}}</span>
      <span class="short"><span class="label">产权：</span>{{detail.cq}}</span>
    </div>
    <div class="xmms">
      <div class="label">项目描述：</div>
      <div class="content">{{detail.xmms}}</div>
    </div>
    <div class="kfs-name" v-if="isManager"><span class="label">开发商：</span>{{detail.kfs}}</div>
    <div class="lp-address" v-if="isManager">
      <span class="label">楼盘地址：</span>
      <span class="content">{{detail.lpdz}}</span>
      <span class="guide" @click="openGuide">带我去</span></div>
    <div class="map" ref="map" v-if="isManager"></div>
    <div class="info" v-if="xiaoshou">
      <div class="info-lable">销售信息</div>
      <span class="long"><span class="label">销售状态：</span>{{xiaoshou.xszt}}</span>
      <span class="long" v-if="isManager"><span class="label">售楼地址：</span>{{xiaoshou.sldz}}</span>
      <span class="long">
        <span class="label">在售楼栋：</span>
        <select v-model="selectLoudong" placeholder="请选择楼栋">
          <option v-for="loudong in detail.loudong_list" :value="loudong.ldmc">{{loudong.ldmc}}</option>
        </select>
      </span>
    </div>
    <div class="loudong" v-for="loudong in detail.loudong_list" v-if="loudong.ldmc == selectLoudong">
      <div class="loudong-title">{{loudong.ldmc}}</div>
      <div class="info">
         <span class="short"><span class="label">开盘：</span>{{loudong.kpsj}}</span>
         <span class="short"><span class="label">交房：</span>{{loudong.jfsj}}</span>
         <span class="short"><span class="label">装修：</span>{{loudong.zx}}</span>
         <span class="short"><span class="label">单元：</span>{{loudong.dy}}单元</span>
         <span class="short"><span class="label">层数：</span>{{loudong.cs}}层</span>
         <span class="short"><span class="label">户数：</span>{{loudong.hs}}户</span>
      </div>
      <div class="hx-title">【{{loudong.ldmc}}】户型</div>
      <div class="hx-item" v-for="hx in loudong.hx_list" >
        <img class="hx-preview" v-if="hx.hxt_pic && hx.hxt_pic.length > 0" :src=" 'http://wx.beijinghome.cc/Contract/swfupload/view/pic.jsp?id=' + hx.hxt_pic[0].pic_path" />
        <img class="hx-preview" v-else src="../../images/preview-defalt-new.png" />
        <div class="hx-info">
          <div class="hx-hx">{{hx.hx}}</div>
          <div class="hx-other">建面：{{hx.jzmj}}m&sup2  朝向：{{hx.cx}}</div>
          <div class="hx-tags"><span v-for="tag in hx.xmbq.split(',')" :key="tag">{{tag}}</span></div>
        </div>
        <div class="hxms">户型描述：{{hx.hxms}}</div>
      </div>
    </div>

    <div class="info" v-if="xiaoqu">
      <div class="info-lable">小区概况</div>
      <span class="short"><span class="label">占地面积：</span>{{xiaoqu.zdmj}}m&sup2</span>
      <span class="short"><span class="label">建筑面积：</span>{{xiaoqu.jzmj}}m&sup2</span>
      <span class="short"><span class="label">容积率：</span>{{xiaoqu.rjl}}</span>
      <span class="short"><span class="label">绿化率：</span>{{xiaoqu.lhl}}</span>
      <span class="long"><span class="label">规划车位：</span>地下{{xiaoqu.dxcw}}个，地上{{xiaoqu.dscw}}个</span>
      <span class="long"><span class="label">车位配比：</span>{{xiaoqu.cwpb}}</span>
      <span class="short"><span class="label">规划楼栋：</span>{{xiaoqu.ghld}}栋</span>
      <span class="short"><span class="label">规划户数：</span>{{xiaoqu.ghhs}}户</span>
      <span class="short"><span class="label">物业费用：</span>{{xiaoqu.wyf}}元/m&sup2/月</span>
      <span class="short"><span class="label">供暖方式：</span>{{xiaoqu.gnfs}}</span>
      <span class="short"><span class="label">供水：</span>{{xiaoqu.gs}}</span>
      <span class="short"><span class="label">供电：</span>{{xiaoqu.gd}}</span>
    </div>
    <div class="info" v-if="detail.xukezheng_list">
      <div class="info-lable">预售许可证</div>
      <template v-for="xukezheng in detail.xukezheng_list">
        <span class="long"><span class="label">预售证：</span>{{xukezheng.ysz}}</span>
        <span class="long"><span class="label">发证时间：</span>{{xukezheng.fzsj}}</span>
        <span class="long"><span class="label">绑定楼栋：</span>{{xukezheng.bdld}}</span>
      </template>
    </div>
    <div class="btn-group" v-if="isManager">
      <div class="btn-item" @click="goToShare">分享记录</div>
      <div class="btn-item" @click="goToBaoBei">联系报备</div>
    </div>
    <div class="btn-share" @click="showShareCover = true">分享房源</div>

    <div class="share-cover" v-if="showShareCover" @click="showShareCover = false">
      <img src="../../images/share-it.png">
    </div>
    <div class="no-publish" v-if="detail.status == '00' && !isManager">
      亲！房源已失效～～～
    </div>
  </div>
</template>


<script>
  import Vue from 'vue'
  import actions from '../../common/actions.js'
  import util from '../../common/util.js'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import houseItem from '../../component/houseItem.vue'
  import wx from 'weixin-jsapi'
  import gps from '../../common/gps.js';
  export default {
    components: { swiper, swiperSlide, houseItem},
    data () {
      let contact = util.urlGet().contact;
      return {
        notNextTick: true,
        swiperOption: {
          autoplay: 0,
          direction: "horizontal",
          pagination: ".swiper-pagination",
        },
        showShareCover: false,
        isManager: util.getLocalStorage('manager') == "true",
        detail: null,
        selectLoudong: null
      }
    },
    created(){
      this.$store.commit('changeTitle','新房');
      this.getDetail();
    },
    computed: {
      xiaoqu(){
        if(this.detail && this.detail.xiaoqu_list && this.detail.xiaoqu_list.length > 0){
          return this.detail.xiaoqu_list[0]
        }else{
          return null
        }
      },
      xiaoshou(){
        if(this.detail && this.detail.xiaoshou_list && this.detail.xiaoshou_list.length > 0){
          return this.detail.xiaoshou_list[0]
        }else{
          return null
        }
      }
    },
    mounted(){

    },
    watch: {

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
      goToBaoBei(){
        this.$router.push({name:'xingfangbaobei',query:{id:this.$route.query.id}})
      },
      goToShare(){
        this.$router.push({name:'myshare',query:{id:this.$route.query.id}})
      },
      openGuide(){
          if(util.isWeixin){
            let coord = gps.bd09togcj02( this.detail.y_count,this.detail.x_count);
            wx.openLocation({
              latitude: coord[0], // 纬度，浮点数，范围为90 ~ -90
              longitude:  coord[1], // 经度，浮点数，范围为180 ~ -180。
              name: this.detail.xmmc, // 位置名
              address: this.detail.lpdz, // 地址详情说明
              scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
              infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            });
          }
      },
      gotoVr(url){
        this.$router.push({name:'vr',query:{url}})
      },
      gotoVideo(url){
        this.$router.push({name:'video',query:{url}})
      },
      gotoImages(){
        this.$router.push({name:'xingfangpic',query:this.$route.query})
      },
      handleMap(){
        if(util.isWeixin){
          let coord = gps.bd09togcj02( this.detail.y_count || this.detail.y_weizhi,this.detail.x_count || this.detail.x_weizhi);
          wx.openLocation({
            latitude: coord[0], // 纬度，浮点数，范围为90 ~ -90
            longitude:  coord[1], // 经度，浮点数，范围为180 ~ -180。
            name: this.detail.title, // 位置名
            address: this.detail.address, // 地址详情说明
            scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
          });
        }
      },
      initSwpierImg(list){
        let result = []
        list.forEach(item=>{
          result.push({
            pic_path: 'http://wx.beijinghome.cc/Contract/swfupload/view/pic.jsp?id=' + item.pic_path
          })
        })
        return result
      },
      getDetail(){
        actions.fangwu_info({
          fangwu_id: this.$route.query.id
        }).then(res=>{
          if(res.is_success == 0){

            this.detail = res.content[0];
            this.detail.fy_list = this.initSwpierImg(this.detail.fy_list);
            this.$store.commit('changeTitle',this.detail.xmmc);
            if(this.detail.loudong_list && this.detail.loudong_list.length > 0){
              this.selectLoudong =  this.detail.loudong_list[0].ldmc
            }

            if(util.isWeixin){
              let name = '新房';
              let prefix = util.getLocalStorage('manager') == 'true' ? util.getLocalStorage('phone') : '';
              let userId = util.getLocalStorage('manager') == 'true' ? util.getLocalStorage('userid') : '';
              let shareOption = {
                title:'[' + name + ']' + this.detail.xmmc + '(京西找房)' + prefix,
                desc: this.detail.xmms + prefix,
                link: location.origin + "/?" + util.stringify({
                  sharePath: location.hash,
                  contact: prefix,
                  shareId: userId,
                  fwId: this.$route.query.id
                }),
                imgUrl: "http://phone.jcfyht.cc/logo.png", // 分享图标
              }
              wx.onMenuShareAppMessage(shareOption);
              wx.onMenuShareTimeline(shareOption);
            }

          }
        })
      },
      showImagePreview(current,type){
        if(util.isWeixin){
          let list = [];
          this.detail.fy_list.forEach(item => {
            list.push(item.pic_path)
          })
          wx.previewImage({
            current,
            urls: list
          })
        }
      },
    }
  }
</script>

<style lang="scss">
  .no-publish{
    padding:1rem 0 0;
    text-align:center;
    line-height:.4rem;
    font-size:14px;
    color:#999;
  }
  .xinfang-detail{
    padding-bottom:.5rem;
    background-color: #fff;
    .swiper-outer{
      position:relative;
      height: 4rem;
      width: 100%;
      .swiper{
        height: 100%;
        width: 100%;
        .swiper-slide{
          position:relative;
          overflow: hidden;
        }
        .swiper-image{
          position: absolute;
          display: block;
          width: 100%;
          height: auto;
          min-height: 100%;
          top:0; left:50%;
          transform: translateX(-50%);
        }
      }
      .vr{
        position: absolute;
        display:block;
        width: 1rem;
        height:auto;
        z-index: 10;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
      }
      .video{
        position: absolute;
        display:block;
        width: .6rem;
        height:auto;
        z-index: 10;
        left:0.3rem;
        bottom:.3rem;
      }
      .images{
        position: absolute;
        display:block;
        width: .6rem;
        height:auto;
        z-index: 10;
        right: 0.3rem;
        bottom:.3rem;
      }
    }
    .title{
      padding: .3rem .3rem .1rem;
      font-size: .36rem;
      line-height: .5rem;
      font-weight: bold;
      color: #333;
    }
    .md{
      padding: 0 .3rem;
      font-size: .2rem;
      line-height: .3rem;
      color: #999;
    }
    .tags{
      padding: 0 .3rem;
      .tag{
        display:inline-block;
        margin:0.1rem 0.1rem 0 0;
        padding: 0.05rem 0.1rem;
        font-size: 0.1rem;
        color: #333;
        line-height: normal;
        border-radius: 0.05rem;
        border: 1px solid #e1e1e1;
        &.red{
          color: #fa5741;
        }
        &.blue{
          color: #41fa4a;
        }
      }
    }
    .info{
      padding: 0.3rem 0.3rem 0;
      color: #333;
      font-size: 0.3rem;
      line-height: .42rem;
      .info-lable{
        font-size: .36rem;
        line-height: .5rem;
        color: #333;
        font-weight: bold;
        padding-bottom: .2rem;
      }
      .short{
        display: inline-block;
        margin-bottom: 0.1rem;
        width: 3.4rem;
      }
      .long{
        display: inline-block;
        margin-bottom: 0.1rem;
        width:100%;
      }
      .label{
        display:inline-block;
        color:#999;
        font-size: 0.26rem;
        font-weight: 400;
      }
    }
    .xmms{
      padding: .2rem .3rem 0;
      .label{
        display: block;
        font-size: 0.3rem;
        line-height: .42rem;
        color: #333;
      }
      .content{
        font-size: .26rem;
        line-height: .4rem;
        color: #666;
        margin: .2rem 0 0;
        padding: .2rem;
        border: 1px solid #efefef;
      }
    }
    .kfs-name{
      padding: .3rem .3rem 0;
      font-size: .3rem;
      line-height: .42rem;
      color: #666;
      .label{
        color: #333;
      }
    }
    .lp-address{
      position:relative;
      display:flex;
      align-items: center;
      padding: 0 .3rem;
      font-size: .3rem;
      line-height: .42rem;
      color: #666;
      .label{
        color: #333;
      }
      .content{
        flex:1;
      }
      .guide{
        padding-left: .3rem;
        color: #007aff;
        text-decoration:underline;
      }
    }
    .map{
      position: relative;
      height: 4rem;
      width: 100%;
      margin-top: 0.3rem;
    }
    .loudong{
      padding: .3rem;
      .loudong-title{
        font-size: .3rem;
        color: #333;
        line-height: .42rem;
        border-bottom: 1px solid #efefef;
      }
      .info{
        padding: .1rem 0;
      }
      .hx-title{
        font-size: .3rem;
        color: #333;
        line-height: .42rem;
      }
      .hx-item{
        position:relative;
        padding: .3rem 0 0;
        min-height: 2.24rem;
        border-bottom: 1px solid #efefef;
        .hx-preview{
          position:absolute;
          top: .3rem;
          display:block;
          width: 2.18rem;
          height: 1.64rem;
        }
        .hx-info{
          padding: 0 0 0 2.48rem;
          min-height: 1.64rem;
          .hx-hx{
            font-size: .3rem;
            line-height: .42rem;
            color: #333;
          }
          .hx-other{
            font-size: .2rem;
            line-height: .4rem;
            color: #999;
          }
          .hx-tags{
            span{
              display:inline-block;
              margin:0.1rem 0.1rem 0 0;
              padding: 0.05rem 0.1rem;
              font-size: 0.1rem;
              color: #e8a852;
              line-height: normal;
              border-radius: 0.05rem;
              background-color: #fbf1e4;
            }
          }
        }
        .hxms{
          padding: .2rem 0 ;
          font-size: .2rem;
          line-height: .3rem;
          color: #999;
        }



      }

    }
    .btn-group{
      padding: .3rem 0 0 .3rem;
      display: flex;
      .btn-item{
        display: flex;
        flex: 1;
        height: 0.7rem;
        line-height: normal;
        align-items: center;
        justify-content: center;
        font-size: 0.3rem;
        color: #fff;
        margin-right: .3rem;
        background-color: #00ae66;
      }
    }
    .btn-share{
      display: flex;
      align-items: center;
      justify-content:center;
      height: 0.8rem;
      background-color: #FF725C;
      border-color: #FF725C;
      color:#fff;
      margin: .3rem .3rem 0;
      border-radius:0.05rem;
      font-size: 0.3rem;
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
