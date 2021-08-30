<template>
  <div class="container-map">
    <div class="map" ref="map" v-if="detail"></div>
    <div class="map-guide" v-if="detail" @click="openTecentMap">导航</div>
  </div>
</template>

<script>
  import actions from '../common/actions.js'
  import gps from '../common/gps.js'
  export default {
    props: ['id','type'],
    data () {
      return {
        detail:null,
      }
    },
    created(){
      this.getDetail();
    },
    updated(){
      if(this.detail && this.$refs.map && !this.map){
        let point = new BMap.Point(this.detail.x_count || this.detail.x_weizhi , this.detail.y_count || this.detail.y_weizhi);
        let marker = new BMap.Marker(point);        // 创建标注
        this.map = new BMap.Map(this.$refs.map);
        this.map.centerAndZoom(point, 17);
        this.map.addOverlay(marker);
      }
    },
    methods:{
      getDetail(){
        actions.getHouseDetail(this.id,this.type).then(res=>{
          if(res.is_success == 0){
            this.detail = res.content[0];    
          }
        })
      },
      openTecentMap(){
        let coord = gps.bd09togcj02( this.detail.y_count || this.detail.y_weizhi,this.detail.x_count || this.detail.x_weizhi);
        coord = gps.gcj02towgs84(coord[0],coord[1]);
        wx.openLocation({
          latitude: coord[0], // 纬度，浮点数，范围为90 ~ -90
          longitude:  coord[1], // 经度，浮点数，范围为180 ~ -180。
          name: 'asdhkjasndkasj', // 位置名
          address: 'asndashdklajsndkl', // 地址详情说明
          scale: 17, // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
      }
    }
  }
</script>

<style lang="scss">
  .container-map{
    position: fixed;
    top:1rem;
    bottom:0;
    left:0;right:0;
    .map{
      height:100%;
    }
    .map-guide{
      position: fixed;
      width:1rem;height:1rem;
      border-radius:50%;
      right:1rem; bottom:1rem;
      background-color:#007aff;
      line-height:1rem;
      text-align:center;
      color:#fff;
    }
  }
</style>
