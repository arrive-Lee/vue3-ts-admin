import Mock from "mockjs";
import { v4 as uuidv4 } from "uuid";
import { User, Menu, CardData, ToDo, Histogram, Pie } from "../model/home";
import { Message } from "../model/home";
import avatar from "../assets/image/avatar.jpg";
import avatar1 from "../assets/image/avatar1.jpg";
import * as _ from "lodash";

//首页数据
const adminMenu: Menu[] = [
  {
    label: "首页",
    icon: "Odometer",
    path: "/home/index",
    name: "index",
    component: "Index.vue",
    meta: {
      title: "首页",
    },
  },
  {
    label: "消息中心",
    icon: "Message",
    path: "/home/message",
    name: "message",
    component: "MessageView.vue",
    meta: {
      title: "消息中心",
    },
  },
  {
    label: "用户管理",
    icon: "User",
    name: "manage",
    path: "/home/manage",
    component: "ManageView.vue",
    meta: {
      title: "用户管理",
    },
  },
  {
    label: "图表生成",
    icon: "PieChart",
    name: "chart",
    path: "/home/chart",
    component: "ChartView.vue",
    meta: {
      title: "图表生成",
    },
  },
  {
    label: "权限设置",
    icon: "Tools",
    name: "auth",
    path: "/home/auth",
    component: "AuthView.vue",
    meta: {
      title: "权限设置",
    },
  },
];
//用户菜单
const userMenu: Menu[] = [
  {
    label: "首页",
    icon: "Odometer",
    path: "/home/index",
    name: "index",
    component: "Index.vue",
    meta: {
      title: "首页",
    },
  },
  {
    label: "消息中心",
    icon: "Message",
    path: "/home/message",
    name: "message",
    component: "MessageView.vue",
    meta: {
      title: "消息中心",
    },
  },
  {
    label: "图表生成",
    icon: "PieChart",
    name: "chart",
    path: "/home/chart",
    component: "ChartView.vue",
    meta: {
      title: "图表生成",
    },
  },
];

//管理员名单
const adminList: User[] = [
  {
    account: "admin",
    password: "123456",
    name: "潇潇",
    auth: "超级管理员",
    avatar: avatar,
    lastTime:
      `2023-${Mock.Random.integer(1, 12)}-${Mock.Random.integer(1, 28)}` +
      Mock.Random.time("HH:mm:ss"),
    lastPosition: `${Mock.Random.province()} ${Mock.Random.city()} ${Mock.Random.county()}`,
    menu: adminMenu,
    registerTime: `2020-${Mock.Random.integer(1, 12)}-${Mock.Random.integer(
      1,
      28
    )}`,
    introduce: `大家好，我喜欢玩游戏，跟高兴认识大家，谢谢你们。`,
  },
];

//用户名单
const userList: User[] = [
  {
    account: "users",
    password: "123456",
    name: "沐沐",
    auth: "普通用户",
    avatar: avatar1,
    lastTime:
      `2023-${Mock.Random.integer(1, 12)}-${Mock.Random.integer(1, 28)}` +
      Mock.Random.time("HH:mm:ss"),
    lastPosition: `${Mock.Random.province()} ${Mock.Random.city()} ${Mock.Random.county()}`,
    menu: userMenu,
    registerTime: `2020-${Mock.Random.integer(1, 12)}-${Mock.Random.integer(
      1,
      28
    )}`,
    introduce: `大家好，我喜欢玩游戏，跟高兴认识大家，谢谢你们。`,
  },
];
//创造用户数据
for (let i = 0; i < 200; i++) {
  const name = Mock.Random.cname();
  const avatar = Mock.Random.image("100×100", Mock.Random.color(), name);
  userList.push({
    account: String(Mock.Random.integer(1000000, 10000000)),
    password:
      Mock.Random.paragraph().slice(1, 3) +
      String(Mock.Random.integer(1000000, 10000000)),
    name,
    avatar,
    auth: "普通用户",
    lastTime:
      `2023-${Mock.Random.integer(1, 12)}-${Mock.Random.integer(1, 28)}` +
      Mock.Random.time("HH:mm:ss"),
    lastPosition: `${Mock.Random.province()} ${Mock.Random.city()} ${Mock.Random.county()}`,
    menu: userMenu,
    registerTime: `2020-${Mock.Random.integer(1, 12)}-${Mock.Random.integer(
      1,
      28
    )}`,
  });
}

