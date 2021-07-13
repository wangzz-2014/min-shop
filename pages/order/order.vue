<template>
	<view class="content">
		<view>
			<u-tabs-swiper active-color="#fa436a" ref="uTabs" :list="navList" :current="tabCurrent" @change="tabsChange" :is-scroll="false"
			 swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="swiper-box">
			<swiper-item class="swiper-item" v-for="(item, navindex) in navList" :key="navindex">
				<scroll-view scroll-y style="height: calc(100vh - 40px );width: 100%;" @scrolltolower="onreachBottom" class="list-scroll-content">
					<!-- 空白页 -->
					<u-empty v-if="item.orderList.length===0" text="您还没有相关订单" mode="order"></u-empty>
					<!-- 订单列表 -->
					<view class="order-item" v-for="(orderItem,orderindex) in item.orderList" :key="orderindex" @click="gotoOrderDetail(orderItem)">
						<!-- 头部订单状态 -->
						<view class="i-top b-b">
							<text class="time">{{orderItem.created_at | formatDateTime }}</text>
							<text class="state" :style="{color:orderItem.statusTipColor}">{{orderItem.statusTip}}</text>
							<text v-if="orderItem.status === 99" class="del-btn yticon icon-iconfontshanchu1" @click.stop="deleteOrder(orderindex)"></text>
						</view>
						<!-- 中间商品信息 -->
						<scroll-view scroll-x v-if="orderItem.edges.order_goods_sku.length>1" class="goods-box">
							<view class="goods-item" v-for="(goodsItem,goodsIndex) in orderItem.edges.order_goods_sku" :key="goodsIndex">
								<image class="goods-img" :src="goodsItem.spu_head_img" mode="aspectFill"/>
							</view>
						</scroll-view>
						<view class="goods-box-single" v-for="(goodsItem,goodsIndex) in orderItem.edges.order_goods_sku" :key="goodsIndex">
							<image :src="goodsItem.spu_head_img" mode="aspectFill" class="goods-img"/>
							<view class="right">
								<text class="title clamp">{{goodsItem.spu_name}}</text>
								<text class="attr-box">{{goodsItem.sku_name ? goodsItem.sku_name : ''}} x {{goodsItem.amount}}</text>
								<text class="price">{{orderItem.pay_money}}</text>
							</view>
						</view>
						<!-- 底部付款信息 -->
						<view class="price-box">
							共<text class="num">{{orderItem.edges.order_goods_sku.length}}</text>
							件商品 实付款
							<text class="price">{{orderItem.pay_money}}</text>
						</view>
						<view class="action-box b-t" v-if="orderItem.status !== 99">
							<view class="countDown" v-if="orderItem.status === 1">
								<text>剩余：</text>
								<u-count-down :show-days="false" :show-hours="false" color="#fa436a" :timestamp="getCountDown(orderItem.created_at)"></u-count-down>
							</view>
							
								<button class="action-btn" @click.stop="cancelOrder(orderItem)">取消订单</button>
								<button class="action-btn recom" v-if="orderItem.status === 1" @click.stop="goPay(orderItem)">立即支付</button>

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
				payType:1,
				status:'loadmore',
				tabCurrent:0,// tabs组件的current值，表示当前活动的tab选项
				swiperCurrent:0,// swiper组件的current值，表示当前那个swiper-item是活动的,
				
				navList:[
					{
						name:'全部',
						loadingType:'loadmore',
						orderList:[],
						status:0,
						pageOptions:{
							page:1,
							size:10
						},
						total:0,
						pageSize:0,
					},
					{
						name:'待付款',
						loadingType:'loadmore',
						orderList:[],
						status:1,
						pageOptions:{
							page:1,
							size:10
						},
						total:0,
						pageSize:0,
					},
					{
						name:'待发货',
						loadingType:'loadmore',
						orderList:[],
						status:2,
						pageOptions:{
							page:1,
							size:10
						},
						total:0,
						pageSize:0,
					},
					{
						name:'待收货',
						loadingType:'loadmore',
						orderList:[],
						status:3,
						pageOptions:{
							page:1,
							size:10
						},
						total:0,
						pageSize:0,
					},
					{
						name:'已取消',
						loadingType:'loadmore',
						orderList:[],
						status:99,
						pageOptions:{
							page:1,
							size:10
						},
						total:0,
						pageSize:0,
					},
				]
			};
		},
		onLoad(options) {
			options.status = options.status || 0
			this.tabCurrent = this.navList.findIndex((val)=>val.status == options.status)
			this.swiperCurrent = this.tabCurrent
			if(options.status == 0 ){
				this.loadData()
			}
		},
		async onPullDownRefresh() {
		 	await this.refresh()
			uni.stopPullDownRefresh()
		},
		methods:{
			//立即支付
			goPay(orderItem){
				let order_code = orderItem.order_number
				let totalPrice = orderItem.pay_money
				uni.redirectTo({
					url:'/pages/pay/pay?payType='+this.payType
				})
				uni.setStorageSync('order_code',order_code)
				uni.setStorageSync('totalPrice',totalPrice)
			},
			//获取倒计时时间戳
			getCountDown(createTime){
				let timestamp = (new Date(createTime).getTime())/1000
				timestamp += 1200
				return timestamp - (new Date().getTime()/1000)
				console.log(timestamp)
			},
			//下拉刷新
			async refresh(){
				let index = this.tabCurrent
				this.navList[index].orderList = []
				this.navList[index].loadingType = 'loading';
				this.navList[index].pageOptions ={
					page:1,
					size:10
				}
				this.navList[index].loaded = false
				await this.loadData()
			},
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
				this.navList[current].loaded = false
				this.loadData('tabChange')
			},
			async loadData(source){
				//将订单挂载到tab列表下，切换列表获取订单数据
				//获取当前index
				let index = this.tabCurrent
				//得到index对应的项
				let navItem = this.navList[index]
				let status = navItem.status
				
				if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return
				}
				// if(navItem.loadingType === 'loading'){
				// 	//防止重复加载数据
				// 	return
				// }
				navItem.loadingType = 'loading'
				
				let res = await this.$u.api.getOrderList({
					...this.navList[index].pageOptions,
					status:status
					
				})
				this.navList[index].total = res.data.total
				let orderArr = res.data.data
				let orderList = []
				if(this.navList[index].pageOptions.page === 1){
					orderList = orderArr
				}else{
					orderList = [...orderList,...orderArr]
				}
				orderList = orderList.filter(item=>{
					//添加不同状态下订单的表现形式
					item = Object.assign(item,this.orderStatusExp(item.status))
					if(status === 0){
						//返回全部订单
						return item
					}
					return item.status === status
				})
				orderList.forEach(item=>{
					navItem.orderList.push(item)
				})
				this.$set(navItem,'loaded',true)
				navItem.loadingType = 'loadmore'
			},
			onreachBottom(){
				console.log('触底执行')
				this.$u.throttle(()=>{
					let index = this.tabCurrent
					let navItem = this.navList[index]
					let status = navItem.status
					this.navList[index].pageSize = this.navList[index].total / this.navList[index].pageOptions.size
					if(this.navList[index].pageOptions.page < this.navList[index].pageSize){
						this.navList[index].loadingType = 'loading';
						this.navList[index].pageOptions = {
							page:this.navList[index].pageOptions.page + 1,
							size:10
						}
						this.navList[index].loaded = false
						this.loadData()
						this.navList[index].loaded = true
					}else{
						navItem.loadingType = 'nomore'; 
					}
				}, 500)
			},
			//订单状态文字和颜色
			orderStatusExp(status){
				let statusTip = '',statusTipColor = '#fa436a';
				switch (+status){
					case 1:
						statusTip = '待付款'
						break;
					case 2:
						statusTip = '待发货'
						break;
					case 3:
						statusTip = '待收货'
						break;
					case 99:
						statusTip = '已取消'
						statusTipColor = '#909399'
						break;
					case 100:
						statusTip = '已完成'
						statusTipColor = '#909399'
						break;
				}
				
				return {statusTip,statusTipColor}
			},
			deleteOrder(index){
				uni.showModal({
					content:'确定删除该订单吗？',
					success: async (res)=>{
					        if (res.confirm) {
					            let order_code = this.navList[this.tabCurrent].orderList[index].order_number
								try{
									let res = await this.$u.api.delOrder({
										order_code
									})
									
									uni.showToast({
										title:'删除成功',
										icon:'success'
									})
								uni.startPullDownRefresh({})	
								// await this.refresh()
								// uni.stopPullDownRefresh()
								}catch(e){
									console.log(e)
									uni.showModal({
										title:'操作提示',
										content:e?.data?.msg||"删除失败",
										showCancel:false
									})
								}
								
					        } 
					    }
				})
			},
			 cancelOrder(order){
				uni.showModal({
					content:'确认取消该订单吗？',
					success: async (res) => {
						if(res.confirm){
							try{
								let res = await this.$u.api.cancelOrder({order_code:order.order_number})
								uni.showToast({
									title:'取消成功',
									icon:'success'
								})
								uni.startPullDownRefresh({})	
							}catch(e){
								uni.showModal({
									title:'操作提示',
									content:e?.data?.msg||"取消失败",
									showCancel:false
								})
								console.log(e)
							}
						}
					}
				})
			},
			//跳转到订单详情页
			gotoOrderDetail(orderItem){
				uni.navigateTo({
					url:'/pages/order/orderDetail',
					success: (res) => {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage',{order_code:orderItem.order_number})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
page,.content{
	background: #f8f8f8;
	height: 100vh;
}
.swiper-box{
	height: calc(100vh - 40px);
}
.swiper-item{
	height: 100%;
}
.list-scroll-content{
	height: 100%;
}

.order-item{
	display: flex;
	flex-direction: column;
	padding-left: 30upx;
	background: #fff;
	margin-top: 16upx;
	
	.i-top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80upx;
		padding-right: 30upx;
		font-size: 28upx;
		color: #303133;
		position: relative;
		
		.time{
			flex: 1;
		}
		.state{
			color: #606266;
		}
		.del-btn{
			padding: 10upx 0 10upx 36upx;
			font-size: 34upx;
			color: #909399;
			position: relative;
			&:after{
				content: "";
				width: 0;
				height: 30upx;
				border-left: 1px solid #909399;
				position: absolute;
				left: 20upx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	// 多件商品下单样式
	.goods-box{
		height: 160upx;
		padding: 20upx 0;
		white-space: nowrap;
		.goods-item{
			width: 120upx;
			height: 120upx;
			display: inline-block;
			margin-right: 24upx;
		}
		.goods-img{
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	
	//单间商品下单
	.goods-box-single{
		display: flex;
		padding: 20upx 0;
		.goods-img{
			display: block;
			width: 120upx;
			height: 120upx;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30upx 0 24upx;
			overflow: hidden;
			.title{
				font-size: 30upx;
				color: #303133;
				line-height: 1;
			}
			.attr-box{
				font-size: 26upx;
				color: #909399;
				padding: 10upx 12upx;
			}
			.price{
				font-size: 28upx;
				color: #303133;
				&:before{
					content: '￥';
					font-size: 24upx;
					margin: 0 2upx 0 8upx;
				}
			}
		}
	}
}

.price-box{
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 20upx 30upx;
	font-size: 26upx;
	color: #909399;
	
	.num{
		margin: 0 8upx;
		color: #303133;
	}
	.price{
		font-size:32upx;
		color: #303133;
		
		&:before{
			content: '￥';
			font-size: 24upx;
			margin: 0 2upx 0 8upx;
		}
	}
}

.action-box{
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 100upx;
	position: relative;
	padding-right: 30upx;
	.countDown{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #fa436a;
		margin-right: 140upx;
	}
	.action-btn{
		width: 160upx;
		height: 60upx;
		margin: 0;
		margin-left: 24upx;
		padding: 0;
		text-align: center;
		line-height: 60upx;
		font-size: 26upx;
		color: #303133;
		background: #fff;
		border-radius: 100px;
		
		&:after{
			border-radius: 100px;
		}
		&.recom{
			background: #fff9f9;
			color: #fa436a;
			&:after{
				border-color: #f7bcc8;
			}
		}
	}
}

</style>
