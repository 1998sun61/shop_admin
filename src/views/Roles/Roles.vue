<template>
  <div>
    <!-- /面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-table ref="rolesTable" :data="rolesList" stripe style="width: 100%">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template v-slot="{row}">
          <!-- 一级菜单 -->
          <el-row type="flex" class="item1" v-for="item1 in row.children" :key="item1.id">
            <el-col :span="6">
              <el-tag closable @close="delRoles(row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <!-- 二级菜单 -->
              <el-row type="flex" class="item2" v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag closable type="success" @close="delRoles(row,item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级菜单 -->
                <el-col>
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    type="warning"
                    class="item3"
                    @close="delRoles(row,item3.id)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 序列号 -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="delRolesUser(row.id)"
          ></el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-check"
            size="mini"
            @click="rolesUserList(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配模态框 -->
    <el-dialog title="角色授权" :visible.sync="rolesShow">
      <!-- 树状控件 -->
      <el-tree
        :data="rolesUserData"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckKey"
        :default-expand-all="true"
        :props="defaultProps"
        ref="rolesTree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesShow = false">取 消</el-button>
        <el-button type="primary" @click="rolesListClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      rolesShow: false,
      rolesUserData: [],
      rolesKeyId: -1,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      // 默认选中
      defaultCheckKey: []
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 封装的刷新
    async getRoles(callback) {
      let res = await this.$http({
        url: "roles"
      });
      // console.log(res);
      this.rolesList = res.data.data;
      callback && callback();
    },
    // 点击显示模态框
    async rolesUserList(row) {
      this.rolesKeyId = row.id;
      // console.log(id);
      let res = await this.$http({
        url: "rights/tree"
      });
      // console.log(res);
      this.rolesUserData = res.data.data;
      this.rolesShow = true;
      // 获取一二三级id合并成数组
      // let rolesId1 = [];
      // let rolesId2 = [];
      let rolesId3 = [];
      row.children.forEach(item1 => {
        // rolesId1.push(item1.id);
        item1.children.forEach(item2 => {
          // rolesId2.push(item2.id);
          item2.children.forEach(item3 => {
            rolesId3.push(item3.id);
          });
        });
      });
      // 默认选中的按钮
      this.defaultCheckKey = [...rolesId3];
    },
    // 模态框确定按钮
    async rolesListClick() {
      // 获取tree组件中所有被选中的id
      let ids = [
        ...this.$refs.rolesTree.getCheckedKeys(),
        ...this.$refs.rolesTree.getHalfCheckedKeys()
      ].join();
      // console.log(ids);
      let res = await this.$http({
        url: `roles/${this.rolesKeyId}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      });
      // console.log(res);
      // 提示更新成功
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });
      // 从新渲染 隐藏模态框
      this.getRoles();
      this.rolesShow = false;
    },
    // 删除标签事件
    async delRoles(row, id) {
      // console.log(row, id);
      // 获取一二三级id合并成数组
      // let rolesId1 = [];
      // let rolesId2 = [];
      // let rolesId3 = [];
      // row.children.forEach(item1 => {
      //   rolesId1.push(item1.id);
      //   item1.children.forEach(item2 => {
      //     rolesId2.push(item2.id);
      //     item2.children.forEach(item3 => {
      //       rolesId3.push(item3.id);
      //     });
      //   });
      // });
      // let results = [...rolesId1, ...rolesId2, ...rolesId3];
      // let ids = results.filter(item => item !== id).join();
      // console.log(ids);
      let res = await this.$http({
        url: `roles/${row.id}/rights/${id}`,
        method: "delete"
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.getRoles(() => {
          this.$nextTick(() => {
            this.$refs.rolesTable.toggleRowExpansion(
              this.rolesList.find(item => item.id == row.id),
              true
            );
          });
        });
      }
    },
    // 删除按钮的
    async delRolesUser(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await this.$http({
          url: `roles/${id}`,
          method: "delete"
        });
        console.log(res);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getRoles(this);
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    }
  }
};
</script>

<style scoped>
.item1 {
  border-bottom: 1px dashed orange;
  margin: 15px 0;
}
.item2 {
  margin-bottom: 10px;
}
.item3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
