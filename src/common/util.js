import {version} from '../../package.json';
import gps from './gps';

let util  = {
  isWeixin: navigator.userAgent.toLowerCase().match(/MicroMessenger/i)=="micromessenger",
  isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  // isTest: location.href.indexOf(".d.edaijia") !== -1,
  pageSize: 10,
};

util.closest = (el, selector)=> {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        el = el.parentElement;
    }
    return el;
}

function createCallbackUrl() {
  var localHref = location.href.split('#')[0];
  if (localHref.indexOf("?") === -1 || location.search.indexOf('code=') === -1) {
    return encodeURIComponent(localHref);
  } else {
    var args = location.search.substring(1).split("&");
    var search = [];
    for (var i = 0; i < args.length; i++) {
      if (args[i].indexOf('=') == -1) {
        search.push(args[i]);
      } else {
        if (args[i].split('=')[0] != 'code' && args[i].split('=')[0] != 'state') {
          search.push(args[i]);
        }
      }
    }
    return encodeURIComponent(localHref.slice(0, localHref.indexOf("?")) + '?' + search.join('&'));
  }
}

util.urlGet = function() {
  var args = {};
  var query = location.search.substring(1);
  var pairs = query.split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos == -1) continue;
    var argname = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    value = decodeURIComponent(value);
    args[argname] = value;
  }
  return args;
}

util.changeTitle = function(title){
  if (document.title != title) {
    document.title = title;
  }
}

util.stringify = data=>{
  let result =[];
  Object.keys(data).forEach(function(key) {
    result.push(key+"="+encodeURIComponent(data[key]));
  })
  return result.join('&');
}

util.verify = {
  phone:/^[1]\d{10}$/,
  captcha:/^[A-Za-z0-9]+$/,
}

let storageKey = "jinchengfuye_" + version + "_";
util.setSessionStorage = function(key,value){
  sessionStorage.setItem(storageKey + key,value);
}
util.getSessionStorage = function(key){
  return sessionStorage.getItem(storageKey + key);
}
util.removeSessionStorage = function(key){
  sessionStorage.removeItem(storageKey + key)
}

util.setLocalStorage = function(key,value){
  localStorage.setItem(storageKey + key,value);
}
util.getLocalStorage = function(key){
  return localStorage.getItem(storageKey + key);
}
util.removeLocalStorage = function(key){
  localStorage.removeItem(storageKey + key)
}

util.showToast = function(text){
  var div = document.createElement("div");
  div.setAttribute("class", "container-toast");
  div.innerHTML = text;
  document.body.appendChild(div);
  div.style.opacity = 1;
  setTimeout(function(){
    document.body.removeChild(div);
  },1500)
}

util.createConfirm = function(title) {
  return new Promise((resolve, reject) => {
    let content = `<div class="confirm-inner">
      <div class="title">${title}</div>
      <div class="btns">
        <div class="btn-cancle">取消</div>
        <div class="btn-ok">确定</div>
      </div>
    </div>`
    var div = document.createElement("div");
    div.setAttribute("class", "confirm-layer");
    div.innerHTML = content;
    document.body.appendChild(div);
    div.querySelector('.btn-ok').addEventListener('click',function(){
      resolve(true);
      document.body.removeChild(div);
    },{once:true})
    div.querySelector('.btn-cancle').addEventListener('click',function(){
      resolve(false);
      document.body.removeChild(div);
    },{once:true})
  })
}

util.createAlert = function(title,btnText) {
  return new Promise((resolve, reject) => {
    let content = `<div class="confirm-inner">
      <div class="title">${title}</div>
      <div class="btns">
        <div class="btn-ok">${btnText}</div>
      </div>
    </div>`
    var div = document.createElement("div");
    div.setAttribute("class", "confirm-layer");
    div.innerHTML = content;
    document.body.appendChild(div);
    div.querySelector('.btn-ok').addEventListener('click',function(){
      resolve(true);
      document.body.removeChild(div);
    },{once:true})
  })
}


util.showLoading = function(){
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').style.opacity = 1;
}
util.hideLoading = function(){
  document.getElementById('loading').style.display = 'none';
}

util.jsApiList = [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'];


util.numberRecoverChinese = function(str) {
  var num = parseFloat(str);
  var strOutput = "",
      strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
  num += "00";
  var intPos = num.indexOf('.');
  if (intPos >= 0){
      num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
  }
  strUnit = strUnit.substr(strUnit.length - num.length);
  for (var i=0; i < num.length; i++){
      strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
  }
  return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")
}

util.getLocation = function(){
  return new Promise((resolve,reject)=>{
    if(window.injectedObject){
      window.setAddress = (obj)=>{
        let res = JSON.parse(obj)
        resolve({ lat: res.lalatitudet, lng: res.longitude });
      }
      window.injectedObject.getAddress();
    }else if(util.isWeixin){
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: res => {
          let coord = gps.wgs84togcj02(res.longitude,res.latitude);
          coord = gps.gcj02tobd09(coord[0],coord[1]);
          resolve({lat: coord[1], lng: coord[0]});
        },
        fail: res=>{
          reject()
        }
      })
    }else{
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(result){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          resolve(result.point);
        }else {
          reject()
        }
      });
    }
  })
}

export default util;
