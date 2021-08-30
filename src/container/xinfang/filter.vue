<template>
    <div class="component-filter" @click.self="$emit('change','close')" ref="wrapper">
      <ul class="filter-nav">
      <li v-for="filter in filterList" @click="selectType = filter.type" :style="{color:filter.type == selectType ? '#00ae66': '#333333'}">
        {{filter.title}}
        <svgicon class="filter-icon" name="triangle" width=".2rem" height=".2rem"
          :color="filter.type == selectType ? '#00ae66': '#333333'"
          :dir="filter.type == selectType ? 'left': ''"
        ></svgicon>
      </li>
      </ul>

    <div :class="['wp-area',select.area.id ? 'level3':'level2']" v-if="selectType == 'area'">
      <ul class="wp-area-level wp-area-level1 scrollWrapper">
        <li class="check">北京市</li>
      </ul>
      <ul class="wp-area-level wp-area-level2 scrollWrapper">
        <li v-for="area in areaList" @click="selectArea(area)" :class='{check:select.area.id == area.id}'>{{area.name}}</li>
      </ul>
      <ul class="wp-area-level wp-area-level3 scrollWrapper" v-if="select.area.id">
        <li v-for="area in area2List" @click="selectArea2(area)" :class='{check:select.area2.id == area.id}'>{{area.name}}</li>
      </ul>
    </div>
    <div class="wp-price" v-if="selectType == 'price'">
      <ul class="wp-price-list scrollWrapper">
        <li v-for="price in priceList" @click="selectPrice(1,price)" :class="{check:select.price.id == price.id}">{{price.name}}</li>
        <li class="price-self">
          自定义价格
          <input class="price-self-input price-self-min" type="number" v-model="priceself.min" placeholder="最小">
          <span class="price-self-line">-</span>
          <input class="price-self-input" type="number" placeholder="最大" v-model="priceself.max">
          <span class="price-self-btn" @click="selectPrice(2,priceself)">确定</span>
        </li>
      </ul>
    </div>
    <div class="wp-fangxing" v-if="selectType == 'fangxing'">
      <ul class="wp-fangxing-list scrollWrapper">
        <li v-for="fangxing in fangXingList" @click="selectArray('fangxing',fangxing)">
          <span class="content">{{fangxing.name}}室</span>
          <span :class="[select.fangxing.includes(fangxing.id)? 'checked':'check']"></span>
        </li>
      </ul>
      <span class="btn-ok" @click="$emit('change','search')">确定</span>
    </div>
    <div class="wp-other" v-if="selectType == 'other'">
      <ul class="wp-other-list scrollWrapper">
        <li class="wo-item">
          <span class="title">朝向</span>
          <ul>
            <li :class="{check:select.chaoxiang.id == item.id}" v-for="item in chaoxiangList" @click="select.chaoxiang = item">{{item.name}}</li>
          </ul>
        </li>
        <li class="wo-item">
          <span class="title">面积</span>
          <ul>
            <li :class="{check:select.mianji.id == item.id}"  v-for="item in mianjiList" @click="select.mianji = item">{{item.name}}</li>
          </ul>
        </li>
        <!-- <li class="wo-item">
          <span class="title">标签</span>
          <ul>
            <li :class="[select.biaoqian.includes(item.id)? 'check':'']" v-for="item in biaoqianList" @click="selectArray('biaoqian',item)">{{item.name}}</li>
          </ul>
        </li> -->
        <li class="wo-item">
          <span class="title">楼龄</span>
          <ul>
            <li v-for="item in loulingList" :class="{check:select.louling.id == item.id}" @click="select.louling = item">{{item.name}}</li>
          </ul>
        </li>
        <li class="wo-item">
          <span class="title">装修</span>
          <ul>
            <li v-for="item in zhuangxiuList" :class="{check:select.zhuangxiu.id == item.id}"  @click="select.zhuangxiu = item">{{item.name}}</li>
          </ul>
        </li>
        <li class="wo-item">
          <span class="title">电梯</span>
          <ul>
            <li v-for="item in diantiList" :class="{check:select.dianti.id == item.id}"  @click="select.dianti = item">{{item.name}}</li>
          </ul>
        </li>
        <li class="wo-item">
          <span class="title">用途</span>
          <ul>
            <li v-for="item in yongtuList" :class="{check:select.yongtu.id == item.id}"  @click="select.yongtu = item">{{item.name}}</li>
          </ul>
        </li>
        <li class="wo-item" v-if="isSystem()">
          <span class="title">状态</span>
          <ul>
            <li v-for="item in statusList" :class="{check:select.status.id == item.id}"  @click="select.status = item">{{item.name}}</li>
          </ul>
        </li>
        <!-- <li class="wo-item">
          <span class="title">交易权属</span>
          <ul>
            <li v-for="item in jiaoyiquanshuList" :class="{check:select.jiaoyiquanshu.id == item.id}"  @click="select.jiaoyiquanshu = item">{{item.name}}</li>
          </ul>
        </li> -->
      </ul>
      <div class="btn-group">
        <span class="btn-clear" @click="clearOther">清空条件</span>
        <span class="btn-commit" @click="$emit('change','search')">确定</span>
      </div>
    </div>
  </div>
