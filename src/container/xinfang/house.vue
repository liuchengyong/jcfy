<template>
  <div class="house-xinfang" @click="triggleEvent('detail')">
    <img class="house-preview" v-if="pic" :src="pic" />
    <img class="house-preview" v-else src="../../images/preview-defalt-new.png" />
    <img class="house-vr" v-if="house.vr_url" src="../../images/icon-vr.png" />
    <div class="house-video" v-if="house.vedio_url">视频讲盘</div>
    <div class="house-yongtu">{{house.yt}}</div>
    <div class="house-info">
      <div class="house-title">{{house.xmmc}}</div>
      <div class="house-other">{{house.shi}} {{house.pianqu}} 建面{{house.jzmj}}m&sup2</div>
      <div class="house-price">{{house.xmjj}}万元/m&sup2</div>
      <div class="house-tags" v-if="biaoqian.length > 0">
        <span class="tag" v-for="tag in biaoqian">{{tag}}</span>
      </div>
    </div>
    <div class="house-md" v-if="house.xmmd">项目卖点：{{house.xmmd}}</div>
  </div>
</template>

<script>
import util from '../../common/util.js'
export default {
  props:['house','type'],
  computed:{
    pic(){
      if(this.house.pic_path){
        return this.house.pic_path;
      }else if(this.house.pic_list && this.house.pic_list.length > 0){
        return this.house.pic_list[0].pic_path;
      }else{
        return false
      }
    },
    biaoqian(){
      return this.house.xmbq.split(',')
    }
  },
  methods:{
    triggleEvent(type){
      this.$emit('handleHosue',type,this.house);
    },
    isSystem(){
      return util.getLocalStorage('manager') == "true"
    }
  }
}
</script>

<style lang="scss">
  .house-xinfang{
      position:relative;
      min-height: 2.5rem;
      padding: .3rem;
      border-bottom: 1px solid #e5e5e5;
      &:first-child{
        border-top: none;
      }
      &:last-child{
        border-bottom: none;
      }
      .house-preview{
        position:absolute;
        top: .3rem;
        left: .3rem;
        display:block;
        width: 2.18rem;
        height: 1.64rem;
      }
      .house-vr{
        position:absolute;
        display:block;
        width: .5rem;
        height: auto;
        left: 1.88rem;
        top: .3rem;
      }
      .house-video{
        position:absolute;
        display:flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: .3rem;
        line-height: normal;
        left: .4rem;
        top: 1.54rem;
        font-size: .2rem;
        color: #333;
        background-color:#fff;
      }
      .house-yongtu{
        position:absolute;
        display:flex;
        align-items: center;
        justify-content: center;
        padding: .05rem .2rem;
        line-height: normal;
        right: .3rem;
        top: .3rem;
        font-size: .2rem;
        color: #333;
        border: 1px solid #efefef;
      }
      .house-info{
        padding: 0 0 0 2.48rem;
        font-size: 0.3rem;
        line-height: .42rem;
        color: #333;
        min-height: 1.64rem;
        .house-title{

        }
        .house-other{
          display:block;
          width:100%;
          font-size: .24rem;
          line-height: .3rem;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .house-price{
          font-size: .36rem;
          line-height: .5rem;
          color: #e9624b;
        }
        .tag{
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
      .house-md{
        padding-top: .2rem;
        font-size: 0.2rem;
        line-height: .3rem;
        color: #333;
      }


    }
</style>
