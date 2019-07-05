<template>
  <div>
    <!-- /面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- // 添加商品按钮 -->
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodsList" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>

      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="goodsPage"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    async getGoods() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      }
    },
    goodsPage(page) {
      console.log(page);
      this.pagenum = page;
      this.getGoods();
    }
  }
};
</script>