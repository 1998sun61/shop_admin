<template>
  <el-table :data="userList" stripe style="width: 100%">
    <el-table-column prop="username" label="姓名" width="120px"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180px"></el-table-column>
    <el-table-column prop="mobile" label="电话" width="180px"></el-table-column>
    <el-table-column label="用户状态" width="150px">
      <template v-slot="{row}">
        <!-- {{scope.row}} -->
        <el-switch v-model="row.type" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
      <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
      <el-button type="success" plain icon="el-icon-check" size="mini">分配角色</el-button>
    </el-table-column>
  </el-table>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      headers: { Authorization: localStorage.getItem("token") },
      params: {
        pagenum: 1,
        pagesize: 5
      }
    }).then(({ data: { data, meta } }) => {
      console.log(data);
      if (meta.status === 200) {
        console.log(data.users);
        this.userList = data.users;
      }
    });
  }
};
</script>
<style lang="less">
.el-table td,
.el-table th {
  text-align: center;
}
</style>
