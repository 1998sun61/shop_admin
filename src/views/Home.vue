<template>
  <el-container>
    <!-- /头部 -->
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <!-- logo -->
        <el-col :span="5">
          <img src="../assets/logo.png" alt />
        </el-col>
        <!-- 标题 -->
        <el-col>
          <h1>品优购后台管理系统</h1>
        </el-col>
        <!-- 右侧退出 -->
        <el-col :span="6" class="rightOut">
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
          <el-submenu v-for="item1 in menusList" :key="item1.id" :index="item1.order + ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="'/' + item2.path"
                v-for="item2 in item1.children"
                :key="item2.id"
              >
                <i class="el-icon-menu"></i>
                <span slot="title">{{item2.authName}}</span>
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
  data() {
    return {
      menusList: []
    };
  },
  async created() {
    let res = await this.$http({
      url: "menus"
    });
    if (res.data.meta.status === 200) {
      this.menusList = res.data.data;
    }
    // console.log(res);
  },
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

<style lang="less" scoped>
.el-header {
  background-color: #b3c1cd;
  padding: 0;
  .el-col {
    min-width: 300px;
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
.rightOut {
  text-align: right;
  padding-right: 20px;
}
</style>
