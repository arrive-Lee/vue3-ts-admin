<template>
  <div class="message-container">
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-tabs class="tabs" v-model="current">
            <!-- 未读消息 -->
            <el-tab-pane :label="`未读消息(${unrMessage.length})`" name="first">
              <el-table :data="unrMessage" max-height="390px" :show-header="false" :row-style="{
                height: '41.1px',
              }">
                <el-table-column label="内容" width="820" prop="content">
                </el-table-column>
                <el-table-column label="时间" width="200" prop="time">
                </el-table-column>
                <el-table-column label="操作" width="127">
                  <template #default="scope">
                    <el-button @click="read(scope.row)">标为已读</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" class="confirm-btn" @click="readAll">全部标为已读</el-button>
            </el-tab-pane>
            <!-- 已读消息 -->
            <el-tab-pane :label="`已读消息(${rMessage.length})`" name="second">
              <el-table :data="rMessage" max-height="390px" :show-header="false" :row-style="{
                height: '41.1px',
              }">
                <el-table-column label="内容" width="820" prop="content">
                </el-table-column>
                <el-table-column label="时间" width="200" prop="time">
                </el-table-column>
                <el-table-column label="操作" width="127">
                  <template #default="scope">
                    <el-button @click="deleteMessage(scope.row)" type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="danger" class="confirm-btn" @click="deleteAll">删除全部</el-button>
            </el-tab-pane>
            <!-- 回收站 -->
            <el-tab-pane :label="`回收站(${rec.length})`" name="third">
              <el-table :data="rec" max-height="390px" :show-header="false" :row-style="{
                height: '41.1px',
              }">
                <el-table-column label="内容" width="820" prop="content">
                </el-table-column>
                <el-table-column label="时间" width="200" prop="time">
                </el-table-column>
                <el-table-column label="操作" width="127">
                  <template #default="scope">
                    <el-button @click="recover(scope.row)">还原</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="danger" class="confirm-btn" @click="clearRec">清空回收站</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { getMessage, changeMsgStatus, delMsg, recoverMsg } from "../util/api";
import { Message } from "../model/home";
import { useMessageStore } from "../store/message";
import { confirm, message } from "../util/util"
const current = ref<string>("first");

//已读消息
const rMessage = reactive<Message[]>([]);
//未读消息
const unrMessage = reactive<Message[]>([]);
//回收站
const rec = reactive<Message[]>([]);

const messages = useMessageStore();
//获取数据
const getData = () => {
  getMessage().then((response: any) => {
    const {
      data: {
        data: { read, unRead, recycle },
      },
    } = response;
    if (rMessage.length != 0) {
      rMessage.splice(0)
      unrMessage.splice(0);
      rec.splice(0)
    }
    (read as Message[]).forEach((e) => {
      rMessage.push(e);
    });
    (unRead as Message[]).forEach((e) => {
      unrMessage.push(e);
    });
    (recycle as Message[]).forEach((e) => {
      rec.push(e);
    });
  });
}
getData()
//标为已读
const read = (row: Message): void => {
  confirm("是否将消息标为已读", "设为已读", () => {
    changeMsgStatus(row.id).then((response: any) => {
      if (response) {
        const {
          data: { code, msg },
        } = response;

        if (code == "200") {
          getData();
          message("success", msg)
        } else {
          message("success", "修改失败")
        }
      }
    });
  })
};

//全部标为已读
const readAll = (): void => {
  confirm("是否将所有消息标为已读", "设为已读", () => {
    changeMsgStatus().then((response: any) => {
      if (response) {
        const {
          data: { code, msg },
        } = response;
        if (code == "200") {
          //刷新消息
          getData();
          message("success", msg)
        } else {
          message("success", "修改失败")
        }
      }
    });
  })
};

//删除
const deleteMessage = (row: Message): void => {
  confirm("删除消息", "是否要将这条消息删除", () => {
    delMsg(row.id).then((response: any) => {
      if (response) {
        const {
          data: { code, msg },
        } = response;

        if (code == "200") {
          getData();
          message("success", msg)
        } else {
          message("success", "网络错误")
        }
      }
    });
  })

};

const deleteAll = (): void => {
  confirm("删除全部消息", "是否要将所有消息删除", () => {
    delMsg().then((response: any) => {
      if (response) {
        const {
          data: { code, msg },
        } = response;

        if (code == "200") {
          getData();
          message("success", msg)
        } else {
          message("success", "网络错误")
        }
      }
    });
  })
};

//恢复
const recover = (row: Message): void => {
  confirm("是否要复原这条消息?", "复原消息", () => {
    recoverMsg(row.id).then((response: any) => {
      if (response) {
        const {
          data: { code, msg },
        } = response;

        if (code == "200") {
          getData();
          message("success", msg)
        } else {
          message("success", "网络错误")
        }
      }
    });
  })
};

//清空回收站
const clearRec = (): void => {
  confirm("是否要清空回收箱?", "清空回收箱", () => {
    recoverMsg().then((response: any) => {
      if (response) {
        const {
          data: { code, msg },
        } = response;

        if (code == "200") {
          getData();
          message("success", msg)
        } else {
          message("success", "网络错误")
        }
      }
    });
  })
};

watch(
  () => unrMessage.length,
  (newVal) => {
    messages.unReadNum = newVal;
  }
);
</script>

<style scoped lang="less">
.message-container {
  height: 85vh;
  padding: 10px;
  background-color: rgb(240, 240, 240);

  .el-card {
    padding: 30px 30px 0;

    .confirm-btn {
      margin: 30px 0 0 0;
    }
  }
}
</style>
