<template>
    <div class="chart-container">
        <el-card ref="card">
            <el-select v-model="choice" placeholder="请选择生成图形的类型" size="large">
                <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button type="primary" @click="upload?.click()" icon="Upload">
                上传数据
            </el-button>
            <input type="file" class="upload" ref="upload" accept=".xlsx,.xls" @change="uploadData">
            <el-button @click="createChart" type="primary">生成图表</el-button>
            <div ref="container" class="container">

            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from "vue"
import { message } from "../util/util"
import * as xlsx from "xlsx"
import { ECOption } from "../echart";

const selectData = reactive<{
    label: string,
    value: string
}[]>([{
    label: "折线图",
    value: "line"
},
{
    label: "柱形图",
    value: "bar"
},
{
    label: "饼图",
    value: "pie"
},
])
//选项
const choice = ref<string>("")
//上传容器
const upload = ref<HTMLInputElement>();
const echarts: any = inject("echarts")
const container = ref<HTMLDivElement>();
//excel表头名字
const key = reactive<any[]>([])
//excel数据
const dataValue = reactive<any[]>([]);
//导入文件的名字
const fileName = ref<string>("");
//上传数据
const uploadData = () => {
    if (upload) {
        const files = upload.value!.files;
        if (files) {
            if (files!.length <= 0) {
                return;
            } else if (!/\.(xlsx|xls)$/.test(files[0].name)) {
                message("error", "请上传xlsx文件或xls文件")
            }
            const reader: FileReader = new FileReader();
            fileName.value = files[0].name;
            reader.readAsBinaryString(files[0]);
            reader.onload = (e) => {
                const workBook = xlsx.read(e.target!.result, {
                    type: "binary"
                })
                const wsName = workBook.SheetNames[0];
                const ws: any[] = xlsx.utils.sheet_to_json(workBook.Sheets[wsName]);
                const k = Object.keys(ws[0]);
                if (k.includes("__EMPTY")) {
                    //获取数据
                    ws.forEach((item) => {
                        const values = Object.values(item);
                        key.push(values[0])
                        const value = values.slice(1);
                        dataValue.push(value)
                    })
                } else {
                    k.forEach(item => {
                        key.push(item)
                    })
                    ws.forEach((item: any) => {
                        const value = Object.values(item);
                        dataValue.push(value)
                    })
                }
            }
        }
    }
}
//根据上传的信息生成图表
const createChart = (): void => {
    if (choice.value == "") {
        message("error", "请先选择生成图表的类型")
    } else {

        if (choice.value == "bar" || choice.value == "line") {

            const series: any[] = [];
            dataValue.forEach(item => {
                series.push({
                    type: choice.value,
                    data: item
                })
            })
            const option: ECOption = {
                title: {
                    text: fileName.value,
                },
                tooltip: {
                },
                yAxis: {},
                xAxis: { data: key },
                series

            }




            const chart = echarts.init(container.value, null, {
                height: 400,
                width: 800,
            })
            chart.setOption(option)

        } else {
            if (dataValue.length > 1) {
                message("error", "饼图支持Key-value形式的图表")
            } else {
                const data: any[] = [];
                (dataValue[0] as []).forEach((item, index) => {
                    data.push({
                        name: key[index],
                        value: item,
                    })
                })
                const option: ECOption = {
                    title: {
                        text: fileName.value,
                    },
                    series: {
                        type: "pie",
                        data: data
                    }
                }

                const chart = echarts.init(container.value, null, {
                    height: 400,
                    width: 800,
                })
                chart.setOption(option)
            }
        }

    }

}

</script>

<style scoped lang="less">
.chart-container {
    padding: 10px;
    background-color: rgb(240, 240, 240);
    height: 85vh;
    position: relative;

    .el-card {
        height: 80vh;
        padding: 10px;

        .el-button {
            height: 40px;
            margin-left: 20px;
        }

        .upload {
            display: none;
        }

        .container {
            margin-top: 30px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>