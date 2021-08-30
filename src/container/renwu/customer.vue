<template>
  <div class="renwu-customer">
    <div class="from-item">
      <span class="from-lable">客户姓名</span>
      <div class="from-control">
        <input type="text" placeholder="请输入客户姓名" v-model="name"/>
      </div>
    </div>
    <div class="from-item">
      <span class="from-lable">客户手机号</span>
      <div class="from-control">
        <input type="text" placeholder="请输入客户手机号" v-model="phone"  />
      </div>
    </div>
    <div class="add_phone" @click="addPhone">
      <img src="../../images/add.png"> 添加手机号
    </div>
    <div class="from-item" v-for="(phoneItem,index) in phoneList">
      <span class="from-lable">客户手机号{{index+1}} </span>
      <div class="from-control">
        <input type="text" placeholder="请输入客户手机号" v-model="phoneItem.phone"  />
      </div>
      <div class="from-after" @click="deletePhone(phoneItem,index)">删除</div>
    </div>

    <div class="from-item">
      <span class="from-lable">客户性别</span>
      <div class="from-control">
        <div class="radio-group">
          <span :class="['radio',item == sex ? 'selected' : '']" v-for="item in sexList" :key="item" @click="sex = item">{{item}}</span>
        </div>
      </div>
    </div>
    <div class="btn-commit" @click='commit'>保存</div>
  </div>
</template>

<script>
    import actions from '../../common/actions.js'
    import util from '../../common/util.js'

    let sexList = ['男','女'];
    let phoneIndex = -1;
    export default {
      components:{},
      data () {
        return {
          sexList: sexList,
          sex: this.$route.query.khxb || '',
          name: this.$route.query.khxm || '',
          phone: this.$route.query.khdh || '',
          phoneList: []
        }
      },
      created(){
        util.hideLoading()
        this.$store.commit('changeTitle','带看任务');
        actions.page_phone({
          rwid: this.$route.query.id
        }).then(res=>{
          if(res.content){
            this.phoneList = res.content
          }
        })
      },
      updated(){
      },
      computed: {
      },
      watch: {
      },
      methods:{
        addPhone(){
          this.phoneList.push({
            phone: ''
          })
        },
        deletePhone(item,index){
          if(item.id){
            actions.action_phone({
              action: 'delete',
              rwid: this.$route.query.id,
              id: item.id,
            }).then(res=>{
              if(res.is_success == 0){
                this.phoneList = this.phoneList.filter(phone => phone.id != item.id);
                util.showToast('删除成功');
              }
            })
          }else{
            this.phoneList = this.phoneList.filter((phone,i) => i != index);
          }

        },
        commit(){
          if(!this.name) return util.showToast('客户姓名不能为空');
          if(!util.verify.phone.test(this.phone)) return util.showToast('输入正确的手机号');
          if(!this.sex) return util.showToast('客户性别不能为空');

          for(let i = 0; i < this.phoneList.length; i++){
            if(!util.verify.phone.test(this.phoneList[i].phone)) return util.showToast('输入正确的客户手机号' + (i + 1));
          }

          this.phoneList.forEach(item=>{
            if(item.id){
              actions.action_phone({
                action: 'update',
                rwid: this.$route.query.id,
                id: item.id,
                phone: item.phone,
              })
            }else{
              actions.action_phone({
                action: 'add',
                rwid: this.$route.query.id,
                phone: item.phone,
              })
            }

          })


          actions.updateRenWu({
            id: this.$route.query.id,
            khxm: this.name,
            khdh: this.phone,
            khxb: this.sex
          }).then(res=>{
            if(res.is_success == 0){
              util.showToast('保存成功')
              this.$router.push({name:'renwulist'})
            }
          })
        }
      }
    }
</script>

<style lang="scss">
  .renwu-customer{
    font-size: .3rem;
    color: #333;
    .from-item{
      position:relative;
      display:flex;
      margin-top: .3rem;
      align-items: center;
      padding: 0 .3rem;
      height: 1rem;
      background-color: #fff;
      .from-lable{
        width: 2rem;
      }
      .from-control{
        flex:1;
        text-align:right;
        input{
          text-align:right;
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
      .from-after{
        display: flex;
        align-items: center;
        justify-content: center;
        color: red;
        width: 1rem;
        height: 100%;
      }
    }
    .add_phone{
      display: flex;
      margin-top: .3rem;
      padding-right: .3rem;
      align-items: center;
      justify-content: flex-end;
      color: #2196f3;
      img{
        display: block;
        width: .4rem;
        height: auto;
        margin-right: .1rem
      }
    }
    .btn-commit{
      width: 80%;
      margin: .5rem auto 0;
      height: 1rem;
      line-height: 1rem;
      color: #fff;
      background-color: #00ae66;
      text-align:center;
    }
  }
</style>

