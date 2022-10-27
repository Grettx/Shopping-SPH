import {reqGetSearchInfo} from '@/api'
// state: 仓库存储数据的地方
const state = {
  // 仓库初始状态
  searchList: {},
}
// action: 处理action
const actions = {
  // 获取search模块数据
  async getSearchList({commit}, params={}){
    // 当前这个reqGetSearchInfo这个函数在调用获取服务器数据的时候, 至少传递一个参数(空对象)
    // params形参: 是当用户派发action的时候, 第二个参数传递过来的,至少是一个空对象
    let reault = await reqGetSearchInfo(params)
    if(reault.code === 200){
      commit("GETSEARCHLIST", reault.data)
    }
  }
}
// mutations: 修改state的唯一手段
const mutations = {
  GETSEARCHLIST(state, searchList){
    state.searchList = searchList
  }
}
// getters: 理解为计算属性, 用于简化仓库数据,让组件获取仓库的数据更加方便
const getters = {
  // 当前形参state, 当前仓库中的state, 并非大仓库中的那个state
  goodsList(state){
    // state.searchList.goodsList如果服务器数据回来了, 没问题是一个数组
    // 假如网络不给力|没有网络state.searchList.goodsList应该返回的是undefined
    // 计算新的属性的属性值
    return state.searchList.goodsList
  },
  trademarkList(state){
    return state.searchList.trademarkList
  },
  attrsList(state){
    return state.searchList.attrsList
  }
}

export default{
  state,
  actions,
  mutations,
  getters
}