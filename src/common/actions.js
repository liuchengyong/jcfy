import axios from 'axios';
import util from './util.js';

let baseUrl = '//wx.beijinghome.cc/';

let request = function(options,isHideLoading = false){
  options = Object.assign({
      method: 'GET',
      timeout: 20000,
    },options);
  options.url = baseUrl +  options.url;
  if(options.method == 'GET'){
    options.url += "?" + util.stringify(options.data)
    delete options.data
  }else{
    options.data = util.stringify(options.data)
  }
  isHideLoading ? '' : util.showLoading();
  return axios(options)
  .then(function(res){ // 服务器状态判断
    isHideLoading ? '' : util.hideLoading();
    if(res.status == 200){
      return res.data;
    }else{
      util.showToast("网络异常，请稍后重试");
    }
  })
}

let service = (options,isHideLoading) =>{
  options.data = Object.assign({},options.data,{api_name:options.url});
  options.url = 'Contract/api/fangwu.do';
  return request(options,isHideLoading);
}

let renwu = (options,isHideLoading) =>{
  options.data = Object.assign({},options.data,{
    api_name:options.url,
    login_id: util.getLocalStorage('userid')
  });
  options.url = 'Contract/api/renwu';
  return request(options,isHideLoading);
}

let renwuActions = {
  addRenWu(data){ // 添加任务
    return renwu({url:'add_renwu',method:"POST",data})
  },
  getRenWuList(data){ // 获取任务列表
    return renwu({url:'page_renwu',method:"POST",data})
  },
  deleteRenWu(data){
    return renwu({url:'del_renwu',method:"POST",data})
  },
  updateRenWu(data){
    return renwu({url:'update_renwu',method:"POST",data})
  },
  compelteRenWn(data){
    return renwu({url:'rw_fang_wcdk',method:"POST",data})
  },
  renWnOk(data){
    return renwu({url:'rw_fang_khqr',method:"POST",data})
  },
  renWuFangDaKa(data){
    return renwu({url:'rw_fang_daka',method:"POST",data})
  },
  renWuFangList(data){
    return renwu({url:'page_renwu_fangwu',method:"POST",data})
  },
  renWuAddFangJiHua(data){
    return renwu({url:'rw_fang_add',method:"POST",data})
  },
  renWuAddFangJiHuaPeiKanRen(data){
    return renwu({url:'rw_fang_pkr',method:"POST",data})
  },
  deleteRenWuFangJiHua(data){
    return renwu({url:'rw_fang_del',method:"POST", data})
  },
  fpRenWu(data){
    return renwu({url:'fp_renwu',method:"POST", data})
  },
  getFpRenWuList(data){
    return renwu({url:'page_fp_renwu',method:"POST", data})
  },
  deleteFpRenWu(data){
    return renwu({url:'del_fp_renwu',method:"POST", data})
  },
  searchJinJiRen(data,isHideLoading){
    return renwu({url:'getalljjr',method:"POST", data},isHideLoading)
  },
  page_woqueren_fangwu(data){
    return renwu({url:'page_woqueren_fangwu',method:"POST", data})
  },
  add_tiren_renwu(data){
    return renwu({url:'add_tiren_renwu',method:"POST", data})
  },
  page_phone(data){
    return renwu({url:'page_phone',method:"POST", data})
  },
  action_phone(data){
    return renwu({url:'action_phone',method:"POST", data})
  },
  rw_fang_pkr(data){
    return renwu({url:'rw_fang_pkr',method:"POST", data})
  },
  renwu_page_fangwu(data){
    return renwu({url:'page_fangwu',method:"POST",data},data.page_number != 1)
  },
  page_pkr(data){
    return renwu({url:'page_pkr',method:"POST",data})
  }
}



let contract = (options,isHideLoading) =>{
  let table_type = '';
  if(location.href.indexOf('/liangshu/') != -1){
    table_type = 'liangshu'
  }
  options.data = Object.assign({},options.data,{api_name:options.url, table_type: table_type });
  options.url = 'Contract/api/fangwu.do';
  return request(options,isHideLoading);
}

