import { request } from "./request";
import { User, Menu } from "../model/home";
import { message } from "../util/util";
import axios from "axios";
//登陆请求
export const getCheckCode = async (len: number) => {
  try {
    return await axios.get(`/codes/api/verifycode/code?app-secret='WnhrK251TWlUUThqaVFWbG5OeGQwdz09
'&app_id:rgihdrm0kslojqvm&type=0&len=${len}`);
  } catch (err: any) {
    message("error", err.message);
  }
};

//登陆请求
export const login = async (account: string, password: string) => {
  try {
    return await request.get(
      `/login/loginIn?account=${account}&password=${password}`
    );
  } catch (err: any) {
    message("error", err.message);
  }
};

//请求首页的数据
export const getIndexData = async () => {
  try {
    return await request.get(`/home/index/indexData`);
  } catch (err: any) {
    message("error", err.message);
  }
};

//消息中心请求消息的数据
export const getMessage = async () => {
  try {
    return await request.get(`/home/message/getMessage`);
  } catch (err: any) {
    message("error", err.message);
  }
};

//让消息变成已读，传递id则删除一条不传递则删除全部
export const changeMsgStatus = async (id?: string) => {
  try {
    return await request.post("/home/message/readMessage", id);
  } catch (err: any) {
    message("error", err.message);
  }
};

//让消息变成已读，传递id则删除一条不传递则删除全部
export const delMsg = async (id?: string) => {
  try {
    return await request.post("/home/message/deleteMsg", id);
  } catch (err: any) {
    message("error", err.message);
  }
};

//让已读消息复位
export const recoverMsg = async (id?: string) => {
  try {
    return await request.post("/home/message/recoverMsg", id);
  } catch (err: any) {
    message("error", err.message);
  }
};

//获取用户数据
export const getUser = async (page: number, pageSize: number) => {
  try {
    return await request.get(
      `/home/manage/getUser?page=${page}&pageSize=${pageSize}`
    );
  } catch (err: any) {
    message("error", err.message);
  }
};

//获取全部用户数据，便于导出
export const getAll = async () => {
  try {
    return await request.get(`/home/manage/getAllUser`);
  } catch (err: any) {
    message("error", err.message);
  }
};

//批量增加用户
export const addUsers = async (users: User[]) => {
  try {
    return await request.post("/home/manage/createUsers", users);
  } catch (err: any) {
    message("error", err.message);
  }
};

//更新用户信息
export const updateUser = async (user: User) => {
  try {
    return await request.post("/home/manage/update", user);
  } catch (err: any) {
    message("error", err.message);
  }
};

//删除用户
export const deleteUser = async (account: string) => {
  try {
    return await request.post("/home/manage/delete", account);
  } catch (err: any) {
    message("error", err.message);
  }
};

//查找用户信息
export const searchUser = async (info?: string) => {
  try {
    return await request.post("/home/manage/search", info);
  } catch (err: any) {
    message("error", err.message);
  }
};

//获取菜单
export const getMenu = async () => {
  try {
    return await request.get("/home/auth/getMenu");
  } catch (err: any) {
    message("error", err.message);
  }
};

//跟新权限
export const updateAuth = async (menus: Menu[]) => {
  try {
    return await request.post("/home/auth/updateAuth", menus);
  } catch (err: any) {
    message("error", err.message);
  }
};
