<template>
  <div>
    <Header />
    <router-view></router-view>
    <Footer v-show="$route.meta.show" />
  </div>
</template>

<script>
// 引入
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "App",
  components: { Header, Footer },
  mounted() {
    // 通过Vuex发请求, 获取数据, 存储于仓库中
    // 派发一个action||获取商品分类的三级列表的数据
    this.$store.dispatch("categoryList");
    // console.log(this.$store.state.home.categoryList)
  },
};
</script>

<style>
</style>
