<template>
  <div class="list" ref="list">
    <div v-if="gps" class="gps">
      <div><span>x_count:</span>{{gps.x_count}}</div>
      <div><span>y_count:</span>{{gps.y_count}}</div>
    </div>
    <div class="search" v-if="['list','near'].includes(source)">
      <svgicon name="search" width=".38rem" height=".38rem" color="#9fa2a3" ></svgicon>
      <input class="search-input" type="text" v-model="title" placeholder="输入小区或商圈开始找房咯~" />
      <span class="search-btn">搜索</span>
    </div>
    <div class="filter" v-if="source == 'list'">
      <div class="filter-item" v-for="item in currentFilterList" @click="()=>{isShowFilter=true;filterType = item.type}" :style="{color:item.statu ? '#00ae66': '#999'}">
        {{item.value||item.title}}
         <svgicon class="filter-icon" name="triangle" width=".2rem" height=".2rem"
          :color="item.statu ? '#00ae66': '#999'"
          :dir="item.statu ? 'left': ''"></svgicon>
      </div>
    </div>
    <my-filter :filter='filter' :houseType="type"  :type="filterType" @change="changeFilter" v-show="isShowFilter" ></my-filter>
    <div class="wrapper">
      <house-item v-for="(house,index) in list" :key="index" :house="house" :type="type" @handleHosue="handleHosue"></house-item>
    </div>
    <div class="loadmore-tip" ref="scrollWrapperTip" v-if="loadMore.scrollStatu != 'hide'">
      <span class="text-loadmore">{{ loadMore.scrollStatu | scrollTextFilter }}</span>
    </div>
    <div class="wrapper-null" v-if="list.length == 0">{{nullString}}</div>
    <div class="btn-go-top" @click="goToTop"></div>
  </div>
</template>

