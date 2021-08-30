<template>
  <div class="container-contract-detail">
    <template v-if="['add','edit'].includes($route.query.type)">
      <div class="header">
        <div class="steps">
          <div :class="['step',{
            'is-finsh': step > item.id,
            'is-process':  step == item.id,
            'is-wait': step < item.id
          }]" v-for="item in stepList" :key="item.id" >
            <div class="step__head">
              <div :class="['line',(step > item.id + 1) ? 'active' : '' ]"></div>
              <div class="no">{{item.id}}</div>
            </div>
            <div class="step__main">{{item.title}}</div>
          </div>
        </div>
      </div>
      <div class="body">
        <div :class="['form-group', getVerify(item) ]"
          v-for="(item,index) in list"
          :key="item.id"
          v-if="item.col_isview == '是' && item.show && item.page == step ">
          <div class="lable"><span class="red" v-if="item.require">*</span> {{item.name}}</div>
          <div class="control"  v-if="item.page == 1 && $route.query.source == 'prefect'">
            {{item.value}}
          </div>
          <div class="control" v-else-if="item.type == '文本框'">
            <input v-if="item.id == 'col_8'" class="input" :value="item.value | phoneFilter"
              @input="inputChange('input',index,$event)"
              @compositionstart="inputChange('compositionstart',index,$event)"
              @compositionend="inputChange('compositionend',index,$event)"
            @blur="inputBlur" :placeholder="'请输入' + item.name" />
            <input v-else class="input" :value="item.value"
              @input="inputChange('input',index,$event)"
              @compositionstart="inputChange('compositionstart',index,$event)"
              @compositionend="inputChange('compositionend',index,$event)"
            @blur="inputBlur" :placeholder="'请输入' + item.name" />
          </div>
          <div class="control" v-else-if="['下拉框'].includes(item.type)">
            <div :class="['select',item.value ? '' : 'placeholder']" @click="openSelect(index)">{{ item.value  || ('请选择' + item.name) }}</div>
          </div>
          <div class="control" v-else-if="item.type == '日期'">
            <div :class="['select',item.value ? '' : 'placeholder']" @click="openDatePicker(index)">{{ item.value  || ('请选择' + item.name) }}</div>
          </div>
          <div class="control" v-else-if="item.type == '单选钮'">
            <div class="radio-group">
              <span :class="['radio',item.value == radio ? 'selected' : '']" v-for="radio in item.default" :key="radio" @click="selectRadio(index,radio)">{{radio}}</span>
            </div>
          </div>
          <div class="control" v-else-if="item.type == '多选框'">
            <div :class="['select',item.value ? '' : 'placeholder']" @click="openCheckBox(index)">{{ item.value  || '请选择' }}</div>
          </div>
        </div>
        <div class="result" v-if="step == 4">
          <div class="btn" @click="showPreview = true">预览合同</div>
          <div class="btn" @click="clearData">清空数据</div>
          <div class="btn" @click="commitInfo">
            <template v-if="$route.query.source == 'prefect'">补充合同</template>
            <template v-else-if="$route.query.source == 'copy'">重签合同</template>
            <template v-else-if="$route.query.type == 'edit'">修改合同</template>
            <template v-else>签署两书</template>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="btn btn-pre" @click="stepChange('pre')" v-if="step != 1">上一步</div>
        <div class="btn btn-next" @click="stepChange('next')" v-if="step != 4">下一步</div>
      </div>
    </template>
    <div class="body" v-if="['preview'].includes($route.query.type)">
      <div class="form-group" v-for="(item,index) in list" :key="item.id" v-if="item.col_isview == '是' && item.show ">
        <div class="lable">{{item.name}}</div>
        <div class="control">{{ item | previewItemFilter }}</div>
      </div>
    </div>

    <div class="preview-list" v-if="showPreview">
      <div class="preview-title">房源预览</div>
      <ul class="form-group">
        <li v-for="(item,index) in list" :key="item.id" v-if="item.col_isview == '是' && item.show">
          <div class="key">{{ item.name }}</div>
          <div class="value">{{ item | previewItemFilter }}</div>
        </li>
        <div class="btn-return" @click="showPreview = false">返回</div>
      </ul>
    </div>

    <div class="checkbox-wrapper" v-if="checkBox">
      <div class="checkbox-inner">
        <div class="title">{{checkBox.name}}</div>
        <div class="body">
          <span :class="checkBox.values.includes(item)? 'checked' : ''" v-for="item in checkBox.default" :key="item" @click="selectCheckBox(item)">{{item}}</span>
        </div>
        <div class="btns">
          <div class="btn-cancle" @click="checkBox=null">取消</div>
          <div class="btn-ok" @click="commitCheckBox">确定</div>
        </div>
      </div>
    </div>
    <div id="selectDom"></div>
  </div>
