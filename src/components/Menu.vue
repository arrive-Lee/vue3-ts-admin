<template>
  <div class="menu-container">
    <el-menu :collapse="isCollapse" router :default-active="route.fullPath" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" popper-effect="light" class="menu">
      <MenuTree :menu="menu" v-for="menu in userInfo.menu" :key="menu.label"></MenuTree>
    </el-menu>
  </div>
</template>



<script setup lang="ts">
import { useHomeStore } from "../store/home";
import { storeToRefs } from "pinia";
import MenuTree from "./MenuTree.vue";
import { useRoute } from "vue-router"
const home = useHomeStore();
const { userInfo, isCollapse } = storeToRefs(home);
const route = useRoute();
</script>

<style scoped lang="less">
.menu-container {
  height: 100%;

  .menu {
    height: 100%;

    &:not(.el-menu--collapse) {
      width: 250px;
      min-height: 400px;
    }
  }
}
</style>
