<template>
<div class="welcome">  
  <div class="content">
    <div class="sub-title">欢迎体验</div>
    <div class="title">慕课通用后台管理系统</div>
    <div class="desc">
        - Vue3.0+ElementPlus+Node+Mongo打造通用后台管理系统
    </div>
  </div>
  <div class="img"></div>
  </div>
</template>


<script>
/* import {defineProps,reactive} from 'vue'
这是用钩子函数，是vue3的新特征script需要加上setup，接下来我们用vue2的原始写法
defineProps({
  msg:String
}) */
export default{
  name:'welcome',
}
</script>
<style lang="scss">
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
  .content {
    position: relative;
    bottom: 40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 105px;
    background-image: url("./../assets/images/welcome.png");
    width: 371px;
    height: 638px;
    background-repeat: no-repeat;
  }
}
</style>
