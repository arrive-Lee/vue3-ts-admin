<template>
    <div class="auth-container">
        <el-card>
            <template #header>
                <div>
                    <span>用户权限列表</span>
                </div>
            </template>
            <el-tree ref="tree" :data="aMenu" show-checkbox node-key="name" highlight-current
                :default-checked-keys="checkedKey" />
            <el-button type="primary" @click="save">保存权限</el-button>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { getMenu, updateAuth } from "../util/api"
import { Menu } from "../model/home";
import { message } from "../util/util";
import { ElTree } from 'element-plus'
import { useHomeStore } from "../store/home"


//用户菜单
const uMenu = reactive<Menu[]>([]);
//管理员菜单
const aMenu = reactive<Menu[]>([]);
const tree = ref<InstanceType<typeof ElTree>>()
//默认选择的key    
const checkedKey = reactive<string[]>(["message", "index", "chart"])
getMenu().then((response: any) => {
    if (response) {
        const { data: { userMenu, adminMenu } } = response
        userMenu.forEach((menu: any) => {
            uMenu.push(menu as Menu)
            // 获取默认选择的Key
            checkedKey.push((menu as Menu).name as string)
        });
        adminMenu.forEach((menu: any) => {
            aMenu.push(menu as Menu)
        });
    }
})

//保存权限
const save = () => {
    const home = useHomeStore();
    if (home.userInfo.auth == "普通用户") {
        message("error", "抱歉，您无权修改!")
    } else {
        const check = tree.value?.getCheckedNodes();
        const menu: Menu[] = [];
        check?.forEach(item => {
            const { path, name, component, meta, icon, label, children } = item
            menu.push({
                path,
                name,
                component,
                icon,
                label,
                meta,
                children
            })
        })
        updateAuth(menu).then(response => {
            if (response) {
                const { data: { msg } } = response
                message("success", msg)
            }
        })
    }

}

</script>

<style lang="less" scoped>
.auth-container {
    background-color: rgb(240, 240, 240);
    padding: 10px;
    height: 80vh;

    .el-card {
        padding: 10px;
        height: 560px;

        .el-button {
            margin: 20px 0 0 20px;
        }
    }
}
</style>