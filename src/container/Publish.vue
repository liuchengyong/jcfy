<template>
  <div class="container-publish">
    <div class="publish-from">
      <div class="publish-row">
        <span class="lable">类型</span>
        <div class="radio-group">
          <span :class="['radio',{'checked':type == 2}]" @click="type == 2 ? '': (type = 2)">二手房</span>
          <span :class="['radio',{'checked':type == 3}]" @click="type == 3 ? '': (type = 3)">租房</span>
        </div>
      </div>
      <div class="publish-row">
        <span class="lable">小区名称</span>
        <input class="value" type="text" v-model="xq_name">
      </div>
      <div class="publish-row">
        <span class="lable">楼栋号</span>
        <input class="value" type="text" v-model="loudong">
      </div>
      <div class="publish-row">
        <span class="lable">单元号</span>
        <input class="value" type="text" v-model="danyuan">
      </div>
      <div class="publish-row">
        <span class="lable">门牌号</span>
        <input class="value" type="text" v-model="menpaihao">
      </div>
    </div>
    <div class="btn-submit" @click="submit">提交</div>
  </div>
</template>


<script>
  import util from '../common/util.js';
  import actions from '../common/actions.js';
  export default {
    data(){
      return {
        type:2,
        xq_name:'',
        loudong:'',
        danyuan:'',
        menpaihao:'',
      }
    },
    created(){
      util.hideLoading();
    },
    methods:{
      submit(){
        if(this.xq_name == ""){
          return util.showToast('小区名称不能为空');
        }
        if(this.loudong == ""){
          return util.showToast('楼栋号不能为空');
        }
        if(this.danyuan == ""){
          return util.showToast('单元号称不能为空');
        }
        if(this.menpaihao == ""){
          return util.showToast('门牌号不能为空');
        }
         actions.publish(this.xq_name,this.loudong,this.danyuan ,this.menpaihao,this.type).then(res=>{
            if(res.is_success == 0){
              util.showToast('提交成功');
            }
         });
      }
    }
}
</script>

<style lang="scss">
  .container-publish{
    padding:0.3rem 0;
    .publish-from{
      padding:0 0.2rem;
      background-color: #fff;
    }
    .publish-row{
      position: relative;
      display:flex;
      align-items:center;
      height: 1rem;
      border-bottom:1px solid #eee;
      &:last-child{
        border-bottom:none;
      }
      .lable{
        display:block;
        width: 1.8rem;
        font-size: 0.3rem;
        color:#666;
      }
      .value{
        display:block;
        flex:1;
        font-size:0.32rem;
        color:#333;
        text-align:right;
      }
      .radio-group{
        display:flex;
        flex:1;
        height:100%;
        align-items:center;
        justify-content:flex-end;
        font-size:0.32rem;
        color:#333;
      }
      .radio{
        position:relative;
        display:block;
        padding-left: 0.4rem;
        font-size:0.3rem;
        line-height:0.3rem;
        color:#333;
        margin: 0 0.2rem;
        &:before{
          position:absolute;
          content:"";
          background-image: url(../images/icon-unselected.png);
          width:0.3rem; height:0.3rem;
          left:0;
          background-size: 0.3rem 0.3rem;
          background-repeat: no-repeat;
          background-position: center;
        }
        &.checked{
          &:before{
            background-image: url(../images/icon-selected.png);
          }
        }
      }

    }
    .btn-submit{
      position:relative;
      width:7.1rem;
      margin:0.3rem auto;
      line-height: 0.9rem;
      text-align: center;
      background-color:#39ac6a;
      color:#fff;
      font-size:0.32rem;
    }
  }
</style>
