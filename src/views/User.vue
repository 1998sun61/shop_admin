<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //搜索框 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="searchUser"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userList" stripe style="width=100%">
      <el-table-column prop="username" label="姓名" width="120px"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180px"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180px"></el-table-column>
      <el-table-column label="用户状态" width="150px">
        <template v-slot="{row}">
          <!-- {{scope.row}} -->
          <el-switch
            v-model="row.mg_state"
            @change="toggleUser(row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="editUser(row)"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="delUser(row.id)"></el-button>
          <el-button type="success" plain icon="el-icon-check" size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="onPageChange"
    ></el-pagination>

    <!-- 添加模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormUserShow"
      @close="$refs.addFormUser.resetFields()"
    >
      <el-form :model="formUser" label-width="100px" ref="addFormUser" :rules="rulesForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formUser.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formUser.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formUser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormUserShow = false">取 消</el-button>
        <el-button type="primary" @click="addUserList">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户模态框 -->
    <el-dialog title="修改用户信息" :visible.sync="editFormUserShow">
      <el-form :model="editUserForm" label-width="100px" ref="editFormUser" :rules="editForm">
        <el-form-item label="用户名">
          <el-tag type="info" v-text="editUserForm.username"></el-tag>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormUserShow = false">取 消</el-button>
        <el-button type="primary" @click="editUserList">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createHash } from "crypto";
// import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      searchUser: "",
      total: 0,
      currentpage: 1,
      pagesize: 3,
      //添加用户的表单
      formUser: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      dialogFormUserShow: false,
      // 表单校验
      rulesForm: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式错误",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式错误",
            trigger: "change"
          }
        ]
      },
      // 修改用户数据
      editUserForm: {
        id: 0,
        email: "",
        mobile: "",
        username: ""
      },
      editFormUserShow: false,
      // 修改用户表单效验
      editForm: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式错误",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式错误",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 封装刷新数据
    getUserList() {
      this.$http({
        url: "users",
        params: {
          pagenum: this.currentpage,
          pagesize: this.pagesize,
          query: this.searchUser
        }
      }).then(({ data: { data, meta } }) => {
        // console.log(data);
        if (meta.status === 200) {
          // console.log(data);
          this.userList = data.users;
          this.total = data.total;
        }
      });
    },
    // 切换状态的按钮
    async toggleUser(row) {
      let {
        data: { data, meta }
      } = await this.$http({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: "put"
      });
      if (meta.status === 200) {
        // 提示框
        this.$message({
          message: meta.msg,
          type: "success",
          duration: 1000
        });
      } else {
        this.$message({
          message: meta.msg,
          type: "error",
          duration: 1000
        });
      }
      // console.log(data, meta);
    },
    // 搜索按钮
    search() {
      this.getUserList();
    },
    // 分页器
    onPageChange(page) {
      // console.log(page);
      this.currentpage = page;
      this.getUserList();
    },
    // 添加
    addUser() {
      this.dialogFormUserShow = true;
    },
    // 添加模态框确定按钮
    async addUserList() {
      try {
        // 提交表单校验
        await this.$refs.addFormUser.validate();
        // console.log(校验成功);
        let {
          data: { data, meta }
        } = await this.$http({
          url: "users",
          method: "post",
          data: this.formUser
        });
        // console.log(data, mate);

        if (meta.status === 201) {
          this.$message({
            message: meta.msg,
            type: "success",
            duration: 1000
          });
          this.getUserList();
          this.dialogFormUserShow = false;
        } else {
          this.$message({
            message: meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (err) {
        // console.log(err);
      }
    },
    // 删除用户
    async delUser(id) {
      try {
        console.log(id);
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        let {
          data: { data, meta }
        } = await this.$http({
          url: `users/${id}`,
          method: "delete"
        });
        // console.log(data, meta);
        // console.log(res);
        if (meta.status === 200) {
          this.$message({
            type: "success",
            message: meta.msg,
            duration: 1000
          });
          this.currentpage = 1;
          this.getUserList();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    // 修改用户
    async editUser(row) {
      let {
        data: { data, meta }
      } = await this.$http({
        url: `users/${row.id}`
      });
      if (meta.status === 200) {
        this.editUserForm = data;
      }
      this.editFormUserShow = true;
    },
    async editUserList() {
      try {
        await this.$refs.editFormUser.validate();
        let {
          data: { data, meta }
        } = await this.$http({
          url: `users/${this.editUserForm.id}`,
          method: "put",
          data: {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        });
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success",
            duration: 1000
          });

          this.getUserList();
          this.editFormUserShow = false;
        }

        // console.log(res.data);
      } catch (err) {
        this.$message({
          message: meta.msg,
          type: "error",
          duration: 1000
        });
      }
    }
  }
};
</script>
<style lang="less">
.el-table td,
.el-table th {
  text-align: center;
}
.el-breadcrumb {
  background-color: #d4dae0;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  padding-left: 20px;
  margin-bottom: 10px;
}
</style>
