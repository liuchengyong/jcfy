<template>
  <div class="xinfang-baobei">
    <div class="form" v-if="detail && jingjiren">
      <div class="person" v-for="(person,index) in personList" :key='index'>
        <span class="content">{{person.lxrlx}}: {{person.login_name}}</span>
        <span class="content">联系电话: {{person.lxdh}}</span>
      </div>
      <div class="item">
        <span class="lable">项目名称：</span>
        <span class="content">{{detail.xmmc}}</span>
      </div>
      <div class="item">
        <span class="lable">客户姓名：</span>
        <input class="input" v-model="name" placeholder="请输入客户姓名" />
      </div>
      <div class="item">
        <span class="lable">客户电话：</span>
        <input class="input" v-model="phone" placeholder="请输入客户电话" />
      </div>
      <div class="item">
        <span class="lable">预计到访时间：</span>
        <span class="select"  @click="openDatePicker">{{ date || '请选择'}}</span>
      </div>
      <div class="person" v-if="jingjiren">
        <span class="content">经纪人门店：{{jingjiren.dept_name}}</span>
      </div>
      <div class="person" v-if="jingjiren">
        <span class="content">经纪人姓名：{{jingjiren.login_name}}</span>
      </div>
      <div class="person">
        <span class="content">经纪人电话：{{jingjirenPhone}}</span>
      </div>

      <div class="btn-commit" @click="commit">提交报备</div>
      <div id="selectDom"></div>
    </div>
    <div class="list-wrapper" v-if="detail">
      <div class="title">我的报备</div>
      <div class="item" v-for="(item,index) in list" :key='index' @click="goToShare(item.id,item)">
        <div class="xing">{{item.khxm.slice(0,1)}}</div>
        <div class="right">
          <div class="text-1">{{item.khxm.slice(1)}} {{item.khdh}}</div>
          <div class="text-2">报备时间：{{item.dfsj}}</div>
          <div class="text-3">报备项目：{{detail.xmmc}} </div>
        </div>
        <div class="status">{{item.status}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import util from '../../common/util.js';
  import actions from '../../common/actions.js';
  import Select from '../../common/select.js';

  export default {
    components:{},
    data(){
      return {
        detail: null,
        jingjiren: null,
        name: '',
        phone: '',
        date: '',
        list: [],
        jingjirenPhone: util.getLocalStorage('phone'),
        personList: []
      }
    },
    created(){
      this.$store.commit('changeTitle','新房报备');
      this.getDetail();
    },
    methods:{
      getDetail(){
        actions.fangwu_info({
          fangwu_id: this.$route.query.id
        }).then(res=>{
          if(res.is_success == 0){
            this.detail = res.content[0];
          }
        })

        actions.lxr_list({
          fangwu_id: this.$route.query.id
        }).then(res=>{
          if(res.is_success == 0){
            this.personList = res.content
          }
        })
        actions.getUserInfo(util.getLocalStorage('phone')).then(res=>{
          if(res.is_success == 0 && res.content.length > 0){
            this.jingjiren = {
              dept_name:res.content[0].dept_name,
              login_id:res.content[0].login_id,
              login_name:res.content[0].login_name,
              user_phone:res.content[0].login_id,
              xxk_path:res.content[0].xxk_path,
              pic_path:res.content[0].pic_path,
            };
          }
        })

        this.getList()
      },
      getList(){
        actions.bb_list({
          fangwu_id: this.$route.query.id,
          login_id: util.getLocalStorage('userid')
        }).then(res=>{
          if(res.is_success == 0){
            this.list = res.content;
          }
        })
      },
      commit(){
        if(!this.name) return util.showToast('客户姓名不能为空');
        if(!this.phone) return util.showToast('客户电话不能为空');
        if(!util.verify.phone.test(this.phone)) return util.showToast('客户电话格式不正确');
        if(!this.date) return util.showToast('请选择预计到访时间');
        actions.add_baobei({
          fangwu_id: this.$route.query.id,
          khxm: this.name,
          khdh: this.phone,
          login_id: util.getLocalStorage('userid'),
          dfsj: this.date
        }).then(res=>{
          if(res.is_success == 0){
            this.goToShare(res.content)
          }
        })
      },
      goToShare(bbid,bb){
        this.$router.push({
          name:'xingfangbaobeishare',
          query:{
            bbid: bbid,
            fx_user: util.getLocalStorage('userid'),
            xmmc: this.detail.xmmc,
            khmc: bb ? bb.khxm : this.name,
            khdh: bb ? bb.khdh : this.phone,
            jjrqy: this.jingjiren.dept_name,
            jjrxm: this.jingjiren.login_name,
            jjrdh: util.getLocalStorage('phone'),
            dfsj: bb ? bb.dfsj : this.date,
            type: bb ? 'result' : 'share'
          }
        })
      },
      openDatePicker(){
        let date = new Date(), dateHalf = '', valueIndex=[];
        if(this.date){
          let arr = this.date.split(' ');
          date = new Date(arr[0].replace(/[年|月|日]/g,'/'));
          dateHalf = arr[1]
        }

        let yearData = [], nowYear = new Date().getFullYear();
        for(let i = nowYear; i <= nowYear + 15; i++) {
          if(date.getFullYear() == i) valueIndex.push(i - nowYear)
          yearData.push({ id: i, value: i + '年' });
        }

        let monthData = [];
        for(let i = 1; i <= 12; i++) {
          if(date.getMonth() == i - 1) valueIndex.push(i - 1)
          monthData.push({ id: i, value: i + '月' });
        }

        let createDateData = (year,month)=>{
          let list = [], days = new Date(year,month,0).getDate();
          for(let i = 1; i <= days; i++) {
            if(date.getDate() == i) valueIndex.push(i-1)
            list.push({ id: i, value: i + '日' });
          }
          return list
        }

        let dateData = createDateData(date.getFullYear(), date.getMonth() + 1)

        let dayHalfData = [{ id: 1, value: '上午'},{ id: 2, value: '下午'}];
        valueIndex.push(dateHalf == '下午' ? 1 : 0)
        console.log( [{ data:yearData },{ data:monthData },{ data:dateData }, {data: dayHalfData}])
        let select = new Select({
          trigger: '#selectDom',
          title: '预计到访时间',
          wheels: [{ data:yearData },{ data:monthData },{ data:dateData }, {data: dayHalfData}],
          position: valueIndex,
          transitionEnd: (indexArr, data)=>{
            if(valueIndex[0] != indexArr[0] || valueIndex[1] != indexArr[1]){
              dateData = createDateData(data[0].id,data[1].id);
              select.locatePosition(2,0);
              select.updateWheel(2,dateData);
              valueIndex = indexArr;
            }
          },
          onHide: ()=>{
            select.mobileSelect.parentNode.removeChild(select.mobileSelect);
          },
          callback: (indexArr, data)=>{
            let selectDate = new Date(data[0].id,data[1].id - 1,data[2].id);
            this.date = selectDate.Format('yyyy年MM月dd日 ') + data[3].value
          }
        });
        select.show();
      },
    }

  }
</script>


<style lang="scss">
  .xinfang-baobei{
    .form{
      padding: .3rem;
      background-color: #fff;
      .person{
        .content{
          line-height: .42rem;
          font-size: .24rem;
          color: #666;
          margin-right: .3rem;
        }
      }
      .item{
        display:flex;
        align-items: center;
        height: .8rem;
        .lable{
          color: #666;
          min-width: 2rem;
        }
        .input{
          height: .6rem;
          flex: 1;
          border: 1px solid #efefef;
        }
        .select{
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
      .btn-commit{
        display: flex;
        flex: 1;
        height: 0.8rem;
        align-items: center;
        justify-content: center;
        font-size: 0.3rem;
        color: #fff;
        margin: .3rem 0;
        background-color: #00ae66;
      }
    }
    .list-wrapper{
      margin-top: .3rem;
      background-color: #fff;
      .title{
        font-size:.32rem;
        line-height: .45rem;
        padding: .3rem .3rem .2rem;
      }
      .item{
        position:relative;
        display: flex;
        align-items: center;
        padding: .2rem .3rem;
        border-top:1px solid #efefef;
        .xing{
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 0.03rem;
          margin-right: .3rem;
          width: .7rem;
          height: .7rem;
          border-radius: 50%;
          border: .1rem solid #00ae66;
        }
        .right{
          flex:1;
        }
        .status{
          position: absolute;
          right: .3rem;
          top: .2rem;
          padding: 0.13rem .2rem .1rem;
          border-radius: .1rem;
          color: #fff;
          font-size: .24rem;
          line-height: .24rem;
          background-color: #00ae66;
        }
        .text-1{
          color: #333;
          font-size: .32rem;
          line-height: .45rem;
        }
        .text-2{
          color: #999;
          font-size: .24rem;
          line-height: .36rem;
        }
        .text-3{
          padding-top: .1rem;
          color: #333;
          font-size: .3rem;
          line-height: .42rem;
        }
      }
    }
  }
  #selectDom{
    display: none;
  }
</style>
