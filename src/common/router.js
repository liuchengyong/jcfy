import Vue from 'vue'
import Router from 'vue-router'

import Home from '../container/Home.vue'
import Login from '../container/Login.vue'
import PersonCenter from '../container/PersonCenter.vue'
import List from '../container/List.vue'
import Detail from '../container/Detail.vue'
import Publish from '../container/Publish.vue'
import BaiduMap from '../container/Map.vue'
import CheckIn from '../container/CheckIn.vue'
import MyCheckIn from '../container/MyCheckIn.vue'
import MyHouse from '../container/MyHouse.vue'
import CheckLocation from '../container/CheckLocation.vue'
import CustomManager from '../container/CustomManager.vue'
import DaKaGenJin from '../container/DaKaGenJin.vue'
import MyShareList from '../container/MyShareList.vue'
import ContractDetail from '../container/ContractDetail.vue'
import ContractList from '../container/ContractList.vue'
import ContractVerify from '../container/ContractVerify.vue'
import ContractPic from '../container/ContractPic.vue'
import ContractPdf from '../container/ContractPdf.vue'
import GenJinList from '../container/GenJinList.vue'
import VrContainer from '../container/VrContainer.vue'
import VideoContainer from '../container/video.vue'

import RenWu from '../container/renwu/index.vue'
import RenWuList from '../container/renwu/list.vue'
import RenWuCustomer from '../container/renwu/customer.vue'
import RenWuFenPei from '../container/renwu/fenpei.vue'
import RenWuFwDaKa from '../container/renwu/fwdaka.vue'
import RenWuFwList from '../container/renwu/renwufwlist.vue'
import RenWuAllFw from '../container/renwu/allfwlist.vue'
import RenWuPeiKan from '../container/renwu/addpeikan.vue'
import RenWuCreatedQrcode from '../container/renwu/createQrcode.vue'
import RenWuQueRen from '../container/renwu/queren.vue'
import RenWuQueRenVerify from '../container/renwu/querenverify.vue'
import RenWuMyDaKaList from '../container/renwu/mydakalist.vue'


import LiangShuContractDetail from '../container/liangshu/ContractDetail.vue'
import LiangShuContractList from '../container/liangshu/ContractList.vue'
import LiangShuContractVerify from '../container/liangshu/ContractVerify.vue'
import LiangShuContractPic from '../container/liangshu/ContractPic.vue'

import YaoShi from '../container/yaoshi/index.vue'
import YaoShiQrCode from '../container/yaoshi/qrcode.vue'
import YaoShiGuiHuan from '../container/yaoshi/guihuan.vue'

import ZhaoPinList from '../container/zhaopin/index.vue'
import ZhaoPinDetail from '../container/zhaopin/detail.vue'
import ZhaoPinDetailShare from '../container/zhaopin/share.vue'

import XinFangList from '../container/xinfang/list.vue'
import XinFangDetail from '../container/xinfang/detail.vue'
import XinFangPic from '../container/xinfang/pic.vue'
import XinFangBaoBei from '../container/xinfang/baobei.vue'
import XinFangBaoBeiShare from '../container/xinfang/baobeishare.vue'

import wx from 'weixin-jsapi'
import util from '../common/util'
import actions from '../common/actions'

