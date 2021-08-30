<template>
  <div :class="['detail',type == 2 || type == 3 ? 'detail1' : 'detail2']">
    <div v-if="detail.status == '01' || (detail.status == '00' && isManager)">
      <swiper :class="[type == 1 ? 'swiper1' : 'swiper']" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
        <swiper-slide v-for="(pic,index) in detail.pic_list" :key='pic.pic_path'>
          <img class="swiper-image" :src="pic.pic_path"  @click="showImagePreview(pic.pic_path,'pic')">
          <img class="vr" v-if="index == 0 && detail.vr_addr && detail.is_vr == '是'" src="../images/vr.png" @click="gotoVr(detail.vr_addr)"/>
        </swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>

      <div v-show="type == 2 || type == 3" class='detail-info'>
        <div class="title">{{detail.xiaoqumingcheng_id}}</div>
        <div class="base_previes">
          <div><span class="lable">{{['售价','租金'][type-2]}}</span><span class="value">{{detail.shoujia + (type == 2 ? '万元' : '元/月')}}</span></div>
          <div><span class="lable">房型</span><span class="value">{{detail.shi}}室{{detail.ting}}厅</span></div>
          <div><span class="lable">建筑面积</span><span class="value">{{detail.taoneimianji}}m&sup2;</span></div>
        </div>
        <div class="tags" v-if="detail.biaoqian && detail.biaoqian.length > 0">
            <span class="tag" v-for="(tag,index) in detail.biaoqian" :key="index">{{tag.name}}</span>
        </div>
        <div v-if="type == 3" class="zf-base">
          <span v-for="(base,index) in zfBase" :key="index" :class="['base','base' + (index+1),{'had': detail.peizhixinxi && detail.peizhixinxi.includes(base)}]">{{base}}</span>
        </div>
        <div class="info">
          <span class="short" v-if="type == 2"><span class="label">单价：</span>{{Math.floor(detail.shoujia * 10000 / detail.taoneimianji * 100) / 100}}元/平</span>
          <span class="short"><span class="label">朝向：</span>{{detail.chaoxiang_id}}</span>
          <span class="short" v-if="isManager"><span class="label">楼层：</span>{{detail.suozaiceng}}/{{detail.gongjiceng}}</span>
          <span class="short"><span class="label">楼型：</span>{{detail.louxing_id}}</span>
          <span class="short"><span class="label">电梯：</span>{{detail.dianti_id}}</span>
          <span class="short"><span class="label">车位：</span>{{detail.chewei}}</span>
          <span class="short"><span class="label">装修：</span>{{detail.zhuangxiu_id || '暂无'}}</span>
          <span class="short"><span class="label">年代：</span>{{detail.niandai || '暂无'}}</span>
          <span class="short"><span class="label">用途：</span>{{detail.yongtu_id || '暂无'}}</span>
          <span class="short" v-if="isManager"><span class="label">房源编号：</span>{{detail.bianhao || '暂无'}}</span>
          <span class="short" v-if="isManager"><span class="label">发布状态：</span>{{detail.status == '01' ? '已发布' : '未发布'}}</span>
          <span class="short" v-if="isManager"><span class="label">已收定金：</span>{{detail.is_dj == 'yes' ? '已收' : '未收'}}</span>
          <span class="short" v-if="isManager"><span class="label">钥匙位置：</span>{{detail.weizhi|| '暂无'}}</span>
          <span class="long"><span class="label">产权性质：</span>{{detail.chanquansuoyou_id || '暂无'}}</span>
          <span class="long"><span class="label">供暖方式：</span>{{detail.gongnuanfangshi_id || '暂无'}}</span>
          <span class="long"><span class="label">小区：</span>{{detail.xiaoqumingcheng_id || '暂无'}}</span>
          <span class="long"><span class="label">房源状态：</span>{{detail.jiaoyiquanshu_id || '暂无'}}</span>
          <span class="long" v-if="shareContact && jingjiren.length > 0"><span class="label">联系人：</span>{{jingjiren[0].login_name}}</span>
          <span class="long" v-if="shareContact && shareContact.length == 11"><span class="label">联系电话：</span><a :href="'tel:' + shareContact" >{{shareContact}}</a></span>
          <span class="long" v-if="isManager"><span class="label">房源描述：</span>{{detail.miaoshu || '暂无'}}</span>
        </div>
        <div class="huixingfenjian">
          <div class="huixingfenjian_title">户型分间</div>
          <img class="huixingfenjian_img" v-for="(hxt,index) in detail.pic_hxt" :key="index" v-if="index == 0" :src="hxt.pic_path"  @click="showImagePreview(hxt.pic_path,'hxt')"/>
        </div>
        <div class="genduofangyuan" @click="showfangyuanInfoWrapper = true" v-if="type == 2">更多房源信息</div>
        <div class="baidu-map" ref="map" @click="handleMap"></div>

        <!-- <div class="describe" v-if="type == 2 || type == 3">
          <div class="describe_title">房源介绍</div>{{detail.jieshao}}
        </div>
        <div class="zhoubianjieshao" v-if="type == 2">
          <div class="zhoubianjieshao_title">业主自荐</div>{{detail.yezhuzijian}}
        </div>
        <div class="zhoubianjieshao" v-if="type == 2 || type == 3">
          <div class="zhoubianjieshao_title">周边介绍</div>{{detail.zhoubianjieshao}}
        </div>
        <div class="zhoubianjieshao">
          <div class="zhoubianjieshao_title">周边介绍</div>{{detail.zhoubianjieshao}}
        </div> -->

        <div v-if="isManager" class="btn-group">
          <div class="btn-item btn-genjin" @click="goToGenjin">查看跟进</div>
          <div class="btn-item btn-my-share" @click="goToShare">我的分享列表</div>
        </div>

        <div v-if="isManager && ['2'].includes(type)" class="btn-group">
          <div class="btn-item btn-genjin" @click="gotoContract">签署两书</div>
          <div class="btn-item btn-my-share" @click="goToContractList">我的两书合同</div>
        </div>
        <div v-if="isManager && ['3'].includes(type)" class="btn-group">
          <div class="btn-item btn-genjin" @click="gotoContract">发起合同</div>
          <div class="btn-item btn-my-share" @click="goToContractList">我的合同列表</div>
        </div>

        <div v-if="isManager && showShaoShi == 'yes'" class="btn-group">
          <div class="btn-item btn-genjin" @click="yaoshilingong">钥匙领用</div>
        </div>

      </div>

      <div v-show="type == 1">
        <div class="intro">
          <div class="title">{{detail.loupan}}</div>
          <div class="tags">
              <span class="tag" v-for="(tag,index) in detail.biaoqian" :key="index">{{tag.name}}</span>
          </div>
          <div class="price"> 均价：<span class="num">{{detail.junjia}} 元/平</span></div>
          <div class="address"> 户型：{{detail.shi}}市{{detail.ting}}厅{{detail.wei}}卫{{detail.chu}}厨</div>
          <div class="address"> 地址：{{detail.xiangxidizhi}}</div>
          <div class="address"> 开盘：{{detail.shoucikaipanriqi}}</div>
          <div class="address"> 装修：{{detail.zhuangxiu}}</div>
          <div class="address" v-if="shareContact && jingjiren.length > 0" > 联系人：{{jingjiren[0].login_name}}</div>
          <div class="address" v-if="shareContact && shareContact.length == 11"> 联系电话：<a :href="'tel:' + shareContact" >{{shareContact}}</a></div>
        </div>
        <div class="info">
          <div class="title">楼盘信息</div>
          <div class="item"><span class="label">开发商：</span>{{detail.kaifashang}}</div>
          <div class="item"><span class="label">交房时间：</span>{{detail.jiaofangshijian}}</div>
          <div class="item"><span class="label">产权年限：</span>{{detail.chanquannianxian}}</div>
          <div class="genduofangyuan" @click="showXinfangWrapper = true">更多楼盘信息</div>
        </div>
        <div class="huixingfenjian">
          <div class="huixingfenjian_title">户型分间</div>
          <img class="huixingfenjian_img" v-for="(hxt,index) in detail.pic_hxt" :key="index" v-if="index == 0" :src="hxt.pic_path"  @click="showImagePreview(hxt.pic_path,'hxt')"/>
        </div>

        <div class="baidu-map" ref="map2" @click="handleMap"></div>
        <div class="describe">
          <div class="describe_title">户型卖点</div>{{detail.huxingmaidian}}
        </div>
      </div>


      <div class="daikan" v-if="daikan.length != 0">
        <div class="daikan-title">经纪人带看反馈</div>
        <ul>
          <li v-for="(item,index) in daikan" :key="index">
            <div class="daikan-header">
              <div class="daikan-info"><span class="name">{{item.login_name}}</span> 共带看本房{{item.fangbencishu}}次 <br>{{item.daikanshijian}} 带看过</div>
              <a class="daikan-phone" :href="'tel:'+item.user_phone"><svgicon  name="phone" width=".6rem" height=".6rem"></svgicon></a>
              <a class="daikan-sms" :href="'sms:'+item.user_phone"><svgicon  name="sms" width=".6rem" height=".6rem"></svgicon></a>
            </div>
            <!-- <span>{{item.dept_name}}</span> -->
            <div class="daikan-content">{{item.jingjiren_miaoshu}}</div>
          </li>
        </ul>
      </div>

      <div class="xiangsi" v-if="xiangsi.length != 0">
        <div class="xiangsi-title">相似房源</div>
        <house-item v-for="(house,index) in xiangsi" :key="index" :house="house" :type="type" @handleHosue="handleHosue"></house-item>
      </div>
      <!-- 经纪人wrapper -->
      <div class="jingjiren-wrapper" v-if="showJingJiRenWrapper">
        <span class="btn-close" @click="showJingJiRenWrapper = false"></span>
        <div class="jingjiren">
          <div class="jinjiren-title">咨询经纪人</div>
          <ul>
            <li v-for="(item,index) in jingjiren" :key="index" v-if="['房源开发','房源维护'].includes(item.guishukaifa) || shareContact">
              <img v-if="!item.pic_path" class="avater" src="../images/icon-jingjiren.png" />
              <img v-if="item.pic_path" class="avater" :src="'http://wx.jcfyht.cc/Contract/swfupload/files/' +item.pic_path" />
              <div class="jinjiren-info"><span class="name">{{item.login_name}}</span>{{item.dept_name}}</div>
              <span class="jinjiren-xinxika" @click="showXinXiKaImage(item.xxk_path)">信息卡</span>
              <a class="jinjiren-phone" :href="'tel:'+item.user_phone"><svgicon  name="phone" width=".6rem" height=".6rem"></svgicon></a>
              <a class="jinjiren-sms" :href="'sms:'+item.user_phone"><svgicon  name="sms" width=".6rem" height=".6rem"></svgicon></a>
            </li>
          </ul>
        </div>
      </div>
      <!-- 房源信息wrapper -->
      <div class="fangyuaninfo-wrapper" v-if="showfangyuanInfoWrapper">
        <span class="btn-close" @click="showfangyuanInfoWrapper = false"></span>
        <div class="fangyuaninfo-item">
          <div class="fangyuaninfo-item-title">基础信息</div>
          <div class="fangyuaninfo-item-content">房源户型：{{detail.shi}}室{{detail.ting}}厅</div>
          <div class="fangyuaninfo-item-content">套内面积：{{detail.taoneimianji}}m&sup2;</div>
          <div class="fangyuaninfo-item-content">交易状态：{{detail.jiaoyiquanshu_id}}</div>
          <!-- <div class="fangyuaninfo-item-content">公私：{{detail.gongsipan}}</div> -->
          <div class="fangyuaninfo-item-content">现状：{{detail.xianzhuang}}</div>
          <div class="fangyuaninfo-item-content">证件类型：{{detail.zhengjianleixing}}</div>
          <div class="fangyuaninfo-item-content">建成年代：{{detail.niandai}}</div>
          <div class="fangyuaninfo-item-content">产权性质：{{detail.chanquansuoyou_id}}</div>
          <div class="fangyuaninfo-item-content">房屋用途：{{detail.yongtu_id}}</div>
          <div class="fangyuaninfo-item-content">户型结构：{{detail.louxing_id}}</div>
          <div class="fangyuaninfo-item-content">装修：{{detail.zhuangxiu_id}}</div>
          <div class="fangyuaninfo-item-content">电梯：{{detail.dianti_id}}</div>
          <div class="fangyuaninfo-item-content">车位：{{detail.chewei}}</div>
          <div class="fangyuaninfo-item-content">供暖方式：{{detail.gongnuanfangshi_id}}</div>
          <div class="fangyuaninfo-item-title border-top">交易信息</div>
          <div class="fangyuaninfo-item-content">上次交易：{{detail.shangcijiaoyi}}</div>
          <div class="fangyuaninfo-item-content">原过户价：{{detail.yuanguohujia}}万</div>
          <div class="fangyuaninfo-item-content">抵押状况：{{detail.diyazhuangkuang}}</div>
          <div class="fangyuaninfo-item-content">抵押金额：{{detail.diyajiner}}万</div>
          <div class="fangyuaninfo-item-content">土地年限：{{detail.tudinianxian}}</div>
        </div>
      </div>
      <!-- 新房信息 wrapper-->
      <div class="xingfang-wrapper" v-if="showXinfangWrapper">
        <span class="btn-close" @click="showXinfangWrapper = false"></span>
        <div class="xingfang-group first-group">
          <div class="xingfang-item xingfang-item-title">{{loupan.name}}【{{loupan.is_new}}】</div>
          <div class="xingfang-item"><span>楼盘别名</span>{{loupan.bie_name}}</div>
          <div class="xingfang-item"><span>参考价格</span>{{loupan.cankaojiage}}元/m&sup2</div>
          <div class="xingfang-item"><span>房屋用途</span>{{detail.fangwuyongtu}}</div>
          <div class="xingfang-item"><span>物业用途</span>{{loupan.wuyeyongtu}}</div>
          <div class="xingfang-item"><span>电梯费用</span>{{loupan.diantifeiyong}}</div>
          <div class="xingfang-item"><span>梯户比例</span>{{detail.ti}}梯{{detail.hu}}户</div>
          <div class="xingfang-item"><span>楼盘特性</span>{{loupan.loupantexing}}</div>
          <div class="xingfang-item"><span>周边学校</span>{{loupan.zhoubianxuexiao}}</div>
          <div class="xingfang-item"><span>地铁/轻轨</span>{{loupan.ditieqinggui}}</div>
        </div>
        <div class="xingfang-group">
          <div class="xingfang-item"><span>区域位置</span>{{loupan.qx}}</div>
          <div class="xingfang-item"><span>楼盘地址</span>{{loupan.qx}}{{loupan.pq}}{{loupan.jiedao}}</div>
          <div class="xingfang-item"><span>产权</span>{{detail.chanquan}}</div>
          <div class="xingfang-item"><span>楼盘描述</span>{{loupan.loupanmiaoshu}}</div>
          <div class="xingfang-item"><span>楼盘备注</span>{{loupan.loupanbeizhu}}</div>
        </div>
        <div class="xingfang-group">
          <div class="xingfang-item"><span>建筑结构</span>{{loupan.jianzhujiegou}}</div>
          <div class="xingfang-item"><span>土地使用年限</span>{{loupan.tudishiyongnianxian}}</div>
          <div class="xingfang-item"><span>容积率</span>{{detail.rongjilv}}</div>
          <div class="xingfang-item"><span>绿化率</span>{{detail.lvhualv}}</div>
          <div class="xingfang-item"><span>车位比</span>{{detail.cheweibi}}</div>
        </div>
        <div class="xingfang-group">
          <div class="xingfang-item"><span>物业类型</span>{{detail.wuyeleixing}}</div>
          <div class="xingfang-item"><span>物业公司</span>{{detail.wuyegongsi}}</div>
          <div class="xingfang-item"><span>物业费</span>{{detail.wuyefei}}平方米/月</div>
          <div class="xingfang-item"><span>供暖方式</span>{{detail.gongnuanfangshi}}</div>
          <div class="xingfang-item"><span>供水方式</span>{{detail.gongshuileixing}}</div>
          <div class="xingfang-item"><span>供电方式</span>{{detail.gongdianleixing}}</div>
        </div>
        <div class="xingfang-group">
          <div class="xingfang-item"><span>责任部门</span>{{detail.zerenbumen1}}</div>
          <div class="xingfang-item"><span>责任人</span>{{detail.zerenren1 || '暂无'}}</div>
        </div>
      </div>
      <!-- 跟进信息 wrapper-->
      <div class="genjin-wrapper" v-if="showGenJinWrapper">
        <div class="genjin-wrapper-inner">
          <textarea placeholder="请输入跟进信息" v-model="genjin"></textarea>
          <div class="commit-genjin" @click="commitGenJin">提交</div>
        </div>
      </div>


      <div class="share-cover" v-if="showShareCover" @click="showShareCover = false">
        <img src="../images/share-it.png">
      </div>
      <div class="detail-bottom single" v-if="isManager && source == 'near'">
        <span class="btn-daka" @click="daka" >打卡</span>
      </div>
      <div class="detail-bottom" v-else>
        <span class="btn-attention" @click="attention" :style="{color:detail.guanzhu == 0 ? '#999' : '#3385ff'}">
          <svgicon :name="detail.guanzhu == 0 ? 'heart-hollow':'heart'" width=".4rem" height=".4rem" :color="detail.guanzhu == 0 ? '#999' : '#3385ff'"></svgicon>
          <br/>
          关注
        </span>
        <span class="btn-share" @click="showShareCover = true">分享房源</span>
        <span class="btn-jinjiren" v-if="type != 1 " @click="showJingJiRenWrapper = true">咨询经纪人</span>
        <span class="btn-jinjiren" v-if="type != 1 && isManager && !(type == 3 && detail.is_ba == 'yes')" @click="checkFenPan()">联系业主</span>
      </div>
    </div>
    <div class="no-publish" v-if="detail.status == '00' && !isManager">
      亲！房源已失效～～～
    </div>
  </div>
