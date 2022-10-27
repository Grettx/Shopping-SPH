import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from '@/api/index';
import { setToken, getToken, removeToken } from '@/utils/token'

const state = {
  code: '',
  token: getToken(),
  userInfo: {},
}
// 登录与注册模块
const actions = {
  // 获取验证码
  async getCode({ commit }, phone) {
    // 获取验证码的这个接口, 把验证码返回, 但是正常情况下, 后台把验证码发动用户手机上
    let result = await reqGetCode(phone)
    if (result.code == 200) {
      commit('GETCODE', result.data)
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  // 用户注册
  async userRegister({ commit }, user) {
    let result = await reqUserRegister(user)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('注册失败!'))
    }
  },
  // 用户登录
  async userLogin({ commit }, data) {
    let result = await reqUserLogin(data)
    // 服务器下发token, 用户唯一标识
    // 将来经常通过带token找服务器要用户信息进行展示
    if (result.code == 200) {
      // 用户已经登录成功且获取到token
      commit("USERLOGIN", result.data.token)
      // 持久化存储token
      setToken(result.data.token)
      return 'OK'
    } else {
      return Promise.reject(new Error('登录失败!'))
    }
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    let result = await reqUserInfo()
    if (result.code == 200) {
      commit('GETUSERINFO', result.data)
      return "OK"
    }else{
      return Promise.reject(new Error('faile'))
    }
  },
  // 退出登录
  async userLogout({commit}){
    // 只是向服务器发起一次请求, 通知服务器清除token
    let result = await reqLogout()
    if(result.code == 200) {
      commit("CLEAR")
      return "OK"
    }else{
      return Promise.reject(new Error('退出失败!'))
    }
  }
}
const mutations = {
  GETCODE(state, code) {
    state.code = code
  },
  USERLOGIN(state, token) {
    state.token = token
  },
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo
  },
  // 清除本地数据
  CLEAR(state){
    state.token = ''
    state.userInfo = {}
    // 本地存储数据清空
    removeToken()
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}