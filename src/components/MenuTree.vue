<template>
  <el-menu-item v-if="!menu.children" :index="menu.path" @click="addHistory(menu.label, <string>menu.path)">
    <el-icon>
      <component :is="menu.icon"></component>
    </el-icon>
    <span>{{ menu.label }}</span>
  </el-menu-item>

  <el-sub-menu v-else :index="menu.label" class="se-sub-menu">
    <template #title>
      <el-icon v-if="menu.icon">
        <component :is="menu.icon"></component>
      </el-icon>
      <span>{{ menu.label }}</span>
    </template>
    <MenuTree :menu="item" v-for="item in menu.children" :key="item.label"></MenuTree>
  </el-sub-menu>
</template>

<script setup lang="ts">
import { Menu, ClickHistory } from "../model/home";
import { useHomeStore } from "../store/home";
import { storeToRefs } from "pinia";
import { reactive, watch } from "vue";
const home = useHomeStore();
const { menuHistory } = storeToRefs(home);

//递归组件接受值
defineProps<{
  menu: Menu;
}>();
//每次点击添加菜单点击历史记录
const addHistory = (label: string, path: string): void => {
  //创造一条点击历史记录
  const history = reactive<ClickHistory>({
    label,
    path,
  });
  //遍历判断该记录是否存在，存在则不添加
  const isExsit = menuHistory.value.every((item) => {
    return item.path != history.path;
  });
  //不存在则添加
  if (isExsit) {
    home.menuHistory.push(history);
  }
};
</script>

<style scoped lang="less">
.el-sub-menu .el-menu-item .el-icon {
  width: 0;
  height: 0;
}

.el-sub-menu .se-sub-menu :deep(.el-sub-menu__title) {
  padding: 0 20px 0 40px;

  span {
    margin-left: 6px;
  }
}
</style>

<style></style>