//处理get请求的url拿到参数
const handleUrl = (url: string): Map<string, string> => {
  url = decodeURIComponent(url);
  const values: string[] = url.split("?")[1].split("&");
  const params: Map<string, string> = new Map();
  values.forEach((item) => {
    params.set(item.split("=")[0], item.split("=")[1]);
  });
  return params;
};

//处理登陆请求
export const login = (option: any) => {
  const account = <string>handleUrl(option.url).get("account");
  const password = <string>handleUrl(option.url).get("password");
  //判断用户是否在其中
  const userInfo = [...adminList, ...userList].find((user) => {
    return user.account == account && user.password == password;
  });

  //如果查找到则返回相关信息
  if (userInfo) {
    const {
      name,
      auth,
      avatar,
      menu,
      lastTime,
      lastPosition,
      account,
      registerTime,
      introduce,
    } = userInfo;
    return {
      code: "200",
      message: "登陆成功",
      token: uuidv4(),
      data: {
        name,
        auth,
        avatar,
        menu,
        lastTime,
        lastPosition,
        account,
        registerTime,
        introduce,
      },
    };
  } else {
    return {
      code: "404",
      message: "未查找到该用户",
    };
  }
};

//首页数据
const sysInfo: CardData[] = [
  {
    mean: "用户访问量",
    num: Mock.Random.integer(30000, 202000),
    color: Mock.Random.color(),
    icon: "UserFilled",
  },

  {
    mean: "用户总数",
    num: Mock.Random.integer(2000, 20000),
    color: Mock.Random.color(),
    icon: "Avatar",
  },
  {
    mean: "系统消息数",
    num: Mock.Random.integer(20, 200),
    color: Mock.Random.color(),
    icon: "ChatDotSquare",
  },
];

//待办事项
const todo: ToDo[] = [
  {
    isFinished: false,
    content: "修bug,修完100个bug",
  },
  {
    isFinished: false,
    content: "写项目，完成项目的编写",
  },
  {
    isFinished: false,
    content: "好好休息，出去耍",
  },
  {
    isFinished: false,
    content: "睡个好觉，明天好好努力",
  },
  {
    isFinished: false,
    content: "睡个好觉，明天好好努力",
  },
  {
    isFinished: false,
    content: "睡个好觉，明天好好努力",
  },
];

//首页柱状图数据
const histogram: Histogram[] = [];
const week: string[] = [
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期天",
];
for (let w of week) {
  histogram.push({
    date: w,
    userOnline: Mock.Random.integer(2000, 10000),
    new: Mock.Random.integer(500, 2000),
  });
}

//首页饼状图数据
const pie: Pie[] = [];
const jobs: string[] = [
  "教师",
  "程序员",
  "学生",
  "技术工人",
  "自由技术者",
  "商贩",
];
for (let j of jobs) {
  pie.push({
    name: j,
    value: Mock.Random.integer(5000, 20000),
  });
}

//饼状图数据

//处理首页请求数据的请求
export const getIndexData = () => {
  return {
    code: "200",
    data: {
      sysInfo,
      todo,
      histogram,
      pie,
    },
  };
};

//消息中心数据

//未读消息
const unRead: Message[] = [];
//已读消息
const read: Message[] = [];
//回收站
const recycle: Message[] = [];

for (let i = 0; i < 10; i++) {
  if (i < 5) {
    unRead.push({
      content:
        "【系统通知】该系统将在" +
        Mock.Random.integer(0, 23) +
        "点开始维护，请用户注意不要登陆系统。",
      time: `2023-${i}-${Mock.Random.integer(1, 30)} ${Mock.Random.time(
        "HH:mm:ss"
      )}`,
      id: uuidv4(),
    });
  }
  read.push({
    content:
      "【系统通知】该系统将在" +
      Mock.Random.integer(0, 23) +
      "点开始维护，请用户注意不要登陆系统。",
    time: `2023-${i}-${Mock.Random.integer(1, 30)} ${Mock.Random.time(
      "HH:mm:ss"
    )}`,
    id: uuidv4(),
  });
  if (i < 3) {
    recycle.push({
      content:
        "【系统通知】该系统将在" +
        Mock.Random.integer(0, 23) +
        "点开始维护，请用户注意不要登陆系统。",
      time: `2023-${i}-${Mock.Random.integer(1, 30)} ${Mock.Random.time(
        "HH:mm:ss"
      )}`,
      id: uuidv4(),
    });
  }
}

