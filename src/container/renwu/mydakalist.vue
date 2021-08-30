<template>
  <div class="mydakalist">
    <div class="list">
      <house-item v-for="(house,index) in list" :key="index" :house="house" :type="house.type == 'zulin' ? 3 : 2" @handleHosue="handleHosue"></house-item>
      <div class="next" @click="nextPage" v-if="hasMore">下一页</div>
    </div>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'
    import houseItem from './mydakalistitem.vue'

    export default {
      components:{houseItem},
      data () {
        return {
          title: '',
          list: [],
          hasMore: false,
          page: 0,
        }
      },
      created(){
        this.$store.commit('changeTitle','我看过的房源');
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
            phone: util.getLocalStorage('phone')
          };
          this.hasMore = false;
          actions.page_woqueren_fangwu(data).then(res=>{
            if(res.is_success == 0){
              this.list = data.page_number == 1 ? res.content : this.list.concat(res.content);
              this.hasMore = 20 <= parseFloat(res.all_count)
              this.page = page
            }
          })
        },
        nextPage(){
          this.getList(this.page + 1)
        },
        handleHosue(type,item){

        }
      }
    }
</script>

<style lang="scss">
  .mydakalist{
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
