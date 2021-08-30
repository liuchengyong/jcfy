<template>
  <header class="component-header">
    <div class="btn-back" @click="goBack()"></div>
    <div class="title">{{title}}</div>
    <div class="icon-user"  @click="$router.push('/personcenter')"></div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: ()=>{
    return {}
  },
  computed: {
    title(){
      return this.$store.state.title;
    }
  },
  methods:{
    openPerson(){

    },
    goBack(){
      if(history.length > 1){
        this.$router.back()
      }else if(this.$route.name != 'home'){
        this.$router.replace('/');
      }
    },
    handlerEdit(){
    }
  }
}
</script>

<style lang="scss">
  header.component-header{
    position:relative;
    display: flex;
    height:1rem;
    overflow:hidden;
    align-items:center;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
    > .btn-back{
      display: block;
      width: 1rem;
      height: 1rem;
      background-image: url(../images/arrow-left-00ae66.png);
      background-size: .45rem auto;
      background-repeat: no-repeat;
      background-position: center;
    }
    > .title{
      text-align:center;
      font-size: .3rem;
      flex:1;
    }
    > .icon-user{
      display: block;
      width: 1rem;
      height: 1rem;
      background-image: url(../images/user-00ae66.png);
      background-size: .5rem auto;
      background-repeat: no-repeat;
      background-position: center;
    }

  }
</style>
