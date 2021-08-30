 <template>
  <div class="container-contract-pdf">
    <div class="list-none" v-if="list.length == 0">暂无附件</div>
    <div class="item" v-for="(item,index) in list" :key="index">
      <a :href="item.pic_path">{{index+1}}.合同附件{{index +1}}</a>
    </div>
  </div>
</template>


<script>
  import util from '../common/util.js';
  import actions from '../common/actions.js';
  export default {
    data () {
      return {
        list: [],
      }
    },
    created(){
      this.$store.commit('changeTitle','合同附件下载');
      this.getList()
    },
    beforeDestroy(){
      clearTimeout(this.Daojishi);
    },
    methods:{
      getList(){
        actions.contract_pic({
          fangwu_id: this.$route.query.htid,
          type: this.$route.query.type
        }).then(res=>{
          if(res.is_success == 0){
            this.list = res.content || []
          }
        })
      },
    }
}
</script>

<style lang="scss">
  .container-contract-pdf{
    position: relative;
    padding: .3rem .3rem 1rem;
    .item{
      line-height: 1rem;
      font-size: .32rem;
      text-decoration: underline;
    }
    .list-none{
      padding-top: 1rem;
      text-align: center;
      font-size: .28rem;
      color:#999;
    }
  }
</style>
