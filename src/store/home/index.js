import { reqCategoryList, reqGetBannerList, reqFloorList } from '@/api'

export default {
  // action|用户处理派发action的地方, 可以书写异步语句, 自己逻辑的地方
  actions: {
    async categoryList({ commit }) {
      // 通过API里面的接口函数调用, 向服务器发请求, 获取服务器的数据
      const result = await reqCategoryList()
      // console.log(result)
      if (result.code === 200) {
        commit("CATEGORYLIST", result.data)
      }
    },
    // 获取首页轮播图的数据
    async getBannerList({commit}){
      let result = await reqGetBannerList()
      if(result.code === 200) {
        commit('GETBANNERLIST', result.data)
      }
    }, 
    // 获取floor数据
    async getFloorList({commit}){
      let result = await reqFloorList()
      if(result.code === 200) {
        // 提交mutations
        commit('GETFLOORLIST', result.data)
      }
    }
  },
  // mutations: 修改state的唯一手段
  mutations: {
    CATEGORYLIST(state, categoryList) {
      state.categoryList = categoryList.slice(0, 15)
    },
    GETBANNERLIST(state,bannerList){
      state.bannerList = bannerList
    },
    GETFLOORLIST(state, floorList){
      state.floorList = floorList
    }
  },
  // getters: 理解为计算属性, 用于简化仓库数据,让组件获取仓库的数据更加方便
  getters: {},
  // state: 仓库存储数据的地方
  state: {
    // state中数据默认初始值别瞎写, 服务器返回对象, 服务器返回数组. [根据接口返回值初始化的]
    categoryList: [],
    bannerList: [],
    floorList: [],
  },
}