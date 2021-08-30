<template>
  <div :class="['container-yaoshi',tab] " v-if="$store.state.isManager">
    <div class="tabs" v-if="!isShowCheck">
      <div :class="['tab',{select: tab == 'woling'}]" @click="selectTab('woling')">我领的钥匙</div>
      <div :class="['tab',{select: tab == 'woshou'}]" @click="selectTab('woshou')">我收的钥匙</div>
    </div>
    <div class="list">
      <div :class="['item',{check: isShowCheck, checked: item._check}]" v-for="(item,index) in list" :key="item.ysbh" @click="selectItem(item,index)">
        <div class="body">
          <div class="info"><span class="lable">钥匙编号：</span> {{item.fytype + item.bianhao}}</div>
          <div class="info text-blue"><span class="lable">钥匙状态：</span>{{item.status}}</div>
          <div class="info"><span class="lable">房屋类型：</span> {{item.type}}</div>
          <div class="info"><span class="lable">房屋地址：</span> {{item.title}}</div>
          <div class="info"><span class="lable">归还门店：</span> {{item.ysgs.map(ysgs=> ysgs.dept_name).join(',') || '暂无'}}</div>
        </div>
        <div class="footer" v-if="tab == 'woling'">
          <div class="btn" @click="showDakaWrapper(item)">打卡</div>
        </div>
      </div>
      <div class="next" @click="nextPage" v-if="hasMore">下一页</div>
    </div>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>

    <template v-if="tab == 'woling' && list.length != 0">
      <div class="btn-guihuan" v-if="!isShowCheck" @click="isShowCheck = true">归还</div>
      <div class="btn-group" v-else>
        <div class="btn" @click="isShowCheck = false">取消</div>
        <div class="btn" @click="guihuan()">确定</div>
      </div>
    </template>

    <div class="daka-wrapper" v-if="isShowDakaWrapper" @click.self="isShowDakaWrapper = false">
      <div class="daka-wrapper-inner">
        <input placeholder="请输入客源电话" v-model="phone" />
        <div class="commit-daka" @click="daka()">提交</div>
      </div>
    </div>

  </div>
  <div v-else class="container-yaoshi no">暂无权限</div>
</template>


