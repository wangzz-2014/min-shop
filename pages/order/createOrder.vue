<template>
	<view class="content">
		<!-- 收货地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section">
			<view class="address">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="con">
					<view class="top">
						<text class="address-name">{{active_address.name}}</text>
						<text class="address-phone">{{active_address.phone}}</text>
					</view>
					<text class="address-con">{{active_address.province+active_address.city+active_address.area+active_address.detailed}}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<image class="a-bg" src="@/static/address.png"/>
		</navigator>
		<view class="goods">
			<view class="goods-item" v-for="(item,index) in goodsList" :key="item.sku_id">
				<image :src="item.image"/>
				<view class="item-con">
					<text class="item-name ">{{item.spu_name}}</text>
					<text class="item-attr" v-if="item.sku_name">{{item.sku_name}}</text>
					<view class="item-box">
						<text class="item-price">￥{{item.price/100}}</text>
						<text class="item-count">x{{item.count}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品优惠 -->
		<view class="discount">
			<u-cell-group>
				<u-cell-item title="优惠券" value="选择优惠券" :value-style="valueColor" :title-style="titleColor" :index="index" @click="selectCoupon">
					<view class="cell-icon" slot="icon">券</view>
				</u-cell-item>
				<u-cell-item title="商家促销" value="暂无可用优惠" :arrow="false" :border-bottom="false" :title-style="titleColor">
					<view class="cell-icon hb" slot="icon">减</view>
				</u-cell-item>
			</u-cell-group>
		</view>
		<!-- 商品金额明细 -->
		<view class="detail-list">
			<u-cell-group>
				<u-cell-item :title-style="titleColor" title="商品金额" :value="(totalPrice/100).toFixed(2)" :value-style="valueColor1" :arrow="false"></u-cell-item>
				<u-cell-item :title-style="titleColor" title="优惠金额" value="0" :value-style="valueColor" :arrow="false"></u-cell-item>
				<u-cell-item :title-style="titleColor" title="运费" value="免运费" :value-style="valueColor1" :arrow="false"></u-cell-item>
				<u-cell-item :title-style="titleColor" title="备注" :border-bottom="false" value="" :value-style="valueColor1" :arrow="false">
					<u-input :custom-style="customStyle" v-model="mask" type="textarea" height="54" placeholder="请填写备注信息"/>
				</u-cell-item>
			</u-cell-group>
		</view>
		
		<!-- 底部操作按钮 -->
		<view class="footer">
			<view class="left-price">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{(totalPrice/100).toFixed(2)}}</text>
			</view>
			<text class="submit" @click="submitOrder">提交订单</text>
		</view>
		
		<!-- 优惠券弹层 -->
		<u-popup v-model="couponShow" mode="bottom" height="auto">
			<view class="couponList">
				<view class="couponItem" v-for="(item,index) in couponList" :key="index">
					<view class="top">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">有效期至2021-10-31</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text class="limit">满30可用</text>
						</view>
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList:[],
				active_address:{},
				totalPrice:0,
				//备注
				mask:'',
				preList:[],
				//订单号
				order_code:'',
				//定时器id
				timer:'',
				payType: 1, //1微信 2支付宝
				couponShow:false,
				titleColor:{
					color:'#909399'
				},
				valueColor:{
					color:'#fa436a'
				},
				valueColor1:{
					color:'#303133'
				},
				customStyle:{
					'padding-left':'10px',
					'line-height':'18px',
					'box-sizing': 'border-box'
				},
				couponList:[
					{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					}
				]
			};
		},
		onLoad() {
			this.getPreList()
		},
		onUnload() {
			clearInterval(this.timer)
		},
		methods:{
			async getPreList(){
				if(uni.getStorageSync('preList')){
					let preList = JSON.parse(uni.getStorageSync('preList'))
					let res = await this.$u.api.getPreList({products:preList})
					if(res.code === 200){
						this.goodsList = res.data.good_list
						this.totalPrice = this.goodsList.reduce((pre,cur)=>{
							return pre += cur.price * cur.count
						},0)
						this.active_address = res.data.default_address
					}
				}
			},
			async submitOrder(){
				let list = this.goodsList.map(item=>({
					sku_id:item.sku_id,
					amount:item.count
				}))
				this.preList = list
				let res = await this.$u.api.createOrder({address_id:this.active_address.id,products:this.preList,remarks:this.mask})
				if(res.code === 200){
					this.order_code = res.data
					this.getOrderStatus(this.order_code)
				}
			},
			 getOrderStatus(order_code){
				 uni.showLoading({
				 	title: '正在处理请稍后...',
				 	mask: true,
				 });
				this.timer = setInterval(async ()=>{
					let res = await this.$u.api.orderStatus({order_code})
					uni.showLoading({
						title: '正在处理请稍后...',
						mask: true,
					});
					console.log(res)
					if(res.data===1){
						clearInterval(this.timer)
						uni.redirectTo({
							url:'/pages/pay/pay?payType='+this.payType
						})
						uni.hideLoading()
						try{
							uni.removeStorageSync('cart');
						}catch(e){
							console.log(e)
						}
						uni.setStorageSync('order_code',this.order_code)
						uni.setStorageSync('totalPrice',this.totalPrice)
					}
				},1000)
			},
			selectCoupon(){
				this.couponShow = true
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	background: #f8f8f8;
	padding-bottom: 100upx;
}
.address-section{
	padding: 30upx 0upx;
	background: #fff;
	position: relative;
	.address{
		display: flex;
		align-items: center;
	}
	.icon-shouhuodizhi{
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90upx;
		color: #888;
		font-size: 44upx;
	}
	.con{
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: 28upx;
		color: #303133;
		justify-content: space-around;
	}
	.address-name{
		font-size: 34upx;
		margin-right: 24upx;
	}
	.address-con{
		margin-top: 16upx;
		color: #909399;
		margin-right: 30upx;
	}
	.icon-you{
		font-size: 32upx;
		color: #909399;
		margin-right: 30upx;
		
	}
}
.a-bg{
	position: absolute;
	left: 0;
	bottom: 0;
	display: block;
	width: 100%;
	height: 5upx;
}

.goods{
	display: flex;
	flex-direction: column;
	margin-top: 16upx;
	background: #fff;
	padding-bottom: 10upx;
	
	.goods-item{
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20upx 30upx;
		image{
			flex-shrink: 0;
			display: block;
			width: 140upx;
			height: 140upx;
			border-radius: 4upx;
		}
		.item-con{
			height: 136upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex: 1;
			padding-left: 24upx;
			overflow: hidden;
		}
		.item-name{
			font-size: 30upx;
			color: #303133;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.item-attr{
			font-size: 26upx;
			color: #909399;
		}
		.item-box{
			display: flex;
			align-items: center;
			font-size: 32upx;
			color: #303133;
			padding-top: 10upx;
			.item-price{
				margin-bottom: 4upx;
			}
			.item-count{
				font-size: 26upx;
				color: #606266;
				margin-left: 20upx;
			}
		}
	}
}
.discount{
	margin-top: 16upx;
	margin-bottom: 16upx;
	background: #fff;
	.cell-icon{
		width: 32upx;
		height: 32upx;
		font-size: 22upx;
		color: #fff;
		text-align: center;
		background: #f85e52;
		border-radius: 4upx;
		margin-right: 12upx;
		line-height: 32upx;
		&.hb{
			background: #ffaa0e;
		}
	}
	.mask{
		padding-left: 80upx;
	}
}
.footer{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100upx;
	background: #fff;
	z-index: 99;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 -1px 5px rgba(0,0,0,.1);
	font-size: 30upx;
	color: #606266;
	
	.left-price{
		padding-left: 30upx;
	}
	.price-tip{
		color: #fa436a;
		margin-left: 8upx;
	}
	.price{
		font-size: 36upx;
		color: #fa436a;
	}
	.submit{
		width: 280upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		background: #fa436a;
		height: 100%;
		font-size: 32upx;
	}
}
.couponList{
	background: #f3f3f3;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding-top: 20upx;
	.couponItem{
		display: flex;
		flex-direction: column;
		background: #fff;
		margin: 0upx 24upx 20upx;
		.top{
			display: flex;
			align-items: center;
			height: 120upx;
			padding: 0 30upx;
			position: relative;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 100upx;
			flex: 1;
			overflow: hidden;
			
			.title{
				font-size: 32upx;
				color: #303133;
				margin-bottom: 10upx;
			}
			.time{
				color: #909399;
				font-size: 24upx;
			}
		}
		
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #606266;
			height: 100upx;
			
			.price{
				color: #fa436a;
				font-size: 44upx;
				&:before{
					content: "￥";
					font-size: 34upx;
				}
			}
			
		}
		
		.tips{
			font-size: 24upx;
			color: #909399;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			width: 20upx;
			height: 20upx;
			position: absolute;
			bottom: -10upx;
			left: -6upx;
			background: #f3f3f3;
			z-index: 10;
			border-radius: 50%;
		}
		.r{
			right: -6upx;
			left: auto;
		}
	}
}
</style>
