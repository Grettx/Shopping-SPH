import { reqCartList, reqDeleteCartById, reqUpdataCheckedById } from '@/api'
const state = {
  cartList: []
}
const actions = {
  // 获取购物车列表数据
  async getCartList({ commit }, value) {
    let result = await reqCartList()
    if (result.code == 200) {
      commit('GETCARTLIST', result.data)
    }
  },
  // 删除购物车某一个产品
  async deleteCartListBySkuId({ commit }, skuId) {
    let result = await reqDeleteCartById(skuId)
    if (result.code == 200) {
      return 'OK'
    } else {
      return Promise.reject(new Error('删除失败!'))
    }
  },
  // 需修改购物车某一产品的选中状态
  async updataCheckedById({ commit }, { skuId, isChecked }) {
    let result = await reqUpdataCheckedById(skuId, isChecked)
    if (result.code == 200) {
      return 'OK'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  // 删除全部勾选的产品
  deleteAllCheckedCart({ dispatch, getters }) {
    // 获取购物车中全部的产品
    let promiseAll = []
    getters.cartList.cartInfoList.forEach(item => {
      let result = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
      promiseAll.push(result)
    })
    // 所有的Promise都成功, 返回结果才成功, 如果其中有一个失败, 结果为失败
    return Promise.all(promiseAll)
  },
  // 修改全部产品的全选or不全选状态
  updateAllCartChecked({ dispatch, state }, isChecked) {
    // 定义一个空数组, 用于存储下面的promise
    let promiseAll = []
    state.cartList[0].cartInfoList.forEach((item => {
      let promise = dispatch('updataCheckedById', { skuId: item.skuId, isChecked })
      promiseAll.push(promise)
    }))
    return Promise.all(promiseAll)
  }
}
const mutations = {
  GETCARTLIST(state, cartList) {
    state.cartList = cartList
  }
}
const getters = {
  cartList(state) {
    return state.cartList[0] || {}
  },
}

export default {
  state,
  actions,
  mutations,
  getters
}