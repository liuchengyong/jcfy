<template>
  <div class="container-zhaopin-list">
     <div class="list">
      <div :class="['item']" v-for="(item,index) in list" @click="goDetail(item)">
        <div class="job-detail">
          <img class="logo" :src="item.pic_path" />
          <div class="content">
            <div class="job-name">{{item.title}}</div>
            <div class="tag-list">
              <span class="tag">{{item.gzqy}}</span>
              <span class="tag">{{item.gznx}}</span>
              <span class="tag">{{item.xueli}}</span>
            </div>
            <div class="job-position">{{item.md_name}}</div>
            <div class="salary">{{item.xinzi}}</div>
          </div>
        </div>
      </div>
      <div class="next" @click="nextPage" v-if="hasMore">下一页</div>
    </div>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
  </div>
</template>


<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  import gps from '../../common/gps.js';

  export default {
    data () {
      return {
        list: [],
        page: 1,
        hasMore: false,
      }
    },
    created(){
      this.$store.commit('changeTitle','招贤纳士');
      util.hideLoading();
      this.getList();
    },
    methods:{
      goDetail(item){
        this.$router.push({name: 'zhaopindetail', query: {id:item.id}},)
      },
      nextPage(){
        this.page += 1;
        this.getList();
      },
      getList(){
        let page = this.page;
        actions.zhaopin_list({
          page_number: page,
          page_size: 20
        }).then(res=>{
          if(res.is_success == 0){
            this.list = page == 1 ? res.content : this.list.concat(res.content);
            this.hasMore = 20 <= res.content.length
          }
        })
      }

    }
}
</script>

<style lang="scss">
  .container-zhaopin-list{
    padding-bottom: .3rem;
    .job-detail{
      position:relative;
      padding: 0 0 0 1.8rem;
      background-color: #fff;
      .logo{
        position: absolute;
        display: block;
        left:.3rem; top: .3rem;
        width: 1.2rem;
        height: auto;
      }
      .content{
        position:relative;
        padding: .3rem .3rem .3rem 0;
        border-bottom: 1px solid #efefef;
        .job-name{
          font-size: .38rem;
          line-height: .6rem;
          color:#333;
        }
        .tag-list{
          display: flex;
          padding: .1rem 0;
          font-size: .28rem;
          color: #666;
          .tag{
            display:flex;
            height: .42rem;
            align-items: center;
            padding: 0 .1rem;
            border:1px solid #efefef;
            margin-right: .2rem;
            border-radius: .05rem;
          }
        }
        .job-position{
          padding-top: .1rem;
          font-size: .28rem;
          color: #666;
        }
        .salary{
          position: absolute;
          right: .3rem; top: .3rem;
          font-size: .38rem;
          line-height: .6rem;
          color: #ff725c;
        }
      }

    }
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
    .list-null{
      padding: .6rem 0 0;
      text-align: center;
      font-size: .3rem;
      color: #666;
    }

  }
</style>
