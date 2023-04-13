import Mock from "mockjs";

import {
  login,
  getIndexData,
  getMessage,
  readMessage,
  delMsg,
  addUser,
  searchUser,
  deleteUser,
  updateUserInfo,
  getUserList,
  getAll,
  getMenu,
  updateAuth,
} from "./data";

//拦截登陆请求
Mock.mock(RegExp("/api/login/loginIn*"), login);

//拦截首页请求数据的接口
Mock.mock("/api/home/index/indexData", getIndexData);

//拦截消息中心请求数据的接口
Mock.mock("/api/home/message/getMessage", getMessage);

//拦截消息中心将未读消息变为已读消息的接口
Mock.mock("/api/home/message/readMessage", "post", readMessage);

//拦截消息中心删除已读消息的接口
Mock.mock("/api/home/message/deleteMsg", "post", delMsg);

//拦截消息中心恢复已读信息的接口
Mock.mock("/api/home/message/recoverMsg", "post", delMsg);

//拦截用户数据中心，增删改查的操作
Mock.mock(RegExp("/api/home/manage/getUser*"), getUserList);
Mock.mock(RegExp("/api/home/manage/getAllUser"), getAll);
Mock.mock("/api/home/manage/createUsers", "post", addUser);
Mock.mock("/api/home/manage/search", "post", searchUser);
Mock.mock("/api/home/manage/delete", "post", deleteUser);
Mock.mock("/api/home/manage/update", "post", updateUserInfo);

//拦截获取菜单的接口做权限管理
Mock.mock("/api/home/auth/getMenu", getMenu);

//拦截改变权限的接口
Mock.mock("/api/home/auth/updateAuth", updateAuth);