<script>
    import actions from '../common/actions.js'
    import util from '../common/util.js'
    import myFilter from '../component/filter.vue'
    import houseItem from '../component/houseItem.vue'
    import gps from '../common/gps.js'
    import { mapState } from 'vuex'
    let filterList = [
      {title:'区域',type:'area',value:'',statu:false},
      {title:'价格',type:'price',value:'',statu:false},
      {title:'房型',type:'fangxing',value:'',statu:false},
      {title:'其他',type:'other',value:'',statu:false}
    ];
    let defaultFilter = {
      area:{},
      area2:{},
      price:{},
      fangxing:[],
      fangxingObjs:[],
      chaoxiang:{},
      mianji:{},
      biaoqian:[],
      biaoqianObjs:[],
      louling:{},
      zhuangxiu:{},
      dianti:{},
      yongtu:{},
      status:{},
      vr:{},
      jiaoyiquanshu:{}
    };
    export default {
      components:{myFilter,houseItem},
      data () {
        return {
          title:'',
          isShowFilter:false,
          filterList,
          list:[],
          filterType:'',
          pageSize: 10,
          filter:defaultFilter,
          gps:null
        }
      },
      activated(){
        this.changeHtmlTitle();
        this.$store.commit('changeLoadMore',{scrollStatu:'unload'});
        if(util.getSessionStorage('listScroll')){
          document.querySelector('.container').scrollTop = util.getSessionStorage('listScroll');
        }
      },
      created(){
        this.changeHtmlTitle();
        this.$store.commit('changeLoadMore',{page:1,scrollStatu:'unload'});
        util.setSessionStorage('listScroll',0);
        this.getHouseList(1);
      },
      updated(){
        if(this.loadMore.scrollStatu != 'hide' && this.$refs.scrollWrapperTip && this.$refs.scrollWrapperTip.offsetTop < window.innerHeight  && this.$route.name == 'list'){
          this.$store.commit('changeLoadMore',{scrollStatu:'hide'});
        }
      },
      computed: {
        currentFilterList(){
          for(let i = 0; i < this.filterList.length; i++){
            switch(this.filterList[i].type){
              case "area":
                if(this.filter.area2.id){
                  this.filterList[i].value = this.filter.area2.name
                  this.filterList[i].statu = true;
                }else{
                  this.filterList[i].value = '';
                  this.filterList[i].statu = false;
                }
                break;
              case "price":
                if(this.filter.price.id){
                  this.filterList[i].value = this.filter.price.name
                  this.filterList[i].statu = true;
                }else{
                  this.filterList[i].value = '';
                  this.filterList[i].statu = false;
                }
                break;
              case "fangxing":
                if(this.filter.fangxing.length == 1){
                  this.filterList[i].value = this.filter.fangxingObjs[0].name
                  this.filterList[i].statu = true;
                }else if(this.filter.fangxing.length >= 2){
                  this.filterList[i].value = '多选'
                  this.filterList[i].statu = true;
                }else{
                  this.filterList[i].value = '';
                  this.filterList[i].statu = false;
                }
                break;
              case "other":
                if(this.filter.chaoxiang.id
                  || this.filter.mianji.id
                  || this.filter.biaoqian.length > 0
                  || this.filter.louling.id
                  || this.filter.zhuangxiu.id
                  || this.filter.dianti.id
                  || this.filter.yongtu.id
                  || this.filter.jiaoyiquanshu.id
	    						|| this.filter.status.id
                  || this.filter.vr.id){
                  this.filterList[i].statu = true;
                }else{
                  this.filterList[i].statu = false;
                }
                break;
            }
          }
          return this.filterList;
        },
        loadMore(){
          return this.$store.state.loadMore;
        },
        type(){
          return ['1','2','3'].includes(this.$route.params.type) ? this.$route.params.type : 2
        },
        source(){ //
          return 'near'
        },
        nullString(){
          return { list: '没有找到房源', guanzhu: '您还没有关注呢！去关注吧', near: '附近暂无房源' }[this.source]
        }
      },
      watch: {
        loadMore(loadMore){
          if(loadMore.scrollStatu == 'load' && this.$route.name == 'list'){
            this.getHouseList(loadMore.page + 1);
          }
        },
        title(value){
          clearTimeout(this.it);
          this.it = setTimeout(()=>{
            this.getHouseList(1);
          },400)
        },
        source(value,oldValue){
          if(value != oldValue){
            this.$store.commit('changeLoadMore',{page:1,scrollStatu:'unload'});
            util.setSessionStorage('listScroll',0);
            this.getHouseList(1);
          }
        },
        type(value,oldValue){
          if(value != oldValue){
            this.$store.commit('changeLoadMore',{page:1,scrollStatu:'unload'});
            util.setSessionStorage('listScroll',0);
            this.filter.price = {};
            this.getHouseList(1);
          }
        }
      },
      methods:{
        changeHtmlTitle(){
          this.$store.commit('changeTitle',{'near':'附近的','guanzhu':'我关注的','list':''}[this.source] + ['','新房','二手房','租房'][this.type]);
        },
        handleHosue(type,house){
          if(type == 'detail'){
            this.$router.push({name:'detail',params:{id:house.id,type:this.type},query:this.$route.query})
          }
        },
        goToTop(){
          let contains = document.querySelector('.container');
          if(contains){
            contains.scrollTop = 0
          }
        },
        changeFilter(type,value){
          if(type == 'type'){
            this.filterType = value;
          }else if(type == 'filter'){
            this.filter = value;
          }else if(type == 'search'){
            this.isShowFilter = false;
            this.getHouseList(1);
          }else if(type == 'close'){
            this.isShowFilter = false;
          }
        },
        handelChange(){
          let value = event.target.value;
          let newValue = value.length > length ? value.slice(0, length) : value;
          event.target.value =  newValue;
          this[key] = newValue;
          this.checkForm();
        },
        getHouseList(page){
          let data = {
            page_size: this.pageSize,
            page_number: page,
            type: this.type,
            is_system: 'no'
          };
          if(this.filter.area2.id){ //区域
            data.suozaijiedao_id = this.filter.area2.id;
          }
          if(this.filter.price.id){ //价格
            data.shoujia = this.filter.price.value;
          }
          if(this.filter.fangxing.length > 0){//房型
            data.fangxing = this.filter.fangxing[0];
          }
          if(this.filter.chaoxiang.id){//朝向
            data.chaoxiang_id = this.filter.chaoxiang.id;
          }
          if(this.filter.mianji.id){//面积
            data.mianji = this.filter.mianji.value;
          }
          // if(this.filter.biaoqian.length > 0){//标签
          //  data.biaoqian_name = this.filter.biaoqian.join(',');
          // }
          if(this.filter.louling.id){//楼龄
            data.louling = this.filter.louling.value
          }
          if(this.filter.zhuangxiu.id){//装修
            data.zhuangxiu_id = this.filter.zhuangxiu.id
          }
          if(this.filter.dianti.id){//电梯
            data.dianti_id = this.filter.dianti.id
          }
          if(this.filter.yongtu.id){//用途
            data.yongtu_id = this.filter.yongtu.id
          }
          if(this.filter.vr.id){
            data.is_vr = this.filter.vr.id;
          }
          // if(this.filter.jiaoyiquanshu.id){//交易权属
          //  data.jiaoyiquanshu_id = this.filter.jiaoyiquanshu.id
          // }

          if(this.title){
            data.title = this.title;
          }
          if(util.getLocalStorage('manager') == "true"){
            if(this.filter.status.id && this.filter.status.id == '00'){
              data.is_system = 'weifabu'
            }else{
              data.is_system = 'yes'
            }
            if(this.source == 'near'){
              data.is_system = 'weifabu';
            }
          }
          if(this.source == 'guanzhu'){
            data.openid = util.getLocalStorage('phone');
          }

          if(this.source == 'near'){
            util.getLocation().then(res => {
                data.x_count = res.lng;
                data.y_count = res.lat;
                this.gps = {
                  x_count: res.lng,
                  y_count: res.lat,
                };
                data.round = 10;
                actions.getHouseListByLoc(data).then(res=>{
                  if(res.is_success == 0){
                    if(data.page_number == 1 && res.content.length == 0){
                      this.$store.commit('changeLoadMore',{page,scrollStatu:'hide'});
                    }else if(data.page_size > parseFloat(res.all_count)){
                      this.$store.commit('changeLoadMore',{page,scrollStatu:'over'});
                    }else{
                      this.$store.commit('changeLoadMore',{page,scrollStatu:'unload'});
                    }
                    this.list = data.page_number == 1 ? res.content : this.list.concat(res.content);
                  }
                })
            });
            return;
          }
          actions.getHouseList(data).then(res=>{
            if(res.is_success == 0){
              if(data.page_number == 1 && res.content.length == 0){
                this.$store.commit('changeLoadMore',{page,scrollStatu:'hide'});
              }else if(data.page_size > parseFloat(res.all_count)){
                this.$store.commit('changeLoadMore',{page,scrollStatu:'over'});
              }else{
                this.$store.commit('changeLoadMore',{page,scrollStatu:'unload'});
              }
              this.list = data.page_number == 1 ? res.content : this.list.concat(res.content);
            }
          })
        }
      }
    }
