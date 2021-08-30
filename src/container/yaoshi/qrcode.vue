<template>
  <div class="yaoshi-qrcode">
    <img class="qrcode" :src="qrcode"/>
    <div class="desc">扫描二维码，归还钥匙</div>
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
        this.$store.commit('changeTitle','扫描二维码，归还钥匙');
        let qrCodeElement = document.createElement('div');
        let data = this.$route.query
        let qrcode = new QRCode(qrCodeElement, {
          text: `${location.origin}/#/yaoshi/guihuan?ids=${data.ids}`,
          width: 200,
          height: 200,
          colorDark : "#333333",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
        let qrCodeCanvas = qrCodeElement.querySelector('canvas')
        console.log(`${location.origin}/#/yaoshi/guihuan?ids=${data.ids}`)
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
  .yaoshi-qrcode{
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
    .desc{
      padding-top: .4rem;
      font-size: .3rem;
    }
  }
</style>

