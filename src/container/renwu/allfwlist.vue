<template>
  <div class="allfwlist">
    <div class="search">
      <svgicon name="search" width=".38rem" height=".38rem" color="#9fa2a3" ></svgicon>
      <input class="search-input" type="text" v-model="title" placeholder="输入小区或商圈开始找房咯~" />
      <span class="search-btn" @click="search">搜索</span>
    </div>
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
    import houseItem from './allfwlistitem.vue'

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
            rwid: this.$route.query.id
          };
          if(this.title){
            data.title = this.title;
          }
          this.hasMore = false;
          actions.renwu_page_fangwu(data).then(res=>{
            if(res.is_success == 0){
              this.list = data.page_number == 1 ? res.content : this.list.concat(res.content);
              this.hasMore = 20 <= parseFloat(res.all_count)
              this.page = page
            }
          })
        },
        search(){
          this.getList(1)
        },
        nextPage(){
          this.getList(this.page + 1)
        },
        handleHosue(type,item){
          if(type == 'add'){
            actions.renWuAddFangJiHua({
              rwid: this.$route.query.id,
              fangwu_id: item.id,
              qrsj:'',
              qrr:''
            }).then(res=>{
              if(res.is_success == 0){
                item.rw_is_add = 'yes'
                util.showToast('添加房源成功')
              }
            })
          }
        }
      }
    }
</script>

<style lang="scss">
  .allfwlist{
    font-size: .3rem;
    color: #333;
    .search{
      position:relative;
      display:flex;
      align-items:center;
      height:.6rem;
      margin:0.2rem 0.23rem;
      background-color: #e8e8e9;
      padding:0 0 0 0.18rem;
      .search-input{
        flex:1;
        background-color: #e8e8e9;
        padding-left:0.2rem;
      }
      .search-btn{
            color:#fff;
            height: .6rem;
            line-height:.6rem;
            background-color: #FF725C;
            border-color: #FF725C;
            text-align:center;
            border-radius:0.05rem;
            font-size:0.2rem;
            padding: 0 0.3rem;
        }
    }
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
