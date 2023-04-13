<template>
  <div class="manage-container">
    <!-- 编辑用户信息 -->
    <el-dialog v-model="showDiag" title="编辑用户消息" width="40%" align-center>
      <el-form :model="user" class="user-form" inline label-position="left">
        <el-form-item label="姓名">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="user.auth">
            <el-option label="普通用户" value="普通用户" />
            <el-option label="超级管理员" value="超级管理员" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="user.account" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="user.password" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="user.account" />
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker v-model="user.registerTime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="changeInfo">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-card>
      <!-- 功能区 -->
      <div class="functional">
        <div class="fn-left">
          <el-input type="primary" class="search" placeholder="输入用户信息进行搜索" v-model="searchContent"
            @input="search"></el-input>
          <el-button icon="Search" type="primary" @click="search">搜索</el-button>
        </div>
        <div class="fn-right">
          <input type="file" accept=".xlx,.xlsx" @change="uploadExcel" ref="uploadE" class="upload" />
          <el-button type="primary" icon="DocumentAdd" @click="upload">导入excel</el-button>
          <vue3-json-excel :json-data="users" :fields="fields" name="用户信息数据" type="xlsx">
            <el-button type="primary" icon="Download">导出excel</el-button>
          </vue3-json-excel>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-table :data="userList" :border="true" stripe max-height="440" :header-cell-style="headerStyle"
        header-cell-class-name="header-cell" :row-style="{
          height: '40px',
        }">
        <el-table-column label="用户名" width="100" prop="name" />
        <el-table-column label="用户权限" width="100" prop="auth" />
        <el-table-column label="账号" width="150" prop="account" />
        <el-table-column label="密码" width="150" prop="password" />
        <el-table-column label="注册时间" prop="registerTime" width="150" />
        <el-table-column label="地址" width="300" prop="lastPosition" />
        <el-table-column label="操作">
          <template #default="scope">
            <div class="operate">
              <span @mousedown.prevent="editU(scope.row)">
                <el-icon class="icon">
                  <Edit />
                </el-icon>编辑</span>
              <span @mousedown.prevent="deleteU(scope.row)">
                <el-icon class="icon">
                  <Delete />
                </el-icon>删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <span class="info"> 共{{ size }}条，当前展示{{ pageSize }}条 </span>
        <el-pagination background layout="sizes,prev, pager, next" :total="size" v-model:page-size="pageSize"
          v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]" small @currentChange="changePage"
          @size-change="changeSize" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { User } from "../model/home";
import { getUser, getAll, deleteUser, searchUser, addUsers, updateUser } from "../util/api";
import { confirm, message } from "../util/util";
import * as _ from "lodash";
import * as xlsx from "xlsx";


const headerStyle = {
  color: "#909399",
  fontWeight: "650",
  fontSize: "14px",
  backgroundColor: "#F5F7FA",
};
//导出excel的字段
const fields = {
  用户名: "name",
  账号: "account",
  密码: "password",
  权限: "auth",
  头像: "avatar",
  上一次登陆的时间: "lastTime",
  上一次登陆的地点: "lastPosition",
  注册时间: "registerTime",
};

//全部用户数据列表，便用导出excel
const users = reactive<User[]>([]);

//当页数据列表
const userList = reactive<User[]>([]);
//当页数据条数
const pageSize = ref<number>(20);
//当前页码数
const curPage = ref<number>(1);
//总的用户数据长度
let size = ref<number>(0);
//当前用户搜索内容
const searchContent = ref<string>("");
//用来存放excel传入的内容
const excel = reactive<any[]>([]);
//获取上传的dom
const uploadE = ref<HTMLInputElement>();
//控制对话框的打开与关闭
const showDiag = ref<boolean>(false);
//当前编辑的用户
let user = reactive<User>({
  name: "",
  auth: "",
  avatar: "",
  lastTime: "",
  lastPosition: "",
  menu: [],
});

//获取全部用户数据，用于导出excel
getAll().then((response: any) => {
  if (response) {
    const {
      data: { list },
    } = response;
    (list as User[]).forEach((e) => {
      users.push(e);
    });
  }
});

//获取当页数据
const getData = (page: number, pageSize: number): void => {
  getUser(page, pageSize).then((response: any) => {
    if (response) {
      const {
        data: { len, list },
      } = response;
      if (userList.length != 0) {
        userList.splice(0);
      }
      (list as User[]).forEach((item) => {
        userList.push(item);
      });
      size.value = len;
    }
  });
};
//第一次加载数据
getData(1, 20);