let contractActions = {
  getHtParams(data){
    return contract({url:'api_ht_col',method:"POST",data})
  },
  commitHt(data,isHideLoading){
    return contract({url:'api_save_ht',method:"POST",data},isHideLoading)
  },
  getHtList(data){
    return contract({url:'api_ht_view_info',method:"POST",data})
  },
  publishHt(data){
    return contract({url:'ht_submit',method:"POST",data})
  },
  getUserInfoById(data,isHideLoading){
    return contract({url:'api_get_userinfo',method:"POST",data},isHideLoading)
  },
  getHtDx(data){
    return contract({url:'api_ht_dx',method:"POST",data})
  },
  cancleHt(data){
    return contract({url:'api_chexiao_ht',method:"POST",data})
  },
  lockHt(data){
    return contract({url:'api_suoding',method:"POST",data})
  },
  isLockHt(data){
    return contract({url:'api_check_suoding',method:"POST",data})
  },
  uploadHtImage(data){
    return contract({url:'api_ht_pic',method:"POST",data})
  },
  getHtImages(data){
    return contract({url:'api_ht_viewpic',method:"POST",data})
  },
  deleteHtImage(data){
    return contract({url:'api_ht_delpic',method:"POST",data})
  },
  unLockHt(data){
    return contract({url:'cancel_ht',method:"POST",data})
  },
  getHtProgress(data){
    return contract({url:'view_ht_jd',method:"POST",data})
  },
  perfectHt(data){
    return contract({url:'api_ht_bc',method:"POST",data})
  },
  getYezhuInfo(data){
    return contract({url:'api_get_yzinfo',method:"POST",data})
  },
  contract_pic(data){
    return service({url:'contract_pic',method:"POST",data})
  }
}


let yaoshi = (options,isHideLoading) =>{
  options.data = Object.assign({},options.data,{
    api_name:options.url,
    login_id: util.getLocalStorage('userid')
  });
  options.url = 'Contract/api/yaoshi';
  return request(options,isHideLoading);
}

let yaoshiActions = {
  page_yaoshi_woshou(data){ //
   return yaoshi({url:'page_yaoshi_woshou',method:"POST",data},data.page_number != 1)
  },
  page_yaoshi_jingshou(data){
    return yaoshi({url:'page_yaoshi_jingshou',method:"POST",data},data.page_number != 1)
  },
  page_yaoshi_jingshoubyids(data){
    return yaoshi({url:'page_yaoshi_jingshoubyids',method:"POST",data})
  },
  yaoshi_lingyong(data){
    return yaoshi({url:'yaoshi_lingyong',method:"POST",data})
  },
  yaoshi_daka(data){
    return yaoshi({url:'yaoshi_daka',method:"POST",data})
  },
  fang_lingyong(data){
    return yaoshi({url:'fang_lingyong',method:"POST",data})
  },
  zhaopin_list(data){
    return yaoshi({url:'zhaopin_list',method:"POST",data})
  },
  zhaopin_info(data){
    return yaoshi({url:'zhaopin_info',method:"POST",data})
  },
  insertfenxiang(data){
    return yaoshi({url:'insertfenxiang',method:"POST",data})
  },
  viewfenxiang(data){
    return yaoshi({url:'viewfenxiang',method:"POST",data})
  },
  check_yaoshi(data){
    return yaoshi({url:'check_yaoshi',method:"POST",data})
  }
}

let xinfang = (options,isHideLoading) =>{
  options.data = Object.assign({},options.data,{
    api_name: options.url,
  });
  options.url = 'Contract/api/xinfang';
  return request(options,isHideLoading);
}

let xinfangActions = {
  page_fangwu(data){
    return xinfang({url:'page_fangwu',method:"POST",data},data.page_number != 1)
  },
  fangwu_info(data){
    return xinfang({url:'fangwu_info',method:"POST",data})
  },
  fangwu_pic(data){
    return xinfang({url:'fangwu_pic',method:"POST",data})
  },
  bb_list(data){
    return xinfang({url:'bb_list',method:"POST",data})
  },
  add_baobei(data){
    return xinfang({url:'add_baobei',method:"POST",data})
  },
  lxr_list(data){
    return xinfang({url:'lxr_list',method:"POST",data})
  },
  bb_fx(data){
    return xinfang({url:'bb_fx',method:"POST",data})
  }

}

let appapi =  (options,isHideLoading) =>{
  options.data = Object.assign({},options.data,{
    api_name: options.url,
  });
  options.url = 'Contract/api/appapi';
  return request(options,isHideLoading);
}

let appApiActions = {
  getSSO(login_id){ // 获取app基本信息
    return appapi({url:'sso',method:"POST", data: {login_id:login_id,token:'jcfyappkey'}})
  },
}



