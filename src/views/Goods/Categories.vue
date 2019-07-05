<template>
  <div>
    <!-- /面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- // 添加商品按钮 -->
    <el-button type="success" plain @click="cateGoriesDialogShow">添加分类</el-button>

    <!-- 表格 -->
    <el-table :data="cateGoriesList" stripe style="width: 100%">
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon el-icon-folder-opened"
        prop="cat_name"
        label="分类名称"
        width="220"
        level-key="cat_level"
        :indent-size="20"
        tree-key="cat_id"
        parent-key="cat_pid"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="180">
        <template v-slot="{row}">{{row.cat_deleted ? '否' : '是'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="delCateGories(row.cat_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="cateGoriesPage"
    ></el-pagination>
    <!-- 添加分类模态框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="cateGoriesDialogForm"
      @close="$refs.addCateForm.resetFields()"
    >
      <el-form :model="cateGoriesForm" label-width="100px" ref="addCateForm">
        <el-form-item label="分类名称">
          <el-input v-model="cateGoriesForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="cateGoriesForm.parentArr"
            :options="cateDataOptions"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cateGoriesDialogForm = false">取 消</el-button>
        <el-button type="primary" @click="addCateGories">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 树状展开
var ElTreeGrid = require("element-tree-grid");
// Vue.component(ElTreeGrid.name,ElTreeGrid);
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      cateGoriesList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      cateGoriesForm: {
        cat_name: "",
        parentArr: []
      },
      cateGoriesDialogForm: false,
      cateDataOptions: [],
      defaultProps: {
        checkStrictly: true,
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  created() {
    this.getCateGoriesList();
  },
  methods: {
    // 封装重新获取列表数据的函数
    async getCateGoriesList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.cateGoriesList = res.data.data.result;
        this.total = res.data.data.total;
      }
    },
    // 分页
    cateGoriesPage(page) {
      this.pagenum = page;
      this.getCateGoriesList();
    },
    // 点击添加分类显示模态框
    async cateGoriesDialogShow() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      console.log(res);
      this.cateDataOptions = res.data.data;
      this.cateGoriesDialogForm = true;
    },
    // 点击确定按钮提交表单
    async addCateGories() {
      this.$refs.addCateForm.resetFields();

      // 父id 也就是第一个  length
      let cat_pid = this.cateGoriesForm.parentArr.length;
      let cat_name = this.cateGoriesForm.cat_name;
      let cat_level = this.cateGoriesForm.parentArr.pop() || 0;
      // console.log(cat_pid, cat_name, cat_level);
      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_pid,
          cat_name,
          cat_level
        }
      });
      if (res.data.meta.status === 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        //模态框关闭
        this.cateGoriesDialogForm = false;
        //清空表单
        // 重新渲染数据
        this.getCateGoriesList();
      }
      // console.log(res);
    },
    // 删除分类
    async delCateGories(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        let res = await this.$http({
          url: `categories/${id}`,
          method: "delete"
        });
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg
          });
          this.getCateGoriesList();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      console.log(id);
    }
  }
};
</script>
