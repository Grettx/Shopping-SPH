// 引入路由组件 懒加载
// 路由配置信息
export default [
  {
    path: '/center',
    component: () => import('@/pages/Center'),
    meta: {isShow: true},
    children: [
      {
        path: 'myorder',
        component: () => import('@/pages/Center/myOrder'),
      },
      {
        path: 'grouporder',
        component: () => import('@/pages/Center/groupOrder'),
      },
      {
        path: '/center',
        redirect: '/center/myorder',
      }
    ]
  },
  {
    path: '/paysuccess',
    component: () => import('@/pages/PaySuccess'),
    meta: {isShow: true},
  },
  {
    path: '/pay',
    component: () => import('@/pages/Pay'),
    meta: {isShow: true},
    beforeEnter: (to, from, next) => {
      if(from.path == '/trade'){
        next()
      }else{
        next(false)
      }
    }
  },
  {
    path: '/trade',
    component: () => import('@/pages/Trade'),
    meta: {isShow: true},
    // 路由独享守卫
    beforeEnter: (to, from, next) =>{
      if(from.path == '/shopcart'){
        next()
      }else{
        next(false)
      }
    }
  },
  {
    path: '/shopcart',
    component: () => import('@/pages/ShopCart'),
    meta: {isShow: true},
  },
  {
    path: '/addCartSuccess',
    name: 'addcartsuccess',
    component: () => import('@/pages/AddCartSuccess'),
    meta: {isShow: true},
  },
  {
    path: "/detail/:skuid",
    component: () => import('@/pages/Detail'),
    meta: { show: true }
  },
  {
    path: "/home",
    component: () => import('@/pages/Home'),
    meta: { show: true }
  },
  {
    name: 'search',
    path: "/search/:keyword?",
    component: () => import('@/pages/Search'),
    meta: { show: true },
    // 路由组件能不能传递props参数
    // 布尔值写法: params
    // props: true,
    // 对象写法: 额外的给路由舰传递一些props
    // props: {a: 1, b: 2}
    // 函数写法: 可以params参数, query参数, 通过props传递得路由组件
    props: ($route) => ({ keyword: $route.params.keyword, k: $route.query.k })

  },
  {
    path: "/login",
    component: () => import('@/pages/Login'),
    meta: { show: false }
  },
  {
    path: "/register",
    component: () => import('@/pages/Register'),
    meta: { show: false }
  },
  // 重定向, 在项目跑起来的时候, 访问/, 立马让他定向到首页
  {
    path: '*',
    redirect: '/home',
  }
]