<template>
  <view class="container">
    <!-- 商品轮播图 -->
    <view class="carousel">
      <u-swiper
        :list="productDetail.edges.goods_spu_imgs"
        name="img_path"
        mode="number"
        indicator-pos="bottomRight"
        height="722"
      ></u-swiper>
      <!-- 返回按钮 -->
      <view class="back" @click="navBack"
        ><text class="yticon icon-zuo"></text
      ></view>
    </view>

    <!-- 商品描述 -->
    <view class="introduce-section">
      <text class="title">{{ productDetail.spu_name }}</text>
      <view class="price-box">
        <text class="price-tip">￥</text>
        <text class="price">{{
          specsTextShow ? activeSku.price/100 : productDetail.show_price
        }}</text>
      </view>
      <view class="bot-row">
        <text>销量：{{specsTextShow ? (activeSku.sales_num || 0) : (productDetail.sales_num || 0 )}}</text>
        <text>库存：{{ specsTextShow ? (activeSku.stock_num || 0) : (productDetail.stock_num || 0 ) }}</text>
        <text>浏览量：768</text>
      </view>
    </view>

    <!-- 分享 -->
    <view class="share-section" @click="toggleShare">
      <view class="share-icon">
        <text class="yticon icon-xingxing"></text>
        返
      </view>
      <text class="tit">该商品分享可领40减10红包</text>
      <text class="yticon icon-bangzhu1"></text>
      <view class="share-btn">
        立即分享
        <text class="yticon icon-you"></text>
      </view>
    </view>

    <!-- 规格 -->
    <view class="c-list">
      <!-- 购买类型 -->
      <view
        v-if="productDetail.is_custom_sku"
        class="c-row b-b"
        @click="toggleSpec"
      >
        <text class="tit">购买类型</text>
        <view class="con">
          <block v-if="specsTextShow">
            <block v-for="key in Object.keys(specsActive)" :key="key">
              <text class="selected-text"
                >{{ specsActive[key]["name"] }}&nbsp;&nbsp;</text
              >
            </block>
          </block>
          <block v-else> 请选择规格 </block>
        </view>
        <text class="yticon icon-you"></text>
      </view>
      <!-- 优惠券 -->
      <view class="c-row b-b">
        <text class="tit">优惠券</text>
        <text class="con t-r red">领取优惠券</text>
        <text class="yticon icon-you"></text>
      </view>
      <!-- 促销活动 -->
      <view class="c-row b-b">
        <text class="tit">促销活动</text>
        <view class="con-list">
          <text>新人首单送20元无门槛代金券</text>
          <text>订单满50减10</text>
          <text>订单满100减3</text>
          <text>单笔购买满两件免邮费</text>
        </view>
      </view>
      <!-- 服务 -->
      <view class="c-row" @click="toggleService">
        <text class="tit">服务</text>
        <text class="con">7天无理由退换货</text>
        <text class="yticon icon-you"></text>
      </view>
    </view>

    <!-- 评价 -->
    <view class="eva-section">
      <view class="e-header">
        <text class="tit">评价</text>
        <text>(86)</text>
        <text class="tip">好评率 100%</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="eva-box">
        <image
          class="portrait"
          src="/static/missing-face.png"
          mode="aspectFill"
        />
        <view class="right">
          <text class="name">Leo yo</text>
          <text class="con"
            >商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢，质量不错，试了一下有点瘦</text
          >
          <view class="bot">
            <text class="attr">购买类型：XL 红色</text>
            <text class="time">2019-04-01 19:21</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 图文详情 -->
    <view class="detail-desc">
      <view class="d-header"><text>图文详情</text></view>
      <u-parse :html="productDetail.spu_details" :tag-style="style"></u-parse>
    </view>

    <!-- 操作菜单 -->
    <add-cart-buy @listenAddCart="addCart(productDetail)" @listenBuy="buy(productDetail)" />

    <!-- 规格弹出层 -->
    <u-popup
      v-model="specShow"
      mode="bottom"
      height="auto"
      border-radius="20"
      :closeable="true"
      close-icon-pos="top-right"
    >
      <view class="attr-content">
        <view class="a-t">
          <image :src="productDetail.spu_head_img" mode="aspectFill" />
          <view class="right">
            <text class="price"
              >￥{{
                activeSku.price === undefined
                  ? productDetail.show_price
                  : activeSku.price/100
              }}</text
            >
            <text class="stock">库存：{{ specsTextShow ? (activeSku.stock_num || 0) : (productDetail.stock_num || 0 )}}件</text>
            <view class="selected">
              已选：
              <block v-if="specsTextShow">
                <block v-for="key in Object.keys(specsActive)" :key="key">
                  <text class="selected-text"
                    >{{ specsActive[key]["name"] }}&nbsp;&nbsp;</text
                  >
                </block>
              </block>
              <block v-else> 请选择规格 </block>
              <!-- 					<block v-for="(item,index) in activeSku.edges.goods_specs_option" :key="index">
								<text class="selected-text">{{item.specs_option_value}}</text>
							</block> -->
            </view>
          </view>
        </view>
        <view class="attr-list" v-for="item in specs" :key="item.id">
          <text>{{ item.title }}</text>
          <view class="item-list">
            <text
              v-for="childItem in item.list"
              :key="childItem.id"
              class="tit"
              :class="{
                selected: specsActive[item.id].id === childItem.id,
                'selected-disable': !childItem.able,
              }"
              @click="selectSpec(item.id, childItem)"
            >
              {{ childItem.name }}
            </text>
          </view>
        </view>
        <button class="btn" @click="toggleSpec">完成</button>
      </view>
    </u-popup>
    <!-- 服务弹出层 -->
    <u-popup
      v-model="serviceShow"
      mode="bottom"
      height="auto"
      border-radius="20"
      :closeable="true"
      close-icon-pos="top-right"
    >
      <view class="attr-content">
        <view class="ser-list">
          <view class="item">
            <view>
              <text class="yticon icon-xingxing"></text>
              <text class="tit">破损包退换</text>
            </view>
            <text class="tip">7天无理由退换货</text>
          </view>
          <view class="item">
            <view>
              <text class="yticon icon-xingxing"></text>
              <text class="tit">7天价保</text>
            </view>
            <text class="tip"
              >支持7天价保，下单7天内发生降价可申请价格保护</text
            >
          </view>
          <view class="item">
            <view>
              <text class="yticon icon-xingxing"></text>
              <text class="tit">免费上门取件</text>
            </view>
            <text class="tip">自营商品快递免费上门退取，退取后闪电退款</text>
          </view>
        </view>
      </view>
    </u-popup>
    <!-- 分享弹出层 -->
    <u-popup v-model="shareShow" mode="bottom" height="auto" border-radius="20">
      <view class="attr-content">
        <view class="share-header">分享到</view>
        <view class="share-list">
          <view
            v-for="(item, index) in shareList"
            :key="index"
            class="share-item"
            @click="shareToFriend(item.text)"
          >
            <image :src="item.icon" mode="aspectFill" />
            <text>{{ item.text }}</text>
          </view>
        </view>
        <view class="bottom b-t" @click="toggleMask">取消</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import addCartBuy from "@/components/add-cart-buy/add-cart-buy.vue";