let actions = {
  getJsSDKConfig(){ // 获取jssdk config
    return request({url:"Contract/api/sdk.do",method:"POST",data:{url:location.href.split('#')[0]}})
  },
  getOpenId(){ // 获取 openId
    let obj = util.urlGet();
    return request({url:"Contract/api/openid.do",method:"POST",data:{code:obj.code}})
  },
  addLog(data){
    return service({url:'insert',data});
  },
  getBaseConfig(data){
    return service({url:'dic',method:"POST",data})
  },
  getHouseList(data){
     return service({url:'infolist',method:"POST",data},data.page_number != 1)
  },
  getHouseDetail(fangwu_id,type){
    return service({url:'info',method:"POST", data:{fangwu_id,type,openid:util.getLocalStorage('phone') || ''}});
  },
  getHouseDaikan(id){
    return service({url:'daikan',method:"POST", data:{fangwu_id:id}});
  },
  getHouseXiangSi(id,type){
    return service({url:'xiangsi',method:"POST", data:{fangwu_id:id,type}});
  },
  getHouseJingJiRen(id){
    return service({url:'jingjiren',method:"POST", data:{fangwu_id:id}});
  },
  getCaptcha(phone){
    return service({url:'yanzhengma',method:"POST", data:{phone}});
  },
  login(phone){
    return service({url:'phone',method:"POST", data:{phone,openid:util.getLocalStorage('openid')}});
  },
  attention(id,type,is_cancel){
    return service({url:'guanzhu',method:"POST", data:{action:'guanzhu',model_id:id,model:type,is_cancel,openid:util.getLocalStorage('phone')}});
  },
  publish(xq_name,loudong,danyuan,menpaihao,type){
    return service({url:'zhuce',method:"POST", data:{xq_name,loudong,danyuan,menpaihao,type,openid:util.getLocalStorage('phone')}});
  },
  checkPhone(){
    return service({url:'checkphone',method:"POST", data:{openid:util.getLocalStorage('openid')}});
  },
  getUserInfo(phone){
    return service({url:'userinfo', method:"POST", data:{phone}});
  },
  haveGenjin(){
    return service({url:'phone_check', method:"POST", data:{ user_id:util.getLocalStorage('userid') }});
  },
  getYezhu(id){ // 获取 openId
    return service({url:"yezhuinfo",data:{fangwu_id:id, phone:util.getLocalStorage('phone')}})
  },
  commitGenJin(data){
    return service({url:"genjin",method:"POST", data:data})
  },
  commitPhone(phone,dk_type){ // 打卡 验证手机号
    return service({url:"ky_phone",method:"POST", data:{phone,dk_type,openid:util.getLocalStorage('openid')}})
  },
  getHouseListByLoc(data){ // 返回附近房源
    return service({url:"ky_fujin",method:"POST", data:data})
  },
  getJingJiRenCheckIn(type){
    return service({url:"dakalist",method:"POST", data: { type, user_id:util.getLocalStorage('userid')}})
  },
  commitJingJiRenCheckIn(phone,dk_type,fangwu_id,type,y_count,x_count){
    return service({url:"ky_daka",method:"POST", data:{phone,dk_type,fangwu_id,type,x_count,y_count,user_id:util.getLocalStorage('userid')}})
  },
  getMyHouseList(data){
    return service({url:'jjrinfolist',method:"POST",data},data.page_number != 1)
  },
  getMyCustom(data){// 获取我的客源
    return service({url:'api_ky_list',method:"POST",data},data.page_number != 1)
  },
  getKyDaKa(data){// 获取我的客源打卡信息
    return service({url:'api_ky_dakalist',method:"POST",data})
  },
  getKyGenJin(data){// 获取我的客源跟进信息
    return service({url:'api_ky_genjinlist',method:"POST",data})
  },
  isManager(data){ //是否门店经理
    return service({url:'api_user_role',method:"POST",data})
  },
  exportOpenShare(data){
    return service({url:'api_fangwu_zhuanfa',method:"POST",data})
  },
  getShareList(data){
    return service({url:'api_fangwu_zhuanfalist',method:"POST",data})
  },
  getGenJinList(data){
    return service({url:'fang_gj_list',method:"POST",data})
  },
  getFwDistant(data){
    return service({url:'checkxy',method:"POST",data})
  },
  check_is_fp(data){
    return service({url:'check_is_fp',method:"POST",data})
  },
  ...appApiActions,
  ...renwuActions,
  ...contractActions,
  ...yaoshiActions,
  ...xinfangActions
};

export default actions;






