<template class="component">
  <div class="renwufwlistitem" @click="triggleEvent('detail')">
    <img class="item-preview" src="../../images/preview-defalt-new.png" v-if="!pic"/>
    <img class="item-preview" v-if="pic" :src="pic" />
    <img class="zd-house" v-if=" house.is_zd_fang && house.is_zd_fang == 'yes'" src="../../images/icon-zd-house.png" />
    <img class="house-vr-img" v-if="house.vr_addr && house.is_vr == '是'" src="../../images/icon-vr.png" />
    <div class="house-info">
      <div class="house-info-title">{{type == 1 ? house.loupan : house.title}} （{{house.bianhao}}）</div>
      <div class="other" v-if="type == 2 || type == 3">{{house.shi}}室{{house.ting}}厅/{{house.taoneimianji}}m&sup2/{{house.chaoxiang_id}}/{{house.xiaoqumingcheng_id}}</div>
      <div class="money" v-if="type == 2"><span class="amout">{{house.shoujia}}万</span>{{Math.floor(house.shoujia * 10000 / house.taoneimianji * 100) / 100}}元/平</div>
      <div class="money" v-if="type == 3"><span class="amout">{{house.shoujia}}元/月</span></div>
      <div class="location" v-if="type == 1">{{house.xiangxidizhi || '暂无'}}</div>
      <div class="house-info-tags" v-if="house.biaoqian && house.biaoqian.length > 0">
        <span class="tag" v-for="tag in house.biaoqian">{{tag.name}}</span>
      </div>
      <div class="house-price" v-if="type == 1"><span class="junjia">{{house.junjia}}万元/平</span> 建面 {{house.mianji || '暂无'}}m&sup2</div>
      <div class="house-gn-list">
        <div class="house-key" v-if="house.is_have_ys && house.is_have_ys == 'yes'">钥匙房</div>
        <img class="house-vr" v-if="house.vr_addr && house.is_vr == '是'" src="../../images/icon-vr.png" />
      </div>
      <div v-if="house.dkzt == '已打卡'" class="daka-status">已打卡 {{house.dksj}}</div>
      <div v-if="house.pkr" class="daka-status">陪看人：{{house.pkr}}</div>
      <div class="s-btn-group">
        <div class="s-btn" @click="triggleEvent('delete')">删除</div>
        <div class="s-btn" @click="triggleEvent('peikan')">陪看{{ house.pkr_list ? ('(' + house.pkr_list.length+')') : ''}}</div>
        <div class="s-btn" v-if="house.dkzt != '已打卡' && !stopDaka" @click="triggleEvent('daka')">打卡</div>
      </div>
    </div>
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
    stopDaka(){
      if(this.house.dk_time){
        let date = new Date(this.house.dk_time.replace(/-/g,'/')).getTime();
        let now = new Date().getTime();
        return  Math.floor(((date + 2 * 60 * 60 * 1000) - now) / 1000) <= 0
      }
      return false;
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
  .renwufwlistitem{
      position:relative;
      min-height: 2.5rem;
      padding:0.4rem 0.6rem 1rem 2.56rem;
      border-bottom: 1px solid #e5e5e5;
      &:first-child{
        border-top: none;
      }
      &:last-child{
        border-bottom: none;
      }
      .item-preview{
        position:absolute;
        display:block;
        width:2.18rem;
        height:1.64rem;
        left: 0;
      }
      .zd-house{
        position:absolute;
        display:block;
        width:1.3rem;
        height:auto;
        left: 0; top: .5rem;
      }
      .house-vr-img{
        position:absolute;
        display:block;
        width:.6rem;
        height:auto;
        left: 1.5rem; top: .3rem;
      }
      .house-info{
        font-size:0.26rem;
        color:#8b8b8b;
      }
      .house-info-title{
        display:block;
        font-size: 0.3rem;
        color:#333;
        line-height: 1.2em;
      }
      .other{
        display:block;
        width:100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .money,.other,.location,.price{
        padding-top:0.05rem;
      }
      .amout{
        font-size:0.3rem;
        color:#e9624b;
        font-weight: 600;
        padding-right: 0.2rem;
      }
      .tag{
        display:inline-block;
        padding: 0.1rem;
        font-size:0.22rem;
        border-radius: 0.05rem;
        background-color:#fbf1e4;
        color: #e8a852;
        margin-top:0.1rem;
        margin-right:0.1rem;
      }
      .location{
        color:#6b7072;
      }
      .status{
        line-height:.4rem;
        font-size:0.3rem;
      }
      .house-price{
        color:#9C9FA1;
      }
      .junjia{
        font-size:0.3rem;
        font-weight:500;
        color:#FA5741;
      }
      .house-gn-list{
        display:flex;
      }
      .house-key{
        display: block;
        line-height:.4rem;
        font-size:0.26rem;
        color:#e9624b;
        padding-right: .3rem;
        background-image: url(../../images/icon-key.png);
        background-repeat: no-repeat;
        background-position: center right;
        background-size: auto .26rem;
      }
      .house-vr{
        display: block;
        margin-left:.3rem;
        height: .4rem;
        width: auto;
      }
      .daka-status{
        padding-top:.1rem;
        font-size: 0.3rem;
        font-weight:500;
        color: #007aff;
      }
      .s-btn-group{
        position:absolute;
        display:flex;
        right: 0;
        bottom: .2rem;
      }
      .s-btn{
        margin-left: .2rem;
        padding: .1rem .3rem;
        font-size: .3rem;
        color: #fff;
        background-color: #00ae66;
      }
    }
</style>