export default {
  components: {
    addCartBuy,
  },
  data() {
    return {
      style: {
        img: "display:block;",
      },
      productId: "",
      serviceShow: false,
      shareShow: false,
      specShow: false,
      specSelected: [],
      productDetail: {},
      //商品规格
      specs: [],
      // sku列表
      skus: [],
      shareList: [
        {
          type: 1,
          icon: "/static/temp/share_wechat.png",
          text: "微信好友",
        },
        {
          type: 2,
          icon: "/static/temp/share_moment.png",
          text: "朋友圈",
        },
        {
          type: 3,
          icon: "/static/temp/share_qq.png",
          text: "QQ好友",
        },
        {
          type: 4,
          icon: "/static/temp/share_qqzone.png",
          text: "QQ空间",
        },
      ],
      specsActive: {},
      // 是否展示已选规格
      specsTextShow: false,
      activeSku: {},
	  cart:[]
    };
  },

  onLoad(options) {
    this.productId = options.id;
    this.getProductDetail();
  },
  methods: {
    async getProductDetail() {
      let res = await this.$u.api.getProductByIdDetail({
        id: this.productId,
      });
      if (res.code === 200) {
        this.productDetail = res.data;
        //  如果是多sku商品
        if (res.data.is_custom_sku) {
          // 初始化所有的选项
          res.data.specs.forEach((item) => {
            this.$set(this.specsActive, item.id, "");
          });
          // 处理所有的sku
          this.skus = res.data.edges.goods_sku.map((item) => {
            return {
              id: item.id,
              specs: item.edges.goods_specs_option.map((s_item) => {
                return {
                  id: s_item.id,
                  name: s_item.specs_option_value,
                };
              }),
            };
          });
          // 处理所有的specs
          /**
						 [
							 {
								 id:1,
								 title:颜色,
								 list:[
									 {
										 id:2,
										 name:"红色",
										 able:true //是否可以点击
									 }
								 ]
							 }
						 ]
						 */
          this.specs = res.data.specs.map((item) => {
            return {
              title: item.specs_name,
              id: item.id,
              list: item.edges.goods_specs_option.map((s_item) => ({
                able: this.isAble(item.id, s_item),
                name: s_item.specs_option_value,
                id: s_item.id,
              })),
            };
          });
          // Object.keys(specsActive).every(item => item!=null&&item!="")
        }
      }
    },
    // 核心函数
    // 大类的id 选项组
    isAble(specs_id, option) {
      // 获取当前选项
      let copySelectSpec = JSON.parse(JSON.stringify(this.specsActive));
      copySelectSpec[specs_id] = option;
      let specLen = Object.keys(this.specsActive).length;
      // 遍历商品sku
      let flag = this.skus.some((item) => {
        // 条件判断 核心逻辑判断
        var i = 0;
        // 循环遍历 当前所有值
        for (let k in copySelectSpec) {
          if (copySelectSpec[k] == "") {
            i++;
          } else if (
            item.specs.findIndex(
              (s_spec) => s_spec.id == copySelectSpec[k].id
            ) > -1
          ) {
            i++;
          }
        }
        return i == specLen;
      });
      return flag;
    },
    selectSpec(key, val) {
      // 过滤掉被禁用的
      if (!val.able) return;
      let specsActive = this.specsActive;
      // 如果次元素已经选中
      if (specsActive[key] && specsActive[key].id == val.id) {
        specsActive[key] = "";
      } else {
        specsActive[key] = val;
      }
      this.specsActive = JSON.parse(JSON.stringify(specsActive));
      this.specs.forEach((item) => {
        item.list.forEach((its) => {
          its.able = this.isAble(item.id, its);
        });
      });
      if (Object.keys(this.specsActive).every((key) => this.specsActive[key])) {
        this.specsTextShow = true;
        this.getSku();
      } else {
        this.specsTextShow = false;
        this.activeSku = "";
      }
    },
    async getSku() {
      this.productId = parseInt(this.productId);
      try {
        let res = await this.$u.api.getSku({
          id: this.productId,
          // 遍历循环处理
          option_ids: Object.keys(this.specsActive).map((key) => {
            return this.specsActive[key]["id"];
          }),
        });
        this.activeSku = res.data;
      } catch (e) {
        if (e.data.code >= 400) {
          uni.showToast({
            title: "所选商品不存在",
            icon: "none",
          });
          return;
        }
      }
    },
    navBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    toggleSpec() {
      if (this.specShow) {
        this.specShow = false;
      } else {
        this.specShow = true;
      }
    },
    toggleService() {
      this.serviceShow = true;
    },
    toggleShare() {
      this.shareShow = true;
    },
    toggleMask() {
      this.shareShow = false;
    },
    addCart(product) {
		
      if(uni.getStorageSync('cart')){
		  this.cart = uni.getStorageSync('cart')
	  }
	  let index = this.cart.findIndex(cartItem=>cartItem.id === product.id)
	  if(index>-1){
		  this.cart[index].count += 1
	  }else{
		  if(product.is_custom_sku){
		  	this.cart.push({
				id:product.id,
				count:1,
				spu_name:product.product,
				price:this.activeSku.price,
				image:product.spu_head_img,
				stock_num:product.stock_num,
				
		  	})
		  }else{
			this.activeSku = product.sku
			this.cart.push({
			 
			})  
		  }
		  
	  }
	  this.cart = Array.from(new Set(this.cart.map(item=>item.id))).map(item=>(
	this.cart.find(items=>items.id===item)  
	  ))
	  uni.setStorageSync('cart',JSON.stringify(this.cart))
    },
    buy() {
      console.log(222);
    },
  },
};
</script>

