<template>
  <div class="renwu-customer">
    <div class="from-item">
      <span class="from-lable">替看人</span>
      <div class="from-control">
        <input type="text" placeholder="请输入经纪人姓名" :value="name" @input="inputChange($event)"/>
      </div>
    </div>
    <div class="list" v-if="list.length > 0">
      <div class="item" v-for="item in list" :key="item.id" @click="select(item)">
        <span class="name">{{item.login_name}}</span>
      </div>
    </div>
    <div class="btn-commit" @click='commit'>确认</div>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'

    export default {
      components:{},
      data () {
        return {
          name: '',
          user: null,
          list: []
        }
      },
      created(){
        util.hideLoading()
        this.$store.commit('changeTitle','替我打卡');
      },
      updated(){
      },
      computed: {
      },
      watch: {
      },
      methods:{
        inputChange(event){
          let value = event.target.value;
          this.name = value
          this.user = null;
          if(!value) return;
          actions.searchJinJiRen({
            login_name: value
          },true).then(res=>{
            if(res.is_success == 0){
              this.list = res.content;
            }
          })
        },
        select(item){
          this.user = item;
          this.name = item.login_name;
        },
        commit(){
          if(!this.name) return util.showToast('经纪人姓名不能为空');
          if(!this.user) return util.showToast('请选择经纪人');
          actions.fpRenWu({
            rwid: this.$route.query.id,
            zxr: this.user.login_id,
            fpr: util.getLocalStorage('userid')
          }).then(res=>{
            if(res.is_success == 0){
              util.showToast('分配成功')
              this.$router.push({name:'renwulist'})
            }
          })
        }
      }
    }
</script>

<style lang="scss">
  .renwu-customer{
    font-size: .3rem;
    color: #333;
    .from-item{
      position:relative;
      display:flex;
      margin-top: .3rem;
      align-items: center;
      padding: 0 .3rem;
      height: 1rem;
      background-color: #fff;
      .from-lable{
        width: 2rem;
      }
      .from-control{
        flex:1;
        text-align:right;
        input{
          text-align:right;
        }
      }
    }
    .btn-commit{
      width: 80%;
      margin: .5rem auto 0;
      height: 1rem;
      line-height: 1rem;
      color: #fff;
      background-color: #00ae66;
      text-align:center;
    }
    .list{
      max-height: 5rem;
      overflow-y: scroll;
      background-color:#fff;
      border-top: 1px solid #efefef;
      .item{
        display: flex;
        height: .8rem;
        align-items: center;
        padding: 0 .3rem;
        border-bottom: 1px solid #efefef;
        .name{
          display: inline-block;
        }
        .phone{
          display: inline-block;
          padding-left: .3rem;
          font-size:.24rem;
          color: #999;
        }
      }

    }
  }
</style>

