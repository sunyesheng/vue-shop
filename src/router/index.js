import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/user.vue'
import categories from '../components/goods/categories.vue'
import goods from '../components/goods/goods.vue'
import params from '../components/goods/params.vue'
import orders from '../components/order/orders.vue'
import reports from '../components/reports/reports.vue'
import right from '../components/role/right.vue'
import roles from '../components/role/roles.vue'
import add from '../components/goods/add.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/categories',
        component: categories
      },
      {
        path: '/goods',
        component: goods
      },
      {
        path: '/params',
        component: params
      },
      {
        path: '/orders',
        component: orders
      },
      {
        path: '/reports',
        component: reports
      },
      {
        path: '/rights',
        component: right
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/goods/add',
        component: add
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径 from代表从那个路径跳转而来 next 放心
  // next()  next('/sadsd')两种方法
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) {
    return next('/login')
  }
  next()
})

export default router