<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  import gps from '../../common/gps.js'

  export default {
    data () {
      return {
        tab: 'woling',
        list: [],
        page: 1,
        isShowCheck: false,
        hasMore: false,
        currentItem: null,
        isShowDakaWrapper: false,
        phone: ''
      }
    },
    created(){
      this.$store.commit('changeTitle','我的钥匙');
      util.hideLoading();
      this.getJingshouList();
    },
    methods:{
      showDakaWrapper(item){
        this.currentItem = item
        this.isShowDakaWrapper = true;
      },
      daka(){
        if(!this.phone) return util.showToast('客源电话不能为空');
        if(!util.verify.phone.test(this.phone)) return util.showToast('客源电话格式错误');
        let item = this.currentItem;
        util.getLocation().then(res => {
            // res = { lng: 116.1196460949, lat: 39.9375058141 };
            let data = {
              fangwu_id: item.fangwu_id,
              x_count: res.lng,
              y_count: res.lat
            };
            actions.getFwDistant(data).then(res=>{
              if(res.content <= 500){
                actions.yaoshi_daka({
                  fangwu_id: item.fangwu_id,
                  ysbh: item.ysbh,
                  x_count: data.x_count,
                  y_count: data.y_count,
                  kyphone: this.phone
                }).then(res=>{
                  if(res.is_success == 0){
                    util.showToast('打卡成功')
                    this.isShowDakaWrapper = false;
                    this.phone = ''
                  }else{
                    util.showToast(res.msg)
                  }
                })
              }else if(res.content == -1){
                util.showToast('请联系管理员设置坐标')
              }else{
                util.showToast('您不在房源附近')
              }
            })
        });

      },
      guihuan(){
        let ids = [];
        this.list.forEach(item=>{
          if(item._check) ids.push(item.ysbh)
        })
        if(ids.length == 0) return util.showToast('请选择归还钥匙')
        this.$router.push({name:'yaoshiqrcode',query:{ids: ids.join(',')}})
      },
      selectItem(item,index){
        if(!this.isShowCheck) return;
        this.list[index]._check = !this.list[index]._check
        this.list = this.list.concat([])
      },
      selectTab(type){
        this.tab = type
        this.page = 1;
        if(type == 'woling'){
          this.getJingshouList();
        }else{
          this.getWoshouList();
        }
      },
      nextPage(){
        this.page = this.page + 1
        if(this.tab == 'woshou'){
          this.getWoshouList();
        }else if(this.tab == 'woling'){
          this.getJingshouList();
        }
      },
      getWoshouList(){
        let page = this.page;
        actions.page_yaoshi_woshou({
          page_number: page,
          page_size: 20,
        }).then(res=>{
          if(this.tab != 'woshou') return;
          if(res.is_success == 0){
            this.list = page == 1 ? res.content : this.list.concat(res.content);
            this.hasMore = 20 <= res.content.length
          }
        })
      },
      getJingshouList(){
        let page = this.page;
        actions.page_yaoshi_jingshou({
          page_number: page,
          page_size: 20,
        }).then(res=>{
          if(this.tab != 'woling') return;
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
  .container-yaoshi{
    position: relative;
    font-size: 0.3rem;
    padding-bottom:.3rem;
    &.woling{
      padding-bottom:1.3rem;
    }
    &.no{
      color: #999;
      text-align:center;
    }
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
    .list{
      .item{
        position: relative;
        margin: .3rem 0 0;
        background-color:#fff;
        &.check{
          padding-left: 1rem;
          background-image: url('../../images/check.png');
          background-size: .4rem auto;
          background-repeat: no-repeat;
          background-position: left .3rem center;
          &.checked{
            background-image: url('../../images/checked.png');
          }
          .footer{
            display: none;
          }

        }
        .body{
          padding: .3rem;
          border-bottom: 1px solid #efefef;
        }
        .info{
          position:relative;
          padding-left: 1.8rem;
          font-size: .3rem;
          color: #333;
          line-height: .42rem;
          min-height: .42rem;
        }
        .lable{
          position:absolute;
          left: 0;
          top: 0;
          color: #666;
          min-width: 2rem;
        }
        .status{
          position: absolute;
          top: .3rem;
          right: .3rem;
          color: #00ae66;
        }
        .text-blue{
          color: #00ae66;
        }
        .footer{
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          padding-bottom: .3rem;
          .btn{
            display:flex;
            align-items: center;
            padding: 0 .3rem;
            height: .6rem;
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

    .btn-guihuan{
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
    .btn-group{
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 1rem;
      bottom:0;
      left:0;
      right:0;
      padding: 0 .3rem;
      background-color: #fff;
      .btn{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content:center;
        height: 0.8rem;
        background-color: #00ae66;
        color:#fff;
        margin: 0 .1rem;
        border-radius: 0.1rem;
        font-size:0.3rem;
        &:first-child{
          color: #00ae66;
          border: 1px solid #00ae66;
          background-color: #fff;
        }
      }
    }

    .daka-wrapper{
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      top:0;
      background-color:rgba(0,0,0,.6);
      z-index:1000;
      .daka-wrapper-inner{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        width:6rem;
        background-color:#fff;
        border-radius:5px;
        padding:.3rem 0;
        > input{
          display:block;
          padding:0 .3rem;
          margin: .3rem auto;
          width:5rem;
          height: .8rem;
          border: 1px solid #ddd;
          outline: none;
        }
        > .commit-daka{
          display: block;
          margin: 0 auto;
          height: 0.6rem;
          line-height: .6rem;
          text-align:center;
          width: 3rem;
          font-size: 0.3rem;
          background-color: #FF725C;
          border-color: #FF725C;
          color: #fff;
          border-radius:0.05rem;

        }
      }
    }

  }
</style>