const changePage = (page: number): void => {
  curPage.value = page;
  getData(page, pageSize.value);
};
const changeSize = (size: number): void => {
  pageSize.value = size;
  getData(curPage.value, pageSize.value);
};

const deleteU = (row: User): void => {
  confirm("删除用户", "是否要删除此名用户？", () => {
    deleteUser(row.account as string).then((respone: any) => {
      if (respone) {
        if (respone.data.code == "200") {
          getData(curPage.value, pageSize.value);
          message("success", "删除成功！");
        } else {
          message("error", "删除失败！");
        }
      }
    });
  });
};

//搜索用户
const search = (): void => {
  if (searchContent.value != "") {
    //节流函数
    _.throttle(
      function () {
        userList.splice(0);
        searchUser(searchContent.value).then((response: any) => {
          if (response) {
            const {
              data: { list },
            } = response;
            (list as User[]).forEach((item) => {
              userList.push(item);
            });
            size.value = list.length;
          }
        });
      },
      500,
      {
        leading: true,
        trailing: false,
      }
    )();
  }
};

//编辑用户消息
const editU = (row: User): void => {
  showDiag.value = true
  user = row;
};

//上传excel
//注意导入导出的格式必须相同
const uploadExcel = (e: Event): void => {
  const files = (e.target as HTMLInputElement).files;
  if (files) {
    if ((files.length as number) <= 0) {
      return;
    } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
      message("error", "请上传xls或xlsx文件");
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      //将excel文件读成而进程
      const workBook = xlsx.read(e.target?.result, {
        type: "binary",
      });
      //获得表头名字
      const wsName = workBook.SheetNames[0];
      //获取每一项数据并转成json
      const ws = xlsx.utils.sheet_to_json(workBook.Sheets[wsName]);
      //对导入的数据进行转化
      //获取转换文件的列名
      const key: string[] = Object.keys(fields);
      //获取列名
      const value: string[] = Object.values(fields);
      ws.forEach((item: any) => {
        const map: Map<string, string> = new Map();
        key.forEach((k, index) => {
          map.set(value[index], item[k]);
        });
        // 转化为user对象
        const user = Object.fromEntries(map);
        //添加
        excel.push(user)
      });
      //将其添加道userlist里面
      addUsers(excel).then((response: any) => {
        if (response) {
          const { data: msg } = response;
          message("success", msg);
        }
      })
      //重新刷新视图
      getData(curPage.value, pageSize.value)
    };
    reader.readAsBinaryString(files[0]);
  }
};

const upload = () => {
  uploadE.value?.click();
};

//修改用户数据
const cancel = (): void => {
  showDiag.value = false
  user = reactive<User>({
    name: "",
    auth: "",
    avatar: "",
    lastTime: "",
    lastPosition: "",
    menu: [],
  });
}

const changeInfo = (): void => {
  updateUser(user).then((response: any) => {
    if (response) {
      const { data: { msg } } = response;
      message("success", msg)
      cancel();
      getData(curPage.value, pageSize.value);
    }
  })
}

//监测用户是否取消输入取消则复原数据
watch(searchContent, (newVal) => {
  if (newVal == "") {
    getData(curPage.value, pageSize.value);
  }
});
</script>

<style scoped lang="less">
.manage-container {
  padding: 10px 10px 0;
  background-color: rgb(240, 240, 240);
  height: 85vh;

  .el-card {
    padding: 0 10px;
    width: 100%;

    .functional {
      display: flex;
      position: relative;
      @height: 40px;

      .fn-right {
        position: absolute;
        right: 0;

        .el-button {
          height: @height;
          margin: 0 10px;
        }

        .upload {
          display: none;
        }
      }

      .fn-left {
        .search {
          width: 300px;
          height: @height;
        }

        .el-button {
          height: @height;
          margin: 0 20px;
        }
      }
    }

    .el-table {
      margin-top: 20px;

      &:deep(.header-cell:last-child) {
        text-align: center;
      }

      .operate {
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          display: flex;
          align-items: center;
          height: 20px;
          cursor: pointer;


          .icon {
            margin-right: 5px;
          }

          &:first-child {
            color: #606266;
            margin-right: 20px;
          }

          &:last-child {
            color: #f56c6c;
          }
        }
      }
    }

    .pagination {
      display: flex;

      .info {
        font-size: 12px;
        align-self: center;
        margin: 23px 20px 0;
        width: 12em;
        color: #303133;
      }

      .el-pagination {
        margin-top: 20px;

        &:deep(.el-pagination__sizes) {
          margin-right: 550px;
        }
      }
    }
  }
}
</style>
