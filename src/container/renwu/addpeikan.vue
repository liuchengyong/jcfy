<template>
  <div class="add-peikan">
    <div class="pkr" v-for="(pkr,index) in pkrs">
      <span>{{pkr.pkr}}</span>
      <span>{{pkr.add_time}}</span>
      <span @click="deletePkr(pkr)">删除</span>
    </div>
    <div class="from-item">
      <div class="from-control">
        <input type="text" placeholder="请输入陪看人姓名" v-model="name" @input="inputChange($event)"/>
      </div>
    </div>
    <div class="list" v-if="list.length > 0">
      <div class="item" v-for="item in list" :key="item.id" v-if="pkrs.findIndex(pkr => pkr.pkr == item.login_name) == -1" @click="select(item)">
        <span class="name">{{item.login_name}}</span>
        <span class="msg">{{ '点击添加'}}</span>
      </div>
    </div>
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
          list: [],
          pkrs: [],
        }
      },
      created(){
        util.hideLoading()
        this.$store.commit('changeTitle','设置陪看人');
        this.getList()
      },
      updated(){
      },
      computed: {
      },
      watch: {
      },
      methods:{
        getList(){
          actions.page_pkr({
            rw_fang_id: this.$route.query.rw_f_rel_id
          }).then(res=>{
            if(res.is_success == 0){
              this.pkrs = res.content;
            }
          })
        },
        deletePkr(item){
          actions.rw_fang_pkr({
            action:'delete',
            rw_fang_id: this.$route.query.rw_f_rel_id,
            id: item.id
          }).then(res=>{
            if(res.is_success == 0){
              util.showToast('删除成功');
              this.getList();
            }
          })
        },
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
          if(this.pkrs.find(pkr => pkr.pkr ==  item.login_name)){
            return util.showToast('已添加不可重复添加');
          }
          actions.rw_fang_pkr({
            action:'add',
            rw_fang_id: this.$route.query.rw_f_rel_id,
            pkr: item.login_name
          }).then(res=>{
            if(res.is_success == 0){
              util.showToast('添加成功');
              this.getList();
            }
          })
        },
      }
    }
</script>

<style lang="scss">
  .add-peikan{
    font-size: .3rem;
    color: #333;
    .pkr{
      position:relative;
      display:flex;
      align-items: center;
      padding: 0 .3rem;
      height: 1rem;
      font-size: .3rem;
      border-bottom:1px solid #efefef;
      background-color: #fff;
      span:nth-child(1){
        color: #333;
      }
      span:nth-child(2){
        padding-left: .3rem;
        flex:1;
        font-size: .24rem;
        color: #666;
      }
      span:nth-child(3){
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 1rem;
        color: red;

      }
    }
    .from-item{
      position:relative;
      display:flex;
      margin-top: .3rem;
      align-items: center;
      padding: 0 .3rem;
      height: 1rem;
      background-color: #fff;

      .from-control{
        flex:1;
      }
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
          flex:1;
        }
        .msg{
          font-size:.24rem;
          color: #999;
        }

      }

    }
  }
</style>