<style lang="scss">
page {
  background: #f8f8f8;
  padding-bottom: 160upx;
}

.icon-you {
  font-size: 26upx;
  color: #888;
}

.carousel {
  height: 722upx;
  width: 100%;
  position: relative;

  .back {
    position: absolute;
    top: 50upx;
    left: 40upx;
    width: 60upx;
    height: 60upx;
    background: rgba($color: #fff, $alpha: 0.2);
    border: 1upx solid #ccc;
    border-radius: 50%;
    color: #fff;
    font-size: 38upx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 商品描述
.introduce-section {
  background: #fff;
  padding: 20upx 30upx;
  border-radius: 20upx;
  margin: 20upx 10upx;

  .title {
    font-size: 32upx;
    color: #303133;
    height: 50upx;
    line-height: 50upx;
  }

  .price-box {
    display: flex;
    align-items: baseline;
    height: 64upx;
    padding: 10upx 0;
    font-size: 26upx;
    color: #fa436a;
  }

  .price {
    font-size: 34upx;
  }

  .bot-row {
    display: flex;
    align-items: center;
    color: #909399;
    font-size: 24upx;
    height: 50upx;

    text {
      flex: 1;
    }
  }
}

// 分享
.share-section {
  display: flex;
  align-items: center;
  color: #606266;
  background: linear-gradient(left, #fdf5f6, #fbebf6);
  padding: 12upx 30upx;

  .share-icon {
    display: flex;
    align-items: center;
    width: 70upx;
    height: 30upx;
    line-height: 1;
    border: 1px solid #fa436a;
    border-radius: 4upx;
    position: relative;
    overflow: hidden;
    font-size: 22upx;
    color: #fa436a;

    &:after {
      content: "";
      width: 50upx;
      height: 50upx;
      border-radius: 50%;
      left: -20upx;
      top: -12upx;
      position: absolute;
      background: #fa436a;
    }
  }

  .icon-xingxing {
    position: relative;
    z-index: 1;
    font-size: 24upx;
    margin-left: 2upx;
    margin-right: 10upx;
    color: #fff;
    line-height: 1;
  }

  .share-btn {
    flex: 1;
    text-align: right;
    font-size: 24upx;
    color: #fa436a;
  }

  .tit {
    font-size: 28upx;
    margin-left: 10upx;
  }

  .icon-bangzhu1 {
    padding: 10upx;
    font-size: 30upx;
    line-height: 1;
  }

  .icon-you {
    font-size: 24upx;
    margin-left: 4upx;
    color: #fa436a;
  }
}

// 规格
.c-list {
  background: #fff;
  padding: 10upx 10upx;
  border-radius: 20upx;
  margin: 20upx 10upx;
  font-size: 26upx;

  .c-row {
    display: flex;
    align-items: center;
    padding: 20upx 20upx;
    position: relative;
  }

  .tit {
    color: #606266;
    width: 140upx;
  }

  .con {
    flex: 1;
    color: #303133;

    .selected-text {
      margin-right: 10upx;
    }
  }

  .con-list {
    display: flex;
    flex-direction: column;

    text {
      font-size: 24upx;
      line-height: 1.5;
    }
  }

  .red {
    color: #fa436a;
  }
}

//评价
.eva-section {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 20upx 30upx;
  margin: 20upx 10upx;
  border-radius: 20upx;

  .e-header {
    display: flex;
    align-items: center;
    height: 70upx;
    font-size: 26upx;
    color: #909399;

    .tit {
      font-size: 30upx;
      color: #303133;
      margin-right: 4upx;
    }

    .tip {
      flex: 1;
      text-align: right;
    }

    .icon-you {
      margin-left: 10upx;
    }
  }
}

.eva-box {
  display: flex;
  padding: 20upx 0;

  .portrait {
    flex-shrink: 0;
    width: 80upx;
    height: 80upx;
    border-radius: 100px;
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 28upx;
    color: #606266;
    padding-left: 26upx;

    .con {
      font-size: 28upx;
      color: #303133;
      margin: 20upx 0;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      // width: 564upx;
    }

    .bot {
      display: flex;
      justify-content: space-between;
      font-size: 24upx;
      color: #909399;
    }
  }
}

// 图文详情
.detail-desc {
  background: #fff;
  margin-top: 20upx;

  .d-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80upx;
    font-size: 30upx;
    color: #303133;
    position: relative;

    text {
      padding: 0 20upx;
      background: #fff;
      position: relative;
      z-index: 1;
    }

    &:after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
      width: 300upx;
      height: 0;
      content: "";
      border-bottom: 1px solid #ccc;
    }
  }
}

// 规格弹层
.attr-content {
  padding: 10upx 30upx;
  margin-bottom: 200upx;
}

.a-t {
  display: flex;

  image {
    width: 170upx;
    height: 170upx;
    flex-shrink: 0;
    margin-top: 20upx;
    border-radius: 8upx;
  }

  .right {
    display: flex;
    flex-direction: column;
    padding-left: 24upx;
    font-size: 26upx;
    color: #606266;
    line-height: 42upx;
    margin-top: 20upx;

    .price {
      font-size: 32upx;
      color: #fa436a;
      margin-bottom: 10upx;
    }

    .seleted-text {
      margin-right: 10upx;
    }
  }
}

.attr-list {
  display: flex;
  flex-direction: column;
  font-size: 30upx;
  color: #606266;
  padding-top: 30upx;
  padding-left: 10upx;
}

.item-list {
  padding: 20upx 0 0;
  display: flex;
  flex-wrap: wrap;

  text {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eee;
    margin-right: 20upx;
    margin-bottom: 20upx;
    border-radius: 100upx;
    min-width: 60upx;
    height: 60upx;
    padding: 0 20upx;
    font-size: 28upx;
    color: #303133;
  }

  .selected {
    background: #fbebee;
    color: #fa436a;
  }

  .selected-disable {
    opacity: 0.6;
  }
}

.btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50upx;
  height: 66upx;
  line-height: 66upx;
  border-radius: 100upx;
  background: #fa435a;
  font-size: 30upx;
  color: #fff;
  margin: 0 30upx;
}

//服务弹层
.ser-list {
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-top: 60upx;

  .item {
    display: flex;
    flex-direction: column;
    padding: 30upx 20upx;
    margin: 20upx 10upx;
    border-radius: 10upx;
    box-shadow: 0px 0.5px 5px rgba($color: #000000, $alpha: 0.1);

    .tit {
      font-size: 30upx;
      color: #303133;
    }

    .icon-xingxing {
      color: #fa436a;
    }

    .tip {
      font-size: 24upx;
      color: #606266;
    }
  }
}

.share-header {
  height: 110upx;
  font-size: 30upx;
  color: #303133;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10upx;
  margin-top: 50upx;

  &:before,
  &:after {
    content: "";
    width: 240upx;
    height: 0;
    border-top: 1px solid #909399;
    transform: scaleY(0.5);
    margin-right: 30upx;
  }

  &:after {
    margin-left: 30upx;
    margin-right: 0;
  }
}

.share-list {
  display: flex;
  flex-wrap: wrap;
}

.share-item {
  min-width: 33.33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 180upx;

  image {
    width: 80upx;
    height: 80upx;
    margin-bottom: 16upx;
  }

  text {
    font-size: 28upx;
    color: #606266;
  }
}

.bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90upx;
  background: #fff;
  z-index: 9;
  font-size: 30upx;
  color: #303133;
}
</style>
