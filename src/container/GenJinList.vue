<template>
  <div class="my-genjin-list">
    <ul class="list">
      <li v-for="(item,index) in list" class="item">
        <span class="block"><span class="lable">序号：</span>{{index+1}}</span>
        <span class="inline"><span class="lable">类型：</span>{{item.type == 'system' ? '系统' : '写入'}}</span>
        <span class="inline"><span class="lable">员工：</span>{{item.login_name}}</span>
        <span class="inline"><span class="lable">日期：</span>{{item.add_time}}</span>
        <span class="block"><span class="lable">跟进内容：</span>{{item.content}}</span>
      </li>
    </ul>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
  </div>
</template>

<script>
    import actions from '../common/actions.js'
    import util from '../common/util.js'

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
        this.$store.commit('changeTitle','跟进列表');
        this.getList();
      },
      updated(){
      },
      computed: {
        loadMore(){
          return this.$store.state.loadMore;
        },
      },
      watch: {
      },
      methods:{
        getList(){
          actions.getGenJinList({
            id: this.$route.query.id
          }).then(res=>{
            if(res.is_success == 0){
              res.content.forEach(item=>{
                res.content = res.content.filter(item => item.content!= '获取电话');
                res.content = res.content.slice(0, 10);
                let content = item.content.replace("$$$$$$$", "@@@@@@");
                if (content.indexOf("@@@@@@") >= 0 && content.split("@@@@@@").length > 1) {
                  content = content.split("@@@@@@")[1];
                }
                if(content.indexOf("业主电话")>=0){
                  content = content.substring(0,content.indexOf("业主电话")+4)+"******";
                }
                item.content = content
              })
              this.list = res.content;
            }
          })

        }
      }
    }
</script>

<style lang="scss">
  .my-genjin-list{
    .list{
      padding: 30px 0 30px 0;
      .item{
        display: flex;
        flex-wrap: wrap;
        font-size: .3rem;
        line-height: .42rem;
        padding: 0.3rem;
        color:#333;
        background-color: #fff;
        border-bottom:1px solid #efefef;
        .lable{
          color:#666;
        }
        .inline{
          display: block;
          min-width: 50%;
          max-width: 100%;
        }
        .block{
          display: block;
          width: 100%;
          font-size: .3rem;
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

