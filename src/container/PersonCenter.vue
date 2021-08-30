<template>
  <div class="personcenter">
    	<div class="wall">
        <img class="icon-avater" src="../images/avater_default.png" >
    		<router-link class="user-operate" v-if="isShow" :to="{name:'login',query:{back:true}}">
    			<span class="btn-login">登录</span>
    			<span class="btn-register" >注册</span>
    		</router-link>
    	</div>

    	<ul class="user-nav">
    		<li v-for="nav in navList" @click="skip(nav)" v-if="isShowNav(nav)">
    			<span class="nav-icon" :style="{'backgroundPositionY': -0.3 * nav.iconIndex + 'rem'}"></span>
    			<div class="nav">
            {{nav.title}}
          </div>
    		</li>
    	</ul>
      <div class="bottom">
        <router-link v-if="!isShow" class="btn-exit" :to="{name:'login',query:{back:true}}">退出登录</router-link>
      </div>
  </div>
</template>
<script>
  import util from '../common/util.js'
  export default {
    data () {
      return {
        isShow: !util.getLocalStorage('phone'),
        navList:[
          {id:0,title:'我关注的二手房',iconIndex:0,show:true,isLogin:true,type:'2',name:'list',query:{type:'guanzhu'}},
          {id:1,title:'我关注的新房',iconIndex:0,show:true,isLogin:true,type:'1',name:'list',query:{type:'guanzhu'}},
          {id:2,title:'我关注的租房',iconIndex:0,show:true,isLogin:true,type:'3',name:'list',query:{type:'guanzhu'}},
          {id:11,title:'我看过的房源',iconIndex:0,show:true,isLogin:true,type:'',name:'renwumydakalist',query:{}},
          {id:3,title:'我打卡的二手房',iconIndex:3,show:false,isLogin:true,type:'2',name:'mycheckin',query:{}},
          {id:5,title:'我打卡的租房',iconIndex:3,show:false,isLogin:true,type:'3',name:'mycheckin',query:{}},
          {id:6,title:'我的二手房',iconIndex:1,show:false,isLogin:true,type:'2',name:'myhouse',query:{}},
          {id:7,title:'我的租房',iconIndex:1,show:false,isLogin:true,type:'3',name:'myhouse',query:{}},
          {id:8,title:'我的客源',iconIndex:1,show:false,isLogin:true,type:'3',name:'custommanager',query:{}},
          {id:9,title:'我的合同列表',iconIndex:1,show:false,isLogin:true,type:'',name:'contractList',query:{}},
          {id:10,title:'我的两书',iconIndex:1,show:false,isLogin:true,type:'',name:'liangshucontractList',query:{}}
        ],
      }
    },
    created(){
      this.$store.commit('changeTitle','我的');
      util.hideLoading();
    },
    methods:{
      isShowNav(nav){
        if([3,5,6,7,8,9,10].includes(nav.id) && this.$store.state.isManager){
          return true
        }
        return nav.show;
      },
      skip(nav){
        if(!util.getLocalStorage('phone') && nav.isLogin){
          this.$router.push({name:'login',query:{back:true}});
          return;
        }
        this.$router.push({name:nav.name,params:{type:nav.type},query: nav.query})
      }
    }
  }
</script>

<style lang="scss">
    .personcenter{
      padding-bottom:1.3rem;
      .wall{
          position: relative;
          height: 4rem;
          background-image: url(../images/person-bg-head.png);
          background-size:100% auto;
          background-position: left bottom;
          padding-top: 0.8rem;
      }
      .icon-avater{
          display: block;
          margin: 0 auto;
          width: 1rem;
          height: 1rem;
      }
      .user-operate{
          padding-top:0.4rem;
          display:flex;
          justify-content:center;
      }
      .btn-login,.btn-register{
          display: block;
          width: 1.78rem;
          height: 0.74rem;
          line-height: 0.74rem;
          text-align: center;
          border:1px solid #fff;
          font-size: 0.3rem;
          color: #fff;
          margin:0 0.15rem;
      }
      .bottom{
        position: fixed;
        left:0; right: 0;
        bottom:0;
        padding: .3rem;
        background-color:#f5f5f5;
        .btn-exit{
          display: block;
          height: 0.7rem;
          line-height: 0.7rem;
          text-align: center;
          border:1px solid #e22626;
          font-size: 0.3rem;
          color: #e22626;
          background-color: #fff;
        }
      }

      ul.user-nav{
          position: relative;
          border-top: 1px solid #e5e5e5;
          border-bottom:  1px solid #e5e5e5;
          background-color: #fff;
          padding:0;
          margin: 0.3rem 0 0;
          li{
              display:flex;
              height: 1rem;
              align-items:center;
          }
          li:last-child{
              .nav{border-bottom:none}
          }
          .nav-icon{
              display:block;
              width:1rem;
              height:0.3rem;
              background-image:url(../images/user-nav.png);
              background-repeat: no-repeat;
              background-size: 0.3rem auto;
              background-position-x:center;
              background-position-y:0;
          }
          .nav{
              display:flex;
              flex: 1;
              line-height: 1rem;
              border-bottom: 1px solid #e5e5e5;
              align-items:center;
              background-image: url(../images/arrow-right-666.png);
              background-size: .4rem auto;
              background-repeat: no-repeat;
              background-position: center right .3rem;
          }

      }

    }
</style>
