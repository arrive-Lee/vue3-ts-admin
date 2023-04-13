<template>
  <div class="index-container">
    <el-row class="row">
      <el-col :span="8" class="left">
        <el-card class="user-card" shadow="hover">
          <div class="user-info">
            <img :src="userInfo.avatar" alt="0" class="avatar" />
            <div class="info">
              <p>{{ userInfo.name }}</p>
              <p>{{ userInfo.auth }}</p>
            </div>
          </div>
          <div class="account-info">
            <p>
              上次登陆时间：<span>{{ userInfo.lastTime.split(" ")[1] }}</span>
            </p>
            <p>
              上次登陆地点：<span>{{ userInfo.lastPosition }}</span>
            </p>
          </div>
        </el-card>
        <el-card class="lang-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>语言详情</span>
            </div>
          </template>
          <span>Vue</span>
          <el-progress :percentage="79.4" color="rgb(66, 185, 131)" />
          <span>TypeScript</span>
          <el-progress :percentage="14" color="rgb(241, 224, 90)" />
          <span>CSS</span>
          <el-progress :percentage="5.6" />
          <span>HTML</span>
          <el-progress :percentage="1" color="rgb(245, 108, 108)" />
        </el-card>
      </el-col>
      <el-col :span="16" class="right">
        <div class="sys-info">
          <el-card shadow="hover" v-for="item in sysData" :key="item.mean" class="sys-card">
            <div class="content">
              <div class="content-left">
                <el-icon size="50" class="icon" :style="{
                  backgroundColor: item.color,
                }" color="#ffffff">
                  <component :is="item.icon"></component>
                </el-icon>
              </div>
              <div class="content-right">
                <span :style="{
                  color: item.color,
                }">{{ item.num }}</span>
                <span>{{ item.mean }}</span>
              </div>
            </div>
          </el-card>
        </div>
        <div class="todo-list">
          <el-card class="todo-card">
            <template #header>
              <div class="todo-card-header">
                <span>待办事项</span>
                <span>添加</span>
              </div>
            </template>
            <el-table :data="todoThing" stripe style="width: 100%" height="290" :show-header="false"
              :row-style="{ height: '48.8px' }">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="content" label="要做的事" width="745" />
            </el-table>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- 图表数据 -->
    <el-row class="second-row">
      <el-col :span="12">
        <el-card>
          <div ref="hContainer"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div ref="pContainer"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from "../store/home";
import { storeToRefs } from "pinia";
import { getIndexData } from "../util/api";
import { CardData, ToDo, Histogram, Pie } from "../model/home";
import { reactive, inject, ref } from "vue";
import { ECOption } from "../echart";
//拿到store
const home = useHomeStore();
//解构需要的用户信息
const { userInfo } = storeToRefs(home);
//首页数据的容器
const sysData = reactive<CardData[]>([]);
const todoThing = reactive<ToDo[]>([]);
//柱状图容器
const hContainer = ref<HTMLDivElement>();
//饼状图容器
const pContainer = ref<HTMLDivElement>();
const echarts = inject<any>("echarts");
//绘画柱状图
const drawHis = (histogram: Histogram[]): void => {
  //柱状图
  const hXAxis = histogram.map((item) => item.date);
  const online = histogram.map((item) => item.userOnline);
  const newAdd = histogram.map((item) => item.new);
  const hOption: ECOption = {
    title: {
      text: "一周内用户在线与新增图",
    },
    tooltip: {},
    xAxis: {
      data: hXAxis,
    },
    yAxis: {},
    series: [
      {
        name: "用户在线数",
        type: "bar",
        data: online,
      },
      {
        name: "用户新增数",
        type: "bar",
        data: newAdd,
      },
    ],
  };
  const hisChart = echarts.init(hContainer.value, null, {
    height: 340,
    width: 613,
  });
  hisChart.setOption(hOption);
};
const drawPie = (pie: Pie[]): void => {
  //柱状图

  const pOption: ECOption = {
    title: {
      text: "用户职业分析",
    },
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: [
      {
        type: "pie",
        data: pie,
        roseType: "area",
      },
    ],
  };
  const pieChart = echarts.init(pContainer.value, null, {
    height: 340,
    width: 613,
  });
  pieChart.setOption(pOption);
};
//获取首页数据
getIndexData().then((response: any) => {
  const {
    data: {
      data: { sysInfo, todo, histogram, pie },
    },
  } = response;
  //从容器中取到数据
  (sysInfo as CardData[]).forEach((item) => {
    sysData.push(item);
  });
  (todo as ToDo[]).forEach((item) => {
    todoThing.push(item);
  });
  //画图
  drawHis(histogram);
  drawPie(pie);
});
</script>

<style scoped lang="less">
.index-container {
  background-color: rgb(240, 240, 240);
  padding: 10px 10px 0;
  display: flex;
  flex-direction: column;
  width: 100%;

  .row {
    width: 100%;

    .left {
      padding-right: 10px;

      .user-card {
        .user-info {
          width: 362px;
          height: 142px;
          display: flex;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #ccc;

          .avatar {
            height: 120px;
            width: 120px;
            border-radius: 50%;
            object-fit: cover;
          }

          .info {
            padding-left: 50px;
            width: 242px;
            height: 120px;
            display: flex;
            justify-content: center;
            flex-direction: column;

            p {
              color: #222;
              font-size: 28px;

              &:last-child {
                font-size: 14px;
                color: #999;
                margin-top: 10px;
              }
            }
          }
        }

        .account-info {
          margin-top: 20px;

          p {
            width: 362px;
            font-size: 14px;
            color: #999;
            line-height: 25px;

            span {
              margin-left: 20px;
            }
          }
        }
      }

      .lang-card {
        margin-top: 20px;

        span {
          display: inline-block;
          margin-top: 5px;
        }
      }
    }

    .right {
      padding-left: 10px;

      .sys-info {
        display: flex;

        .sys-card {
          flex: 1;
          position: relative;
          height: 100px;
          margin-right: 20px;

          &:last-child {
            margin: 0;
          }

          .content {
            width: 100%;
            height: 100px;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;

            .content-left {
              .icon {
                height: 100px;
                width: 100px;
              }
            }

            .content-right {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              span {
                display: block;

                &:first-child {
                  font-size: 30px;
                }

                &:last-child {
                  color: #999999;
                  font-size: 14px;
                  margin-top: 10px;
                }
              }
            }
          }
        }
      }

      .todo-list {
        margin-top: 20px;

        .todo-card {
          height: 394px;

          .todo-card-header {
            position: relative;

            span {
              &:last-child {
                position: absolute;
                right: 0;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }

  .second-row {
    margin: 20px 0;

    .el-col {
      &:last-child {
        padding-left: 10px;
      }
    }
  }
}
</style>
