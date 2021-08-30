<template>
  <div class="container-yaoshi-guihuan" v-if="$store.state.isManager">
    <div class="list">
      <div class="item" v-for="(item,index) in list" :key="item.ysbh">
        <div class="body">
          <div class="info"><span class="lable">钥匙编号：</span> {{item.fytype + item.bianhao}}</div>
          <div class="info text-blue"><span class="lable">钥匙状态：</span>{{item.status}}</div>
          <div class="info"><span class="lable">房屋类型：</span> {{item.type}}</div>
          <div class="info"><span class="lable">房屋地址：</span> {{item.title}}</div>
          <div class="info"><span class="lable">归还门店：</span>{{item.ysgs.map(ysgs=> ysgs.dept_name).join(',') || '暂无'}}</div>
        </div>
      </div>
    </div>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
    <div class="btn-guihuan" v-if="showBtn" @click="guihuan()">确认归还</div>
  </div>
  <div v-else class="container-yaoshi no">暂无权限</div>
</template>


<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  export default {
    data () {
      return {
        list: [],
        showBtn: true
      }
    },
    created(){
      this.$store.commit('changeTitle','我的钥匙');
      util.hideLoading();
      this.getList();
    },
    methods:{
      getList(){
        actions.page_yaoshi_jingshoubyids({
          ysbh: this.$route.query.ids
        }).then(res=>{
          if(res.is_success == 0){
            this.list = res.content
            this.showBtn  = this.list.findIndex(item => item.status == '领用') != -1
          }
        })
      },
      guihuan(){
        let ids = [];
        this.list.forEach(item=>{
          ids.push(item.ysbh)
        })
        actions.yaoshi_lingyong({
          ysbh: this.$route.query.ids
        }).then(res=>{
          this.getList();
          util.showToast('归还成功')
        })
      }
    }
}
</script>

<style lang="scss">
  .container-yaoshi-guihuan{
    position: relative;
    font-size: 0.3rem;
    padding-bottom:.3rem;
    &.no{
      color: #999;
      text-align:center;
    }
    .list{
      .item{
        position: relative;
        margin: .3rem 0 0;
        background-color:#fff;
        .body{
          padding: .3rem;
          border-bottom: 1px solid #efefef;
        }
        .info{
          position:relative;
          padding-left: 1.8rem;
          font-size: .3rem;
          color: #333;
          line-height: .42rem;
        }
        .lable{
          position:absolute;
          left: 0;
          top: 0;
          color: #666;
          min-width: 2rem;
        }
        .status{
          position: absolute;
          top: .3rem;
          right: .3rem;
          color: #00ae66;
        }
        .text-blue{
          color:#00ae66;
        }
      }
    }
    .list-null{
      padding: .6rem 0 0;
      text-align: center;
      font-size: .3rem;
      color: #666;
    }
    .btn-guihuan{
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1rem;
      bottom:0;
      left:0;
      right:0;
      color: #fff;
      background-color: #00ae66;
    }

  }
</style>