</script>

<style lang="scss">
  .list{
    position: relative;
    .gps{
      position:relative;
      padding:.6rem;
      font-size: .4rem;
      line-height: .6rem;
    }
    .search{
      position:relative;
      display:flex;
      align-items:center;
      height:.6rem;
      margin:0.2rem 0.23rem;
      background-color: #e8e8e9;
      padding:0 0 0 0.18rem;
      .search-input{
        flex:1;
        background-color: #e8e8e9;
        padding-left:0.2rem;
      }
      .search-btn{
            color:#fff;
            height: .6rem;
            line-height:.6rem;
            background-color: #FF725C;
            border-color: #FF725C;
            text-align:center;
            border-radius:0.05rem;
            font-size:0.2rem;
            padding: 0 0.3rem;
        }
    }
    .filter{
      position:relative;
      display:flex;
      height:0.9rem;
      border-top:1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      background-color:#fff;
      .filter-item{
        flex:1;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#999;
        font-size: 0.24rem;
      }
      .filter-icon{
        margin-left:0.1rem;
      }
    }

    .wrapper{
      border-bottom: 1px solid #e5e5e5;
      padding-left:0.4rem;
      background-color:#fff;
    }
    .wrapper-null{
      font-size:0.32rem;
      color:#999;
      line-height:5em;
      text-align: center;
    }
    .loadmore-tip{
      font-size:0.24rem;
      color:#999;
      line-height:2em;
      text-align: center;
      background-color:#f5f5f5;
    }
  }
</style>
