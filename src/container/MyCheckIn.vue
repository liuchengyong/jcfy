<template>
  <div class="my-check-in">
    <div v-for="(item,index) in list" :key="index" class="check-in">
      <div><span class="lable">房源编号：</span>{{item.bianhao}}</div>
      <div><span class="lable">房源标题：</span>{{item.title}}</div>
      <div><span class="lable">小区名称：</span>{{item.xiaoqumingcheng_id}}</div>
      <div><span class="lable">用户：</span><a :href="'tel:'+item.kyphone">{{item.kyphone}}</a></div>
      <div><span class="lable">打卡时间：</span>{{item.dk_time}}</div>
    </div>
    <div v-if="!list" class="my-check-in-null">数据加载中...</div>
    <div v-if="list && list.length == 0" class="my-check-in-null">暂无打卡记录</div>
  </div>
</template>

<script>
    import actions from '../common/actions.js'
    import util from '../common/util.js'
    export default {
      data () {
        return {
          list:null,
        }
      },
      created(){
        this.$store.commit('changeTitle','我的打卡');
        actions.getJingJiRenCheckIn(this.type).then(res=>{
          if(res.is_success == 0){
            this.list = res.content;
          }
        })
      },
      computed: {
        type(){
          return this.$route.params.type
        }
      },
      methods:{

      }
    }
</script>

<style lang="scss">
  .my-check-in{
    padding:.3rem;
    .check-in{
      font-size:.3rem;
      color:#666;
      line-height: .6rem;
      padding:.3rem;
      background-color:#fff;
      margin-bottom:.3rem;
      box-shadow:0 0 10px #ddd;
      .lable{
        color:#333;
      }
    }
    .my-check-in-null{
      text-align:center;
      font-size:.3rem;
      color:#999;
      line-height:.6rem;
    }
  }
</style>
