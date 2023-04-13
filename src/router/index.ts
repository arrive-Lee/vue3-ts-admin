import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import pinia from "../store/store";
import { useHomeStore } from "../store/home";
import { storeToRefs } from "pinia";
import { addRoutes } from "../util/util";
import { Menu } from "../model/home";

const home = useHomeStore(pinia);

//自定义路由元信息
declare module "vue-router" {
  interface RouteMeta {
    title: string;
    isAuth?: boolean;
    isAlive?: boolean;
    transition?: string;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "",
    redirect: "/login",
    children: [
      {
        path: "/login",
        name: "login",
        component: () => import("../view/LoginView.vue"),
        meta: {
          title: "登陆",
        },
      },
      {
        path: "/home",
        name: "home",
        component: () => import("../view/HomeView.vue"),
        redirect: {
          name: "index",
        },
        children: [
          //属于同于路由不用二次注册
          //首页
          {
            path: "index",
            name: "index",
            component: () => import("../view/IndexView.vue"),
            meta: {
              title: "首页",
            },
          },
          //个人中心
          {
            path: "info",
            name: "info",
            component: () => import("../view/PersonCenter.vue"),
            meta: {
              title: "个人中心",
            },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savePostion) {
    return savePostion ? savePostion : { top: 0 };
  },
});

//前置路由守卫判断登录状态
router.beforeEach((to, from, next) => {
  const { token, userInfo, needRoute } = storeToRefs(home);
  //如果token不存在且去的页面不是登陆页面，重定向为登陆页面
  if (!token.value && to.fullPath != "/login") {
    next({
      name: "login",
    });
  }
  //如果token存在且要回去登陆页面则重定向回当前页面
  else if (token.value && to.fullPath == "/login") {
    next({
      name: "home",
    });
  }
  //剩余情况放行
  else {
    // 刷新后二次加载路由
    if (needRoute.value) {
      addRoutes(userInfo.value.menu as Menu[]);
      needRoute.value = false;
      router.replace({
        path: to.fullPath,
      });
    } else {
      next();
    }
  }
});

//后置路由守卫，切换页签名字
router.afterEach((to, from) => {
  document.title = to.meta.title;
});

export default router;
