import { defineStore } from "pinia";
import { StoreName } from "./store";
import { reactive, ref } from "vue";
import { User, ClickHistory } from "../model/home";
import { getStorage } from "../util/util";

export const useHomeStore = defineStore(StoreName.HOME, () => {
  //token
  const token = ref<string>(sessionStorage.getItem("token") || "");
  //需要加载路由
  const needRoute = ref<boolean>(true);
  //用户消息
  const userInfo = reactive<User>(
    getStorage("session", "userInfo") || {
      name: "",
      auth: "",
      avatar: "",
      lastTime: "",
      lastPosition: "",
      menu: [],
    }
  );
  //记录菜单是否收缩
  const isCollapse = ref<boolean>(false);
  //记录用户点击的菜单历史
  const menuHistory = reactive<ClickHistory[]>([
    {
      label: "首页",
      path: "/home/index",
    },
  ]);
  return { userInfo, token, isCollapse, menuHistory, needRoute };
});