//处理消息请求
export const getMessage = () => {
  return {
    code: "200",
    messgae: "获取成功",
    data: {
      unRead,
      read,
      recycle,
    },
  };
};

//让消息由未读变成已读
export const readMessage = (option: any) => {
  const id = option.body;
  console.log(id);
  if (id) {
    //通过id找到消息本体
    const message = unRead.find((item) => item.id == id);
    //找到消息与消息的索引
    const index = unRead.findIndex((item) => item.id == id);
    //从未读消息中删除这条消息
    unRead.splice(index, 1);
    //向已读消息中添加次消息
    read.push(message as Message);
  } else {
    //将消息添加到已读去
    unRead.forEach((item) => read.push(item));
    //删除未读消息
    unRead.splice(0);
  }
  return {
    code: "200",
    msg: "修改成功",
  };
};

//删除已读消息
export const delMsg = (option: any) => {
  const id = option.body;
  console.log(id);

  if (id) {
    //通过id找到消息本体
    const message = read.find((item) => item.id == id);
    //找到消息与消息的索引
    const index = read.findIndex((item) => item.id == id);
    //从未读消息中删除这条消息
    read.splice(index, 1);
    //向已读消息中添加次消息
    recycle.push(message as Message);
  } else {
    //将消息添加到已读去
    unRead.forEach((item) => read.push(item));
    //删除未读消息
    unRead.splice(0);
  }
  return {
    code: "200",
    msg: "修改成功",
  };
};

//复位已删除消息,不传递参数则全部删除
export const recoverMsg = (option: any) => {
  const id = option.body;
  if (id) {
    //通过id找到消息本体
    const message = recycle.find((item) => item.id == id);
    //找到消息与消息的索引
    const index = recycle.findIndex((item) => item.id == id);
    //从未读消息中删除这条消息
    recycle.splice(index, 1);
    //向已读消息中添加次消息
    read.push(message as Message);
  } else {
    //删除未读消息
    recycle.splice(0);
  }
  return {
    code: "200",
    msg: "修改成功",
  };
};

// 用户管理数据
//获取用户的数据
export const getUserList = (option: any) => {
  const params = handleUrl(option.url);
  const page = Number.parseInt(params.get("page") as string);
  const pageSize = Number.parseInt(params.get("pageSize") as string);
  return {
    code: "200",
    msg: "获取成功",
    list: userList.slice((page - 1) * pageSize, page * pageSize),
    len: userList.length,
  };
};
//获取全部用户的数据
export const getAll = () => {
  return {
    code: "200",
    msg: "获取成功",
    list: userList,
  };
};

// excel批量新增新增用户
export const addUser = (option: any) => {
  const users = JSON.parse(option.body) as User[];
  users.forEach((user) => {
    user.menu = userMenu;
    userList.push(user);
  });
  return {
    code: "200",
    msg: "新增成功",
  };
};

//删除用户信息,传入账号信息，删除用户
export const deleteUser = (option: any) => {
  const account = option.body;
  //通过账号找到用户索引
  const index = userList.findIndex((user) => user.account == account);
  //删除
  userList.splice(index, 1);
  return {
    code: "200",
    msg: "删除成功",
  };
};

//查找用户信息
export const searchUser = (option: any) => {
  const info = option.body;
  if (info) {
    const res = userList.filter((item) => {
      return (
        item.account?.includes(info) ||
        item.name.includes(info) ||
        item.lastPosition?.includes(info)
      );
    });
    return {
      code: "200",
      msg: "查找成功",
      list: res,
    };
  }
};

//编辑用户信息
export const updateUserInfo = (option: any) => {
  const user = JSON.parse(option.body);
  const index = userList.findIndex((item) => item.account == user.account);
  userList[index] = user;
  return {
    code: "200",
    msg: "编辑成功",
  };
};

//返回用户菜单管理权限
export const getMenu = () => {
  return {
    code: "200",
    msg: "获取成功",
    userMenu,
    adminMenu,
  };
};

//更新用户权限
export const updateAuth = (option: any) => {
  const menu = JSON.parse(option.body);
  userMenu.length = 0;
  menu.forEach((item: Menu) => {
    userMenu.push(item);
  });
  return {
    code: "200",
    msg: "修改成功",
  };
};
