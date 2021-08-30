 <template>
  <div class="container-contract-pic">
    <div class="img-box" v-for="item in list" :key="item">
      <div class="btn-delete"  @click="deleteImage(item)"><img src="../../images/delete.png" /></div>
      <img :src="item" @click="previewImage(item)"/>
    </div>

    <div class="bottom">
      <div @click="addImage" class="btn-add">添加附件</div>
    </div>
  </div>
</template>


<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  export default {
    data () {
      return {
        list: [],
      }
    },
    created(){
      this.$store.commit('changeTitle','附件');
      this.getList()
    },
    beforeDestroy(){
      clearTimeout(this.Daojishi);
    },
    methods:{
      getList(){
        actions.getHtImages({
          id: this.$route.query.id,
        }).then(res=>{
          if(res.is_success === "0"){
            let list = [];
            res.content.forEach(item=>{
              list.push(item.pic_path)
            })
            this.list = list;

          }
        })
      },
      deleteImage(item){
        util.createConfirm('是否删除图片').then(res=>{
          if(res){
            actions.deleteHtImage({
              id: this.$route.query.id,
              pic_path: item.replace('http://wx.beijinghome.cc/Contract/wx_pics/','')
            }).then(res=>{
              if(res.is_success === "0"){
                this.getList();
                util.showToast('删除图片成功')
              }
            })
          }
        })
      },
      uploadImage(list,index){
        if(list.length <= index) return util.showToast('图片上传完成');
        wx.uploadImage({
          localId: list[index], // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: (res) =>{
            actions.uploadHtImage({
              id: this.$route.query.id,
              mediaIds: res.serverId,
              user_id: util.getLocalStorage('userid')
            }).then(res=>{
              if(res.is_success === "0"){
                util.showToast('第'+(index+1)+'张图片上传成功')
                this.getList();
              }
              this.uploadImage(list,++index);
            })

          },
          fail: res=> {
            util.showToast('第'+(index+1)+'张图片上传失败');
            this.uploadImage(list,++index);
          }
        });
      },
      addImage(){
        if(util.isWeixin){
          wx.ready(()=>{
            wx.chooseImage({
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: res=> {
                if(res.errMsg === "chooseImage:ok"){
                  this.uploadImage(res.localIds,0)
                }
                // var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              },
              fail: res=> {
                util.showToast('上传图片失败')
              }
          });
          })
        }else{
          location.href =  `http://wx.beijinghome.cc/Contract/test_pic/add_wx_pic.jsp?login_id=${util.getLocalStorage('userid')}&id=${this.$route.query.id}`
        }
      },
      previewImage(item){
        if(util.isWeixin){
          wx.ready(()=>{
            wx.previewImage({
              current: item, // 当前显示图片的http链接
              urls: this.list // 需要预览的图片http链接列表
            });
          })
        }else{
          this.$hevueImgPreview({
            multiple: true, // 开启多图预览模式
            nowImgIndex: this.list.indexOf(item), // 多图预览，默认展示第二张图片
            imgList: this.list,
            mainBackground: 'rgba(0, 0, 0, 0.9)',
          })
        }
      }
    }
}
</script>

<style lang="scss">
  .container-contract-pic{
    position: relative;
    padding: .3rem .3rem 1rem;
    .img-box {
      position: relative;
      margin-bottom: .3rem;
      width: 100%;
      height: 3rem;
      overflow: hidden;
      background-color: #ddd;
      img{
        display: block;
        height: 100%;
        width: 100%;
      }
      .btn-delete{
        position: absolute;
        top: .2rem;
        right: .2rem;
        width: 1rem;
        height: 1rem;
        padding: .3rem;
        border-radius: 50%;
        background-color: #333;
      }
    }

    .bottom{
      position: fixed;
      left:0; right: 0;
      bottom:0;
      background-color:#f5f5f5;
      .btn-add{
        display: block;
        height: 0.9rem;
        line-height: 0.9rem;
        text-align: center;
        font-size: 0.3rem;
        color: #fff;
        background-color: #007aff;
      }
    }
  }
</style>
