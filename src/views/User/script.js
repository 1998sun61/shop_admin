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
      },
      // 分配角色模态框显示隐藏
      allocationShow: false,
      allocationForm: {
        username: "",
        rid: "",
        id: ""
      },
      allocationUser: []
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
    },
    // 分配角色模态框
    async allocationUserList(id) {
      let res = await this.$http({
        url: `users/${id}`
      });
      this.allocationForm = res.data.data;
      // console.log(res);

      let resultUser = await this.$http({
        url: "roles"
      });
      // console.log(resultUser);
      this.allocationUser = resultUser.data.data;
      // console.log(res);
      this.allocationShow = true;
    },
    // 分配角色提交
    async allocationList() {
      let res = await this.$http({
        url: `users/${this.allocationForm.id}/role`,
        method: "put",
        data: {
          rid: this.allocationForm.rid
        }
      });
      // console.log(res.data.meta.status);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: 1000
        });
        this.getUserList();
      }
      this.allocationShow = false;
    }
  }
};
