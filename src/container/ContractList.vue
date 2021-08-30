<template>
  <div class="contract-list">
    <ul class="list">
      <li v-for="item in list" class="item" :key="item.id">
        <div class="header" >
          状态：{{item.status | statusText}}
        </div>
        <div class="body">
          <span class="block"><span class="lable">合同编号：</span>{{item.col_2}}</span>
          <span class="inline"><span class="lable">房屋地址：</span>{{item.col_3}}-{{item.col_4}}</span>
          <span class="inline"><span class="lable">起租日期：</span>{{item.col_245}}</span>
          <span class="inline"><span class="lable">终止日期：</span>{{item.col_84}}</span>
          <span class="inline"><span class="lable">租金总额：</span>{{item.col_25}}</span>
          <span class="inline"><span class="lable">承办人：</span>{{item.col_42}}</span>
          <span class="inline"><span class="lable">发起时间：</span>{{item.add_time}}</span>
          <span class="block" v-if="item.htid"><span class="lable">上上签合同编号：</span>{{item.htid}}</span>
        </div>
        <div class="footer">
          <div class="btn wran" v-if="item.status == '01'" @click="cancleContract(item)">撤销</div>
          <div class="btn wran" v-if="item.status == '00'" @click="unlockContract(item)">解锁</div>
          <div class="btn wran" @click="picContract(item)">附件</div>
          <div class="btn normal"  @click="goToPreviewContract(item)">预览</div>
          <div class="btn wran" v-if="item.status == '00'" @click="goToEditContract(item)">修改</div>
          <div class="btn wran" v-if="item.status == '01'"  @click="goPerfectContract(item)">补充</div>
          <div class="btn primary" v-if="item.status == '00'"  @click="publishContract(item)">发布</div>
          <div class="btn primary" v-if="item.status == '01'"  @click="searchContract(item)">进度</div>
          <div class="btn primary" v-if="['01','10','30'].includes(item.status)"  @click="repainContract(item)">重签</div>
          <div class="btn primary" v-if="item.htid"  @click="gotoSSQContract(item)">查看合同</div>

        </div>
      </li>
      <li class="next" @click="nextPage" v-if="hasMore">下一页</li>
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
          hasMore: false,
          page: 1
        }
      },
      activated(){
      },
      created(){
        this.$store.commit('changeTitle','我的合同');
        this.getMyContractList(1);
      },
      updated(){
      },
      computed: {
        loadMore(){
          return this.$store.state.loadMore;
        },
      },
      filters:{
        statusText:function(status){
          let statusText = '';
          switch(status){
            case '00':
              statusText = '未完成';
              break;
            case '01':
              statusText = '已推送';
              break;
            case '10':
              statusText = '已撤销';
              break;
            case '20':
              statusText = '签署完成';
              break;
            case '30':
              statusText = '过期';
              break;
            default:
              statusText = '未完成';
          }
          return statusText;
        }
      },
      watch: {
      },
      methods:{
        gotoSSQContract(item){
          this.$router.push({name:'contractPdf',query: { htid: item.htid, type: 'zulin'}})
        },
        getMyContractList(page){
          this.page = page;
          actions.getHtList({
            user_id: util.getLocalStorage('userid'),
            page_number: page,
            page_size: 10
          }).then(res=>{
            if(res.is_success == 0){
              this.list = page == 1 ? res.content : this.list.concat(res.content);
              this.hasMore = 10 <= parseFloat(res.all_count)
            }
          })
        },
        nextPage(){
          this.hasMore = false;
          this.getMyContractList(this.page + 1)
        },
        goToEditContract(item){
          this.$router.push({name:'contractDetail',query: { id: item.id, type: 'edit'}})
        },
        goToPreviewContract(item){
          this.$router.push({name:'contractDetail',query: { id: item.id, type: 'preview'}})
        },
        picContract(item){
          this.$router.push({name:'contractPic',query: { id: item.id }})
        },
        publishContract(item){
          util.createConfirm('是否发布合同').then(res=>{
            if(res){
              actions.publishHt({
                id: item.id
              }).then(res=>{
                if(res.is_success === "0"){
                  util.showToast('发布成功')
                  this.getMyContractList(1)
                }else{
                  util.showToast(res.msg)
                }
              })
            }
          })

        },
        cancleContract(item){
          util.createConfirm('是否取消合同').then(res=>{
            if(res){
              actions.cancleHt({
                htid : item.htid
              }).then(res=>{
                if(res.is_success === "0"){
                  util.showToast('撤销成功')
                  this.getMyContractList(1)
                }else{
                  util.showToast(res.msg)
                }
              })
            }
          })
        },
        unlockContract(item){
          util.createConfirm('是否解锁合同').then(res=>{
            if(res){
              actions.unLockHt({
                fangwu_id : item.col_260
              }).then(res=>{
                if(res.is_success === "0"){
                  util.showToast('解锁成功')
                  this.getMyContractList(1)
                }else{
                  util.showToast(res.msg)
                }
              })
            }
          })
        },
        searchContract(item){
          actions.getHtProgress({
            htid: item.htid
          }).then(res=>{
            if(res.is_success === "0"){
              let str = ''
              res.content.forEach(item=>{
                str += `<div>状态：${item.status}</div>`;
                str += `<div>理由：${item.message}</div>`;
                str += `<div>签署时间：${item.add_time}</div>`;
              })
              util.createAlert(`<div class="box">${str}</div>`,'知道了')
            }else{
              util.showToast(res.msg)
            }
          })
        },
        repainContract(item){
          this.$router.push({name:'contractDetail',query: { id: item.id, type: 'edit', source: 'copy'}})
        },
        goPerfectContract(item){
          this.$router.push({name:'contractDetail',query: { id: item.id, type: 'edit', source: 'prefect'}})
        }

      }
    }
</script>

<style lang="scss">
  .contract-list{
    padding: .3rem 0 1rem 0;
    .list{
      .item{
        margin-bottom:.3rem;
        font-size: .3rem;
        line-height: .42rem;
        color:#333;
        background-color: #fff;
        border-bottom:1px solid #efefef;
        .header{
          padding:.2rem .3rem;
          text-align: right;
          font-size: .3rem;
          color: #00ae66;
          border-bottom: 1px solid #efefef;
        }
        .body{
          padding:.3rem;
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
        .footer{
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          border-top: 1px solid #efefef;
          padding: 0.2rem 0.3rem;
          .btn{
            padding: 0 .3rem;
            line-height: .5rem;
            font-size: .3rem;
            color: #fff;
            border-radius: .1rem;
            margin: .3rem .3rem 0 0;
          }
          .wran{
            background-color: #FF725C;
          }
          .normal{
            background-color: #00ae66;
          }
          .primary{
            background-color: #007aff;
          }
        }
      }
      .next{
        display: flex;
        align-items: center;
        justify-content: center;
        height: .9rem;
        margin: 30px 10px 0;
        border:1px solid red;
        background-color: #fff;
      }
    }
    .test{
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: .9rem;
      line-height: .5rem;
      font-size: .3rem;
      color: #fff;
      background-color: #00ae66;
    }
    .list-null{
      padding: .6rem 0 0;
      text-align: center;
      font-size: .3rem;
      color: #666;
    }
  }
</style>