</template>


<script>
	import Vue from 'vue'
	import actions from '../common/actions.js'
	import util from '../common/util.js'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import houseItem from '../component/houseItem.vue'
  import wx from 'weixin-jsapi'
  import gps from '../common/gps.js';
	export default {
		components: { swiper, swiperSlide, houseItem},
  	data () {
      let contact = util.urlGet().contact;
  		return {
      	notNextTick: true,
      	swiperOption: {
	    	  autoplay: 0,
	        direction: "horizontal",
	        pagination: ".swiper-pagination",
		    },
        isManager: util.getLocalStorage('manager') == "true",
        zfBase:[ "热水器","冰箱","空调","电视","沙发","衣柜","烟机灶具","单人床","双人床"],
        loupan:{},
		    detail:{},
		    daikan:[],
		    jingjiren:[],
		    xiangsi:[],
        genjin:'',
        showShareCover:false,
        showJingJiRenWrapper:false,
        showfangyuanInfoWrapper:false,
        showXinfangWrapper:false,
        shareContact:contact,
        showGenJinWrapper:false,
        showShaoShi: 'no'
    	}
 	 	},
    created(){
    	this.getDetail();
    	this.getDaikan();
    	this.getXiangSi();
    	this.getJingJiRen();
      if(this.isManager){
        actions.getUserInfo(util.getLocalStorage('phone')).then(res=>{
            if(res.is_success == 0 && res.content.length > 0){
                this.myInfo = {
                  dept_name:res.content[0].dept_name,
                  login_id:res.content[0].login_id,
                  login_name:res.content[0].login_name,
                  user_phone:res.content[0].login_id
                }
            }
          })
        actions.check_yaoshi({fangwu_id:this.id }).then(res=>{
          if(res.is_success == 0){
            this.showShaoShi = res.content
          }
        })
      }
    },
    computed: {
      id(){
        return this.$route.params.id
      },
      type(){
        return this.$route.params.type
      },
      source(){
        return this.$route.query.type
      }

    },
    mounted(){
    },
    watch: {
      id(){
        this.getDetail();
        this.getDaikan();
        this.getXiangSi();
        this.getJingJiRen();
      }
    },
    updated(){
      if(this.detail && (this.$refs.map || this.$refs.map2) && !this.map){
        let dom = this.$refs.map || this.$refs.map2;
        let point = new BMap.Point(this.detail.x_count || this.detail.x_weizhi , this.detail.y_count || this.detail.y_weizhi);
        let marker = new BMap.Marker(point);        // 创建标注
        this.map = new BMap.Map(dom);
        this.map.centerAndZoom(point, 17);
        this.map.addOverlay(marker);
        this.map.disableDragging();
        this.map.disableDoubleClickZoom();
      }
    },
    methods:{
      gotoVr(url){
        location.href = url;
        // this.$router.push({name:'vr',query:{url}})
      },
      gotoContract(){
        // this.$router.push({name:'contractDetail',query: { fwid: this.id, type: 'add'}})

        actions.isLockHt({ fangwu_id:this.id}).then(res=>{
          if(res.is_success === '0'){
            if(this.type == 2){
              this.$router.push({name:'liangshucontractVerify',query:{id:this.id}})
            }else if(this.type == 3){
              this.$router.push({name:'contractVerify',query:{id:this.id}})
            }
          }else{
            util.showToast(res.is_success)
          }
        })
        // this.$router.push({name:'contractVerify',query:{id:this.id}})
      },
      goToContractList(){
        if(this.type == 2){
          this.$router.push({name:'liangshucontractList'})
        }else if(this.type == 3){
          this.$router.push({name:'contractList'})
        }

      },
      yaoshilingong(){
        util.createConfirm('是否领用钥匙？').then(res=>{
          if(res){
            actions.fang_lingyong({
              fangwu_id: this.id
            }).then(res=>{
              if(res.is_success == '0'){
                util.showToast('领用成功')
              }else{
                util.showToast(res.msg)
              }
            })
          }
        })
      },
      goToShare(){
        this.$router.push({name:'myshare',query:{id:this.id}})
      },
      goToGenjin(){
        this.$router.push({name:'genjinlist',query:{id:this.id}})
      },
      handleHosue(type,house){
        if(type == 'detail'){
          this.$router.push({name:'detail',params:{id:house.id,type:this.type}})
        }
      },
      checkFenPan(){
        if(this.type == 2){
          actions.check_is_fp({
            userid: util.getLocalStorage('userid'),
            fangwu_id: this.id
          }).then(res=>{
            if(res.content == 'true'){
              this.callYeZhu();
            }else{
              util.showToast("已经封盘了不可联系业主");
            }
          })
        }else{
          this.callYeZhu();
        }
      },
      callYeZhu(){
        actions.isLockHt({ fangwu_id:this.id}).then(res=>{
          if(res.is_success === '0'){
            actions.haveGenjin().then(res=>{
              if(res.is_success == 0 && res.content && res.content.length > 0 && res.content[0].have_genjin == 'yes'){
                actions.getYezhu(this.id).then(res=>{
                  if(res.is_success == 0 && res.content && res.content.number){
                    this.showGenJinWrapper = true;
                    location.href = "tel:" + res.content.number;
                    actions.commitGenJin({
                      id: new Date().getTime(),
                      user_id: this.myInfo.login_id,
                      dept_id: '',
                      content: '获取电话',
                      add_time: new Date(),
                      fangwu_id: this.id
                    })
                  }else{
                    util.showToast("暂无业主联系方式");
                  }
                })
              }else{
                util.showToast("你的当日次数到达限制");
              }
            })
          }else{
            util.showToast(res.is_success)
          }
        })
      },
      commitGenJin(){
        if(this.genjin == ''){
          return util.showToast("跟进信息不能为空");
        }
        actions.commitGenJin({
          id: new Date().getTime(),
          user_id: this.myInfo.login_id,
          dept_id: '',
          content: this.genjin,
          add_time: new Date(),
          fangwu_id: this.id
        }).then(res=>{
          if(res.is_success == 0){
            this.genjin = '';
            this.showGenJinWrapper = false;
            util.showToast("跟进信息提交成功");
          }
        })
      },
      handleMap(){
        if(util.isWeixin){
          let convertor = new BMap.Convertor();
          let point = new BMap.Point(this.detail.x_count || this.detail.x_weizhi , this.detail.y_count || this.detail.y_weizhi);
          let pointArr = [point];
          convertor.translate(pointArr, BMAP_COORD_BD09, BMAP_COORD_GCJ02, (data)=>{
            if(data.status == 0 && data.points.length > 0){
              let point = data.points[0];
              wx.openLocation({
                latitude: point.lat, // 纬度，浮点数，范围为90 ~ -90
                longitude:  point.lng, // 经度，浮点数，范围为180 ~ -180。
                name: this.detail.xiaoqumingcheng_id, // 位置名
                address: this.detail.address, // 地址详情说明
                scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
              });
            }else{
              let coord = gps.bd09togcj02( this.detail.y_count || this.detail.y_weizhi,this.detail.x_count || this.detail.x_weizhi);
              wx.openLocation({
                latitude: coord[0], // 纬度，浮点数，范围为90 ~ -90
                longitude:  coord[1], // 经度，浮点数，范围为180 ~ -180。
                name: this.detail.xiaoqumingcheng_id, // 位置名
                address: this.detail.address, // 地址详情说明
                scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
              });
            }
          })


        }
      },
      initImageList(list){
        let result = [];
        if(!list) return result;
        if(list.length == 0) return result;
        for(let i = 0; i< list.length;i++){
          result.push(list[i].pic_path);
        }
        return result;
      },
    	getDetail(){
    		actions.getHouseDetail(this.id,this.type).then(res=>{
    			if(res.is_success == 0){
            // res.content[0].vr_addr = 'https://www.anjuke.com/pc/esf/vrview/?token=%2B%2B4b%2FvIoI3qyr6yyQIzOVwufCeAF0r%2B1JZ80cwYgtdGSi7O%2FWZr0HmRrG1Ar2F0A&app_id=10002&prop_id=2006419481&city_id=14&comm_id=1019707&from=prop_view'
            // res.content[0].is_vr = '是'
    				this.detail = res.content[0];
            this.$store.commit('changeTitle',this.detail.xiaoqumingcheng_id);
            this.picList = this.initImageList(this.detail.pic_list || []);
            this.hxtList = this.initImageList(this.detail.pic_hxt || []);
            if(util.isWeixin){
              let name = this.type == 1 ? '新房' : (this.type == 2 ? '二手房' : '租房');
              let prefix = util.getLocalStorage('manager') == 'true' ? util.getLocalStorage('phone') : '';
              let userId = util.getLocalStorage('manager') == 'true' ? util.getLocalStorage('userid') : '';
              let shareOption = {
                title:'[' + name + ']' + this.detail.xiaoqumingcheng_id + '(京西找房)' + prefix,
                desc: this.detail.jieshao + prefix,
                link: location.origin + "/?" + util.stringify({
                  sharePath: location.hash,
                  contact: prefix,
                  shareId: userId,
                  fwId: this.id
                }),
                imgUrl: "http://phone.jcfyht.cc/logo.png", // 分享图标
              }
              wx.onMenuShareAppMessage(shareOption);
              wx.onMenuShareTimeline(shareOption);
            }
            if(this.detail.lp_info ){
              this.loupan = this.detail.lp_info;
            }
    			}
    		})
    	},
      showImagePreview(current,type){
        if(util.isWeixin){
          wx.previewImage({
            current,
            urls:type == 'hxt' ? this.hxtList : this.picList,
          })
        }
      },
      showXinXiKaImage(current){
        if(!current) return util.showToast('暂未上传信息卡')
        if(util.isWeixin){
          current = 'http://wx.jcfyht.cc/Contract/swfupload/files/' + current;
          wx.previewImage({
            current,
            urls:[current],
          })
        }
      },
    	getDaikan(){
    		actions.getHouseDaikan(this.id).then(res=>{
    			if(res.is_success == 0){
    				this.daikan = res.content || [];
    			}
    		})
    	},
    	getXiangSi(){
    		actions.getHouseXiangSi(this.id,this.type).then(res=>{
    			if(res.is_success == 0){
    				this.xiangsi = res.content || [];
    			}
    		})
    	},
    	getJingJiRen(){
        let contact = util.urlGet().contact;
        if(contact){
          actions.getUserInfo(contact).then(res=>{
            if(res.is_success == 0 && res.content.length > 0){
                this.jingjiren = [{
                  dept_name:res.content[0].dept_name,
                  login_id:res.content[0].login_id,
                  login_name:res.content[0].login_name,
                  user_phone:res.content[0].login_id,
                  xxk_path:res.content[0].xxk_path,
                  pic_path:res.content[0].pic_path,
                }];
            }
          })
        }else{
          actions.getHouseJingJiRen(this.id).then(res=>{
            if(res.is_success == 0){
              this.jingjiren = res.content|| [];
            }
          })
        }
    	},
      attention(){
        if(!util.getLocalStorage('phone')){
          this.$router.push({name:'login',query:{back:true}});
          return;
        }
        actions.attention(this.id,this.type,this.detail.guanzhu == 0 ? 'no':'yes').then(res=>{
          if(res.is_success == 0){
            this.getDetail();
          }
        })
      },
      daka(){
        if(!util.getLocalStorage('phone')){
          this.$router.push({name:'login',query:{back:true}});
          return;
        }
        util.getLocation().then(res=>{
            actions.commitJingJiRenCheckIn(util.getSessionStorage('CheckInPhone')||'',util.getSessionStorage('CheckInDkType') || '',this.id,this.type,res.lng,res.lat).then(res=>{
              if(res.is_success == 0){
                util.showToast('打卡成功')
                this.$router.back();
              }
            })
        });
      }
    }
  }
