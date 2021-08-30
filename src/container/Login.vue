<template>
  <div class="container-login">
    <div class="input-phone">
      <input type="text" placeholder="请输入手机号" :value="phone" @input="handelChange(11,'phone',$event)"/>
    </div>
    <div class="input-captcha">
      <input type="text" :value="captcha" @input="handelChange(6,'captcha',$event)" placeholder="请输入验证码" />
      <span :class="['btn-captcha',{disable:isTimerStart ? false : isCaptchaDisable}]" @click="getCaptcha">{{ isTimerStart ? this.count + 's' : '获取验证码' }}</span>
    </div>
    <span :class="['btn-login',{disable:isFromDisable}]" @click='login'>登陆</span>
  </div>
</template>


<script>
  import util from '../common/util.js';
  import actions from '../common/actions.js';
  export default {
    data () {
      return {
        phone:'',
        captcha:'',
        isFromDisable:true,
        isCaptchaDisable:true,
        isTimerStart: false,
        count:90,
        remoteCaptcha:'',
      }
    },
    created(){
      this.$store.commit('changeTitle','登陆');
      util.hideLoading();
    },
    beforeDestroy(){
      clearTimeout(this.Daojishi);
    },
    methods:{
      handelChange(length,key,event){
        let value = event.target.value;
        let newValue = value.length > length ? value.slice(0, length) : value;
        event.target.value =  newValue;
        this[key] = newValue;
        this.checkForm();
      },
      getCaptcha(){
        this.isCaptchaDisable = true;
        if(this.isTimerStart) return;
        actions.getHtDx({phone: this.phone}).then((res)=>{
            if(res.is_success == 0){
              this.isTimerStart = true;
              this.remoteCaptcha = res.content;
              this.timer();
            }
        })
      },
      checkForm(){
        this.isCaptchaDisable = !util.verify.phone.test(this.phone);
        this.isFromDisable = !(util.verify.phone.test(this.phone)
          && util.verify.captcha.test(this.captcha) && this.isTimerStart);
      },
      login(){
        this.isFromDisable = true;
        if(this.captcha !== this.remoteCaptcha) {
          return util.showToast('验证码不正确')
        }
        actions.login(this.phone).then((res)=>{
          if(res.is_success == 0){
            this.$store.commit('userLoginStatus',true);
            util.setLocalStorage('phone',this.phone);
            actions.checkPhone().then(data=>{
              if(data.is_success == 0 && data.content.length > 0){
                util.setLocalStorage('manager',data.content[0].is_ywy == 'yes')
                util.setLocalStorage('userid',data.content[0].user_id || '')
                if(data.content[0].is_ywy == 'yes'){
                  this.$store.commit('changeAgent',true)
                }
                if(this.$route.query.back){
                  this.$router.back();
                }else{
                  this.$router.replace({name:'home'});
                }
              }
            })
          }
        })
      },
      timer:function(){
        this.Daojishi = setTimeout(() => {
          if(this.count == 0){
            this.isTimerStart = false;
          }else{
            this.count --;
            this.timer();
          }
        },1000);
      }
    }
}
</script>

<style lang="scss">
  .container-login{
    position: relative;
    padding: 1rem 0.3rem 0;
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
    .input-captcha{
      position:relative;
      padding-bottom:0.6rem;
      >input{
        width: 100%;
        height: 1rem;
        border:1px solid #eee;
        text-align: center;
        font-size: 0.28rem;
        width:4.4rem;
      }
      .btn-captcha{
        position:absolute;
        right: 0;
        top:0;
        width:2.3rem;
        height:1rem;
        line-height: 1rem;
        font-size:0.28rem;
        color:#fff;
        background-color: #00ae66;
        text-align:center;
        &.disable{
          background-color:rgba(0,174,102,0.45);
        }
      }
    }
    .btn-login{
      display: block;
      height:1rem;
      line-height: 1rem;
      font-size:0.36rem;
      color:#fff;
      background-color: #00ae66;
      text-align:center;
      &.disable{
        pointer-events: none;
        background-color:rgba(0,174,102,0.45);
      }
    }

  }
</style>
