<template>
  <div class="container-check-in" v-if="$store.state.isManager">
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
        <select v-model="dk_type">
          <option selected value="phone">手机号</option>
          <option value="bianhao">客源编号</option>
        </select>
      </div>
    </div>
    <div class="input-phone">
      <input type="text" v-if="dk_type == 'phone'" placeholder="请输入客户手机号" :value="phone" @input="handelChange(11,'phone',$event)"/>
      <input type="text" v-if="dk_type == 'bianhao'" placeholder="请输入客源编号" :value="phone" @input="handelChange(11,'phone',$event)"/>
    </div>
    <span :class="['btn-commit',{disable:isFromDisable}]" @click='commit'>提交</span>
  </div>
  <div v-else class="container-check-in no">暂无权限</div>
</template>


<script>
  import util from '../common/util.js';
  import actions from '../common/actions.js';
  export default {
    data () {
      return {
        type:'2',
        dk_type:'phone',
        phone:'',
        isFromDisable:true,
      }
    },
    created(){
      this.$store.commit('changeTitle','客源手机号验证');
      util.hideLoading();
    },
    methods:{
      handelChange(length,key,event){
        let value = event.target.value;
        let newValue = value.length > length ? value.slice(0, length) : value;
        event.target.value =  newValue;
        this[key] = newValue;
        this.checkForm();
      },
      checkForm(){
        if(this.dk_type == 'phone'){
          this.isFromDisable = !util.verify.phone.test(this.phone);
        }else{
          this.isFromDisable = isNaN(this.phone);
        }

      },
      commit(){
        this.isFromDisable = true;
        actions.commitPhone(this.phone,this.dk_type).then(res=>{
          if(res.is_success == 0){
            util.setSessionStorage('CheckInPhone',this.phone);
            util.setSessionStorage('CheckInDkType',this.dk_type);
            this.$router.push({name:'list',params:{type:this.type},query:{type:'near'}})
          }
        })
      }
    }
}
</script>

<style lang="scss">
  .container-check-in{
    position: relative;
    padding: 1rem 0.3rem 0;
    &.no{
      font-size:.3rem;
      color:#999;
      text-align:center;
    }
    .select-type{
      position:relative;
      display:flex;
      font-size: 0.28rem;
      align-items: center;
      padding: 0 .3rem;
      height: 1rem;
      border: 1px solid #eee;
      background-color: #fff;
      margin-bottom: 0.2rem;
      .control{
        flex:1;
        text-align:right;
      }
      > select{
        font-size: 0.28rem;
      }
    }
    .input-phone{
      position:relative;
      padding-bottom: 0.2rem;
        >input{
          width: 100%;
          height: 1rem;
          border:1px solid #eee;
          text-align: center;
          font-size: 0.28rem;
        }
    }
    .btn-commit{
      display: block;
      height:1rem;
      line-height: 1rem;
      font-size:0.36rem;
      color:#fff;
      background-color: #00ae66;
      text-align:center;
      margin-top: .3rem;
      &.disable{
        pointer-events: none;
        background-color:rgba(0,174,102,0.45);
      }
    }

  }
</style>
