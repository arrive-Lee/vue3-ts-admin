<template>
  <div class="tags-container" v-if="menuHistory.length != 0">
    <div class="left">
      <transition-group name="fade">
        <el-tag v-for="(tag, index) in menuHistory" :key="tag.label"
          :effect="route.fullPath == tag.path ? 'dark' : 'plain'" closable @close="removeHistory(index)"
          @click="push(tag.path)" :disable-transitions="false">
          {{ tag.label }}
        </el-tag>
      </transition-group>
    </div>
    <div class="right">
      <el-dropdown type="primary" trigger="click" @command="handle">
        <el-tag effect="dark">
          标签选项 <el-icon class="el-icon--right"><arrow-down /></el-icon></el-tag>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其它</el-dropdown-item>
            <el-dropdown-item command="clearAll">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from "../store/home";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { ClickHistory } from "../model/home";
const home = useHomeStore();
const route = useRoute();
const router = useRouter();
const { menuHistory } = storeToRefs(home);
//点击关闭时的行为，删除该菜单历史记录
const removeHistory = (index: number): void => {
  //如果后面还有元素就跳向后面的元素，如果后面没有元素则不跳转
  if (index < menuHistory.value.length - 1) {
    router.push(menuHistory.value[index + 1].path);
  } else {
    if (index - 1 >= 0) {
      router.push(menuHistory.value[index - 1].path);
    } else {
      router.push({
        name: "index",
      });
    }
  }
  menuHistory.value.splice(index, 1);
};
//右边选项
const handle = (command: string): void => {
  if (command == "clearOther") {
    //清除其它
    const current = <ClickHistory>(
      menuHistory.value.find((item) => item.path == route.fullPath)
    );
    menuHistory.value.splice(0);
    menuHistory.value.push(current);
  } else {
    //清除所有
    menuHistory.value.splice(0);
  }
};
//点击跳转
const push = (path: string): void => {
  router.push({
    path: path,
  });
};
</script>

<style scoped lang="less">
.tags-container {
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;

  .left {
    margin-left: 5px;
    padding: 3px 0;

    .el-tag {
      margin-right: 10px;
    }
  }

  .right {
    position: absolute;
    right: 10px;
    top: 3px;
  }
}

.fade-move {
  transition: all 0.3s ease;
}

.fade-leave-active {
  position: absolute;
}
</style>