</template>
<script>
  import actions from '../../common/actions.js'
  import util from '../../common/util.js'
  let defaultList = [
    {title:'区域',type:'area'},
    {title:'价格',type:'price'},
    {title:'房型',type:'fangxing'},
    {title:'其他',type:'other'}
  ];
  let priceList = [
    {id:1,name:'不限',min:0,max:'',value:''},
    {id:2,name:'200万以下',min:0,max:200,value:'0-200'},
    {id:3,name:'200-250万',min:200,max:250,value:'200-250'},
    {id:4,name:'250-300万',min:250,max:300,value:'250-300'},
    {id:5,name:'300-400万',min:300,max:400,value:'300-400'},
    {id:6,name:'400-500万',min:400,max:500,value:'400-500'},
    {id:9,name:'500-800万',min:500,max:800,value:'500-800'},
    {id:10,name:'800-1000万',min:800,max:1000,value:'800-1000'},
    {id:11,name:'1000万以上',min:1000,max:'',value:'1000-'}
  ];
  let priceList3 = [
    {id:1,name:'不限',min:0,max:'',value:''},
    {id:2,name:'2000以下',min:0,max:2000,value:'0-2000'},
    {id:3,name:'2000-3000',min:2000,max:3000,value:'2000-3000'},
    {id:4,name:'3000-4000',min:3000,max:4000,value:'3000-4000'},
    {id:5,name:'4000-5000',min:4000,max:5000,value:'4000-5000'},
    {id:11,name:'5000以上',min:5000,max:'',value:'5000-'}
  ];
  let mianjiList = [
    {id:1,name:'不限',min:0,max:'',value:''},
    {id:2,name:'50平以下',min:0,max:50,value:'0-50'},
    {id:3,name:'50-70平',min:50,max:70,value:'50-70'},
    {id:4,name:'70-90平',min:70,max:90,value:'70-90'},
    {id:5,name:'90-110平',min:90,max:110,value:'90-110'},
    {id:6,name:'110-130平',min:110,max:130,value:'110-130'},
    {id:9,name:'130-150平',min:130,max:150,value:'130-150'},
    {id:10,name:'150-200平',min:150,max:200,value:'150-200'},
    {id:11,name:'200平以上',min:200,max:'',value:'200-'}
  ];
  let chaoxiangList = [
    {id:'东',name:'东'},
    {id:'南',name:'南'},
    {id:'西',name:'西'},
    {id:'北',name:'北'},
    {id:'南北',name:'南北'},
    {id:'东西',name:'东西'},
    {id:'东南',name:'东南'},
    {id:'西南',name:'西南'},
    {id:'东北',name:'东北'},
    {id:'西北',name:'西北'}
  ];
  let diantiList = [
    {id:'无',name:'无'},
    {id:'有',name:'有'}
  ];
  let zhuangxiuList = [
    {id:'毛坯',name:'毛坯'},
    {id:'简装',name:'简装'},
    {id:'中装',name:'中装'},
    {id:'精装',name:'精装'},
    {id:'豪装',name:'豪装'}
  ];
  let loulingList = [
    {id:1,name:'5年以内',min:0,max:5,value:'5'},
    {id:2,name:'10年以内',min:0,max:10,value:'10'},
    {id:3,name:'10-20年',min:10,max:20,value:'20'},
    {id:4,name:'20年以上',min:20,max:'',value:'*'}
  ];
  let yongtuList = [
    {id:'住宅',name:'住宅'},
    {id:'商业',name:'商业'},
    {id:'写字楼',name:'写字楼'},
    {id:'商铺',name:'商铺'},
    {id:'厂房',name:'厂房'}
  ];
  let statusList = [
    {id:'00',name:'未发布'},
    {id:'01',name:'已发布'}
  ];
  let fangXingList = [
    {"id":1,"name":1},
    {"id":2,"name":2},
    {"id":3,"name":3},
    {"id":4,"name":4},
    {"id":5,"name":5},
    {"id":6,"name":6},
    {"id":7,"name":7},
    {"id":8,"name":8},
    {"id":9,"name":9},
    {"id":10,"name":10}
  ];

  export default {
      props: ['type','filter','houseType'],
      data () {
          return {
            filterList:defaultList,

            areaList:[],
            area2List:[],
            priceself:{
              id:1000,
              min:'',
              max:'',
            },
            fangXingList,
            chaoxiangList,
            mianjiList,
            loulingList,
            biaoqianList:[],
            zhuangxiuList,
            diantiList,
            yongtuList,
            statusList,
            jiaoyiquanshuList:[],
          }
      },
      created(){

      },
      mounted(){
        this.$nextTick(()=>{
          this.$refs.wrapper.addEventListener('touchstart',event =>{
            event._target = event._target || '.scrollWrapper';
          })
        })
      },
      computed: {
        selectType:{
          get(){
            switch(this.type){
              case 'area':
                this.getArea();
                break;
              case 'pirce':
                break;
              case 'fangxing':
                // this.getFangXing();
                break;
              case 'other':
                // this.getOtherConfig();
                break;
            }
            return this.type
          },
          set(value){this.$emit('change','type',value)}
        },
        select:{
          get(){return this.filter},
          set(value){this.$emit('change','filter',value)}
        },
        priceList(){
          return this.houseType == 3 ? priceList3 : priceList
        }
      },
      methods:{
        getArea(){
          if(this.areaList.length > 0) return;
          actions.getBaseConfig({'dic_type':'quxian'}).then(res => {
            if(res.is_success == 0){
              this.areaList = res.content;
            }
          })
        },
        getOtherConfig(){
          let others = ['biaoqian','zhuangxiu','dianti','yongtu','jiaoyiquanshu'];
          for(let i = 0; i < others.length ;i++){
            actions.getBaseConfig({'dic_type':others[i]}).then(res => {
              if(res.is_success == 0){
                this[others[i] + 'List'] = res.content
              }
            })
          }
        },
        selectArea(area){
          actions.getBaseConfig({'dic_type':'type2','dic_id':area.id}).then(res => {
            if(res.is_success == 0){
              this.select.area = area;
              this.area2List = res.content;
            }
          })
        },
        selectArea2(area2){
          this.select.area2 = area2;
          this.$emit('change','search');
        },
        getFangXing(){
          actions.getBaseConfig({'dic_type':'fangxing'}).then(res => {
            if(res.is_success == 0){
              this.fangXingList = res.content
            }
          })
        },
        selectPrice(type,price){
          if(type == 1){
            this.select.price = price;
          }else if(type == 2){
            if(price.min == "" && price.max == ""){
              price.value = "";
            }else if(price.min == ""){
              price.value = '0-' + price.max;
            }else{
              price.value = price.min + '-' + price.max;
            }
            this.select.price = price;
          }

          this.$emit('change','search');
        },
        isSystem(){
          return util.getLocalStorage('manager') == "true"
        },
        selectArray(name,obj){
          let nFangXingSelect = this.select[name].filter(item => item != obj.id);
          let nFangXingSelectObjs = this.select[name+'Objs'].filter(item => item.id != obj.id);
          if(this.select[name].length == nFangXingSelect.length){
            this.select[name].push(obj.id);
            this.select[name+'Objs'].push(obj);
          }else{
            this.select[name] = nFangXingSelect;
            this.select[name+'Objs'] = nFangXingSelectObjs;
          }
        },
        clearOther(){
          this.select.chaoxiang={};
          this.select.mianji={};
          this.select.biaoqian=[];
          this.select.louling={};
          this.select.zhuangxiu={};
          this.select.dianti={};
          this.select.yongtu={};
          this.select.status={};
          this.select.jiaoyiquanshu={};

        }
      }
  }
