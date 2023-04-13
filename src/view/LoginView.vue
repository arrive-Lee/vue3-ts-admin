<template>
  <div class="login-container">

    <div class="login-content">
      <h1 class="title">欢迎使用后台管理系统</h1>
      <div class="content">
        <div class="left">
          <img :src="bg1" class="bg1" />
          <img :src="bg2" class="bg2" />
        </div>
        <div class="right">
          <form>
            <h1>Enter our Plantform</h1>
            <input type="text" placeholder="Enter the account" v-model="account" />
            <input type="password" autocomplete="password" v-model="password" placeholder="password" />
            <el-popover :visible="visible" placement="top" :width="240">
              <div class="check-code"
                style="display: flex; flex-direction: column; align-items: center; height: 190px; justify-content: center;">
                <el-image :src="src" style="width: 204.4px;height: 63.8;" fit />
                <el-input type="text" v-model="checkCode" placeholder="请输入验证码" class="code"
                  style="width: 204.4px; margin: 15px 0; height: 40px;"></el-input>
                <el-button type="primary" @click.prevent="loginIn" class="send"
                  style="width: 204.4px; height: 40px;">确认</el-button>
              </div>
              <template #reference>
                <button @click="createCheckCode">Sing in</button>
              </template>
            </el-popover>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bg1 from "../assets/image/img1.png";
import bg2 from "../assets/image/img2.png";
import { ref, computed } from "vue";
import { login, getCheckCode } from "../util/api";
import { ElMessage } from "element-plus";
import { useHomeStore } from "../store/home";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import { User } from "../model/home";
import { setStorage, addRoutes } from "../util/util";
// 账号密码
const account = ref<string>("");
const password = ref<string>("");

//验证码图片地址
const src = ref<string>("http://www.mxnzp.com/api_file/varitycode/9/a/f/4/f/8/0/6/f66d8905cbe84d75ab219f18b0b89550.jpg")
//用户输入的验证码
const checkCode = ref<string>("")
//验证码答案
const result = ref<string>("pfptt")



//store
const home = useHomeStore();
const { userInfo, token, needRoute } = storeToRefs(home);
const router = useRouter();
//验证账号密码是否合理
const check = computed<boolean>(() => {
  const match: RegExp = /\w{5,20}/;
  return match.test(account.value) && match.test(password.value);
});
const visible = ref<boolean>(false)

const loginIn = (): void => {
  if (result.value = checkCode.value.toLowerCase()) {
    login(account.value, password.value).then((respnose: any) => {
      if (respnose) {
        const {
          data: { code, message },
        } = respnose;
        if (code == "200") {
          //拿到用户相关的数据进行存储
          const {
            data: { token: temp, data },
          } = respnose;
          const { name, auth, avatar, menu, lastTime, lastPosition, registerTime, account, introduce } = data;
          const user = reactive<User>({
            name,
            auth,
            avatar,
            menu,
            lastTime,
            lastPosition,
            registerTime,
            account,
            introduce
          });
          //储存token
          setStorage("session", "token", temp);
          //持久化用户信息
          setStorage("session", "userInfo", user);
          //动态添加路由
          addRoutes(menu)
          //现在不需要添加路由
          needRoute.value = false
          token.value = temp;
          userInfo.value = user;
          //跳转页面
          router.replace({
            name: "home",
          });
          ElMessage.success(message);
        } else {
          ElMessage.error(message);
        }
      }
    });
  } else {
    ElMessage.error("验证码输入错误");
  }
};

//创建验证码
const createCheckCode = () => {
  if (check.value) {
    //接口用不了，我懒得改了
    // getCheckCode(6).then((response: any) => {
    //   if (response) {
    //     const { data: { data: { verifyCode, verifyCodeImgUrl } } } = response;
    //     src.value = verifyCodeImgUrl;
    //     result.value = verifyCode;
    //   }
    // })
    visible.value = true;
  } else {
    ElMessage.error("账号或密码输入错误。");
  }
}
</script>

<style scoped lang="less">
.login-container {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url("../assets/image/bg.jpg") no-repeat center;
  background-size: cover;

  .login-content {
    width: 800px;
    height: 500px;
    backdrop-filter: blur(20px);
    z-index: 1;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;

    .title {
      font-size: 25px;
      position: absolute;
      top: 50px;
    }

    .content {
      display: flex;

      .left {
        @size-bg1: 300px;
        @size-bg2: 200px;
        position: relative;
        height: @size-bg1;
        width: @size-bg1;
        margin-right: 50px;
        perspective: 800px;

        .bg1 {
          width: @size-bg1;
          height: @size-bg1;
          position: absolute;
          object-fit: cover;
          z-index: 2;
          animation: move1 2s ease 1;
        }

        .bg2 {
          width: @size-bg2;
          height: @size-bg2;
          position: absolute;
          z-index: 3;
          left: 40%;
          top: 50%;
          transform: translate(-50%, -50%);
          object-fit: cover;
          animation: move 2s ease 1;
        }
      }

      .right {
        flex: 1;
        @wdith: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h1 {
          font-size: 20px;
          font-weight: 700;
          width: 300px;
          text-align: left;
          margin-bottom: 15px;
        }

        input {
          display: block;
          width: @wdith;
          height: 50px;
          margin: 20px 0;
          border-radius: 10px;
          border: 0;
          background: none;
          box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
          color: rgb(80, 82, 84);
          font-family: "Century Gothic", Times, serif;
          outline: none;
          padding: 20px;
          box-sizing: border-box;
          font-size: 16px;

          &:focus {
            outline: 2px solid #abc6f8;
          }
        }


        button {
          width: @wdith;
          height: 40px;
          background-color: rgb(68, 96, 241);
          border-radius: 10px;
          font-size: 15px;
          color: #fff;
          border: 0;
          font-weight: 600;
          margin-top: 15px;
          cursor: pointer;
          box-shadow: -20px 28px 42px 0 rgba(62, 145, 255, 0.37);
          font-family: "Century Gothic", Times, serif;

          &:active {
            transition: all 0.5s ease;
            background-color: rgb(210, 223, 237);
          }
        }
      }
    }
  }
}

@keyframes move {
  0% {
    transform: translate(-1000px, -50%);
  }

  100% {
    transform: translate(-50%, -50%);
  }
}

@keyframes move1 {
  0% {
    transform: translateY(-300%) translateZ(-1000px);
  }

  100% {
    transform: translateY(0) translateZ(0);
  }
}
</style>
