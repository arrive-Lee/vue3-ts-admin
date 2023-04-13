import { ElMessageBox, Action, ElMessage } from "element-plus";
import { Menu } from "../model/home";
import { RouteRecordRaw, RouteMeta } from "vue-router";
import router from "../router/index";

const modules = import.meta.glob("../view/*.vue");

//浏览器本地存储
export const setStorage = (
  storageType: string,
  key: string,
  value: any
): void => {
  if (storageType == "local") {
    if (typeof value == "object") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  } else {
    if (typeof value == "object") {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(key, value);
    }
  }
};

//获取浏览器本地存储
export const getStorage = (storageType: string, key: string): any => {
  if (storageType == "local") {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) as string)
      : null;
  } else {
    return sessionStorage.getItem(key)
      ? JSON.parse(sessionStorage.getItem(key) as string)
      : null;
  }
};

export const confirm = (title: string, content: string, fn: any): void => {
  ElMessageBox.confirm(title, content, {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
    showCancelButton: true,
    callback: (action: Action) => {
      if (action == "confirm") {
        fn();
      } else {
        ElMessage.success("操作已取消");
      }
    },
  });
};

export const message = (type: string, content: string): void => {
  switch (type) {
    case "success":
      ElMessage.success(content);
      break;
    case "error":
      ElMessage.error(content);
      break;
    case "info":
      ElMessage.info(content);
      break;
    default:
      ElMessage.warning(content);
  }
};

//动态添加路由
export const addRoutes = (menus: Menu[]) => {
  menus.forEach((item) => {
    if (item.name != "index") {
      if (!item.children) {
        const config: RouteRecordRaw = {
          path: item.path as string,
          name: item.name,
          component: modules[`../view/${item.component}`],
          meta: item.meta as RouteMeta,
        };
        router.addRoute("home", config);
      } else {
        addRoutes(item.children);
      }
    }
  });
};
