<template>
  <el-container class="home-container">
    <el-header class="header">
      <Header></Header>
    </el-header>
    <el-container class="main">
      <el-aside width="auto">
        <Menu></Menu>
      </el-aside>
      <el-main>
        <div class="tags">
          <Tags></Tags>
        </div>
        <router-view class="content"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import Menu from "../components/Menu.vue";
import Header from "../components/Header.vue";
import Tags from "../components/Tags.vue";
</script>

<style scoped lang="less">
.home-container {
  margin: 0;
  padding: 0;

  .header {
    height: 10vh;
    border: 0;
  }

  .el-header {
    padding: 0;
  }

  .main {
    padding: 0;

    .el-main {
      padding: 0;
      height: 90vh;
      overflow: auto;

      .tags {
        height: 5vh;
        background-color: rgb(240, 240, 240);
      }
    }
  }
}
</style>
