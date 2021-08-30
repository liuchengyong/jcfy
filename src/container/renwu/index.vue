<template>
  <div class="container-renwu" v-if="$store.state.isManager">
    <div class="tabs">
      <div class="tab select">打卡带看</div>
      <div class="tab"  @click="gotoRenwu">带看任务</div>
    </div>

    <div class="select-type">
      <span>选择类型</span>
      <div class="control">
        <select v-model="type">
          <option selected value="2">二手房</option>
          <option value="3">租房</option>
        </select>
      </div>
    </div>
    <div class="select-type">
      <span>打卡方式</span>
      <div class="control">
        <select v-model="method">
          <option selected value="1">本人带看打卡</option>
          <option value="2">替人带看打卡</option>
        </select>
      </div>
    </div>
    <div class="input-phone">
      <select v-model="dk_method">
        <option selected value="phone">手机号</option>
        <option value="bianhao">客户编号</option>
      </select>
      <input type="text" v-if="dk_method == 'phone'" placeholder="请输入客户手机号" v-model="phone" />
      <input type="text" v-if="dk_method == 'bianhao'" placeholder="请输入客源编号" v-model="phone" />
    </div>

    <div class="from-item" v-if="method == 2">
      <span class="from-lable">替看人</span>
      <div class="from-control">
        <input type="text" placeholder="请输入经纪人姓名" :value="name" @input="inputChange($event)"/>
      </div>
    </div>
    <div class="list" v-if="method == 2 && list.length > 0">
      <div class="item" v-for="item in list" :key="item.id" @click="select(item)">
        <span class="name">{{item.login_name}}</span>
      </div>
    </div>

    <div class="btn-commit" @click='commit'>确认打卡</div>
  </div>
  <div v-else class="container-renwu no">暂无权限</div>
</template>


<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  export default {
    data () {
      return {
        method: '1',
        type:'2',
        dk_method: 'phone',
        phone:'',
        name: '',
        list: [],
        user: null,
      }
    },
    created(){
      this.$store.commit('changeTitle','客源手机号验证');
      util.hideLoading();
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
        let data = {
          type: this.type,
          rwfzr: util.getLocalStorage('userid'),
          login_name: util.getLocalStorage('xingming')
        };
        if(this.dk_method == 'phone'){
          if(!util.verify.phone.test(this.phone)) return util.showToast('输入正确的手机号')
          data.khdh = this.phone;
        }else if(this.dk_method == 'bianhao'){
          if(this.phone == '') return util.showToast('输入客源编号')
          data.khbh = this.phone;
        }

        if(this.method == 1){
          actions.addRenWu(data).then(res=>{
            if(res.is_success == 0){
              util.showToast('添加成功')
              this.$router.push({name:'renwulist'})
            }else{
              util.showToast(res.msg)
            }
          })
        }else{
          if(!this.user) return util.showToast('请选择经纪人');
          data.rwfzr = this.user.login_id;
          actions.add_tiren_renwu(data).then(res=>{
            if(res.is_success == 0){
              util.showToast('添加成功')
              this.$router.push({name:'renwulist'})
            }else{
              util.showToast(res.msg)
            }
          })
        }
      },
      gotoRenwu(){
        this.$router.push({name:'renwulist'})
      }

    }
}
</script>

<style lang="scss">
  .container-renwu{
    position: relative;
    font-size: 0.3rem;
    &.no{
      color: #999;
      text-align:center;
    }
    .tabs{
      position: relative;
      display: flex;
      width: 100%;
      line-height: 1rem;
      height: 1rem;
      background-color: #fff;
      .tab{
        flex:1;
        text-align: center;
        color: #00ae66;
        border: 1px solid #00ae66;
        &.select{
          color: #fff;
          background-color: #00ae66;
        }
      }
    }
    .select-type{
      position:relative;
      display:flex;
      margin-top: .3rem;
      align-items: center;
      padding: 0 .3rem;
      height: 1rem;
      background-color: #fff;
      .control{
        flex:1;
        text-align:right;
      }
    }
    .input-phone{
      position:relative;
      display:flex;
      margin-top: .3rem;
      align-items: center;
      padding: 0 .3rem;
      height: 1rem;
      background-color: #fff;
        >input{
          flex: 1;
          text-align: right;
          border: none;
          outline: none;
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
    .list{
      max-height: 3rem;
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
    .btn-commit{
      width: 80%;
      margin: .5rem auto 0;
      height: 1rem;
      line-height: 1rem;
      color: #fff;
      background-color: #00ae66;
      text-align:center;
    }

  }
</style>
