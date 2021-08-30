<template>
  <div class="create-qrcode">
    <div class="name">{{$route.query.khxm}}</div>
    <div class="phone">{{$route.query.khdh}}</div>
    <img class="qrcode" :src="qrcode"/>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'

    export default {
      components:{},
      data () {
        return {
          qrcode:''
        }
      },
      created(){
        util.hideLoading()
        this.$store.commit('changeTitle','扫描二维码');
        let qrCodeElement = document.createElement('div');
        let data = this.$route.query
        let qrcode = new QRCode(qrCodeElement, {
          text: `${location.origin}/#/renwu/qr?id=${data.id}&phone=${data.khdh}&type=${data.type}`,
          width: 200,
          height: 200,
          colorDark : "#333333",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
        let qrCodeCanvas = qrCodeElement.querySelector('canvas')
        console.log(`${location.origin}/#/renwu/qr?id=${data.id}&phone=${data.khdh}&type=${data.type}`)
        this.qrcode = qrCodeCanvas.toDataURL("image/jpeg");
      },
      updated(){
      },
      computed: {
      },
      watch: {
      },
      methods:{

      }
    }
</script>

<style lang="scss">
  .create-qrcode{
    padding-top: 1rem;
    color: #333;
    text-align: center;
    .name{
      font-size: 1rem;
    }
    .phone{
      padding-top: .4rem;
      font-size: .8rem;
    }
    .qrcode{
      width: 3rem;
      height: 3rem;
      margin: .6rem auto 0;
    }
  }
</style>

