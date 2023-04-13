<template>
  <div class="header-container">
    <div class="left">
      <el-icon v-show="isCollapse" @mousedown.prevent="isCollapse = !isCollapse" :size="22" color="#ffffff" class="icon">
        <Expand />
      </el-icon>
      <el-icon v-show="!isCollapse" @mousedown.prevent="isCollapse = !isCollapse" :size="22" color="#ffffff" class="icon">
        <Fold />
      </el-icon>
      <div class="title">
        <h1>后台管理系统</h1>
      </div>
    </div>
    <div class="right">
      <div class="user-info">
        <div class="message">
          <el-tooltip :content="`您有${messgae.unReadNum}条未读消息`" placement="bottom" effect="light">
            <el-icon :size="22" color="#ffffff" @click="goMessageCenter">
              <Bell />
            </el-icon>
          </el-tooltip>
        </div>
        <el-avatar :src="userInfo.avatar" :size="30"></el-avatar>
        <el-dropdown trigger="click" @command="operate">
          <span>{{ userInfo.name
          }}<el-icon class="icon-right"><arrow-down /></el-icon></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="personInfo" @click="goProfile">个人中心</el-dropdown-item>
              <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from "../store/home";
import { useMessageStore } from "../store/message";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import { ClickHistory } from "../model/home"
const home = useHomeStore();
const messgae = useMessageStore();
const { isCollapse, userInfo, token, menuHistory } = storeToRefs(home);
const router = useRouter();
//对下拉框选择进行操作
const operate = (command: string | number | object): void => {
  if (command == "loginOut") {
    //删除token
    sessionStorage.removeItem("token");
    token.value = "";
    //跳转回登陆
    router.replace({
      name: "login",
    });
  }
};

//去消息中心
const goMessageCenter = (): void => {
  router.push({
    name: "message",
  });
  addHistory("消息中心", "/home/message")
};

const goProfile = (): void => {
  router.push({
    name: "info"
  })
  addHistory("个人中心", "/home/info")
}

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
.header-container {
  display: flex;
  align-items: center;
  background-color: rgb(36, 47, 66);
  height: 10vh;
  position: relative;

  .left {
    display: flex;
    height: 100%;

    .icon {
      height: 70px;
      width: 64px;

      &:hover {
        background-color: rgba(244, 244, 245, 0.2);
      }
    }

    .title {
      font-size: 22px;
      color: #ffffff;
      width: 250px;
      height: 70px;
      text-align: left;
      line-height: 70px;
    }
  }

  .right {
    position: absolute;
    right: 50px;

    .user-info {
      display: flex;
      height: 70px;
      align-items: center;

      .message {
        position: relative;
        padding-top: 5px;

        &::after {
          content: "";
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background-color: #f56c6c;
          top: 0;
          right: -7px;
          position: absolute;
        }
      }

      .el-avatar {
        margin: 0 10px 0 30px;
      }

      span {
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;

        .icon-right {
          vertical-align: middle;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
