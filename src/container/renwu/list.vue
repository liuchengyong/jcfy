<template>
  <div class="renwulist">
    <div class="tabs">
      <div :class="['tab',{select: item.id == tab.id}]"
        v-for="item in tabList" @click="selectTab(item)">
        {{item.text}}
      </div>
    </div>
    <div class="search-wrapper">
      <div class="item">
        <span class="lable">打卡状态:</span>
        <div class="scroll-wrapper">
          <div class="scroll"  :style="{width: 1.7 * dakaList.length  + 'rem' }">
            <span v-for="item in dakaList" :class="['radio',{ check: dakaStatus.id == item.id}] " @click="selectRadio('dakaStatus',item)">{{item.text}}</span>
          </div>
        </div>
      </div>
      <div class="item">
        <span class="lable">客户状态:</span>
        <div class="scroll-wrapper">
          <div class="scroll"  :style="{width: 1.7 * kehuStatusList.length  + 'rem' }">
            <span v-for="item in kehuStatusList" :class="['radio',{ check: kehuStatus.id == item.id}] " @click="selectRadio('kehuStatus',item)">{{item.text}}</span>
          </div>
        </div>
      </div>
      <div class="item" v-if="tab.id == 'my'">
        <span class="lable">类型:</span>
        <div class="scroll-wrapper">
          <div class="scroll"  :style="{width: 1.7 * typeList.length  + 'rem' }">
            <span v-for="item in typeList" :class="['radio',{ check: type.id == item.id}] " @click="selectRadio('type',item)">{{item.text}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="body">
          <img class="avater" v-if="item.khtx" :src="item.khtx" >
          <img class="avater" v-else src="../../images/avater_default.png" >
          <div class="name">{{item.khxm | khxmFilter(item) }}</div>
          <div class="time">{{item.rwsj}}</div>
          <div class="phone">{{item.khdh}}</div>
          <div class="time" v-if="item.timeDownStr && item.timeDownStr != '已超时'">打卡倒计时：{{ item.timeDownStr }}</div>
          <div class="zxr" v-if="tab.id == 'my' && item.zxr_list.length > 0">打卡人:{{item.zxr_list[0].login_name}}</div>
          <div class="status">{{ item.timeDownStr == '已超时' ? '已完成' : item.dkzt }} | {{item.khzt}}</div>
        </div>
        <div class="footer">
          <div class="btn wran" @click="handleItemEvent('delete',item)">删除</div>
          <div class="btn" v-if="tab.id == 'my'" @click="handleItemEvent('tiwo',item)">替我打卡</div>
          <div class="btn" v-if="item.timeDownStr != '已超时'" @click="handleItemEvent('daka',item)">带看打卡</div>
          <div class="btn" @click="handleItemEvent('addJiHua',item)">添加计划</div>
          <div class="btn" v-if="tab.id == 'my'" @click="handleItemEvent('edit',item)">编辑客户</div>
        </div>
      </div>
      <div class="next" @click="nextPage" v-if="hasMore">下一页</div>
    </div>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'

    let TabList = [{id:'my',text:'我的打卡'},{id:'other',text:'替人打卡'}];
    let DakaStatusList = [
      {id: '', text:'全部'},
      {id: '计划中', text:'计划中'},
      {id: '带看中', text:'带看中'},
      {id: '已完成', text:'已完成'}
    ];
    let KeHuStatusList = [
      {id: '', text:'全部'},
      {id: '已确认', text:'已确认'},
      {id: '未确认', text:'未确认'},
    ];
    let TypeList = [
      {id: '', text:'全部'},
      {id: '本人打卡', text:'本人打卡'},
      {id: '有人替打', text:'有人替打'},
    ];
    export default {
      components:{},
      data () {
        return {
          tabList: TabList,
          tab: TabList[0],
          dakaList: DakaStatusList,
          dakaStatus: DakaStatusList[0],
          kehuStatusList: KeHuStatusList,
          kehuStatus: KeHuStatusList[0],
          typeList: TypeList,
          type: TypeList[0],
          list: [],
          hasMore: false,
          page: 0,
        }
      },
      created(){
        this.$store.commit('changeTitle','带看任务');
        this.getList(1);
        this.timer = setInterval(()=>{
          this.refreshList();
        },1000);
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
      filters:{
        khxmFilter(value,item){
          if(value == '') return '暂无姓名';
          return value.slice(0,1) + (item.khxb == '男' ? '先生' : '女士')
        }
      },
      methods:{
        refreshList(){
          if(this.tab.id != 'my') return;
          if(!this.list) return;
          let list = [];
          this.list.forEach((item,index)=>{
            list.push(item)
            if(!item.dk_time) {
              item.timeDownStr = ''
            }else{
              let date = new Date(item.dk_time.replace(/-/g,'/')).getTime();
              let now = new Date().getTime();
              let time = Math.floor(((date + 2 * 60 * 60 * 1000) - now) / 1000)
              if(time < 0){
                item.timeDownStr = '已超时'
              }else{
                let hour = Math.floor(time / (60 * 60));
                let muite = Math.floor((time - (hour * 60 * 60) ) / 60);
                let second = time - (hour * 60 * 60) - muite * 60;
                item.timeDownStr = (hour < 10 ? ('0' + hour) : hour) + ':' + (muite < 10 ? ('0' + muite) : muite) + ':' +  (second < 10 ? ('0' + second) : second)
              }
            }

            // this.list[index] = Object.assign({},item)
          })
          this.list = list
        },
        getTimeStr(item){


          let time = Math.floor((now - date) / 1000);
          return time
        },
        selectRadio(key,value){
          this[key] = value;
          this.getList(1);
        },
        selectTab(tab){
          this.tab = tab;
          this.dakaStatus = DakaStatusList[0];
          this.kehuStatus = KeHuStatusList[0];
          this.type = TypeList[0];
          this.getList(1);
        },
        getList(page){
          if(page == this.page && page != 1) return;
          this.hasMore = false;
          let remote = null
          let data = {
            page_size: 20,
            page_number: page,
            dkzt: this.dakaStatus.id,
            khzt: this.kehuStatus.id,
            type: this.type.id
          };
          if(this.tab.id == 'my'){
            remote = actions.getRenWuList(data)
          }else if(this.tab.id == 'other'){
            remote = actions.getFpRenWuList(data)
          }
          remote.then(res=>{
            if(res.is_success == '0'){
              this.list = page == 1 ? res.content : this.list.concat(res.content);
              this.hasMore = 20 <= parseFloat(res.all_count)
              this.page = page;
            }
          })
        },
        nextPage(){
          this.getList(this.page + 1)
        },
        deleteRenwu(item){
          util.createConfirm('是否删除任务').then(res=>{
            if(res){
              let remote = null;
              if(this.tab.id == 'my'){
                remote = actions.deleteRenWu({id: item.id})
              }else if(this.tab.id == 'other'){
                remote = actions.deleteFpRenWu({id: item.fp_rw_id})
              }
              remote.then(res=>{
                if(res.is_success == 0){
                  util.showToast('删除成功');
                  this.getList(1);
                }
              })
            }
          })
        },
        handleItemEvent(type,item){
          if(type == 'edit'){
            this.$router.push({name: 'renwucustom', query: item})
          }else if(type == 'delete'){
            this.deleteRenwu(item)
          }else if(type == 'tiwo'){
            this.$router.push({name: 'renwufeipei', query: {id: item.id}})
          }else if(type == 'daka'){
            this.$router.push({name: 'renwufwdaka', query: {id: item.id, type: item.type}})
          }else if(type == 'addJiHua'){
            this.$router.push({name: 'renwufwlist', query: item })
          }
        }
      },
      beforeDestroy(){
        clearInterval(this.timer)
      }
    }
</script>

<style lang="scss">
  .renwulist{
    font-size: .3rem;
    color: #333;
    padding-bottom:.5rem;
    .tabs{
      position: relative;
      display: flex;
      width: 100%;
      line-height: 1rem;
      height: 1rem;
      background-color: #fff;
      .tab{
        flex:1;
        text-align: center;
        color: #00ae66;
        border: 1px solid #00ae66;
        &.select{
          color: #fff;
          background-color: #00ae66;
        }
      }
    }
    .search-wrapper{
      position: relative;
      padding: 0.3rem 0 .3rem .3rem;
      background-color: #fff;
      border-bottom: 1px solid #ccc;
      .item{
        position: relative;
        padding-left: 1.5rem;
        .lable{
          position: absolute;
          left: 0; top:0;
          line-height: 0.9rem;
          font-size: .3rem;
          color: #333;
        }
        .scroll-wrapper{
          position: relative;
          width: 100%;
          overflow-x:scroll;
          .scroll{
            height: .9rem;
            display: flex;
            align-items: center;
          }
        }
        .input{
          height: .9rem;
          display: flex;
          align-items: center;
          input{
            height: 0.6rem;
            padding: 0 0.3rem;
            font-size: .3rem;
            color: #333;
            border: 1px solid #999;
          }
        }
        .radio{
          display:block;
          width:1.5rem;
          margin:0 .2rem 0 0;
          border: 1px solid #f4f4f4;
          color: #999;
          border-radius: 0.05rem;
          overflow: hidden;
          white-space: nowrap;
          font-size:0.2rem;
          text-align:center;
          line-height:0.5rem;
          &.check{
            border-color: #00ae66;
            color:#00ae66;
          }
        }
      }
      .btn-search{
        width: 3rem;
        color:#fff;
        font-size:0.3rem;
        height: .6rem;
        margin: 0.3rem auto 0;
        line-height:.6rem;
        background-color: #FF725C;
        text-align:center;
        border-radius:0.05rem;

      }
    }
    .list{
      .item{
        position: relative;
        margin: .3rem 0 0;
        background-color:#fff;
        .body{
          padding: .3rem .3rem .3rem 1.8rem;
          border-bottom: 1px solid #efefef;
        }
        .avater{
          position: absolute;
          display: block;
          top: .3rem;
          left: .3rem;
          width: 1.2rem;
          height: auto;
          border-radius: 50%;
        }
        .name{
          font-size:.36rem;
        }
        .time{
          padding-top: .1rem;
          font-size: .28rem;
          color: #999;
        }
        .phone{
          padding-top: .2rem;
          font-size:.36rem;
        }
        .zxr{
          position: absolute;
          top: .8rem;
          right: .3rem;
          color: #00ae66;
        }
        .status{
          position: absolute;
          top: .3rem;
          right: .3rem;
          color: #00ae66;
        }
        .footer{
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          padding-bottom: .3rem;
          .btn{
            padding: 0 .1rem;
            line-height: .5rem;
            color: #fff;
            border-radius: .1rem;
            margin: .2rem .2rem 0 0;
            background-color: #00ae66;
          }
          .wran{
            background-color: #FF725C;
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
    }
    .list-null{
      padding: .6rem 0 0;
      text-align: center;
      font-size: .3rem;
      color: #666;
    }
  }
</style>
