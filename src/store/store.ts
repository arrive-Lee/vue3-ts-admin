import { createPinia } from "pinia";
const pinia = createPinia();
//导出枚举类
export enum StoreName {
  HOME = "home",
  MESSAGE = "message",
}

export default pinia;
