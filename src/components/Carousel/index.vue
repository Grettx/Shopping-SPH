<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="carousel in list" :key="carousel.id">
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "Carousel",
  watch: {
    list: {
      immediate: true,
      handler() {
        // 只能监听到数据已经有了, 但是v-for动态渲染结构我们还是不能确定, 因此还是需要用nextTick
        this.$nextTick(() => {
          var mySwiper = new Swiper(this.$refs.cur, {
            loop: true, // 循环模式选项
            autoplay: true,
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              // 点击小球的时候也切换图片
              clickable: true,
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
    },
  },
  props: ["list"],
};
</script>

<style>
</style>