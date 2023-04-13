import { createApp } from "vue";
import "./reset.css";
import App from "./App.vue";
import pinia from "./store/store";
import router from "./router";
import "./mock/mock";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// excel导入导出插件
import vue3JsonExcel from "vue3-json-excel";

//导入pinia持久化插件

const app = createApp(App);
app.use(vue3JsonExcel);
app.use(ElementPlus);
app.use(pinia);
app.use(router);

app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
