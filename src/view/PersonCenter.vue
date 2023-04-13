<template>
    <div class="center-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>用户基础信息</span>
                </div>
            </template>
            <input type="file" accept=".jpg,.jpeg,.png" style="display: none;" ref="upload" @change="changeAvatar">
            <el-avatar :src="userInfo.avatar" shape="square" :size="100" @click="upload!.click();">
            </el-avatar>
            <el-form :inline="true">
                <el-form-item>
                    <div>
                        <p>昵称:</p>
                        <input type="text" v-model="userInfo.name" />
                    </div>
                </el-form-item>
                <el-form-item>
                    <div>
                        <p>账号:</p>
                        <input type="text" readonly v-model="userInfo.account" />
                    </div>
                </el-form-item>
                <el-form-item>
                    <div>
                        <p>身份:</p>
                        <input type="text" readonly v-model="userInfo.auth" />
                    </div>
                </el-form-item>
                <el-form-item>
                    <div>
                        <p>暂住地:</p>
                        <input type="text" v-model="userInfo.lastPosition" />
                    </div>
                </el-form-item>
                <el-form-item>
                    <div>
                        <p>个人简介:</p>
                        <textarea type="text" v-model="userInfo.introduce" />
                    </div>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useHomeStore } from "../store/home"
import { storeToRefs } from "pinia"
import { ref } from "vue"
import { message } from "../util/util"
const home = useHomeStore();
const { userInfo } = storeToRefs(home)
const upload = ref<HTMLInputElement>();
const changeAvatar = (): void => {
    if (upload.value!.files) {
        if (upload.value!.files.length <= 0) {
            return;
        } else {
            const image = upload.value!.files[0];
            // if (/\.(png|jpeg|jpg)$/.test(image!.name)) {
            //     message("error", "请上传图片！")
            // }
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                userInfo.value.avatar = (e.target?.result as string)
            }
        }
    }
}


</script>

<style scoped lang="less">
.center-container {
    padding: 20px;
    display: flex;
    justify-content: center;
    background-color: rgb(240, 240, 240);

    .el-card {
        height: 550px;
        width: 750px;
        position: relative;

        p {
            font-size: 18px;
            margin-left: 5px;
        }

        .el-avatar {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        .el-form {
            margin-top: 130px;

            .el-form-item {
                &:nth-child(1n) {
                    margin-left: 30px;
                }

                &:nth-child(2n) {
                    margin-left: 30zpx;
                }
            }
        }

        input,
        textarea {
            width: 265px;
            padding: 0 0 0 15px;
            height: 40px;
            border-radius: 10px;
            font-size: 14px;
            border: none;
            outline: none;
            background-color: #F2F3F4;

            &:focus {
                outline: 2px solid#007aff;
            }

        }

        textarea {
            resize: none;
            width: 600px;
            height: 100px;
        }

    }

}
</style>