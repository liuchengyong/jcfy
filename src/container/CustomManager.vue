<template>
  <div class="custom-manager">
    <div class="search-wrapper">
      <div class="item">
        <span class="lable">类型:</span>
        <div class="scroll-wrapper">
          <div class="scroll"  :style="{width: 1.7 * s_jylx_list.length  + 'rem' }">
            <span v-for="item in s_jylx_list" :class="['radio',{ check: s_jylx == item}] " @click="selectRadio('s_jylx',item)">{{item}}</span>
          </div>
        </div>
      </div>
      <div class="item">
        <span class="lable">状态:</span>
        <div class="scroll-wrapper">
          <div class="scroll" :style="{width: 1.7 * s_sfgk_list.length  + 'rem' }">
            <span v-for="item in s_sfgk_list" :class="['radio',{ check: s_sfgk == item}] " @click="selectRadio('s_sfgk',item)">{{item}}</span>
          </div>
        </div>
      </div>
      <div class="item">
        <span class="lable">公私:</span>
        <div class="scroll-wrapper">
          <div class="scroll" :style="{width: 1.7 * s_gs_list.length  + 'rem' }">
            <span v-for="item in s_gs_list" :class="['radio',{ check: s_gs == item}] " @click="selectRadio('s_gs',item)">{{item}}</span>
          </div>
        </div>
      </div>
      <div class="item">
        <span class="lable">手机:</span>
        <div class="input">
          <input type="text" v-model="s_dh">
        </div>
        </div>
      <div class="item">
        <span class="lable">编号:</span>
        <div class="input">
          <input type="text" v-model="s_bh">
        </div>
      </div>
      <div class="btn-search" @click="search">查询</div>
    </div>
    <!-- 跟进信息 wrapper-->
    <div class="genjin-wrapper" v-if="showGenJinWrapper">
      <div class="genjin-wrapper-inner">
        <textarea placeholder="请输入跟进信息" v-model="genjin"></textarea>
        <div class="commit-genjin" @click="commitGenJin">提交</div>
      </div>
    </div>
    <ul class="list">
      <li v-for="item in list" class="item" @click="goToDaKaGenJin(item)">
        <span class="block"><span class="lable">编号：</span>{{item.bh}}</span>
        <span class="inline"><span class="lable">状态：</span>{{item.status}}</span>
        <span class="inline"><span class="lable">交易类型：</span>{{item.jylx}}</span>
        <span class="inline"><span class="lable">客户名称：</span>{{item.name}}</span>
        <span class="inline"><span class="lable">公私：</span>{{item.sfgk}}</span>
        <span class="inline"><span class="lable">需求面积：</span>{{item.xqmj}}</span>
        <span class="block"><span class="lable">需求房型：</span>{{item.jylx}}</span>
        <span class="block"><span class="lable">录入日期：</span>{{item.add_time}}</span>
        <span class="block" v-if="item.lxfs"><span class="lable">联系业主：</span><span class="btn-call" @click.stop="callPhone(item)">查看电话</span></span>
      </li>
      <li class="next" @click="nextPage" v-if="hasMore">下一页</li>
    </ul>
    <div class="list-null" v-if="list.length == 0"> 暂无数据 </div>
  </div>
</template>

<script>
    import actions from '../common/actions.js'
    import util from '../common/util.js'

    import { mapState } from 'vuex'

    export default {
      components:{},
      data () {
        return {
          s_jylx_list:['全部','租赁','买卖'],
          s_jylx: '全部',
          s_sfgk_list:['全部','有效','暂缓','已购','我购','已租','我租','预订','无效','未知'],
          s_sfgk: '有效',
          s_gs_list:['全部','公客','私客'],
          s_gs: '全部',
          s_dh: '',
          s_bh: '',
          list: [],
          hasMore: false,
          showGenJinWrapper:false,
          genjin:'',
          custom: null
        }
        this.page = 1;
      },
      activated(){
      },
      created(){
        this.$store.commit('changeTitle','我的客源');
        this.getMyCustomList(1);
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
        callPhone(item){
          this.custom = item;
          actions.haveGenjin().then(res=>{
            if(res.is_success == 0 && res.content && res.content.length > 0 && res.content[0].have_genjin == 'yes'){
              this.showGenJinWrapper = true;
              location.href = "tel:" + item.lxfs;
              actions.commitGenJin({
                id: new Date().getTime(),
                user_id: util.getLocalStorage('userid'),
                dept_id: '',
                content: '获取电话',
                add_time: new Date(),
                fangwu_id: item.id
              })
            }else{
              util.showToast("你的当日次数到达限制");
            }
          })
          this.showGenJinWrapper = true
        },
        commitGenJin(){
          if(this.genjin == ''){
            return util.showToast("跟进信息不能为空");
          }
          actions.commitGenJin({
            id: new Date().getTime(),
            user_id: util.getLocalStorage('userid'),
            dept_id: '',
            content: this.genjin,
            add_time: new Date(),
            fangwu_id: this.custom.id
          }).then(res=>{
            if(res.is_success == 0){
              this.genjin = '';
              this.showGenJinWrapper = false;
              util.showToast("跟进信息提交成功");
            }
          })
        },
        getMyCustomList(page){
          this.page = page;
          actions.getMyCustom({
            userid: util.getLocalStorage('userid'),
            page_number: page,
            page_size: 10,
            s_jylx: this.s_jylx == '全部' ? '' : this.s_jylx ,
            s_sfgk: this.s_sfgk == '全部' ? '' : this.s_sfgk ,
            s_dh: this.s_dh,
            s_bh: this.s_bh,
            s_gs: this.s_gs == '全部' ? '' : this.s_gs
          }).then(res=>{
            if(res.is_success == 0){
              this.list = page == 1 ? res.content : this.list.concat(res.content);
              this.hasMore = 10 <= parseFloat(res.all_count)
            }
          })
        },
        nextPage(){
          this.hasMore = false;
          this.getMyCustomList(this.page + 1)
        },
        selectRadio(key,value){
          if(this[key] != value){
            this[key] = value;
          }
        },
        search(){
          this.getMyCustomList(1)
        },
        goToDaKaGenJin(item){
          this.$router.push({name:'dakagenjin',query: { fwid:item.id, phone: item.lxfs, jylx: item.jylx}})
        }
      }
    }
</script>

<style lang="scss">
  .custom-manager{
    .search-wrapper{
      position: relative;
      padding: 0.3rem 0 .3rem .3rem;
      background-color: #fff;
      border-bottom: 1px solid #ccc;
      .item{
        position: relative;
        padding-left: 1rem;
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
    .genjin-wrapper{
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      top:0;
      background-color:rgba(0,0,0,.6);
      z-index:1000;
      .genjin-wrapper-inner{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        width:6rem;
        background-color:#fff;
        border-radius:5px;
        padding:.3rem 0;
        > textarea{
          display:block;
          line-height:1.5em;
          padding:.2rem;
          margin: .2rem auto;
          width:5rem;height:2rem;
          border:1px solid #ddd;
          outline: none;
        }
        > .commit-genjin{
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
    .list{
      padding: 0 0 30px 0;
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
        .btn-call{
          color:rgb(0, 0, 238);
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
    .list-null{
      padding: .6rem 0 0;
      text-align: center;
      font-size: .3rem;
      color: #666;
    }
  }
</style>
