import Vue from 'vue'
import Vuex from 'vuex'



Vue.use(Vuex)
let state = {
  loadMore:{
    page:1,
    scrollStatu:'unload',
  },
  isLogin:false,
  title:'',
  isManager: false
};
let mutations = {
  changeLoadMore(state,loadMore){
    state.loadMore = Object.assign({},state.loadMore,loadMore);
  },
  userLoginStatus(state,status){
    state.isLogin = status;
  },
  changeTitle(state,title){
    state.title = title
  },
  changeAgent(state,isManager){
    state.isManager = isManager
  }
};


let actions ={};
let getters = {};
let modules ={};

export default new Vuex.Store({state,actions,mutations,getters,modules});