</script>

<style lang="scss">
  .component-filter{
    position:fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color:rgba(0,0,0,.5);
  }
  ul{
    list-style: none;
    padding: 0;
    margin:0;
  }
  .filter-nav{
    position:relative;
    display:flex;
    height:0.9rem;
    background-color: #fff;
    border-bottom:1px solid #e5e5e5;
    li{
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#333;
      font-size: 0.28rem;
      font-weight:bolder;
    }
    .filter-icon{
      margin-left:0.1rem;
    }
  }
  .wp-area{
    position:relative;
    height:7rem;
    display:flex;
  }
  .wp-area-level,.wp-price-list,.wp-other-list{
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .wp-area-level1{
    background-color:#f0f0f0;
    li{
      line-height: 0.8rem;
      padding-left: 0.5rem;
      font-size:0.26rem;
      color:#666;
      &.check{
        background-color:#fff;
      }
    }
  }
  .wp-area-level2,.wp-area-level3{
    background-color:#fff;
    padding-left: 0.3rem;
    li{
      line-height: 0.8rem;
      font-size:0.26rem;
      color:#333;
      border-bottom:1px solid #f4f4f4;
      &.check{
        color:#00ae66;
      }
    }
  }
  .level2{
    .wp-area-level1{
      width:3rem;
    }
    .wp-area-level2{

      flex:1;
    }
  }
  .level3{
    .wp-area-level1,.wp-area-level2{
      width:2rem;
    }
    .wp-area-level2{
      border-right:1px solid #f4f4f4;
    }
    .wp-area-level3{
      flex:1;
    }
  }

  .wp-price-list{
    position:relative;
    padding-left: 0.5rem;
    background-color:#fff;
    height:7rem;
    li{
      line-height: 1rem;
      font-size:0.28rem;
      color:#333;
      border-bottom:1px solid #f4f4f4;
      &.check{
        color:#00ae66;
      }
    }
  }
  .price-self{
    display:flex;
    align-items:center;
  }
  .price-self-line{
    display:block;
    font-size:0.2rem;
    color:#c5c5c5;
  }
  .price-self-input{
    display:block;
    width:0.6rem;
    background-color:#f5f5f5;
    font-size:0.2rem;
    text-align: center;
    line-height: 0.3rem;
    margin:0 0.1rem;
    &.price-self-min{
      margin-left:0.6rem;
    }
  }
  .price-self-btn{
    display:block;
    margin-left:0.2rem;
    width:0.5rem;
    line-height: 0.3rem;
    background-color:#00ae66;
    border-radius: 0.05rem;
    font-size:0.2rem;
    color:#fff;
    text-align:center;
  }

  .wp-fangxing{
    .wp-fangxing-list{
      position:relative;
      flex:1;
      padding-left: 0.4rem;
      max-height: 7.5rem;
      background-color:#fff;
      li{
        display:flex;
        align-items:center;
        line-height: .7rem;
        font-size:0.28rem;
        color:#333;
        border-bottom:1px solid #f4f4f4;
        .content{
          flex:1;
        }
        .check{
          display:block;
          width:0.3rem;
          height:0.3rem;
          margin-right:0.3rem;
          background-image:url(../../images/check.png);
          background-size:100% 100%;
        }
        .checked{
          display:block;
          width:0.3rem;
          height:0.3rem;
          margin-right:0.3rem;
          background-image:url(../../images/checked.png);
          background-size:100% 100%;
        }
      }
    }
    .btn-ok{
      display:block;
      width:100%;
      line-height:0.9rem;
      text-align:center;
      background-color:#00ae66;
      color:#fff;
      font-size:0.28rem;
    }
  }

  .wp-other{
    position:relative;
    height:9rem;
    background-color:#fff;
    padding-bottom:0.9rem;
    .wp-other-list{
      height:100%;
    }
    .wo-item{
      padding:0.3rem 0.25rem;
      border-bottom:1px solid #f4f4f4;
      &:last-child{
        border-bottom:none;
      }
      .title{
        display:block;
        font-weight:500;
        font-size:0.28rem;
        color:#333;
        padding-bottom:0.3rem;
      }
      ul{
        display:flex;
        flex-wrap:wrap;
        li{
          display:block;
          width:1.5rem;
          margin: 0.125rem;
          border: 1px solid #f4f4f4;
          color: #999;
          border-radius: 0.05rem;
          overflow: hidden;
            white-space: nowrap;
            font-size: 0.28rem;
            text-align:center;
            line-height:0.5rem;
            &.check{
              border-color: #00ae66;
              color:#00ae66;
            }
        }
      }
    }
    .btn-group{
      position:absolute;
      display:flex;
      line-height:0.9rem;
      bottom:0;
      width:100%;
      text-align:center;
      .btn-clear{
        flex:1;
        color:#fff;
        background-color:#999;
      }
      .btn-commit{
        flex:1;
        color:#fff;
        background-color:#00ae66;
      }

    }
  }
</style>





