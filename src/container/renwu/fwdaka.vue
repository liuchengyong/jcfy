<template>
  <div class="fwdakalist">
    <div class="list">
      <house-item v-for="(house,index) in list" :key="index" :house="house" :type="$route.query.type" @handleHosue="handleHosue"></house-item>
      <div class="next" @click="nextPage" v-if="hasMore">下一页</div>
    </div>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'
    import houseItem from './fwdakahouse.vue'
    import gps from '../../common/gps.js'

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
        this.$store.commit('changeTitle','附近的房源');
        this.getList(1);
      },
      updated(){
      },
      computed: {
      },
      watch: {
      },
      methods:{
        getList(page){
          if(page == this.page && page != 1) return;
          let data = {
            page_size: 20,
            page_number: page,
            type: this.$route.query.type,
            is_system: 'no',
            round: 5
          };
          util.getLocation().then(res=>{
            // res = { lng: 116.1196460949, lat: 39.9375058141 };
            data.x_count = res.lng;
            data.y_count = res.lat;
            actions.getHouseListByLoc(data).then(res=>{
              if(res.is_success == 0){
                this.list = page == 1 ? res.content : this.list.concat(res.content);
                this.hasMore = 20 <= parseFloat(res.all_count)
                this.page = page
              }
            })
          })
        },
        nextPage(){
          this.hasMore = false;
          this.getList(this.page + 1)
        },
        handleHosue(type,item){
          if(type == 'daka'){
            actions.renWuFangDaKa({
              rwid: this.$route.query.id,
              fangwu_id: item.id,
              qrsj:'',
              qrr:''
            }).then(res=>{
              if(res.is_success == 0){
                util.showToast('打卡成功')
                this.$router.push({name:'renwulist'})
              }
            })
          }
        }
      }
    }
</script>

<style lang="scss">
  .fwdakalist{
    font-size: .3rem;
    color: #333;
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
  }
</style>