</script>

<style lang="scss">
  .no-publish{
    padding:1rem 0 0;
    text-align:center;
    line-height:.4rem;
    font-size:14px;
    color:#999;
  }
  .detail{
    padding-bottom:1.5rem;
  }
	.detail1{
		position: relative;
		.swiper{
			position:relative;
			height:5.4rem;
			width:100%;
      .swiper-slide{
        position:relative;
        overflow: hidden;
      }
			.swiper-image{
        position: absolute;
				display:block;
				width:100%;
				height:auto;
        min-height: 100%;
        top:0; left:50%;
        transform: translateX(-50%);
			}
      .vr{
        position: absolute;
        display:block;
        width: 1rem;
        height:auto;
        z-index: 10;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
      }
		}
    .detail-info{
      padding-bottom: .3rem;
      background-color:#fff;
      border-bottom: 1px solid #e5e5e5;
      .btn-group{
        padding: .3rem .3rem 0;
        display: flex;
        .btn-item{
          display: block;
          flex: 1;
          height: 0.7rem;
          line-height: 0.7rem;
          text-align: center;
          font-size: 0.3rem;
          color: #fff;
          margin-right: .3rem;
          background-color: #00ae66;
        }
      }

    }
		.title{
			font-size: 0.32rem;
			line-height: 1.2em;
			color:#333;
			padding: 0.4rem;
		}
		.base_previes{
			position:relative;
			display:flex;
			align-items:center;
			margin: 0 0.4rem;
			height:1.6rem;
			border-top: 1px solid #e5e5e5;
			border-bottom: 1px solid #e5e5e5;
			>div{
				flex:1;
				height:0.8rem;
				border-left: 1px solid #e5e5e5;
				text-align: center;
			}
			>div:first-child{
				border-left: none;
			}
			.lable{
				display:block;
				color:#9c9fa1;
				font-size:0.24rem;
				font-weight:300;
				line-height:0.3rem;
			}
			.value{
				display:block;
				font-weight:600;
				font-size:0.32rem;
				color:#fa5741;
				line-height:0.5rem;
			}
		}
		.tags{
			padding:0.2rem 0.4rem 0.4rem;
			.tag{
				display:inline-block;
				padding: 0.1rem;
				font-size:0.22rem;
				border-radius: 0.05rem;
				background-color:#fbf1e4;
				color: #e8a852;
				margin-top:0.1rem;
				margin-right:0.1rem;
			}
		}
    .zf-base{
      position:relative;
      padding:0.3rem 0.4rem;
      color:#333;
      font-size:0.28rem;
      display:flex;
      flex-wrap:wrap;
      text-align:center;
      .base{
        display:block;
        width:1.34rem;
        height:1rem;
        background-size:auto 0.5rem;
        background-repeat: no-repeat;
        padding-top: 0.7rem;
        background-position: center 0;
        font-size: 0.26rem;
        color:#999;
        overflow: hidden;
        margin-bottom:0.2rem;
        @for $i from 1 through 9 {
          &.base#{$i}{
            background-image:url(../images/icon-base-#{$i}0.png);
            &.had{
              color:#333;
              background-image:url(../images/icon-base-#{$i}1.png);
            }
          }
        }
      }
    }
		.info{
			padding:0.3rem 0.4rem;
			color:#333;
			font-size:0.28rem;
			.short{
				display:inline-block;
				margin-bottom: 0.2rem;
				width:3.3rem;
			}
			.long{
				display:inline-block;
				margin-bottom: 0.2rem;
				width:100%;
			}
			.label{
				display:inline-block;
				padding-right:0.1rem;
				color:#9c9fa1;
				font-size:0.26rem;
				font-weight:400;
			}
		}
    .huixingfenjian{
      border-top: 1px solid #e5e5e5;
      margin: 0 0.4rem;
      padding:0.1rem 0 0.5rem;
      font-size:0.28rem;
      line-height:1.2em;
      color:#666;
      .huixingfenjian_title{
        line-height:0.6rem;
        color:#333;
        font-size:0.3rem;
      }
      .huixingfenjian_img{
        display:block;
        width:100%; height:auto;
      }
    }
    .genduofangyuan{
      margin: 0 0.4rem;
      background-color:#f9f9f9;
      line-height:0.8rem;
      font-size:0.32rem;
      color:#5680a6;
      text-align:center;
    }
    .baidu-map{
      position:relative;
      height:4rem;
      width:100%;
      margin-top:0.4rem;
    }
    .describe{
      margin: 0 0.4rem;
      padding:0.1rem 0 0.5rem;
      font-size:0.28rem;
      line-height:1.2em;
      .describe_title{
        line-height:1rem;
        color:#333;
        font-weight:500;
        font-size:0.34rem;
      }
    }
    .zhoubianjieshao{
      margin: 0 0.4rem;
      padding:0.1rem 0 0.5rem;
      font-size:0.28rem;
      line-height:1.2em;
      border-top:1px solid #e5e5e5;
      .zhoubianjieshao_title{
        line-height:1rem;
        color:#333;
        font-weight:500;
        font-size:0.34rem;
      }
    }
	}
	.detail2{
		.swiper1{
			position:relative;
			height:5.62rem;
			width:100%;
			img{
				display:block;
				width:100%;
				height:100%;
			}
		}
		.intro{
			padding:0.5rem 0.4rem;
			background-color:#fff;
			.title{
				font-size:0.45rem;
				font-weight:bolder;
				color:#333;
			}
		}
		.tags{
			padding:0.2rem 0 0;
			.tag{
				display:inline-block;
				padding: 0.02rem 0.1rem;
				font-size:0.2rem;
				border-radius: 0.05rem;
				border: 1px solid #e5e5e5;
				color: #9C9FA1;
				margin-top:0.1rem;
				margin-right:0.1rem;
			}
		}
		.price{
			margin-top:0.4rem;
			border-top: 1px solid #E5E5E5;
			padding-top:0.35rem;
			color:#333;
			font-size:0.28rem;
			.num{
				color:#f75848;
				font-weight:700;
			}
		}
		.address{
			margin-top:0.2rem;
			color:#333;
			font-size:0.28rem;
		}
		.info{
			padding:0.5rem 0.4rem;
			background-color:#fff;
			margin-top:0.25rem;
			.title{
				font-size:0.4rem;
				font-weight:bolder;
				color:#333;
				padding-bottom: 0.1rem;
			}
			.item{
				padding-top:0.3rem;
				font-size:0.28rem;
				color:#333;
			}
			.label{
				color:#999;
				padding-right:0.1rem;
			}
		}
    .genduofangyuan{
      margin-top:0.3rem;
      background-color:#f9f9f9;
      line-height:0.8rem;
      font-size:0.32rem;
      color:#5680a6;
      text-align:center;
    }
    .huixingfenjian{
      border-top: 1px solid #e5e5e5;
      padding:0.3rem 0.4rem;
      font-size:0.28rem;
      background-color:#fff;
      .huixingfenjian_title{
        font-size:0.4rem;
        font-weight:bolder;
        color:#333;
        padding-bottom: 0.3rem;
      }
      .huixingfenjian_img{
        display:block;
        width:100%; height:auto;
      }
    }
    .baidu-map{
      position:relative;
      height:4rem;
      width:100%;
    }
    .describe{
      border-top: 1px solid #e5e5e5;
      padding:0.3rem 0.4rem;
      font-size:0.28rem;
      background-color:#fff;
      .describe_title{
        line-height:1rem;
        color:#333;
        font-weight:500;
        font-size:0.34rem;
      }
    }
	}

	.daikan{
		margin-top:0.3rem;
		padding:0 0 0.3rem 0.4rem;
		background-color:#fff;
		border-bottom: 1px solid #e5e5e5;
		border-top: 1px solid #e5e5e5;
		.daikan-title{
			line-height:1rem;
			color:#333;
			font-weight:500;
			font-size:0.34rem;
		}
		li{
			border-top: 1px solid #e5e5e5;
			padding-top: 0.3rem;
		}
		.daikan-header{
			display:flex;
			padding-right:0.2rem;
			.daikan-info{
				flex:1;
				color:#9c9fa1;
				font-size:0.24rem;
				line-height:1.5em;

				.name{
					color:#333;
					font-size:0.3rem;
				}
			}
			.daikan-phone,.daikan-sms{
				padding:0 0 0 0.2rem;
			}
		}
		.daikan-content{
			padding: 0.2rem 0.2rem 0.2rem 0;
			font-size:0.28rem;
			color:#333;
			line-height:1.5em;
		}
	}
  .xiangsi{
    margin-top:0.3rem;
    padding:0 0 0.3rem 0.4rem;
    background-color:#fff;
    border-bottom: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    .xiangsi-title{
      line-height:1rem;
      color:#333;
      font-weight:500;
      font-size:0.34rem;
    }
  }
	.jingjiren-wrapper{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    top:0;
    background-color:rgba(0,0,0,0.4);
    z-index:100;
    padding:0.6rem 0.4rem;
    .btn-close{
      position:absolute;
      background-color:#fff;
      width: 0.8rem; height:0.8rem;
      border-radius:0.5rem;
      left:0.2rem; top:0.4rem;
      z-index:1002;
      &:before,&:after{
        position: absolute;
        content: '';
        display: block;
        width: 2px;
        height: 50%;
        left: 50%;
        top: 50%;
        background: #333333;
        transform: translate(-50%,-50%) rotate(45deg);
      }
      &:after{
        transform: translate(-50%,-50%) rotate(-45deg);
      }
    }
    .jingjiren{
      position:relative;
      width: 100%; height:100%;
      padding:0.6rem 0.3rem 0;
      background-color:#fff;
      .jinjiren-title{
        line-height:1rem;
        color:#333;
        font-weight:500;
        font-size:0.34rem;
      }
      li{
        border-top: 1px solid #e5e5e5;
        padding: 0.3rem 0.2rem .3rem;
        display:flex;
        align-items:center;
        .avater{
          display:block;
          width: 1rem;
          height: 1rem;
          margin-right:0.3rem;
          border-radius:50%;
        }
        .jinjiren-xinxika{
          font-size:.2rem;
          padding:.1rem .2rem;
          color:#00AE66;
          border-radius:.2rem;
          background-color:#E7F7F0;
        }
        .jinjiren-info{
          flex:1;
          padding:.1rem 0 0 0;
          color:#9c9fa1;
          font-size:0.22rem;
          line-height:1.5em;
          .name{
            color:#333;
            font-size:0.34rem;
            display:block;
          }
        }
        .jinjiren-phone,.jinjiren-sms{
          padding:0 0 0 0.2rem;
        }
      }
    }
	}
  .fangyuaninfo-wrapper{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    top:0;
    background-color:#fff;
    z-index:1000;
    padding: 1.2rem 0 1rem;
    overflow-y: scroll;
    .btn-close{
      position:absolute;
      width: 0.8rem; height:0.8rem;
      left:0.2rem; top:0.2rem;
      &:before,&:after{
        position: absolute;
        content: '';
        display: block;
        width: 2px;
        height: 50%;
        left: 50%;
        top: 50%;
        background: #333333;
        transform: translate(-50%,-50%) rotate(45deg);
      }
      &:after{
        transform: translate(-50%,-50%) rotate(-45deg);
      }
    }
    .fangyuaninfo-item{
      padding:0 0.4rem;
      .fangyuaninfo-item-title{
        font-size:0.4rem;
        line-height:1rem;
        color:#333;
        font-weight:500;
        &.border-top{
          margin-top:0.4rem;
          border-top:1px solid #eee;
        }
      }
      .fangyuaninfo-item-content{
        font-size:0.32rem;
        line-height:0.8rem;
        color:#394043;
      }
    }
  }
  .xingfang-wrapper{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    top:0;
    background-color:#f5f5f5;
    z-index:1000;
    overflow-y: scroll;
    .btn-close{
      position:absolute;
      width: 0.8rem; height:0.8rem;
      left:0.2rem; top:0.2rem;
      &:before,&:after{
        position: absolute;
        content: '';
        display: block;
        width: 2px;
        height: 50%;
        left: 50%;
        top: 50%;
        background: #333333;
        transform: translate(-50%,-50%) rotate(45deg);
      }
      &:after{
        transform: translate(-50%,-50%) rotate(-45deg);
      }
    }
    .xingfang-group{
      background-color:#fff;
      padding-left: 0.4rem;
      margin-top:0.4rem;
      border-bottom:1px solid #eee;
      border-top:1px solid #eee;
      &.first-group{
        padding-top:1.2rem;
        margin-top:0;
        border-top:none;
      }
    }

    .xingfang-item{
      line-height:0.8rem;
      border-bottom:1px solid #eee;
      font-size:0.28rem;
      color:#333;
      &.xingfang-item-title{
        font-size:0.32rem;
        line-height:1.2rem;
      }
      &:last-child{
        border-bottom:none;
      }
      &>span{
        display:inline-block;
        width:2.2rem;
        color:#999;
      }
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
  .share-cover{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    top:0;
    background-color:rgba(0,0,0,0.6);
    z-index:1000;
    >img{
      position:absolute;
      display:block;
      right:0.4rem;
      top:0.4rem;
      width: 2rem;
      height:auto;
    }
  }
  .detail-bottom{
    position:fixed;
    height:1rem;
    bottom:0;
    left:0;
    right:0;
    background-color:#fff;
    box-shadow: 0 -2px 1px rgba(0,0,0,.1);
    padding:0.1rem 0;
    display:flex;
    &.single{
      padding:0;
    }
    .btn-attention{
      display:block;
      width: 1.4rem;
      font-size:0.2rem;
      line-height:0.3rem;
      color:#999;
      text-align:center;
      padding: 0.05rem 0;
    }
    .btn-share,.btn-jinjiren,.btn-daka{
      display: flex;
      flex:1;
      align-items: center;
      justify-content:center;
      height:0.8rem;
      background-color: #FF725C;
      border-color: #FF725C;
      color:#fff;
      margin: 0 0.2rem 0 0;
      border-radius:0.05rem;
      font-size:0.3rem;
    }
    .btn-daka{
      height:1rem;
      margin: 0;
    }
    .btn-jinjiren{
      border-color: #00ae66;
      background-color: #00ae66;
    }
  }
</style>