</template>


<script>
  import util from '../../common/util.js';
  import Select from '../../common/select.js';
  import actions from '../../common/actions.js';

  let StepConfig = [
    {
      id: 1,
      title: '第一步',
    },{
      id: 2,
      title: '第二步',
    },{
      id: 3,
      title: '第三步',
    }
  ]
  let localCacheData = {}, localCacheDataKey = 'test', beforeSavaDataStr = '', cpLock = {};;

  export default {
    data () {
      return {
        list: [],
        stepList: StepConfig,
        step: 1,
        showPreview: false,
        currentFW: null,
        house: null,
        isCheck: false,
        checkBox: null
      }
    },
    created(){
      this.$store.commit('changeTitle','上上签');
      if(util.getLocalStorage('manager') == "true"){
        this.getHtCol();
        this.autoSaveRometeData();
        util.hideLoading();
      }else{
        alert('暂无权限')
      }
    },
    beforeDestroy(){
      clearTimeout(this.autSaveTimer)
    },
    filters:{
      phoneFilter(value){
        if(value.length == 11){
          return value.substr(0,3) + "****" + value.substr(7);
        }
        return value
      },
      previewItemFilter(item){
        if(item.value){
          if(item.id == 'col_8'){
            return item.value.substr(0,3) + "****" + item.value.substr(7);
          }
          return item.value;
        }
        return '未填写';
      }
    },
    watch:{
      list: function(val,oldVal){
        for(let i = 0; i < val.length; i++){
          if(oldVal[i] && val[i] && val[i].value != oldVal[i].value){
            this.watchItemAndChange(val[i],val);
          }
        }
      }
    },
    methods:{
      inputBlur(){
        if (util.isIos) {
          window.scrollTo(0,0)
        }
        window.scrollTo(0,0)
      },
      getVerify(item){
        if(this.isCheck){
          let value = item.value.trim()
          if(item.require && !value) return 'isMust';
          if(item.verify == 'phone' && (value.length != 11 || !util.verify.phone.test(value))) return 'isMust';
          if(['col_24','col_25'].includes(item.id) && (!item.data || !item.data.xxkh) ) return 'isMust';

        }
        return '';
      },
      clearData(){
        util.createConfirm('是否清除数据').then(res=>{
          if(res){
            this.list = config.concat([]);
            this.step = 1;
            util.removeLocalStorage(localCacheDataKey);
          }
        })
      },
      stepChange(type){
        let list = this.list.filter(item => item.page == this.step);
        if(this.$route.query.source == 'prefect' && this.step == 1){ // 补充的第一页不验证

        }else{
          for(let i = 0; i < list.length;i++){
            let item = list[i];
            item.value = item.value.trim();
            if(item.show && item.require){
              if(!item.value){
                this.isCheck = true;
                util.showToast( (item.type == '文本框' ? '请输入' : '请选择') + item.name);
                return;
              }

              if(item.verify == 'phone' && (item.value.length != 11 || !util.verify.phone.test(item.value))){
                this.isCheck = true;
                util.showToast( '请输入正确的'+ item.name);
                return;
              }

              if(['col_24','col_25'].includes(item.id) && (!item.data || !item.data.xxkh)){
                this.isCheck = true;
                util.showToast( '请输入正确的'+ item.name);
                return;
              }

            }
          }
        }

        this.isCheck = false;
        if(type == 'pre'){
          this.step = this.step <= 1 ? 1 : (this.step -1);
        }else if(type == 'next'){
          this.step = this.step >= 4 ? 4 : (this.step +1)
        }
      },
      watchItemAndChange(current,list){
        let taskList = [
          ()=>{
            if(current.id == 'col_23'){ // col_23:出售价格 col_22:出售价格大写
              let targetIndex = list.findIndex(item => item.id == 'col_22')
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: current.value ? util.numberRecoverChinese(current.value * 10000) : ''
              }))
            }
          },
          ()=>{
            if(current.id == 'col_24'){ // 承办人:col_24  承办人信息卡号:col_25
              let col_24_index = list.findIndex(item => item.id == 'col_24');
              let targetIndex = list.findIndex(item => item.id == 'col_25');
              this.getUserInfo(current.value,true).then(res=>{
                if(res.is_success == 0){
                  let jinjiren  = res.content[0] || {};
                  this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                    value: jinjiren.xxkh || '',
                    data: jinjiren
                  }))
                  this.mergeList(col_24_index, Object.assign({},list[col_24_index],{
                    value: current.value,
                    data: jinjiren
                  }))
                }
              })
            }
          },
          ()=>{
            if(current.id == 'col_26'){ // 经纪人:col_26  执业证书:col_27
              let targetIndex = list.findIndex(item => item.id == 'col_27');
              this.getUserInfo(current.value,true).then(res=>{
                if(res.is_success == 0){
                  let jinjiren  = res.content[0] || {};
                  this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                    value: jinjiren.zsbh || ''
                  }))
                }
              })
            }
          },
          ()=>{
            if(current.id == 'col_28'){ // 第二经纪人:col_28  第二执业证书:col_27
              let targetIndex = list.findIndex(item => item.id == 'col_29');
              this.getUserInfo(current.value,true).then(res=>{
                if(res.is_success == 0){
                  let jinjiren  = res.content[0] || {};
                  this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                    value: jinjiren.zsbh || ''
                  }))
                }
              })
            }
          },
          ()=>{
            if(current.id == 'col_37'){ // 房屋:col_37  土地使用权性质:col_39
              let targetIndex = list.findIndex(item => item.id == 'col_39'),value = '';
              if(['商品房','商业办公','车库、车位','自住型商品房'].includes(current.value)){
                value = '出让'
              }else if(['已购公房-成本价','已购公房-标准价','已购公房-优惠价','已购公房-央产房','经济适用房','按经济适用房管理','按经济适用住房管理','三定三限','两限房']){
                value = '划拨'
              }
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: value
              }))
            }
          }

        ]
        taskList.forEach(item=> item())
      },
      mergeList(index,obj){
        let result = this.list.concat([]);
        result[index] = obj;
        localCacheData[obj.id] = obj.value;
        this.list = result;
      },
      autoSaveRometeData(){
        // 预览 补充 重签 不自动保存
        if(this.$route.query.source == 'copy') return;
        if(this.$route.query.source == 'prefect') return;
        if(this.$route.query.type == 'preview') return;

        let data = {};
        for(let i = 0; i < this.list.length;i++){
          let item = this.list[i];
          item.value = item.value.trim();
          if(item.value && (item.show || item.systemHide) ){
            data[item.id] = item.value;
          }
        }

        this.autSaveTimer = setTimeout(()=>{
          this.autoSaveRometeData()
        },3000)
        if(this.list.length == 0) return;
        if(beforeSavaDataStr == JSON.stringify(data) || JSON.stringify(data) == '{}'){
          return;
        }
        beforeSavaDataStr = JSON.stringify(data);
        actions.commitHt(data,true).then(res=>{
          if(!data.id && !res.content){
          }else if(!data.id && res.content){
            let targetIndex = this.list.findIndex(item => item.id == 'id');
            if(targetIndex == -1) return;
            this.mergeList(targetIndex, Object.assign({},this.list[targetIndex],{
              value: res.content
            }))
            this.$router.replace({name:'liangshucontractDetail',query: { id: res.content, type: 'edit'}})
          }
        })
      },
      inputChange(type,index,event){
        let cpLockKey = 'item' + index
        if(type == 'compositionstart'){
          cpLock[cpLockKey] = true;
        }else if(type == 'compositionend' || type == 'input'){
          if(type == 'compositionend') cpLock[cpLockKey] = false;
          if(cpLock[cpLockKey]) return;
          if(event.target.value == this.list[index].value) return;
          this.mergeList(index,Object.assign({},this.list[index],{value:event.target.value}))
        }
      },
      openSelect(index){
        let current = this.list[index];
        let list = [], valueIndex = 0;
        current.default.forEach((text,index)=>{
          if(current.value == text) valueIndex = index
          list.push({id: text, value: text})
        })
        let select = new Select({
          trigger: '#selectDom',
          title: current.name,
          wheels: [{
            data:list
          }],
          position:[valueIndex],
          onHide: ()=>{
            select.mobileSelect.parentNode.removeChild(select.mobileSelect);
          },
          callback: (indexArr, data)=>{
            this.mergeList(index,Object.assign({},this.list[index],{value:data[0].id}))
          }
        });
        select.show();
      },
      openDatePicker(index){
        let current = this.list[index],valueIndex = [];
        let date = current.data || new Date();

        let yearData = [], nowYear = new Date().getFullYear();
        for(let i = 1970; i <= nowYear + 15; i++) {
          if(date.getFullYear() == i) valueIndex.push(i - 1970)
          yearData.push({ id: i, value: i + '年' });
        }

        let monthData = [];
        for(let i = 1; i <= 12; i++) {
          if(date.getMonth() == i) valueIndex.push(i)
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
        let select = new Select({
          trigger: '#selectDom',
          title: current.name,
          wheels: [{ data:yearData },{ data:monthData },{ data:dateData }],
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
            this.mergeList(index,Object.assign({},this.list[index],{
              value: selectDate.Format('yyyy年MM月dd日'),
              data: selectDate
            }));
          }
        });
        select.show();
      },
      selectRadio(index,value){
        this.mergeList(index,Object.assign({},this.list[index],{value:value}))
      },
      openCheckBox(index){
        let list = this.list[index].value ? this.list[index].value.split(',') : [];
        this.checkBox = Object.assign({},this.list[index],{values: list});
      },
      selectCheckBox(value){
        if(this.checkBox.values.includes(value)){
          this.checkBox = Object.assign({},this.checkBox,{ values: this.checkBox.values.filter(item => item != value)})
        }else{
          this.checkBox.values.push(value)
          this.checkBox = Object.assign({},this.checkBox,{ values: this.checkBox.values})
        }
      },
      commitCheckBox(){
        let index = this.list.findIndex(item => item.id == this.checkBox.id);
        this.mergeList(index,Object.assign({},this.list[index],{value:this.checkBox.values.join(',')}));
        this.checkBox = null;
      },
      getHtCol(){
        actions.getHtParams().then(res=>{
          if(res.is_success == 0){
            let params = this.handleSourceData(res.content);
            if(this.$route.query.type == 'preview'){
              actions.getHtList({
                id: this.$route.query.id,
                user_id: util.getLocalStorage('userid')
              }).then(res2=>{
                if(res2.is_success == 0){
                  let remote = res2.content[0];
                  this.initHtData(params,remote);
                }
              })
            }else if(this.$route.query.type == 'edit'){
              actions.getHtList({
                id: this.$route.query.id,
                user_id: util.getLocalStorage('userid')
              }).then(res2=>{
                if(res2.is_success == 0){
                  localCacheDataKey = this.$route.query.id;
                  let remote = res2.content[0];
                  for(let key in remote) {
                    if(remote[key] === '') {
                      delete remote[key]
                    }
                  }
                  localCacheData = Object.assign({},this.getCacheCol(),remote);
                  util.setLocalStorage(localCacheDataKey,JSON.stringify(localCacheData));
                  this.initHtData(params,localCacheData);
                }
              })
            }else if(this.$route.query.type == 'add'){
              localCacheDataKey = this.$route.query.fwid;
              localCacheData = this.getCacheCol();
              this.initHtData(params,localCacheData);
              this.initHouseInfo();
              this.initYezhuInfo();
              this.initJinjiRen();
            }
          }
        })
      },
      getItem(obj){
        return Object.assign({},{
              col_decri: "",
              col_default: "",
              col_en: "",
              col_isbt: "否",
              col_isview: "是",
              col_json: "",
              col_order: "",
              col_type: "",
              col_zh: "",
              id: "",
              table_col: "",
              table_name: "",
            },obj)
      },
      handleSourceData(list){
        let params = [];
        list.forEach(item=>{
          // 处理起租时间和终止时间 col_17 col_18 col_19 col_20 col_21 col_22
          // $id$:自增长主键，，这个可以默认给个long的时间戳；$curr_datetime$:当前时间，精确到秒；$curr_date$:当前时间
          if(item.col_default == '$id$'){
            item.col_default = new Date().getTime() + '';
          }
          if(item.col_default == '$curr_datetime$' || item.col_default == '$curr_date$'){
            item.col_default = new Date().Format('yyyy年MM月dd日') + '';
          }
          if(item.col_default == '$user_name$'){
            item.col_default = util.getLocalStorage('xingming');
          }

          params.push(item);
        })
        return params;
      },
      initHtData(list,catchData){
        let config = [], size = Math.floor(list.length / 3);
        list.forEach((item,index)=>{
          // type 标签 文本框 单选钮 多选框 下拉框 日期 隐藏文本
          let data = Object.assign(item,{
            id: item.col_en,
            name: item.col_zh,
            type: item.col_type,
            show: item.col_isview == '是',
            require: item.col_isbt == '是',
            value: catchData[item.col_en] || item.col_default ||'',
            default: item.col_json.split(','),
            page: 1,
            systemHide: item.col_isview == '否',
          });

          if(index < 1 * size){
            data.page = 1;
          }else if(index < 2 * size){
            data.page = 2;
          }else if(index < 3 * size){
            data.page = 3;
          }

          if(data.id == 'col_23') data.name = '出售价格（万元）'


          if(data.name.indexOf('电话') !== -1){
            data.verify = 'phone'
          }

          if(data.id == 'add_user') data.value = util.getLocalStorage('userid');
          if(data.type == '日期' && data.value){
            let str = data.value.replace('年','/').replace('月','/').replace('日','/')
            data.data = new Date(str)
          }
          if(['col_24','col_25'].includes(data.id) && catchData['col_25']){
            data.data = { xxkh: catchData['col_25']}
          }

          config.push(data);
        })

        if(this.$route.query.type != 'preview'){
        }


        this.list = config;
      },
      getCacheCol(){
        let catchData = {};
        return catchData;
      },
      initHouseInfo(data){
        actions.getHouseDetail(this.$route.query.fwid,2).then(res=>{
          if(res.is_success == 0){
            this.house = res.content[0];
            this.list.forEach((item,index)=>{
              if(['t_fangwu'].includes(item.table_name) && item.table_col && !item.value ){
                if(item.col_en == 'col_10'){
                  let value = this.house.xiaoqumingcheng_id + this.house.suozailou_id + this.house.suozaidanyuan_id+ '单元' + this.house.fanghao;
                  this.mergeList(index,Object.assign({},item,{value:value || ''}))
                }else if(item.col_en == 'col_32'){
                  let value = this.house.shi + '室' + this.house.ting + '厅' + this.house.wei + '卫' + this.house.chu + '厨';
                  this.mergeList(index,Object.assign({},item,{value:value || ''}))
                }else{
                  this.mergeList(index,Object.assign({},item,{value:this.house[item.table_col] || ''}))
                }

              }
            })
          }
        })
      },
      getUserInfo(name,isHideLoading){
        return actions.getUserInfoById({ user_name: name},isHideLoading)
      },
      initYezhuInfo(){
        actions.getYezhuInfo({fangwu_id: this.$route.query.fwid}).then(res=>{
          if(res.is_success == 0){
            this.house = res.content[0];
            this.list.forEach((item,index)=>{
              if(['t_fangwu_yezhu'].includes(item.table_name) && item.table_col && !item.value ){
                this.mergeList(index,Object.assign({},item,{value:this.house[item.table_col] || ''}))
              }
            })
          }
        })
      },
      initJinjiRen(){
        this.getUserInfo(util.getLocalStorage('xingming')).then(res=>{
          if(res.is_success == 0){
            this.jinjiren = res.content[0] || {};
            this.list.forEach((item,index)=>{
              if(['t_jingjiren'].includes(item.table_name) && item.table_col && !item.value ){
                this.mergeList(index,Object.assign({},item,{value:this.jinjiren[item.table_col] || ''}))
              }
            })
          }
        })
      },
      commitInfo(){
        let data = {};
        for(let i = 0; i < this.list.length;i++){
          let item = this.list[i];
          item.value = item.value.trim();
          if(item.show && item.require){
            if(!item.value){
              this.isCheck = true;
              util.showToast( (item.type == '文本框' ? '请输入' : '请选择') + item.name);
              return;
            }

            if(item.verify == 'phone' && (item.value.length != 11 || !util.verify.phone.test(item.value))){
              this.isCheck = true;
              util.showToast( '请输入正确的'+ item.name);
              return;
            }
          }


          if(item.value && (item.show || item.systemHide) ){
            data[item.id] = item.value;
          }

        }

        if(this.$route.query.source == 'copy'){
          delete data.id;
          delete data.htid;
        }
        let remote;
        if(this.$route.query.source == 'prefect'){
          remote = actions.perfectHt(data)
        }else{
          remote = actions.commitHt(data)
        }
        remote.then(res=>{
          if(res.is_success == 0){
            util.showToast('提交成功')
            util.removeLocalStorage(localCacheDataKey);
            this.$router.replace({name:'liangshucontractList'});
          }else{
            util.showToast(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .container-contract-detail{
    padding-bottom: 1.3rem;
    .header{
      padding: .3rem 0;
      .steps{
        display: flex;
        .step{
          flex: 1;
          .step__head{
            position: relative;
            width: 100%;
            text-align: center;
            height: .5rem;
            .line{
              position: absolute;
              width: 100%;
              height: 2px;
              top: calc(50% - 1px);
              left: 50%;
              background-color: #C0C4CC;
              &.active{
                background-color: #00ae66;
              }
            }
            .no{
              position: relative;
              z-index: 1;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: .5rem;
              height: .5rem;
              font-size: .3rem;
              border-radius: 50%;
              font-weight: bold;
              border: 2px solid;
              background-color: #fff;
              border-color: inherit;
            }
          }
          .step__main{
            font-size: .3rem;
            text-align: center;
            line-height: .6rem;
            font-weight: bold;
          }
          &:last-child{
            .step__head{
              .line{
                display: none;
              }
            }
          }
          &.is-finsh{
            .step__head{
              .no{
                color: #00ae66;
                border-color: #00ae66;
              }
            }
            .step__main{
              color: #00ae66;
            }
          }
          &.is-process{
            .step__head{
              .no{
                color: #333;
                border-color: #333;
              }
            }
            .step__main{
              color: #333;
            }
          }
          &.is-wait{
            .step__head{
              .no{
                color: #C0C4CC;
                border-color: #C0C4CC;
              }
            }
            .step__main{
              color: #C0C4CC;
            }
          }
        }
      }
    }
    .body{
      &.preview{
        position: fixed;
        bottom:0;
        left:0;
        right:0;
        top:0;
        z-index: 10;
        overflow-y: scroll;
        background-color: #f5f5f5;
      }
      .form-group{
        position: relative;
        margin-top: .1rem;
        display: flex;
        padding: .3rem .3rem;
        background-color: #fff;
        &.isMust{
          border: 1px solid red;
        }
        .lable{
          font-size: .3rem;
          color: #333;
          .red{
            color:#ff0000;
          }
        }
        .control{
          flex:1;
          padding-left: .6rem;
          color: #333333;
          font-size: .32rem;
          text-align: right;
          .input{
            width: 100%;
            text-align: right;
            &::-webkit-input-placeholder {
              color: #999;
            }
            &::-moz-input-placeholder {
              color: #999;
            }
            &::-ms-input-placeholder {
              color: #999;
            }
          }
          .select{
            padding-right: .4rem;
            background-image: url(../../images/arrow-right-666.png);
            background-size: auto .3rem;
            background-repeat: no-repeat;
            background-position: center right;
            &.placeholder{
              color: #999;
            }
          }
          .radio-group{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .radio{
              margin-left: .3rem;
              padding-left: .4rem;
              background-image: url(../../images/icon-unselected.png);
              background-size: 0.32rem;
              background-repeat: no-repeat;
              background-position: left center;
              &.selected{
                background-image: url(../../images/icon-selected.png);
              }
            }
          }
        }
      }
      .result{
        padding: 2rem .3rem 0;
        .btn{
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          height: 0.8rem;
          background-color: #fff;
          border: 1px solid #00ae66;
          color: #00ae66;
          margin: .3rem 0;
          border-radius: 0.1rem;
          font-size: 0.3rem;
        }
      }
    }
    .footer{
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
      }
    }

    .preview-list{
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      top:0;
      background-color:#fff;
      z-index:1000;
      padding: .4rem 0 1rem;
      overflow-y: scroll;
      .preview-title{
        font-size: .36rem;
        line-height: .6rem;
        text-align: center;
        font-weight: bold;
        padding: .3rem 0 .6rem;
      }
      .btn-return{
        margin-top: .3rem;
        width: 100%;
        height: 1rem;
        left:0.2rem; top:0.2rem;
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
      .form-group{
        position: relative;
        padding: 0 .3rem;
        li{
          display: flex;
          padding: .1rem 0;
          border-bottom: 1px solid #ddd;
          background-color: #fff;
          .key{
            font-size: .3rem;
            color: #333;
          }
          .value{
            flex:1;
            color: #333333;
            font-size: .32rem;
            text-align: right;
          }
        }
      }
    }

    .checkbox-wrapper{
      position: fixed;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 10000;
      background-color: rgba(0, 0, 0, 0.3);
      .checkbox-inner{
        position: absolute;
        top:50%;
        left: 50%;
        transform:translate(-50%,-50%);
        width: 80%;
        background-color: #FFF;
      }
      .title{
        text-align:center;
        font-size:.4rem;
        color:#333;
        line-height:.43rem;
        padding:.3rem .3rem;
      }
      .body{
        padding: .1rem 0 .4rem;
        display:flex;
        flex-wrap: wrap;
        justify-content: center;
        max-height: 5rem;
        overflow-y: scroll;
        span{
          display:block;
          width: 1.5rem;
          margin: 0.125rem;
          border: 1px solid #f4f4f4;
          color: #999;
          border-radius: 0.05rem;
          overflow: hidden;
          white-space: nowrap;
          font-size: 0.2rem;
          text-align:center;
          line-height: 0.5rem;
          &.checked{
            border-color: #00ae66;
            color:#00ae66;
          }
        }
      }
      .btns{
        display:flex;
        width:100%;
        height:.8rem;
        border-top:1px solid #F4F4F4;
        .btn-ok,.btn-cancle{
          display:flex;
          flex:1;
          font-size:.3rem;
          color:#999;
          align-items:center;
          justify-content: center;
        }
        .btn-ok{
          color:#FF6D41;
          border-left: 1px solid #F4F4F4;
        }
      }
    }
    #selectDom{
      display:none;
    }

  }
</style>
