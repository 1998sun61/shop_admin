<template>
  <div>
    <!-- /面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 步骤条 -->
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>

    <!-- tabs标签页 -->
    <el-tabs tab-position="left" v-model="activeName" @tab-click="changeTabs">
      <!-- 表单页 -->
      <el-tab-pane label="基本信息" name="one">
        <el-form ref="form" label-width="80px" :model="goodsForm">
          <el-form-item label="商品名称">
            <el-input v-model="goodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="goodsForm.catArr" :props="defaultProps" :options="addOptions"></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="goodsForm.is_promote" label="1">是</el-radio>
            <el-radio v-model="goodsForm.is_promote" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1,'two')">下一步</el-button>
      </el-tab-pane>
      <!-- 上传图片页 -->
      <el-tab-pane label="商品图片" name="two">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="onUploadChange"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2,'three')">下一步</el-button>
      </el-tab-pane>
      <!-- 富文本页 -->
      <el-tab-pane label="商品内容" name="three">
        <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      activeStep: 0,
      activeName: "one",
      goodsForm: {
        goods_name: "",
        catArr: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        is_promote: 0,
        pics: [],
        goods_introduce: ""
      },
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      },
      addOptions: []
    };
  },
  methods: {
    changeTabs(tab) {
      // console.log(tab)
      this.activeStep = +tab.index;
    },
    next(index, activeName) {
      // 同步步骤条
      this.activeStep = index;
      // console.log(activeName);
      // 同步侧边内容栏
      this.activeName = activeName;
    },
    // 图片上传成功的钩子函数
    onUploadChange(res) {
      // console.log(res);
      this.goodsForm.pics.push({
        pic: res.data.tmp_path
      });
    },
    // 确定按钮提交
    async addGoods() {
      let newForm = {
        goods_name: this.goodsForm.goods_name,
        goods_cat: this.goodsForm.catArr.join(),
        goods_price: this.goodsForm.goods_price,
        goods_introduce: this.goodsForm.goods_introduce,
        goods_number: this.goodsForm.goods_number,
        goods_weight: this.goodsForm.goods_weight,
        is_promote: this.goodsForm.is_promote,
        pics: this.goodsForm.pics
      };
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: newForm
      });
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.$router.push("/goods");
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 1000
        });
      }
    }
  },
  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    });
    if (res.data.meta.status === 200) {
      this.addOptions = res.data.data;
    }
  }
};
</script>
<style scoped>
.el-tabs.el-tabs--left {
  margin-top: 20px;
}
</style>
