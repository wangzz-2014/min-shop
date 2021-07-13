<template>
	<view class="content">
		<view>
			<u-tabs-swiper active-color="#fa436a" ref="uTabs" :list="navList" :current="tabCurrent" @change="tabsChange" :is-scroll="false"
			 swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in navList" :key="index">
				<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="loadData">
					<!-- 空白页 -->
					<u-empty v-if="item.orderList.length===0" text="您还没有相关订单" mode="order"></u-empty>
					<!-- 订单列表 -->
					<view class="order-item" v-for="(orderItem,index) in item.orderList" :key="index">
						<!-- 头部订单状态 -->
						<view class="i-top b-b">
							<text class="time">2021-07-07</text>
							<text class="state" :style="{color:orderItem.stateTipColor}">交易完成</text>
							<text v-if="orderItem.state === 9" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text>
						</view>
						<!-- 中间商品信息 -->
						<scroll-view scroll-x v-if="orderItem.goodsList.length>1" class="goods-box">
							<view class="goods-item" v-for="(goodsItem,goodsIndex) in orderItem.goodsList" :key="goodsIndex">
								<image class="goods-img" :src="goodsItem.image" mode="aspectFill"/>
							</view>
						</scroll-view>
						<view class="goods-box-single" v-for="(goodsItem,goodsIndex) in orderItem.goodsList" :key="goodsIndex">
							<image :src="goodsItem.image" mode="aspectFill" class="goods-img"/>
							<view class="right">
								<text class="title clamp">{{goodsItem.name}}</text>
								<text class="attr-box">{{goodsItem.attr}} x {{goodsItem.count}}</text>
								<text class="price">{{goodsItem.price}}</text>
							</view>
						</view>
						<!-- 底部付款信息 -->
						<view class="price-box">
							共<text class="num">7</text>
							件商品 实付款
							<text class="price">190.67</text>
						</view>
						<view class="action-box b-t" v-if="orderItem.state !== 9">
							<button class="action-btn" @click="cancelOrder(orderItem)">取消订单</button>
							<button class="action-btn recom" @click="goPay(orderItem)">立即支付</button>
						</view>
					</view>
					<!-- 加载更多 -->
					<u-loadmore :status="item.loadingType" />
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:'loadmore',
				tabCurrent:0,// tabs组件的current值，表示当前活动的tab选项
				swiperCurrent:0,// swiper组件的current值，表示当前那个swiper-item是活动的
				navList:[
					{
						name:'全部',
						loadingType:'more',
						orderList:[],
						state:0
					},
					{
						name:'待付款',
						loadingType:'more',
						orderList:[],
						state:1
					},
					{
						name:'待收货',
						loadingType:'more',
						orderList:[],
						state:2
					},
					{
						name:'待评价',
						loadingType:'more',
						orderList:[],
						state:3
					},
					{
						name:'已取消',
						loadingType:'more',
						orderList:[],
						state:4
					},
				]
			};
		},
		onLoad(options) {
			this.tabCurrent = parseInt(options.status)
		},
		methods:{
			// tabs通知swiper切换
			tabsChange(index){
				this.swiperCurrent = index
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e){
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e){
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.tabCurrent = current;
			},
			loadData(){
				console.log(111)
			}
		}
	}
</script>

<style lang="scss">

</style>
