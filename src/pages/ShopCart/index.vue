<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @change="updataChecked(cart, $event)"
              ref="listChecked"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('mins', -1, cart)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('plus', 1, cart)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCartById(cart)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          :class="{ pionter: !total.totalCount }"
          type="checkbox"
          :checked="isAllChecked"
          @change="updateAllCartChecked($event)"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a
          href="#none"
          :class="{ pionter: !total.totalCount }"
          @click="deleteAllCheckedCart"
          >删除选中的商品</a
        >
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下架商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">
          共 <span>{{ total.totalCount }}</span
          >件商品
        </div>
        <div class="chosed">
          已选择 <span>{{ total.count }}</span
          >件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） : </em>
          <i class="summoney">{{ total.sum }}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" @click="$router.push('/trade')">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { throttle } from "lodash";
import { mapGetters } from "vuex";
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  methods: {
    // 获取个人购物车数据
    getData() {
      this.$store.dispatch("getCartList");
    },
    // 修改某一个产品的个数
    handler: throttle(async function (type, disNum, cart) {
      // type: 为了区分这三个元素
      // disNum新参: +变化量(1)  -变化量(-1)  input最终个数(并不是变化量)
      // cart: 哪一个产品(身上有id)
      // 向服务器发送请求, 修改数量
      switch (type) {
        // 加号
        case "plus":
          disNum = 1;
          break;
        case "mins":
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "change":
          // 用户输入进来的最终量, 非法
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            disNum = parseInt(disNum) - cart.skuNum;
          }
          break;
        default:
          console.log("未知符号");
          break;
      }
      // 派发action
      try {
        // 代表的是修改数据成功
        await this.$store.dispatch("addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: disNum,
        });
        // 再一次获取服务器最新的数据进行展示
        this.getData();
      } catch (error) {}
    }, 1000),
    // 删除某一个产品的操作
    async deleteCartById(cart) {
      try {
        // 如果删除成功再次发送请求获取新的数据进行展示
        await this.$store.dispatch("deleteCartListBySkuId", cart.skuId);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 修改某一个产品的选中状态
    async updataChecked(cart, event) {
      // 带给服务器的参数isChecked, 不是布尔值, 应该是0|1
      try {
        // 如果修改数据成功, 再次获取服务器数据(购物车)
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("updataCheckedById", {
          skuId: cart.skuId,
          isChecked,
        });
        this.getData();
      } catch (e) {
        alert(e.message);
      }
    },
    // 全选or全不选
    async updateAllCartChecked(event) {
      // 派发action
      this.$refs.listChecked.forEach((item) => {
        item.checked = event.target.checked;
      });
      // 全选按钮的状态
      try {
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("updateAllCartChecked", { isChecked });
      } catch (e) {
        alert(e.message);
      }
    },
    // 删除所有选中的产品0
    // 这个回调函数没有办法收集到一些有用的数据
    async deleteAllCheckedCart() {
      // 派发一个action
      try {
        await this.$store.dispatch("deleteAllCheckedCart");
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  },
  computed: {
    ...mapGetters(["cartList"]),
    // 购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    // 计算购买产品的总价
    total() {
      let sum = 0,
        count = 0,
        totalCount = 0;
      this.cartInfoList.forEach((item) => {
        // 计算出所有商品数
        totalCount += item.skuNum;
        // 计算选中的商品数和总价
        if (item.isChecked == 1) {
          sum += item.skuNum * item.skuPrice;
          count += item.skuNum;
        }
      });
      return { sum, count, totalCount };
    },
    // 判断底部复选框是否勾选[全部产品都选中, 才勾选]
    isAllChecked() {
      if (this.cartInfoList.length) {
        return this.cartInfoList.every((item) => item.isChecked == 1);
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 32px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
          a {
            color: #666 !important;
            text-decoration: none;
            &:hover {
              background-color: rgb(207, 204, 204);
            }
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
        &.pionter {
          pointer-events: none;
        }
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
        &.pionter {
          pointer-events: none;
        }
      }
    }

    .money-box {
      float: right;

      .chosed:first-child {
        padding: 0 0;
      }

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
          text-decoration: none;
        }
      }
    }
  }
}
</style>