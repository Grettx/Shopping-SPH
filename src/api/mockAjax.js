// 对于axios进行二次封装
import axios from 'axios'
// 引入进度条
import nprogress from 'nprogress'
// start: 进度条开始  done: 进度条结束
// 引入进度条的样式
import 'nprogress/nprogress.css'

// 1. 利用axios对象的方法create, 去创建一个axios实例
// 2. request 就是axios, 只不过稍微配置一下
let requests = axios.create({
  //基础路径
  baseURL: "/mock",
  //请求不能超过5S
  timeout: 5000,
});
// 请求拦截器: 在发送请求之前,请求拦截器可以检测到, 可以在请求发出去之前做一些事
requests.interceptors.request.use((config)=>{
  // config: 配置对象, 对象里面有一个属性很重, header请求头
  // 进度条开始
  nprogress.start()
  return config
})

// 响应拦截器
requests.interceptors.response.use(res =>{
  // 成功的回调函数: 服务器相应数据回来以后, 响应拦截器可以检测到, 可以做一些事情
  // 进度条结束
  nprogress.done()
  return res.data
}, error =>{
  // 响应失败的回调函数
  return Promise.reject(new Error('faile'))
})

// 对外暴露
export default requests