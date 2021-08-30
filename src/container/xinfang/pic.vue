<template>
  <div class="pic-container" v-if="detail">
    <div class="tabs">
      <span :class="['tab',{current: tab.id == currentTab.id }]" @click="currentTab = tab" v-for="tab in tabs">{{tab.text}}({{tab.count}})</span>
    </div>

    <div class="tab-container" v-if="currentTab.id == 1">
      <div class="pic-title">效果图</div>
      <div class="img-list">
        <img v-for="pic in detail.fy_list" :src="pic.pic_path" :key="pic.pic_path">
      </div>
      <template v-for="huxing in detail.huxing_list">
        <div class="pic-title">{{huxing.hx}} {{huxing.jzmj}}m&sup2 {{huxing.cx}} {{huxing.status}}</div>
        <div class="img-list">
          <img v-for="pic in huxing.hxt_pic" :src="pic.pic_path" :key="pic.pic_path">
        </div>
      </template>
    </div>
    <div class="tab-container" v-if="currentTab.id == 2">
      <div class="pic-title">{{currentTab.text}}</div>
      <div class="img-list">
        <img v-for="pic in detail.hxt_list" :src="pic.pic_path" :key="pic.pic_path">
      </div>
    </div>
    <div class="tab-container" v-if="currentTab.id == 3">
      <div class="pic-title">{{currentTab.text}}</div>
      <div class="img-list">
        <img v-for="pic in detail.quwei_list" :src="pic.pic_path" :key="pic.pic_path">
      </div>
    </div>
    <div class="tab-container" v-if="currentTab.id == 4">
      <div class="pic-title">{{currentTab.text}}</div>
      <div class="img-list">
        <img v-for="pic in detail.shapan_list" :src="pic.pic_path" :key="pic.pic_path">
      </div>
    </div>
  </div>
</template>
<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  let tabs = [
    { id: 1, text: '效果图', count: 0 },
    { id: 2, text: '户型', count: 0 },
    { id: 3, text: '区位', count: 0 },
    { id: 4, text: '沙盘', count: 0 },
  ]
  export default {
    components:{},
    data(){
      return {
        detail: null,
        tabs: tabs,
        currentTab: tabs[0]
      }
    },
    created(){
      this.$store.commit('changeTitle','楼盘相册');
      util.hideLoading();
      this.getDetail();
    },
    methods:{
      initImg(list){
        let result = []
        list.forEach(item=>{
          result.push({
            pic_path: 'http://wx.beijinghome.cc/Contract/swfupload/view/pic.jsp?id=' + item.pic_path
          })
        })
        return result
      },
      getDetail(){
        actions.fangwu_pic({
          fangwu_id: this.$route.query.id
        }).then(res=>{
          if(res.is_success == 0){
            this.detail = res.content[0]
            this.detail.fy_list = this.initImg(this.detail.fy_list)
            let count = 0;
            this.detail.huxing_list.forEach(item=>{
              count += item.hxt_pic.length;
              item.hxt_pic = this.initImg(item.hxt_pic);
            })
            this.detail.hxt_list = this.initImg(this.detail.hxt_list)
            this.detail.quwei_list = this.initImg(this.detail.quwei_list)
            this.detail.shapan_list = this.initImg(this.detail.shapan_list)
            this.tabs[0].count = this.detail.fy_list.length + count;
            this.tabs[1].count = this.detail.hxt_list.length;
            this.tabs[2].count = this.detail.quwei_list.length;
            this.tabs[3].count = this.detail.shapan_list.length;
            this.tabs = this.tabs;
          }

        })
      }
    }

  }
</script>


<style lang="scss">
  .pic-container{
    background-color:#fff;
    min-height: calc(100% - 1rem);
    .tabs{
      display: flex;
      border-bottom: 1px solid #efefef;
      .tab{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 1rem;
        text-align: center;
        &.current{
          &:before{
            position:absolute;
            content: '';
            left: 50%; bottom: 0;
            width: 20%; height: .05rem;
            background-color: #00ae66;
            border-radius: .1rem;
            transform: translate(-50%,0);
          }
        }
      }
    }
    .tab-container{
      position:relative;
      width: 100%;
      padding: .1rem .3rem;
      overflow: hidden;
      .pic-title{
        padding: .2rem 0;
        font-size: .2rem;
        line-height: .3rem;
        color: #999;
      }
      .img-list{
        > img {
          display: inline-block;
          width: calc(24% - .2rem);
          height: auto;
          margin: 0 .2rem .2rem 0;
        }
      }
    }
  }
</style>
