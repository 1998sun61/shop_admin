<template>
  <el-container>
    <!-- /头部 -->
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <!-- logo -->
        <el-col :span="6">
          <img src="../assets/logo.png" alt />
        </el-col>
        <!-- 标题 -->
        <el-col>
          <h1>品优购后台管理系统</h1>
        </el-col>
        <!-- 右侧退出 -->
        <el-col :span="6">
          <span>
            欢迎伟大的管理员
            <a href="#" @click.prevent="loginOut">退出</a>
          </span>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 导航菜单-->
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/user">
                <i class="el-icon-menu"></i>
                <span slot="title">用户管理</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">商品列表</span>
              </el-menu-item>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">分类参数</span>
              </el-menu-item>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">商品分类</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">订单列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">数据报表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    async loginOut() {
      await this.$confirm("此操作将退出此页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      this.$message({
        type: "success",
        message: "退出成功"
      });
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less">
.el-header {
  background-color: #b3c1cd;
  padding: 0;
  .el-col {
    img {
      width: 200px;
      height: 56px;
    }
    h1 {
      text-align: center;
      margin: 0;
      padding: 0;
      font-size: 28px;
      color: #fff;
    }
    span {
      font-weight: 700;
      a {
        color: orange;
        text-decoration: none;
      }
    }
  }
}
.el-container {
  height: 100%;
}
.el-aside {
  height: 100%;
}
.el-menu-vertical-demo.el-menu {
  height: 100%;
}
.el-submenu .el-menu-item {
  min-width: 100%;
}
</style>
