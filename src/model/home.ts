//首页的数据模型

//菜单选项
export interface Menu {
  //菜单名字
  label: string;
  //图标
  icon?: string;
  //路由路径
  path?: string;
  //路由命名
  name?: string;
  //路由组件名
  component?: string;
  //meta选项
  meta?: RouteMeta;
  children?: Menu[];
}

//路由meta选项
export interface RouteMeta {
  title: string;
  isAuth?: boolean;
  isAlive?: boolean;
  transition?: string;
}

//用户数据
export interface User {
  //账号
  account?: string;
  //密码
  password?: string;
  //用户名
  name: string;
  //权限
  auth: string;
  //用户头像
  avatar: string;
  //上一次登陆的时间
  lastTime: string;
  //上一次登陆的地点
  lastPosition: string;
  //菜单权限
  menu?: Menu[];
  //注册时间
  registerTime?: string;
  introduce?: string;
}

//一次菜单点击的记录
export interface ClickHistory {
  //菜单名字
  label: string;
  //路径
  path: string;
}

//首页数据
export interface CardData {
  mean: string;
  icon: string;
  num: number;
  color: string;
}

//todolist数据
export interface ToDo {
  isFinished: boolean;
  content: string;
}

//柱状数据图数据模型
export interface Histogram {
  date: string;
  userOnline: number;
  new: number;
}

//饼图数据
export interface Pie {
  name: string;
  value: number;
}

//一条消息
export interface Message {
  content: string;
  time: string;
  id: string;
}
