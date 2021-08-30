import Vue from 'vue'
import store from './store/'
import router from './common/router'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import * as svgicon from 'vue-svgicon'
import './icons'

import Index from './container/index.vue'

import util from './common/util'
import actions from './common/actions'
import filter from './common/filter.js'

import hevueImgPreview from 'hevue-img-preview'


Vue.use(VueAwesomeSwiper)
Vue.use(svgicon)
Vue.use(hevueImgPreview)


Object.keys(filter).forEach(key => {
    Vue.filter(key, filter[key])
})


let screenY = 0, loc = 'top',$target = null;
document.body.addEventListener('touchstart',event =>{
  screenY = event.changedTouches[0].screenY;
  if(!event._target){
    loc = 'stop';
  }else{
    $target = util.closest(event.target,event._target)
    if(!$target){
      loc = 'stop'
    }else{
      if($target.scrollTop == 0 && $target.scrollHeight == $target.clientHeight){
        loc = 'stop'
      }else if($target.scrollTop == 0){
        loc = 'top'
      }else if($target.scrollTop == $target.scrollHeight - $target.clientHeight){
        loc = 'bottom'
      }else{
        loc = 'other'
      }
    }
  }
})

document.body.addEventListener('touchmove',function(event){
  if($target){
    if(loc == 'stop'){
      event.preventDefault();
    }else if(loc == 'bottom' && event.changedTouches[0].screenY - screenY < 0){
      event.preventDefault();
    }else if(loc == 'top' && event.changedTouches[0].screenY - screenY > 0){
      event.preventDefault();
    }
  }else{
    event.preventDefault();
  }
},false)


let obj = util.urlGet();
let start = ()=>{
    if(util.getLocalStorage('phone')){
      store.commit('userLoginStatus',true);
    }
    if(util.getLocalStorage('manager') == "true"){
      store.commit('changeAgent',true)
    }
    exportOpenShareRecord();

    if(location.hash == '#/'){
      location.hash = obj.sharePath || '';
    }
    new Vue({
        el: '#app',
        store,
        router,
        template: '<index />',
        components: {Index},
    })
}

function exportOpenShareRecord(){
  if(obj.fwId && obj.shareId){
    if(util.getLocalStorage('manager') == "true" && util.getLocalStorage('userid') == obj.shareId) return;
    if(!util.getLocalStorage('openid')) return;
    actions.exportOpenShare({
      fangwu_id: obj.fwId,
      send_userid: obj.shareId,
      receive_openid: util.getLocalStorage('openid'),
      xingming: util.getLocalStorage('xingming'),
      touxiang: util.getLocalStorage('touxiang')
    })
  }
}

function lhref(){
  let params = Object.assign({},obj);
  delete params.code
  delete params.state
  return encodeURIComponent(location.origin + "/?" + util.stringify(Object.assign(params,{
    sharePath: obj.sharePath ? obj.sharePath : location.hash,
    contact: obj.contact || '',
  })));
}

if(!util.isWeixin){
  if(util.getLocalStorage('userid')){
    start();
  }else {
    actions.getSSO(obj.loginId).then(res=>{
      if(res.phone){
        util.setLocalStorage('openid',res.openid)
        util.setLocalStorage('phone',res.phone)
        util.setLocalStorage('userid',res.user_id || '')
        util.setLocalStorage('xingming',res.xingming)
        util.setLocalStorage('touxiang',res.touxiang)
        util.setLocalStorage('manager',res.is_ywy == 'yes')
        start();
      }else{
        localStorage.clear()
        alert('用户不存在')
      }
    })
  }
}else{
  if(util.getLocalStorage('userid')){
    start();
  }else if(obj.code){
    actions.getOpenId().then(res=>{
      if(res.openid){
        util.setLocalStorage('openid',res.openid)
        util.setLocalStorage('phone',res.phone || '')
        util.setLocalStorage('userid',res.user_id || '')
        util.setLocalStorage('manager',res.is_ywy == 'yes')
        util.setLocalStorage('xingming',res.xingming)
        util.setLocalStorage('touxiang',res.touxiang)
        start();
      }else{
        localStorage.clear()
        window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed7fc8d611d39d34&redirect_uri=" + lhref() + "&response_type=code&scope=snsapi_userinfo&state=null#wechat_redirect")
      }
    })
  }else{
    localStorage.clear()
    window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed7fc8d611d39d34&redirect_uri=" + lhref() + "&response_type=code&scope=snsapi_userinfo&state=null#wechat_redirect")
  }
}










