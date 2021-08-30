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
            <input class="input" 
              :value="item.value" 
              @input="inputChange('input',index,$event)"
              @compositionstart="inputChange('compositionstart',index,$event)"
              @compositionend="inputChange('compositionend',index,$event)"
              @blur="inputBlur" 
              :placeholder="'请输入' + item.name" />
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
            <template v-else>提交合同</template>
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
        <div class="control">{{item.value || '未填写'}}</div>
      </div>
    </div>

    <div class="preview-list" v-if="showPreview">
      <div class="preview-title">房源预览</div>
      <ul class="form-group">
        <li v-for="(item,index) in list" :key="item.id" v-if="item.col_isview == '是' && item.show">
          <div class="key">{{ item.name }}</div>
          <div class="value">{{ item.value || '未填写' }}</div>
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
  import util from '../common/util.js';
  import Select from '../common/select.js';
  import actions from '../common/actions.js';

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
  let localCacheData = {}, localCacheDataKey = 'test', beforeSavaDataStr = '', cpLock = {};

  export default {
    data () {
      return {
        list: [],
        size: 0,
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
          if(item.verify == 'phone' && value.length != 11) return 'isMust';
          if(['col_42','col_43'].includes(item.id) && (!item.data || !item.data.xxkh) ) return 'isMust';
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

              if(item.verify == 'phone' && item.value.length != 11){
                this.isCheck = true;
                util.showToast( '请输入正确的'+ item.name);
                return;
              }

              if(['col_42','col_43'].includes(item.id) && (!item.data || !item.data.xxkh)){
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
            if(current.id == 'col_10'){ // 自动计算最多居住人数 等于：室（居室数量）*2
              let targetIndex = list.findIndex(item => item.id == 'col_16');
              if(targetIndex == -1) return;
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: current.value ? (current.value * 2 + '') : ''
              }))
            }
          },
          ()=>{
            if(current.id == 'col_245'){ // 自动计算终止日期 年+1，日-1
              let targetIndex = list.findIndex(item => item.id == 'col_84')
              if(targetIndex == -1) return;
              let date = new Date(current.data.getFullYear() + 1,current.data.getMonth(),current.data.getDate() - 1);
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: date.Format('yyyy年MM月dd日'),
                data: date
              }))
            }
          },
          ()=>{
            if(current.id == 'col_245' || current.id == 'col_84'){ // 自动计算 租赁总月数 租赁零几天 起租日-终止日
              let start = list.find(item => item.id == 'col_245');
              if(!start || !start.data) return;
              let end = list.find(item => item.id == 'col_84');
              if(!end || !end.data) return;

              let mouthCount = 0, dateCount = 0;
              let autoEnd = new Date(start.data.getFullYear() + 1,start.data.getMonth(),start.data.getDate() - 1);

              if(autoEnd.getTime() == end.data.getTime()){
                mouthCount = 12;
                dateCount = 0;
              }else{
                let days = (end.data.getTime() - start.data.getTime()) / (60 * 60 * 24 * 1000) + 1; // 计算一共多少天
                let sum = 0, index = 1;
                while(days > sum){
                  let mouthDays = new Date(start.data.getFullYear(), start.data.getMonth() + index,0).getDate();
                  if(index == 1){
                    dateCount = mouthDays - start.data.getDate() + 1;
                    sum += dateCount;
                    if(dateCount == mouthDays) {
                      mouthCount ++;
                      dateCount = 0;
                    }
                  }else{
                    sum += mouthDays;
                    if(sum > days){
                      dateCount += end.data.getDate()
                      if(dateCount >= mouthDays){
                        mouthCount ++;
                        dateCount -= mouthDays;
                      }
                    }else{
                      mouthCount ++;
                    }
                  }
                  index ++;
                }
              }

              let targetMonthIndex = list.findIndex(item => item.id == 'col_23')
              if(targetMonthIndex == -1) return;
              this.mergeList(targetMonthIndex, Object.assign({},list[targetMonthIndex],{
                value: mouthCount + ''
              }))

              let targetDayIndex = list.findIndex(item => item.id == 'col_24')
              if(targetDayIndex == -1) return;
              this.mergeList(targetDayIndex, Object.assign({},list[targetDayIndex],{
                value: dateCount + ''
              }))
            }
          },
          ()=>{
            if(current.id == 'col_23' || current.id == 'col_24' || current.id == 'col_83'){ // 月租金*（租赁总月数+租赁零天数/30）
              let month = list.find(item => item.id == 'col_23');
              if(!month || month.value === '') return;
              let day = list.find(item => item.id == 'col_24');
              if(!day || day.value === '') return;
              let price = list.find(item => item.id == 'col_83');
              if(!price || price.value === '') return;
              let targetIndex = list.findIndex(item => item.id == 'col_25');
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: Math.round(price.value * ( month.value - 0 + day.value / 30) * 100) / 100 + ''
              }))
            }
          },
          ()=>{
            if(current.id == 'col_25'){ // 租金总额 大写
              let targetIndex = list.findIndex(item => item.id == 'col_270')
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: current.value ? util.numberRecoverChinese(current.value) : ''
              }))
            }
          },
          ()=>{
            if(current.id == 'col_83'){ // 月租金 月租金大写
              let targetIndex = list.findIndex(item => item.id == 'col_26')
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: current.value ? util.numberRecoverChinese(current.value) : ''
              }))
            }
          },
          ()=>{
            if(current.id == 'col_29'){ // 服务费 服务费大写
              let targetIndex = list.findIndex(item => item.id == 'col_30')
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: current.value ? util.numberRecoverChinese(current.value) : ''
              }))
            }
          },
          ()=>{ //  处理总楼层  col_6 总楼层  col_37 有无电梯  总楼层超过8层（含）默认有电梯
            if(current.id == 'col_6'){
              let targetIndex = list.findIndex(item => item.id == 'col_37')
              this.mergeList(targetIndex, Object.assign({},list[targetIndex],{
                value: current.value >= 8 ? '有' : '无'
              }))
            }
          },
          ()=>{ // isShow5758  出租法定代表人 col_57 出租法定代表人证件号 col_58
            if(current.id == 'isShow5758'){
              let col_57_index = list.findIndex(item => item.id == 'col_57');

              this.mergeList(col_57_index, Object.assign({},list[col_57_index],{
                show: current.value == '有'
              }))

              let col_58_index = list.findIndex(item => item.id == 'col_58');
              this.mergeList(col_58_index, Object.assign({},list[col_58_index],{
                show: current.value == '有'
              }))
            }
          },
          ()=>{ // isShow5960 出租代理人 col_59 出租代理人电话  col_60
            if(current.id == 'isShow5960'){
              let col_59_index = list.findIndex(item => item.id == 'col_59');

              this.mergeList(col_59_index, Object.assign({},list[col_59_index],{
                show: current.value == '有'
              }))

              let col_60_index = list.findIndex(item => item.id == 'col_60');
              this.mergeList(col_60_index, Object.assign({},list[col_60_index],{
                show: current.value == '有'
              }))
            }
          },
          ()=>{
            // isShow7071 承租法定代表人 col_70 承租法定代表人证件号  col_71
            if(current.id == 'isShow7071'){
              let col_70_index = list.findIndex(item => item.id == 'col_70');

              this.mergeList(col_70_index, Object.assign({},list[col_70_index],{
                show: current.value == '有'
              }))

              let col_71_index = list.findIndex(item => item.id == 'col_71');
              this.mergeList(col_71_index, Object.assign({},list[col_71_index],{
                show: current.value == '有'
              }))
            }
          },
          ()=>{
            //col_54 出租人 col_62 所有权人
            if(current.id == 'col_54'){
              let col_62_index = list.findIndex(item => item.id == 'col_62');
              this.mergeList(col_62_index, Object.assign({},list[col_62_index],{
                value: current.value + ''
              }))
            }
          },
          ()=>{
            // col_133 空调数量
            if(current.id == 'col_133'){
              let col_65_index = list.findIndex(item => item.id == 'col_65');
              this.mergeList(col_65_index, Object.assign({},list[col_65_index],{
                value: current.value + ''
              }))
            }
          },
          ()=>{
            // 监听实际居住人数
            if(current.id == 'col_72'){
              let juzhucount = current.value;
              list.forEach((item,item_index)=>{
                if(['col_85','col_81','col_82'].includes(item.id)){ // 第5个隐藏 居住人5 col_85 居住人5证件编号 col_81 居住人5联系电话  col_82
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: juzhucount > 4
                  }))
                }
                if(['col_79','col_80'].includes(item.id)){ // 第4个隐藏 居住人4 col_79 居住人4证件编号 col_80
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: juzhucount > 3
                  }))
                }
                if(['col_76','col_77','col_78'].includes(item.id)){ // 第3个隐藏 居住人3  col_76 居住人3证件编号 col_77 居住人3联系电话 col_78
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: juzhucount > 2
                  }))
                }
                if(['col_73','col_74','col_75'].includes(item.id)){ // 第2个隐藏 居住人2 col_73 居住人2证件编号 col_74 居住人2联系电话 col_75
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: juzhucount > 1
                  }))
                }
              })
            }
          },
          ()=>{
            if(current.id == 'isShowSDQ'){ // 水电气度数 "厨房冷水,卫生间冷水,中水,热水,电,煤/燃气,卫生费,公共电费,上网费",
              let isShowSDQ = current.value.split(',');
              list.forEach((item,item_index)=>{
                if(['col_97','col_98','col_99'].includes(item.id)){ // 厨房冷水现底数  col_97  厨房冷水已截至 col_98 厨房冷水卡情况  col_99
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('厨房冷水')
                  }))
                }

                if(['col_100','col_101','col_102'].includes(item.id)){ // 卫生间冷水现底数 col_100  卫生间冷水已截至 col_101  卫生间冷水卡情况  col_102
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('卫生间冷水')
                  }))
                }

                if(['col_103','col_104','col_105'].includes(item.id)){ // 中水现底数  col_103  中水已截至  col_104  中水卡情况  col_105
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('中水')
                  }))
                }

                if(['col_106','col_107','col_108'].includes(item.id)){ // 水现底数  col_106  水已截至  col_107  水卡情况  col_108
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('水')
                  }))
                }

                if(['col_109','col_110','col_111'].includes(item.id)){ // 电现底数 col_109  电已截至 col_110  电卡情况 col_111
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('电')
                  }))
                }

                if(['col_112','col_113','col_114'].includes(item.id)){ // 煤/燃气现底数  col_112  煤/燃气已截至  col_113  煤/燃气卡情况  col_114
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('煤/燃气')
                  }))
                }

                if(['col_115','col_119','col_116'].includes(item.id)){ // 卫生费价格  col_115  卫生费备注  col_119  卫生费已截至时间 col_116
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('卫生费')
                  }))
                }

                if(['col_117','col_118','col_120'].includes(item.id)){ // 公共电费 col_117  公共电费已截至时间  col_118  公共电费备注 col_120
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('公共电费')
                  }))
                }

                if(['col_121','col_122','col_123'].includes(item.id)){ // 上网费价格  col_121  上网费已截至时间 col_122  上网费备注  col_123
                  this.mergeList(item_index, Object.assign({},list[item_index],{
                    show: isShowSDQ.includes('公共电费')
                  }))
                }
              })
            }
          },
          ()=>{
            if(current.id == 'isShowJJDQ'){ // "电视,机顶盒,空调,冰箱,微波炉,煤气灶,抽油烟机,洗衣机,热水器,床,床头柜,梳妆台,书桌,衣柜,电脑桌,沙发,茶几,餐桌,餐椅,鞋柜,坐便,地漏,水龙头,防盗门,客厅,卧室,厨卫,窗户,阳台,保修单,遥控器,门禁,钥匙,智能锁,水卡数量,电卡数量,燃气卡数量,路由器数量,其它家具电器",
              let isShowSDQ = current.value.split(',');
              let col_66_index = list.findIndex(item => item.id == 'col_66');
              this.mergeList(col_66_index, Object.assign({},list[col_66_index],{
                value: isShowSDQ.length + ''
              }))

              list.forEach((item,item_index)=>{
                // 电视品牌/质地  col_124 电视数量  col_125  电视型号 col_126  电视状况备注 col_127
                if(['col_124','col_125','col_126','col_127'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('电视')
                     }))
                }

                // 机顶盒品牌/质地 col_128 机顶盒数量 col_129 机顶盒型号 col_130  机顶盒状况备注  col_131
                if(['col_128','col_129','col_130','col_131'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('机顶盒')
                     }))
                }

                // 空调品牌/质地  col_132 空调数量  col_133 空调型号  col_134  空调状况备注 col_135
                if(['col_132','col_133','col_134','col_135'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('空调')
                     }))
                     if(item.id == 'col_133'){
                        let col_65_index = list.findIndex(item => item.id == 'col_65');
                        if(isShowSDQ.includes('空调')){
                          this.mergeList(col_65_index, Object.assign({},list[col_65_index],{
                            value: item.value + ''
                          }))
                        }else{
                          this.mergeList(col_65_index, Object.assign({},list[col_65_index],{
                            value: ''
                          }))
                        }
                     }

                }

                // 冰箱品牌/质地  col_136 冰箱数量  col_137 冰箱型号  col_138  冰箱状况备注 col_139
                if(['col_136','col_137','col_138','col_139'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('冰箱')
                     }))
                }

                // 微波炉品牌/质地 col_140 微波炉型号 col_141 微波炉数量 col_142  微波炉状况备注  col_143
                if(['col_140','col_141','col_142','col_143'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('微波炉')
                     }))
                }

                // 煤气灶品牌/质地 col_144 煤气灶数量 col_145 煤气灶型号 col_146  煤气灶状况备注  col_147
                if(['col_144','col_145','col_146','col_147'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('煤气灶')
                     }))
                }

                // 抽油烟机品牌/质地  col_148 抽油烟机数量  col_149 抽油烟机型号  col_94  抽油烟机装备备注  col_150
                if(['col_148','col_149','col_94','col_150'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('抽油烟机')
                     }))
                }

                // 洗衣机品牌/质地 col_151 洗衣机数量 col_152 洗衣机型号 col_153  洗衣机状况备注  col_154
                if(['col_151','col_152','col_153','col_154'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('洗衣机')
                     }))
                }

                // 热水器品牌/质地 col_155 热水器数量 col_156 热水器型号 col_157  热水器状况备注  col_158
                if(['col_155','col_156','col_157','col_158'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('热水器')
                     }))
                }

                // 床品牌/质地 col_159 床数量 col_160 床型号 col_161  床状况备注  col_162
                if(['col_159','col_160','col_161','col_162'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('床')
                     }))
                }

                // 床头柜品牌/质地 col_163 床头柜数量 col_164 床头柜型号 col_165  床头柜状况备注  col_166
                if(['col_163','col_164','col_165','col_166'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('床头柜')
                     }))
                }

                // 梳妆台品牌/质地 col_167 梳妆台数量 col_168 梳妆台型号 col_169  梳妆台状况备注  col_170
                if(['col_167','col_168','col_169','col_170'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('梳妆台')
                     }))
                }

                // 书桌品牌/质地  col_171 书桌数量  col_172 书桌型号  col_173  书桌状况备注 col_174
                if(['col_171','col_172','col_173','col_174'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('书桌')
                     }))
                }

                // 衣柜品牌/质地  col_175 衣柜数量  col_176 衣柜型号  col_177  衣柜状况备注 col_178
                if(['col_175','col_176','col_177','col_178'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('衣柜')
                     }))
                }

                // 电脑桌品牌/质地 col_179 电脑桌数量 col_180 电脑桌型号 col_181 电脑桌状况备注 col_182
                if(['col_179','col_180','col_181','col_182'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('电脑桌')
                     }))
                }

                // 沙发品牌/质地 col_183 沙发数量 col_184 沙发型号 col_185 沙发状况备注 col_186
                if(['col_183','col_184','col_185','col_186'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('沙发')
                     }))
                }

                // 茶几品牌/质地 col_187 茶几数量 col_188 茶几型号 col_189 茶几状况备注 col_190
                if(['col_187','col_188','col_189','col_190'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('茶几')
                     }))
                }

                // 餐桌品牌/质地 col_191 餐桌数量 col_192 餐桌型号 col_193 餐桌状况备注 col_194
                if(['col_191','col_192','col_193','col_194'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('餐桌')
                     }))
                }

                // 餐椅品牌/质地 col_195 餐椅数量 col_196 餐椅型号 col_197 餐椅状况备注 col_198
                if(['col_195','col_196','col_197','col_198'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('餐椅')
                     }))
                }

                // 鞋柜品牌/质地 col_199 鞋柜数量 col_200 鞋柜型号 col_201 鞋柜状况备注 col_202
                if(['col_199','col_200','col_201','col_202'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('鞋柜')
                     }))
                }

                // 坐便品牌/质地 col_203 坐便数量 col_204 坐便型号 col_205 坐便状况备注 col_206
                if(['col_203','col_204','col_205','col_206'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('坐便')
                     }))
                }

                // 地漏品牌/质地 col_207 地漏数量 col_208 地漏型号 col_209 地漏状况备注 col_210
                if(['col_207','col_208','col_209','col_210'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('地漏')
                     }))
                }

                // 水龙头品牌/质地 col_211 水龙头数量 col_212 水龙头型号 col_213 水龙头状况备注 col_214
                if(['col_211','col_212','col_213','col_214'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('水龙头')
                     }))
                }

                // 防盗门品牌/质地 col_215 防盗门数量 col_216 防盗门型号 col_217 防盗门状况备注 col_218
                if(['col_215','col_216','col_217','col_218'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('防盗门')
                     }))
                }

                // 客厅地砖 col_219 客厅木地板 col_220 客厅水泥地 col_221 客厅地面备注 col_222
                if(['col_219','col_220','col_221','col_222'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('客厅')
                     }))
                }

                // 卧室地砖 col_223 卧室木地板 col_224 卧室水泥地 col_225 卧室地面备注 col_226
                if(['col_223','col_224','col_225','col_226'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('卧室')
                     }))
                }

                // 厨卫瓷砖 col_227 厨卫未贴砖 col_228 厨卫马赛克 col_229 厨卫备注 col_230
                if(['col_227','col_228','col_229','col_230'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('厨卫')
                     }))
                }

                // 窗户木窗 col_231 窗户铝合金 col_232 窗户塑钢 col_233 窗户备注 col_234
                if(['col_231','col_232','col_233','col_234'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('窗户')
                     }))
                }

                // 阳台未封 col_235 阳台铝合金 col_236 阳台塑钢 col_237 阳台备注 col_238
                if(['col_235','col_236','col_237','col_238'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('阳台')
                     }))
                }

                // 保修单数量 col_239 保修单包括 col_240
                if(['col_239','col_240'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('保修单')
                     }))
                }

                // 电视遥控器几个 col_241 空调遥控器几个 col_242 机顶盒遥控器几个 col_243 遥控器备注 col_244
                if(['col_241','col_242','col_243','col_244'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('遥控器')
                     }))
                }

                // 门禁卡几张  col_246 门禁卡备注 col_247
                if(['col_246','col_247'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('门禁')
                     }))
                }

                // 防盗门钥匙数量 col_248 房屋钥匙数量 col_249 其它钥匙数量 col_250 钥匙备注 col_251
                if(['col_248','col_249','col_250','col_251'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('钥匙')
                     }))
                }

                // 大门智能锁数量 col_252 房屋智能锁数量 col_253 智能锁备注 col_254
                if(['col_252','col_253','col_254'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('智能锁')
                     }))
                }

                // 水卡数量 col_255
                if(['col_255'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('水卡数量')
                     }))
                }

                // 电卡数量 col_256
                if(['col_256'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('电卡数量')
                     }))
                }

                // 燃气卡数量 col_257
                if(['col_257'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('燃气卡数量')
                     }))
                }

                // 路由器数量 col_258
                if(['col_258'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('路由器数量')
                     }))
                }

                // 其它家具电器 col_259
                if(['col_259'].includes(item.id)){
                     this.mergeList(item_index, Object.assign({},list[item_index],{
                          show: isShowSDQ.includes('其它家具电器')
                     }))
                }

              })
            }
          },
          ()=>{
            // col_42 承办人 承办人信息卡号  col_43 承办人信息卡号
            if(current.id == 'col_42'){
              let col_42_index = list.findIndex(item => item.id == 'col_42');
              let col_43_index = list.findIndex(item => item.id == 'col_43');
              this.getUserInfo(current.value,true).then(res=>{
                if(res.is_success == 0){
                  let jinjiren  = res.content[0] || {};
                  this.mergeList(col_43_index, Object.assign({},list[col_43_index],{
                    value: jinjiren.xxkh || '',
                    data: jinjiren
                  }))
                  this.mergeList(col_42_index, Object.assign({},list[col_42_index],{
                    value: current.value,
                    data: jinjiren
                  }))
                }
              })
            }
          },
          ()=>{
            // col_50 经纪人 col_51 执业证书
            if(current.id == 'col_50'){
              let col_51_index = list.findIndex(item => item.id == 'col_51');
              this.getUserInfo(current.value,true).then(res=>{
                if(res.is_success == 0){
                  let jinjiren  = res.content[0] || {};
                  this.mergeList(col_51_index, Object.assign({},list[col_51_index],{
                    value: jinjiren.zsbh || ''
                  }))
                }
              })
            }
          },
          ()=>{
            // col_52 经纪人 col_53 执业证书
            if(current.id == 'col_52'){
              let col_53_index = list.findIndex(item => item.id == 'col_53');
              this.getUserInfo(current.value,true).then(res=>{
                if(res.is_success == 0){
                  let jinjiren  = res.content[0] || {};
                  this.mergeList(col_53_index, Object.assign({},list[col_53_index],{
                    value: jinjiren.zsbh || ''
                  }))
                }
              })
            }
          }
        ]
        taskList.forEach(item=> item())
      },
      mergeList(index,obj){
        let result = this.list.concat([]);
        result[index] = obj;
        localCacheData[obj.id] = obj.value;
        // util.setLocalStorage(localCacheDataKey,JSON.stringify(localCacheData));
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

          if(item.id == 'col_245'){ // col_17 col_18 col_19 col_20 col_21 col_22
            let date = new Date(item.value.replace('年','/').replace('月','/').replace('日','/'))
            data['col_17'] = date.getFullYear();
            data['col_18'] = date.getMonth()+1;
            data['col_19'] = date.getDate();
          }
          if(item.id == 'col_84'){
            let date = new Date(item.value.replace('年','/').replace('月','/').replace('日','/'))
            data['col_20'] = date.getFullYear();
            data['col_21'] = date.getMonth()+1;
            data['col_22'] = date.getDate();
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
            this.$router.replace({name:'contractDetail',query: { id: res.content, type: 'edit'}})
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
        for(let i = nowYear - 15; i <= nowYear + 15; i++) {
          if(date.getFullYear() == i) valueIndex.push(i - nowYear + 15)
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


          if(['col_18','col_19','col_21','col_22','col_17','col_20'].includes(item.col_en)) return;

          if(this.$route.query.type != 'preview'){
            // 出租法定代表人 col_57 出租法定代表人证件号 col_58
            if(item.col_en == 'col_57'){
              params.push(this.getItem({
                col_en: "isShow5758",
                col_isbt: "是",
                col_type: "单选钮",
                col_zh: "出租法定代表人",
                col_json: "有,无"
              }))
            }
            // 出租代理人 col_59 出租代理人电话  col_60
            if(item.col_en == 'col_59'){
              params.push(this.getItem({
                col_en: "isShow5960",
                col_isbt: "是",
                col_type: "单选钮",
                col_zh: "出租代理人",
                col_json: "有,无"
              }))
            }

            // 承租法定代表人 col_70 承租法定代表人证件号  col_71
            if(item.col_en == 'col_70'){
              params.push(this.getItem({
                col_en: "isShow7071",
                col_isbt: "是",
                col_type: "单选钮",
                col_zh: "承租法定代表人",
                col_json: "有,无"
              }))
            }

            // 水电气 厨房冷水现底数  col_97
            if(item.col_en == 'col_97'){
              params.push(this.getItem({
                col_en: "isShowSDQ",
                col_isbt: "否",
                col_type: "多选框",
                col_zh: "水电气度数",
                col_json: "厨房冷水,卫生间冷水,中水,水,电,煤/燃气,卫生费,公共电费,上网费",
                showModle: false
              }))
            }

            // 家具电器设备 电视品牌/质地 col_124
            if(item.col_en == 'col_124'){
              params.push(this.getItem({
                col_en: "isShowJJDQ",
                col_isbt: "否",
                col_type: "多选框",
                col_zh: "家具电器设备",
                col_json: "电视,机顶盒,空调,冰箱,微波炉,煤气灶,抽油烟机,洗衣机,热水器,床,床头柜,梳妆台,书桌,衣柜,电脑桌,沙发,茶几,餐桌,餐椅,鞋柜,坐便,地漏,水龙头,防盗门,客厅,卧室,厨卫,窗户,阳台,保修单,遥控器,门禁,钥匙,智能锁,水卡数量,电卡数量,燃气卡数量,路由器数量,其它家具电器",
                showModle: false
              }))
            }
          }
          params.push(item);
        })
        return params;
      },
      initHtData(list,catchData){
        let config = [];
        list.forEach(item=>{
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
            systemHide: item.col_isview == '否'
          });

          if(['col_65','col_66','col_261','col_262','col_263','col_264','col_265','col_266',].includes(data.id)){
            data.page = 3;
          }
          if(data.name.indexOf('联系电话') !== -1){
            data.verify = 'phone'
          }

          if(data.id == 'add_user') data.value = util.getLocalStorage('userid');
          if(data.type == '日期' && data.value){
            let str = data.value.replace('年','/').replace('月','/').replace('日','/')
            data.data = new Date(str)
          }
          if(['col_42','col_43'].includes(data.id) && catchData['col_43']){
            data.data = { xxkh: catchData['col_43']}
          }

          config.push(data);
        })


        if(this.$route.query.type != 'preview'){
          // isShow5758  出租法定代表人 col_57 出租法定代表人证件号 col_58
          let isShow5758 = config.findIndex(item => item.id == 'isShow5758');
          let col_57_index = config.findIndex(item => item.id == 'col_57');
          let col_58_index = config.findIndex(item => item.id == 'col_58');
          if(!config[col_58_index].value && !config[col_58_index].value){
            config[isShow5758].value = '无';
            config[col_57_index].show = false;
            config[col_58_index].show = false;
          }else{
            config[isShow5758].value = '有';
          }

          // isShow5960 出租代理人 col_59 出租代理人电话  col_60
          let isShow5960 = config.findIndex(item => item.id == 'isShow5960');
          let col_59_index = config.findIndex(item => item.id == 'col_59');
          let col_60_index = config.findIndex(item => item.id == 'col_60');
          if(!config[col_59_index].value && !config[col_60_index].value){
            config[isShow5960].value = '无';
            config[col_59_index].show = false;
            config[col_60_index].show = false;
          }else{
            config[isShow5960].value = '有';
          }

          // isShow7071 承租法定代表人 col_70 承租法定代表人证件号  col_71
          let isShow7071 = config.findIndex(item => item.id == 'isShow7071');
          let col_70_index = config.findIndex(item => item.id == 'col_70');
          let col_71_index = config.findIndex(item => item.id == 'col_71');
          if(!config[col_70_index].value && !config[col_71_index].value){
            config[isShow7071].value = '无';
            config[col_70_index].show = false;
            config[col_71_index].show = false;
          }else{
            config[isShow7071].value = '有';
          }

          // 实际居住人数 col_72
          let shijijuzhu_index = config.findIndex(item => item.id == 'col_72');
          let juzhucount = config[shijijuzhu_index].value;
          config[shijijuzhu_index].page = 2;
          config.forEach(item=>{
            if(['col_85','col_81','col_82'].includes(item.id)){ // 第5个隐藏 居住人5 col_85 居住人5证件编号 col_81 居住人5联系电话  col_82
              item.show = juzhucount > 4;
              item.page = 2;
            }
            if(['col_79','col_80'].includes(item.id)){ // 第4个隐藏 居住人4 col_79 居住人4证件编号 col_80
              item.show = juzhucount > 3;
              item.page = 2;
            }
            if(['col_76','col_77','col_78'].includes(item.id)){ // 第3个隐藏 居住人3  col_76 居住人3证件编号 col_77 居住人3联系电话 col_78
              item.show = juzhucount > 2;
              item.page = 2;
            }
            if(['col_73','col_74','col_75'].includes(item.id)){ // 第2个隐藏 居住人2 col_73 居住人2证件编号 col_74 居住人2联系电话 col_75
              item.show = juzhucount > 1;
              item.page = 2;
            }
          })

          // 水电气度数 "厨房冷水,卫生间冷水,中水,热水,电,煤/燃气,卫生费,公共电费,上网费",
          let isShowSDQ_index = config.findIndex(item => item.id == 'isShowSDQ');
          let isShowSDQ = [];

          let fastHandle = (keys,name,values,isShow)=>{
            let list_index = [];
            keys.forEach(key=>{
              list_index.push(config.findIndex(item => item.id == key))
            })
            let isHave = false;
            list_index.forEach(col_index=>{
              if(config[col_index].value && config[col_index].value != config[col_index].col_default) isHave = true;
              config[col_index].page = 2;
            })
            if(isHave || isShow){
              values.push(name);
            }else{
              list_index.forEach(col_index=>{
                config[col_index].show = false;
              })
            }
          }

          // 厨房冷水现底数  col_97  厨房冷水已截至 col_98 厨房冷水卡情况  col_99
          fastHandle(['col_97','col_98','col_99'],'厨房冷水',isShowSDQ)

          // 卫生间冷水现底数 col_100  卫生间冷水已截至 col_101  卫生间冷水卡情况  col_102
          fastHandle(['col_100','col_101','col_102'],'卫生间冷水',isShowSDQ)

          // 中水现底数  col_103  中水已截至  col_104  中水卡情况  col_105
          fastHandle(['col_103','col_104','col_105'],'中水',isShowSDQ)

          // 水现底数  col_106  水已截至  col_107  水卡情况  col_108
          fastHandle(['col_106','col_107','col_108'],'水',isShowSDQ, true)

          // 电现底数 col_109  电已截至 col_110  电卡情况 col_111
          fastHandle(['col_109','col_110','col_111'],'电',isShowSDQ, true)

          // 煤/燃气现底数  col_112  煤/燃气已截至  col_113  煤/燃气卡情况  col_114
          fastHandle(['col_112','col_113','col_114'],'煤/燃气',isShowSDQ, true)

          // 卫生费价格  col_115  卫生费备注  col_119  卫生费已截至时间 col_116
          fastHandle(['col_115','col_119','col_116'],'卫生费',isShowSDQ)

          // 公共电费 col_117  公共电费已截至时间  col_118  公共电费备注 col_120
          fastHandle(['col_117','col_118','col_120'],'公共电费',isShowSDQ)

          // 上网费价格  col_121  上网费已截至时间 col_122  上网费备注  col_123
          fastHandle(['col_121','col_122','col_123'],'上网费',isShowSDQ)

          config[isShowSDQ_index].value = isShowSDQ.join(',');
          config[isShowSDQ_index].page = 2

          // "电视,机顶盒,空调,冰箱,微波炉,煤气灶,抽油烟机,洗衣机,热水器,床,床头柜,梳妆台,书桌,衣柜,电脑桌,沙发,茶几,餐桌,餐椅,鞋柜,坐便,地漏,水龙头,防盗门,客厅,卧室,厨卫,窗户,阳台,保修单,遥控器,门禁,钥匙,智能锁,水卡数量,电卡数量,燃气卡数量,路由器数量,其它家具电器",
          let isShowJJDQ_index = config.findIndex(item => item.id == 'isShowJJDQ');
          let isShowJJDQ = [];

          // 电视品牌/质地  col_124 电视数量  col_125  电视型号 col_126  电视状况备注 col_127
          fastHandle(['col_124','col_125','col_126','col_127'],'电视',isShowJJDQ)

          // 机顶盒品牌/质地 col_128 机顶盒数量 col_129 机顶盒型号 col_130  机顶盒状况备注  col_131
          fastHandle(['col_128','col_129','col_130','col_131'],'机顶盒',isShowJJDQ)

          // 空调品牌/质地  col_132 空调数量  col_133 空调型号  col_134  空调状况备注 col_135
          fastHandle(['col_132','col_133','col_134','col_135'],'空调',isShowJJDQ)

          // 冰箱品牌/质地  col_136 冰箱数量  col_137 冰箱型号  col_138  冰箱状况备注 col_139
          fastHandle(['col_136','col_137','col_138','col_139'],'冰箱',isShowJJDQ)

          // 微波炉品牌/质地 col_140 微波炉型号 col_141 微波炉数量 col_142  微波炉状况备注  col_143
          fastHandle(['col_140','col_141','col_142','col_143'],'微波炉',isShowJJDQ)

          // 煤气灶品牌/质地 col_144 煤气灶数量 col_145 煤气灶型号 col_146  煤气灶状况备注  col_147
          fastHandle(['col_144','col_145','col_146','col_147'],'煤气灶',isShowJJDQ)

          // 抽油烟机品牌/质地  col_148 抽油烟机数量  col_149 抽油烟机型号  col_94  抽油烟机装备备注  col_150
          fastHandle(['col_148','col_149','col_94','col_150'],'抽油烟机',isShowJJDQ)

          // 洗衣机品牌/质地 col_151 洗衣机数量 col_152 洗衣机型号 col_153  洗衣机状况备注  col_154
          fastHandle(['col_151','col_152','col_153','col_154'],'洗衣机',isShowJJDQ)

          // 热水器品牌/质地 col_155 热水器数量 col_156 热水器型号 col_157  热水器状况备注  col_158
          fastHandle(['col_155','col_156','col_157','col_158'],'热水器',isShowJJDQ)

          // 床品牌/质地 col_159 床数量 col_160 床型号 col_161  床状况备注  col_162
          fastHandle(['col_159','col_160','col_161','col_162'],'床',isShowJJDQ)

          // 床头柜品牌/质地 col_163 床头柜数量 col_164 床头柜型号 col_165  床头柜状况备注  col_166
          fastHandle(['col_163','col_164','col_165','col_166'],'床头柜',isShowJJDQ)

          // 梳妆台品牌/质地 col_167 梳妆台数量 col_168 梳妆台型号 col_169  梳妆台状况备注  col_170
          fastHandle(['col_167','col_168','col_169','col_170'],'梳妆台',isShowJJDQ)

          // 书桌品牌/质地  col_171 书桌数量  col_172 书桌型号  col_173  书桌状况备注 col_174
          fastHandle(['col_171','col_172','col_173','col_174'],'书桌',isShowJJDQ)

          // 衣柜品牌/质地  col_175 衣柜数量  col_176 衣柜型号  col_177  衣柜状况备注 col_178
          fastHandle(['col_175','col_176','col_177','col_178'],'衣柜',isShowJJDQ)

          // 电脑桌品牌/质地 col_179 电脑桌数量 col_180 电脑桌型号 col_181 电脑桌状况备注 col_182
          fastHandle(['col_179','col_180','col_181','col_182'],'电脑桌',isShowJJDQ)

          // 沙发品牌/质地 col_183 沙发数量 col_184 沙发型号 col_185 沙发状况备注 col_186
          fastHandle(['col_183','col_184','col_185','col_186'],'沙发',isShowJJDQ)

          // 茶几品牌/质地 col_187 茶几数量 col_188 茶几型号 col_189 茶几状况备注 col_190
          fastHandle(['col_187','col_188','col_189','col_190'],'茶几',isShowJJDQ)

          // 餐桌品牌/质地 col_191 餐桌数量 col_192 餐桌型号 col_193 餐桌状况备注 col_194
          fastHandle(['col_191','col_192','col_193','col_194'],'餐桌',isShowJJDQ)

          // 餐椅品牌/质地 col_195 餐椅数量 col_196 餐椅型号 col_197 餐椅状况备注 col_198
          fastHandle(['col_195','col_196','col_197','col_198'],'餐椅',isShowJJDQ)

          // 鞋柜品牌/质地 col_199 鞋柜数量 col_200 鞋柜型号 col_201 鞋柜状况备注 col_202
          fastHandle(['col_199','col_200','col_201','col_202'],'鞋柜',isShowJJDQ)

          // 坐便品牌/质地 col_203 坐便数量 col_204 坐便型号 col_205 坐便状况备注 col_206
          fastHandle(['col_203','col_204','col_205','col_206'],'坐便',isShowJJDQ)

          // 地漏品牌/质地 col_207 地漏数量 col_208 地漏型号 col_209 地漏状况备注 col_210
          fastHandle(['col_207','col_208','col_209','col_210'],'地漏',isShowJJDQ)

          // 水龙头品牌/质地 col_211 水龙头数量 col_212 水龙头型号 col_213 水龙头状况备注 col_214
          fastHandle(['col_211','col_212','col_213','col_214'],'水龙头',isShowJJDQ)

          // 防盗门品牌/质地 col_215 防盗门数量 col_216 防盗门型号 col_217 防盗门状况备注 col_218
          fastHandle(['col_215','col_216','col_217','col_218'],'防盗门',isShowJJDQ)

          // 客厅地砖 col_219 客厅木地板 col_220 客厅水泥地 col_221 客厅地面备注 col_222
          fastHandle(['col_219','col_220','col_221','col_222'],'客厅',isShowJJDQ)

          // 卧室地砖 col_223 卧室木地板 col_224 卧室水泥地 col_225 卧室地面备注 col_226
          fastHandle(['col_223','col_224','col_225','col_226'],'卧室',isShowJJDQ)

          // 厨卫瓷砖 col_227 厨卫未贴砖 col_228 厨卫马赛克 col_229 厨卫备注 col_230
          fastHandle(['col_227','col_228','col_229','col_230'],'厨卫',isShowJJDQ)

          // 窗户木窗 col_231 窗户铝合金 col_232 窗户塑钢 col_233 窗户备注 col_234
          fastHandle(['col_231','col_232','col_233','col_234'],'窗户',isShowJJDQ)

          // 阳台未封 col_235 阳台铝合金 col_236 阳台塑钢 col_237 阳台备注 col_238
          fastHandle(['col_235','col_236','col_237','col_238'],'阳台',isShowJJDQ)

          // 保修单数量 col_239 保修单包括 col_240
          fastHandle(['col_239','col_240'],'保修单',isShowJJDQ)

          // 电视遥控器几个 col_241 空调遥控器几个 col_242 机顶盒遥控器几个 col_243 遥控器备注 col_244
          fastHandle(['col_241','col_242','col_243','col_244'],'遥控器',isShowJJDQ)

          // 门禁卡几张  col_246  门禁卡备注 col_247
          fastHandle(['col_246','col_247'],'门禁',isShowJJDQ)

          // 防盗门钥匙数量 col_248 房屋钥匙数量 col_249 其它钥匙数量 col_250 钥匙备注 col_251
          fastHandle(['col_248','col_249','col_250','col_251'],'钥匙',isShowJJDQ)

          // 大门智能锁数量 col_252 房屋智能锁数量 col_253 智能锁备注 col_254
          fastHandle(['col_252','col_253','col_254'],'智能锁',isShowJJDQ)

          // 水卡数量 col_255
          fastHandle(['col_255'],'水卡数量',isShowJJDQ)

          // 电卡数量 col_256
          fastHandle(['col_256'],'电卡数量',isShowJJDQ)

          // 燃气卡数量 col_257
          fastHandle(['col_257'],'燃气卡数量',isShowJJDQ)

          // 路由器数量 col_258
          fastHandle(['col_258'],'路由器数量',isShowJJDQ)

          // 其它家具电器 col_259
          fastHandle(['col_259'],'其它家具电器',isShowJJDQ)

          config[isShowJJDQ_index].value = isShowJJDQ.join(',');
          config[isShowJJDQ_index].page = 2

          // function a(name){
          //   var str = '', list = []
          //   $("td:contains('"+name+"')").closest('tr').each(function(){
          //       str += $(this).children().eq(0).text() + ' ' + $(this).children().eq(1).text() + ' ';
          //       list.push($(this).children().eq(1).text())
          //   })
          //   console.log(`// ${str} \nfastHandle(['${list.join("','")}'],'${name}',isShowJJDQ)`)
          // }

        }


        this.list = config;
        this.size = Math.round(config.length / 3) + 10;
      },
      getCacheCol(){
        let catchData = {};
        // try{
        //   let str = util.getLocalStorage(localCacheDataKey)
        //   if(str){
        //     catchData = JSON.parse(str)
        //   }
        // }catch(e){
        //   catchData = {}
        // }
        return catchData;
      },
      initHouseInfo(data){
        actions.getHouseDetail(this.$route.query.fwid,3).then(res=>{
          if(res.is_success == 0){
            this.house = res.content[0];
            this.list.forEach((item,index)=>{
              if(['t_fangwu','t_fangwu_zu'].includes(item.table_name) && item.table_col && !item.value ){
                if(item.col_en == 'col_4'){
                  let value = this.house.xiaoqumingcheng_id + this.house.suozailou_id + this.house.suozaidanyuan_id+ '单元' + this.house.fanghao;
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
      initJinjiRen(data){
        this.getUserInfo(util.getLocalStorage('xingming')).then(res=>{
          if(res.is_success == 0){
            this.jinjiren = res.content[0] || {};
            this.list.forEach((item,index)=>{
              if(item.table_name == 't_jingjiren' && item.table_col && !item.value ){
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

            if(item.verify == 'phone' && item.value.length != 11){
              this.isCheck = true;
              util.showToast( '请输入正确的'+ item.name);
              return;
            }
          }


          if(item.value && (item.show || item.systemHide) ){
            data[item.id] = item.value;
          }

          if(item.id == 'col_245'){ // col_17 col_18 col_19 col_20 col_21 col_22
            let date = new Date(item.value.replace('年','/').replace('月','/').replace('日','/'))
            data['col_17'] = date.getFullYear();
            data['col_18'] = date.getMonth()+1;
            data['col_19'] = date.getDate();
          }
          if(item.id == 'col_84'){
            let date = new Date(item.value.replace('年','/').replace('月','/').replace('日','/'))
            data['col_20'] = date.getFullYear();
            data['col_21'] = date.getMonth()+1;
            data['col_22'] = date.getDate();
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
            this.$router.replace({name:'contractList'});
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
            background-image: url(../images/arrow-right-666.png);
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
              background-image: url(../images/icon-unselected.png);
              background-size: 0.32rem;
              background-repeat: no-repeat;
              background-position: left center;
              &.selected{
                background-image: url(../images/icon-selected.png);
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
