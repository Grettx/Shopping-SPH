// 当前这个模块: API进行统一管理
// 引入二次封装的axios(带有请求, 响应的拦截器)
import requests from './request'
import mockRequests from './mockAjax'

// 三级菜单的请求地址  /api/product/getBaseCategoryList  GET  没有任何参数
// 发请求: axios发请求返回的结果时Promise对象
// 对外暴露一个函数, 只要外部调用这个函数, 就向服务器发送ajax请求, 获取咱们的三级菜单数据. 当前咱们这个函数只需要把服务器返回的结果返回即可
export const reqCategoryList = () => requests({url: '/product/getBaseCategoryList', method: 'get'})
// 切记: 当前函数执行需要把服务器返回结果返回

// 获取banner(Home首页轮播图接口)
export const reqGetBannerList = () => mockRequests.get('/banner')

// 获取floor数据
export const reqFloorList = () => mockRequests.get('/floor')

// 获取搜索模块数据 地址: /api/list  请求的方式: POST
// 参数
/* {
  "category3Id": "61",
  "categoryName": "手机",
  "keyword": "小米",
  "order": "1:desc",
  "pageNo": 1,
  "pageSize": 10,
  "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
  "trademark": "4:小米"
} */
// 当前这个函数需不需要接收外部传递参数
// 当前这个接口(获取搜索模块的数据), 给服务器传递一个默认参数, 至少是一个空对象
export const reqGetSearchInfo = (params) => requests({url: '/list',method: 'post', data: params})

// 获取产品详情信息的接口: URL: /api/item/{skuId}  请求方式: GET
export const reqGoodsInfo = (skuId) => requests({url: `/item/${skuId}`, method: 'GET'})

// 将产品添加到购物车中(或者更新某一个产品的个数)
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'POST'})

// 获取购物车列表数据接口
// URL: /api/cart/cartList  methods: get
export const reqCartList = () => requests({url: `/cart/cartList`, method: 'GET'})

// 删除购物车产品的接口
// URL: /api/cart/deleteCart/{skuId}  method: DELETE
export const reqDeleteCartById = (skuId) => requests({url: `/cart/deleteCart/${skuId}`, method: 'DELETE'})

// 修改商品的选中状态
// URL: /api/cart/checkCart/{skuId}/{isChecked}   method: get
export const reqUpdataCheckedById = (skuId, isChecked) => requests({url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'GET'})

// 获取验证码
// URL: /api/user/passport/sendCode/{phone}  method: GET
export const reqGetCode = (phone) => requests({url: `/user/passport/sendCode/${phone}`, method: 'GET'})

// 注册
//  URL: /api/user/passport/register  methods: POST    phone code password
export const reqUserRegister = (data) => requests({url: `/user/passport/register`, data, method: 'POST'})

// 登录
// URL: /api/user/passport/login  method: post  phone password
export const reqUserLogin = (data) => requests({url: `/user/passport/login`, data, method: 'POST'})

// 获取用户信息[需要带着用户的token向服务器要用户信息]
// URL: /api/user/passport/auth/getUserInfo   method: get
export const reqUserInfo = () => requests({url: `/user/passport/auth/getUserInfo`, method: 'GET'})

// 退出登录
// URL: /api/user/passport/logout    method: get
export const reqLogout = () => requests({url: `/user/passport/logout`, method: 'GET'})

// 获取用户地址信息
// URL: /api/user/userAddress/auth/findUserAddressList    method: get
export const reqAddressInfo = () => requests({url: `/user/userAddress/auth/findUserAddressList`, method: 'GET'})

// 获取商品清单
// URL: /api/order/auth/trade     method: get
export const reqOrderInfo = () => requests({url: `/order/auth/trade `, method: 'GET'})

// 提交订单的接口
// URL: /api/order/auth/submitOrder?tradeNo={tradeNo}   method: POST
export const reqSubmitOrder = (tradeNo, data) => requests({url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method: 'POST'})

// 获取支付信息
// URL: /api/payment/weixin/createNative/{orderId}   GET
export const reqPayInfo = (orderId) => requests({url: `/payment/weixin/createNative/${orderId}`, method: 'GET'})

// 获取支付订单状态
// URL: /api/payment/weixin/queryPayStatus/{orderId} get
export const reqPayStatus = (orderId) => requests({url:`/payment/weixin/queryPayStatus/${orderId}`, method: 'GET'})

// 获取个人中心的数据
export const reqMyOrderList = (page, limit) => requests({url:`/order/auth/${page}/${limit}`, method: 'GET'})