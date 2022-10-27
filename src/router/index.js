// 配置路由
import Vue from 'vue';
import VueRouter from 'vue-router';
// 使用插件
Vue.use(VueRouter)
// 引入store
import store from '@/store';
// 引入路由信息模块
import routes from './routes';

// 先把VueRouter原型对象的push,先保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

// 重写push|replace
// 第一个参数: 告诉原来push方法, 你往哪里跳转(传递哪些参数)
// 第二个参数: 成功的回调
// 第三个参数: 失败的回调
// call || apply 区别:
// 相同点: 都可以调用函数一次, 都可以篡改函数的上下文一次
// 不同点: call与apply传递参数: call传递参数用逗号隔开, apply方法执行传递数组
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => { }, () => { })
  }
}

// 配置路由
let router = new VueRouter({
  // 配置路由
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { y: 0 }
  }
})

// 全局路由守卫: 前置守卫(在路由跳转之前进行判断)
router.beforeEach(async (to, from, next) => {
  // to: 可以获取到你要跳转到哪个路由信息
  // from: 可以获取到你从那个路由而来的信息
  // next: 放行函数       next() 放行    next(path)放行到指定路由     next(false)
  // 用户登录了, 才会有token, 未登录一定不会有token
  let token = store.state.user.token
  // 用户信息
  let name = store.state.user.userInfo.name
  // 用户已经登陆了
  if (token) {
    // 用户还想去login 不允许
    if (to.path == "/login" || to.path == '/register') {
      next('/')
    } else {
      // 登录了, 取得不是login
      // 如果用户名已有
      if (name) {
        next()
      } else {
        // 没有用户信息, 派发action让仓库存储用户信息后再跳转
        try {
          // 获取用户信息成功
          await store.dispatch('getUserInfo')
          next()
        } catch (e) {
          // token失效了
          // 清除token
          await store.dispatch('userLogout')
          next('/login')
        }
      }
    }
  } else {
    // 未登录: 不能去交易相关， 不能去支付相关[pay|paysuccess], 不能去个人中心
    // 未登录去上面这些路由------登录
    let toPath = to.path
    if (toPath == '/center/myorder' || toPath == '/pay' || toPath == '/paysuccess' || toPath == '/center') {
      // 把未登录的时候想去而没有去成的信息, 存储与地址栏中[路由当中]
      next('/login?redirect='+ toPath)
    }else{
      // 取得不是上面这些路由 (home, search,shopCart)  ----放行
      next()
    }
  }
})

export default router;