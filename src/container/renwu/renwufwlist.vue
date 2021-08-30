<template>
  <div class="renwufwlist">
    <div class="list">
      <house-item v-for="(house,index) in list" :key="index" :house="house" :type="$route.query.type" @handleHosue="handleHosue"></house-item>
      <div class="next" @click="nextPage" v-if="hasMore">下一页</div>
    </div>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
    <div class="btn-complete" @click="complete">客户确认</div>
    <div class="add-fw" id="addFw"
      v-if="$route.query.khzt != '已确认'"
      @click="addFw"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      ></div>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'
    import houseItem from './renwufwlistitem.vue'
    import gps from '../../common/gps.js'

    let touchmove = {};
    export default {
      components:{houseItem},
      data () {
        return {
          list: [],
          hasMore: false,
          page: 0,
        }
      },
      created(){
        this.$store.commit('changeTitle','看房列表');
        this.getList(1);
      },
      updated(){
      },
      computed: {
      },
      watch: {
      },
      methods:{
        touchstart(event){
          touchmove.isMove = true
          touchmove._x_start = event.touches[0].pageX;
          touchmove._y_start = event.touches[0].pageY;
          touchmove.left_start = document.getElementById('addFw').offsetLeft
          touchmove.top_start = document.getElementById('addFw').offsetTop
        },
        touchmove(event){
          if(!touchmove.isMove) return;
          touchmove._x_move = event.touches[0].pageX;
          touchmove._y_move = event.touches[0].pageY;
          document.getElementById('addFw').style.left = touchmove._x_move - touchmove._x_start + touchmove.left_start + 'px'
          document.getElementById('addFw').style.top = touchmove._y_move - touchmove._y_start + touchmove.top_start + 'px'
        },
        touchend(event){
          touchmove.isMove = false;
        },
        getList(page){
          if(page == this.page && page != 1) return;
          actions.renWuFangList({
            rwid: this.$route.query.id,
            page_size: 20,
            page_number: page
          }).then(res=>{
            if(res.is_success == 0){
              this.list = page == 1 ? res.content : this.list.concat(res.content);
              this.hasMore = 20 <= parseFloat(res.all_count)
              this.page = page
            }
          })
        },
        nextPage(){
          this.hasMore = false;
          this.getList(this.page + 1)
        },
        daka(item){
          util.getLocation().then(res=>{
            // res = { lng: 116.1196460949, lat: 39.9375058141 };
            let data = {
              fangwu_id: item.id,
              x_count: res.lng,
              y_count: res.lat
            };
            actions.getFwDistant(data).then(res=>{
              if(res.content < 500){
                actions.renWuFangDaKa({
                  rwid: this.$route.query.id,
                  fangwu_id: item.id,
                  qrsj:'',
                  qrr:''
                }).then(res=>{
                  if(res.is_success == 0){
                    util.showToast('打卡成功')
                    this.getList(1)
                  }
                })
              }else if(res.content == -1){
                util.showToast('请联系管理员设置坐标')
              }else{
                util.showToast('您不在房源附近')
              }
            })
          })
        },
        delete(item){
          util.createConfirm('是否删除计划').then(res=>{
            if(res){
              actions.deleteRenWuFangJiHua({id: item.rw_f_rel_id}).then(res=>{
                if(res.is_success == 0){
                  util.showToast('删除成功');
                  this.getList(1);
                }
              })
            }
          })
        },
        handleHosue(type,item){
          if(type == 'daka'){
            this.daka(item)
          }else if(type == 'delete'){
            this.delete(item)
          }else if(type == 'peikan'){
            this.$router.push({name:'renwupeikanren',query: Object.assign({},this.$route.query,{rw_f_rel_id:item.rw_f_rel_id})})
          }
        },
        complete(){
          // actions.compelteRenWn({
          //   rwid: this.$route.query.id
          // }).then(res=>{
          //   if(res.is_success == 0){
          //     util.showToast('确认成功')
              this.$router.push({name:'renwucreatedqrcode',query: this.$route.query})
            // }
          // })
        },
        addFw(){
          this.$router.push({name: 'renwuallfw', query: this.$route.query })
        }
      }
    }
</script>

<style lang="scss">
  .renwufwlist{
    font-size: .3rem;
    color: #333;
    padding-bottom: 1.3rem;
    .list{
      padding: 0 0.3rem;
      background-color: #fff;
      .next{
        display: flex;
        align-items: center;
        justify-content: center;
        height: .9rem;
        margin: .3rem .1rem 0;
        color: #00ae66;
        border:1px solid #00ae66;
        background-color: #fff;
      }
    }
    .list-null{
      padding: .6rem 0 0;
      text-align: center;
      font-size: .3rem;
      color: #666;
    }
    .btn-complete{
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
    .add-fw{
      position: fixed;
      left: calc(100% - 1.5rem);
      top: calc(100% - 4.2rem);
      height: 1.2rem;
      width: 1.2rem;
      background-image: url(../../images/add.png);
      background-size: 100%;
    }
  }
</style>
