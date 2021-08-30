<template>
  <div class="renwuqueren">
    <div class="list">
      <house-item v-for="(house,index) in list" :key="index" :house="house" :type="$route.query.type" @handleHosue="handleHosue"></house-item>
      <div class="next" @click="nextPage" v-if="hasMore">下一页</div>
    </div>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
    <div class="btn-complete" @click="complete">确认看房</div>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'
    import houseItem from './querenitem.vue'

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
        this.$store.commit('changeTitle','确认看房');
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

        handleHosue(type,item){

        },
        complete(){
          this.$router.push({name:'renwuquerenverify',query: this.$route.query})
        }
      }
    }
</script>

<style lang="scss">
  .renwuqueren{
    font-size: .3rem;
    color: #333;
    padding-bottom: 1.3rem;
    .list{
      background-color: #fff;
      padding: 0 .3rem;
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
      right: .3rem;
      bottom: 3rem;
      height: 1.2rem;
      width: 1.2rem;
      background-image: url(../../images/add.png);
      background-size: 100%;
    }
  }
</style>