Vue.use(Router)
var router = new Router({
  routes: [
    {
      path: '/',
      name:'home',
      component: Home,
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/login',
      name:'login',
      component: Login,
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/personcenter',
      component: PersonCenter,
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/list/:type',
      name:'list',
      component: List,
      props: true,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/xingfang/list',
      name:'xingfanglist',
      component: XinFangList,
      props: true,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/xingfang/detail',
      name:'xingfangdetail',
      component: XinFangDetail,
    },
    {
      path: '/xingfang/pic',
      name:'xingfangpic',
      component: XinFangPic,
    },
    {
      path: '/xingfang/baobei',
      name:'xingfangbaobei',
      component: XinFangBaoBei,
    },
    {
      path: '/xingfang/baobeishare',
      name:'xingfangbaobeishare',
      component: XinFangBaoBeiShare,
    },
    {
      path: '/detail/:type/:id',
      name:'detail',
      component: Detail,
      props: true,
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/publish',
      name:'publish',
      component: Publish,
      props: true,
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/map/:type/:id',
      name:'map',
      component: BaiduMap,
      props: true,
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/checkin',
      name:'checkin',
      component: CheckIn,
      props: true,
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/my/checkin/:type',
      name:'mycheckin',
      component: MyCheckIn,
      props: true,
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      path: '/my/house/:type',
      name:'myhouse',
      component: MyHouse,
      props: true,
    },
    {
      path: '/checkLocation/:type',
      name:'checklocation',
      component: CheckLocation,
      props: true,
    },
    {
      path: '/custom/manager',
      name:'custommanager',
      component: CustomManager,
      props: true,
    },
    {
      path: '/custom/manager/dakagenjin',
      name:'dakagenjin',
      component: DaKaGenJin,
      props: true,
    },
    {
      path: '/my/share',
      name:'myshare',
      component: MyShareList,
      props: true,
    },
    {
      path: '/contract',
      name: 'contractDetail',
      component: ContractDetail,
      props: true,
    },
    {
      path: '/contract/list',
      name: 'contractList',
      component: ContractList,
      props: true,
    },
    {
      path: '/contract/verify',
      name: 'contractVerify',
      component: ContractVerify,
      props: true,
    },
    {
      path: '/contract/pic',
      name: 'contractPic',
      component: ContractPic,
      props: true,
    },
    {
      path: '/contract/pdf',
      name: 'contractPdf',
      component: ContractPdf,
      props: true,
    },
    {
      path: '/genjinlist',
      name: 'genjinlist',
      component: GenJinList,
      props: true,
    },
    {
      path: '/vr',
      name: 'vr',
      component: VrContainer,
      props: true,
    },
    {
      path: '/video',
      name: 'video',
      component: VideoContainer,
      props: true,
    },
    {
      path: '/renwu',
      name: 'renwu',
      component: RenWu
    },
    {
      path: '/renwu/list',
      name: 'renwulist',
      component: RenWuList
    },
    {
      path: '/renwu/custom',
      name: 'renwucustom',
      component: RenWuCustomer
    },
    {
      path: '/renwu/fenpei',
      name: 'renwufeipei',
      component: RenWuFenPei
    },
    {
      path: '/renwu/fwdaka',
      name: 'renwufwdaka',
      component: RenWuFwDaKa
    },
    {
      path: '/renwu/fwlist',
      name: 'renwufwlist',
      component: RenWuFwList
    },
    {
      path: '/renwu/allfw',
      name: 'renwuallfw',
      component: RenWuAllFw
    },
    {
      path: '/renwu/peikanren',
      name: 'renwupeikanren',
      component: RenWuPeiKan
    },
    {
      path: '/renwu/createdqrcode',
      name: 'renwucreatedqrcode',
      component: RenWuCreatedQrcode
    },
    {
      path: '/renwu/qr',
      name: 'renwuqueren',
      component: RenWuQueRen
    },
    {
      path: '/renwu/qr/verify',
      name: 'renwuquerenverify',
      component: RenWuQueRenVerify
    },
    {
      path: '/renwu/my/daka/list',
      name: 'renwumydakalist',
      component: RenWuMyDaKaList
    },
    {
      path: '/liangshu/contract',
      name: 'liangshucontractDetail',
      component: LiangShuContractDetail,
      props: true,
    },
    {
      path: '/liangshu/contract/list',
      name: 'liangshucontractList',
      component: LiangShuContractList,
      props: true,
    },
    {
      path: '/liangshu/contract/verify',
      name: 'liangshucontractVerify',
      component: LiangShuContractVerify,
      props: true,
    },
    {
      path: '/liangshu/contract/pic',
      name: 'liangshucontractPic',
      component: LiangShuContractPic,
      props: true,
    },
    {
      path: '/yaoshi',
      name: 'yaoshi',
      component: YaoShi
    },
    {
      path: '/yaoshi/qrcode',
      name: 'yaoshiqrcode',
      component: YaoShiQrCode
    },
    {
      path: '/yaoshi/guihuan',
      name: 'yaoshiguihuan',
      component: YaoShiGuiHuan
    },
    {
      path: '/zhaopin/list',
      name: 'zhaopinlist',
      component: ZhaoPinList
    },
    {
      path: '/zhaopin/detail',
      name: 'zhaopindetail',
      component: ZhaoPinDetail
    },
    {
      path: '/zhaopin/detail/share',
      name: 'zhaopindetailshare',
      component: ZhaoPinDetailShare
    }
  ]
})



let sharePath = ['list','home','detail','xingfangdetail','xingfangbaobeishare'];
let shareOption = function(){
  let prefix = util.getLocalStorage('manager') == 'true' ? util.getLocalStorage('phone') : '';
  return {
    title: "二手房_租房(北京京西找房)" + prefix,
    desc: "京西找房是一家以二手房买卖、房屋租赁等房地产经纪企业。找北京市门头沟区及石景山区的房源请来京西找房网站。真实房源，房屋实景照片。" + prefix,
    link: location.origin + "/?" +  util.stringify({sharePath: location.hash,contact: prefix}),
    imgUrl: "http://phone.jcfyht.cc/logo.png", // 分享图标
  }
}
router.beforeEach((to, from, next) => {
  if(util.isWeixin){
    actions.getJsSDKConfig().then(res=>{
      res.jsApiList = util.jsApiList;
      wx.config(res);
      wx.ready(()=>{
        wx.hideOptionMenu();
        if(sharePath.includes(to.name)){
          wx.showMenuItems({
            menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
          });
          wx.onMenuShareAppMessage(shareOption());
          wx.onMenuShareTimeline(shareOption());
        }
        next();
      });
    });
  }else{
    next();
  }
})

export default router
