<template>
  <div class="dakagenjin">
    <div class="tabs">
      <div :class="['tab',{ check: item.id == tab.id}]" v-for="item in tabList" @click="selectTab(item)" :key="item.id">{{item.text}}</div>
    </div>
    <ul class="list" v-if="tab.id == 'daka'">
      <li v-for="(item,index) in list" class="item">
        <span class="block"><span class="lable">序号：</span>{{index+1}}</span>
        <span class="inline"><span class="lable">小区名称：</span>{{item.title}}</span>
        <span class="inline"><span class="lable">房源编号：</span>{{item.bianhao}}</span>
        <span class="inline"><span class="lable">经纪人：</span>{{item.login_name}}</span>
        <span class="block"><span class="lable">打卡时间：</span>{{item.add_time}}</span>
      </li>
    </ul>
    <div class="tabs2" v-if="tab.id == 'genjin'">
      <div :class="['tab',{ check: item.id == tab2.id}]" v-for="item in tab2List" @click="selectTab2(item)" :key="item.id">{{item.text}}</div>
    </div>
    <ul class="list" v-if="tab.id == 'genjin'">
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
          tabList: [{id:'daka',text:'打卡信息'},{id:'genjin',text:'跟进信息'}],
          tab:{id: 'daka',text:'打卡信息'},
          tab2List: [{id:1,text:'系统跟进'},{id:2,text:'写入跟进'}],
          tab2: {id:1,text:'系统跟进'},
          list: [],
        }
      },
      activated(){
      },
      created(){
        this.$store.commit('changeTitle','打卡和跟进');
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
        selectTab2(tab){
          if(this.tab2.id == tab.id) return;
          this.tab2 = tab;
          this.getList();
        },
        selectTab(tab){
          if(this.tab.id == tab.id) return;
          this.tab = tab;
          this.getList();
        },
        getList(){
          if(this.tab.id == 'daka'){
            actions.getKyDaKa({
              userid: util.getLocalStorage('userid'),
              khphone: this.$route.query.phone,
              jylx: this.$route.query.jylx == '租赁' ? 1 : 2,
            }).then(res=>{
              if(res.is_success == 0){
                this.list = res.content;
              }
            })
          }else if(this.tab.id == 'genjin'){
            actions.getKyGenJin({
              id: this.$route.query.fwid,
              type: this.tab2.id,
            }).then(res=>{
              if(res.is_success == 0){
                this.list = res.content;
              }
            })

          }
        }
      }
    }
</script>

<style lang="scss">
  .dakagenjin{
    .tabs{
      position: relative;
      display: flex;
      .tab{
        display: block;
        width: 50%;
        text-align: center;
        line-height: .9rem;
        color: #333;
        font-size: .3rem;
        border:1px solid #ccc;
        background-color: #fff;
        &.check{
          color: #fff;
          border:none;
          background-color: #00ae66;
        }
      }
    }
    .tabs2{
      position: relative;
      display: flex;
      padding: .3rem 1.5rem 0;
      .tab{
        display: block;
        width: 50%;
        text-align: center;
        line-height: .6rem;
        color: #333;
        font-size: .3rem;
        border:1px solid #ccc;
        background-color: #fff;
        &:nth-child(1){
          border-top-left-radius: .6rem;
          border-bottom-left-radius:.6rem;
        }
        &:nth-child(2){
          border-top-right-radius:.6rem;
          border-bottom-right-radius:.6rem;
        }
        &.check{
          color: #fff;
          border:none;
          background-color: #00ae66;
        }
      }
    }
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
