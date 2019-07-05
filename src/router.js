import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import User from "./views/User/User.vue";
import Rights from "./views/Rights/Rights.vue";
import Roles from "./views/Roles/Roles.vue";
import Goods from "./views/Goods/Goods.vue";
import Categories from "./views/Goods/Categories.vue";
import GoodsAdd from "./views/Goods/GoodsAdd.vue";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/users",
          component: User
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/roles",
          component: Roles
        },
        {
          path: "/goods",
          component: Goods
        },
        {
          path: "/categories",
          component: Categories
        },
        {
          path: "/goods-add",
          component: GoodsAdd
        }
      ]
    },
    {
      path: "/",
      redirect: "/home"
    }
  ]
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  // next()
  if (to.path === "/login") {
    next();
    return;
  }

  if (localStorage.getItem("token")) {
    next();
  } else {
    router.push("/login");
  }
});

export default router;
