<template>
  <div class="zhaopin-share-list">
    <ul class="list">
      <li v-for="(item,index) in list" :key="index" class="item">
        <img :src="item.pic_path" />
        <span>{{item.name}}</span>
        <span>{{item.add_time}}</span>
      </li>
    </ul>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'

    export default {
      components:{},
      data () {
        return {
          list: [],
        }
      },
      activated(){
      },
      created(){
        this.$store.commit('changeTitle','我的分享');
        this.getList();
      },
      updated(){
      },
      computed: {
      },
      watch: {
      },
      methods:{
        getList(){
          actions.viewfenxiang({
            zhaopin_id: this.$route.query.id,
            userid: util.getLocalStorage('userid')
          }).then(res=>{
            if(res.is_success == 0){
              this.list = res.content;
            }
          })

        }
      }
    }
</script>

<style lang="scss">
  .zhaopin-share-list{
    .list{
      .item{
        display: flex;
        flex-wrap: wrap;
        font-size: .3rem;
        align-items: center;
        padding: 0.3rem;
        color:#333;
        background-color: #fff;
        border-bottom:1px solid #efefef;
        img{
          width: .8rem;
          height: .8rem;
          border-radius: 50%;
        }
        span{
          margin-left:.3rem;
        }
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
