<template>
  <div class="list" ref="list">
    <div class="wrapper">
      <house-item v-for="(house,index) in list" :key="index" :house="house" :type="type" @handleHosue="handleHosue"></house-item>
    </div>
    <div class="loadmore-tip" ref="scrollWrapperTip" v-if="loadMore.scrollStatu != 'hide'">
      <span class="text-loadmore">{{ loadMore.scrollStatu | scrollTextFilter }}</span>
    </div>
    <div class="wrapper-null" v-if="list.length == 0">暂无拥有房源</div>
  </div>
</template>

<script>
    import actions from '../common/actions.js'
    import util from '../common/util.js'
    import houseItem from '../component/houseItem.vue'
    import { mapState } from 'vuex'
    export default {
      components:{houseItem},
      data () {
        return {
          list:[],
          pageSize: 10,
        }
      },
      created(){
        this.changeHtmlTitle();
        this.$store.commit('changeLoadMore',{page:1,scrollStatu:'unload'});
        util.setSessionStorage('listScroll',0);
        this.getHouseList(1);
      },
      updated(){
        if(this.loadMore.scrollStatu != 'hide' && this.$refs.scrollWrapperTip && this.$refs.scrollWrapperTip.offsetTop < window.innerHeight  && this.$route.name == 'list'){
          this.$store.commit('changeLoadMore',{scrollStatu:'hide'});
        }
      },
      computed: {
        loadMore(){
          return this.$store.state.loadMore;
        },
        type(){
          return ['1','2','3'].includes(this.$route.params.type) ? this.$route.params.type : 2
        },
      },
      watch: {
        loadMore(loadMore){
          if(loadMore.scrollStatu == 'load' && this.list.length > 0){
            this.getHouseList(loadMore.page + 1);
          }
        },
        type(value,oldValue){
          if(value != oldValue){
            this.$store.commit('changeLoadMore',{page:1,scrollStatu:'unload'});
            util.setSessionStorage('listScroll',0);
            this.filter.price = {};
            this.getHouseList(1);
          }
        }
      },
      methods:{
        changeHtmlTitle(){
          this.$store.commit('changeTitle','我的' + ['','新房','二手房','租房'][this.type]);
        },
        handleHosue(type,house){
          if(type == 'detail'){
            this.$router.push({name:'detail',params:{id:house.id,type:this.type},query:this.$route.query})
          }
        },
        getHouseList(page){
          let data = {
            page_size: this.pageSize,
            page_number: page,
            type: this.type,
            login_id: util.getLocalStorage('phone')
          };

          actions.getMyHouseList(data).then(res=>{
            if(res.is_success == 0){
              if(data.page_number == 1 && res.content.length == 0){
                this.$store.commit('changeLoadMore',{page,scrollStatu:'hide'});
              }else if(data.page_size > parseFloat(res.all_count)){
                this.$store.commit('changeLoadMore',{page,scrollStatu:'over'});
              }else{
                this.$store.commit('changeLoadMore',{page,scrollStatu:'unload'});
              }
              this.list = data.page_number == 1 ? res.content : this.list.concat(res.content);
            }
          })
        }
      }
    }
</script>

<style lang="scss">
  .list{
    position: relative;
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
    .filter{
      position:relative;
      display:flex;
      height:0.9rem;
      border-top:1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      background-color:#fff;
      .filter-item{
        flex:1;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#999;
        font-size: 0.24rem;
      }
      .filter-icon{
        margin-left:0.1rem;
      }
    }

    .wrapper{
      border-bottom: 1px solid #e5e5e5;
      padding-left:0.4rem;
      background-color:#fff;
    }
    .wrapper-null{
      font-size:0.32rem;
      color:#999;
      line-height:5em;
      text-align: center;
    }
    .loadmore-tip{
      font-size:0.24rem;
      color:#999;
      line-height:2em;
      text-align: center;
      background-color:#f5f5f5;
    }
  }
</style>
