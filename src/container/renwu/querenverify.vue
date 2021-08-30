<template>
  <div class="renwuquerenverify">
    <div class="customer-phone">
      {{$route.query.phone}}
    </div>
    <div class="input-verify">
      <canvas id="canvas" @click="initCavans"></canvas>
      <input type="text" v-model="verify" placeholder="请输入图形验证码" />
    </div>
    <div class="input-captcha" v-if="!noLogin">
      <input type="text" v-model="captcha" placeholder="请输入验证码" />
      <span :class="['btn-captcha',{disable: isTimerStart}]" @click="getCaptcha">{{ isTimerStart ? this.count + 's' : '获取验证码' }}</span>
    </div>
    <span :class="['btn-login']" @click='gotoDetail'>确认看房</span>
  </div>
</template>


<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  export default {
    data () {
      let phone = util.getLocalStorage('phone')
      console.log(this.$route.query)
      return {
        dataVerify: '',
        verify: '',
        data: '',
        captcha:'',
        isTimerStart: false,
        count: 90,
        noLogin: phone == this.$route.query.phone
      }

    },
    created(){
      this.$store.commit('changeTitle','确认看房');
      util.hideLoading();
    },
    mounted(){
      this.initCavans();
    },
    beforeDestroy(){
      clearTimeout(this.Daojishi);
    },
    methods:{
      randomColor(){
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
      },
      initCavans(){
        this.dataVerify = '';
        let canvas = document.getElementById("canvas");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        let context = canvas.getContext("2d");
        let codeList = "a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0".split(",");
        for (let i = 0; i < 4; i++) {
           let txt = codeList[Math.floor(Math.random() * codeList.length)];
           this.dataVerify += txt
           let deg = Math.random() - 0.5;
           let x =  canvas.width / 6 + canvas.width / 6 * i;
           var y = canvas.height / 2 + Math.random() * canvas.height / 3;//文字在canvas上的y坐标
           context.font = "bold 30px 微软雅黑";
           context.translate(x, y);
           context.rotate(deg);
           context.fillStyle = this.randomColor();
           context.fillText(txt, 0, 0);
           context.rotate(-deg);
           context.translate(-x, -y);

        }
      },
      getCaptcha(){
        if(this.dataVerify && this.dataVerify.toUpperCase() == this.verify.toUpperCase()){
          if(this.isCaptcha) return;
          this.isCaptcha = true;
          actions.getHtDx({phone: this.$route.query.phone}).then(res=>{
              if(res.is_success == 0){
                this.data = res.content;
                this.isTimerStart = true;
                this.timer();
              }
          })
        }else{
          util.showToast('图形验证码不正确');
        }
      },
      gotoDetail(){
        if((this.data && this.data == this.captcha) || (this.noLogin && this.dataVerify && this.dataVerify.toUpperCase() == this.verify.toUpperCase())){
          actions.login(this.$route.query.phone)
          actions.renWnOk({
            rwid: this.$route.query.id,
            khphone: this.$route.query.phone,
            khtx: util.getLocalStorage('touxiang')
          }).then(res=>{
            if(res.is_success == '0'){
              util.showToast('确认成功');
              this.$router.push({name:'list',params:{type: this.$route.query.type}})
            }
          })
        }else{
          util.showToast('验证码不正确');
        }
      },
      timer(){
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
  .renwuquerenverify{
    position: relative;
    padding: 1rem 0.3rem 0;
    .customer-phone{
      position:relative;
      line-height: 1rem;
      margin-bottom: .6rem;
      font-size: #333;
      text-align: center;
      background-color:#fff;
    }
    .input-verify{
      position:relative;
      padding:0 0 0.6rem 2.5rem;
      canvas{
        position: absolute;
        left: 0;
        top:0;
        width: 2.3rem;
        height: 1rem;
        background-color: #fff;
      }
      >input{
        width: 100%;
        height: 1rem;
        border:1px solid #eee;
        text-align: center;
        font-size: 0.28rem;
        width:4.4rem;
      }
    }
    .input-captcha{
      position:relative;
      padding: 0 2.5rem 0.6rem 0;
      >input{
        width: 100%;
        height: 1rem;
        border:1px solid #eee;
        text-align: center;
        font-size: 0.28rem;
      }
      .btn-captcha{
        position: absolute;
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
