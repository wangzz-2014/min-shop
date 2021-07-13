<template>
	<view class="content">
		
		<!-- 订单状态 -->
		<view class="orderStatus">
			<u-icon v-if="orderItem.status === 100" name="checkmark-circle-fill" size="60" color="#59BB73"></u-icon>
			<u-icon v-else name="error-circle-fill" size="60" color="#E74940"></u-icon>
			<text class="tit" :style="{color:orderItem.statusTipColor}">{{orderItem.statusTip}}</text>
		</view>
		
		<!-- 收货信息 -->
		<view class="address">
			<text class="yticon icon-shouhuodizhi"></text>
			<view class="con">
				<view class="top">
					<text class="address-name">{{orderItem.edges.order_address.name}}</text>
					<text class="address-phone">{{orderItem.edges.order_address.phone}}</text>
				</view>
				<text class="address-con">{{orderItem.edges.order_address.province+orderItem.edges.order_address.city+orderItem.edges.order_address.area+orderItem.edges.order_address.detailed}}</text>
			</view>
		</view>

		<!-- 商品详情 -->
		<view class="item-box">
			<view class="goods-box-single" v-for="(goodsItem,goodsIndex) in orderItem.edges.order_goods_sku" :key="goodsIndex">
				<image :src="goodsItem.spu_head_img" mode="aspectFill" class="goods-img"/>
				<view class="right">
					<text class="title clamp">{{goodsItem.spu_name}}</text>
					<text class="attr-box">{{goodsItem.sku_name ? goodsItem.sku_name : ''}} x {{goodsItem.amount}}</text>
					<text class="price">{{orderItem.pay_money}}</text>
				</view>
			</view>
		</view>
		
		<!-- 订单信息 -->
		<view class="tips">
				<view class="orderDetail">
					<view class="tip">
						<view class="title">订单编号</view>
						<view class="value">{{orderItem.order_number}}</view>
					</view>
					<view class="tip">
						<view class="title">下单时间</view>
						<view class="value">{{orderItem.created_at | formatDateTime}}</view>
					</view>
					
					<view class="tip">
						<view class="title">支付方式</view>
						<view class="value" v-if="!orderItem.pay_method">微信支付</view>
						<view class="value" v-if="orderItem.pay_method && orderItem.pay_method == 1">余额支付</view>
						<view class="value" v-if="orderItem.pay_method && orderItem.pay_method== 2">支付宝支付</view>
					</view>
					<view class="tip" v-if="orderItem.edges.wechat_pay">
						<view class="title">支付时间</view>
						<view class="value" >{{orderItem.edges.wechat_pay.success_time}}</view>
					</view>
				</view>
				<view class="orderDetail right">
					<view class="tip">
						<view class="title">商品总额</view>
						<view class="value">226</view>
					</view>
					<view class="tip">
						<view class="title">运费</view>
						<view class="value">0</view>
					</view>
					<view class="tip">
						<view class="title">促销立减</view>
						<view class="value">0</view>
					</view>
					<view class="tip">
						<view class="title">商品优惠</view>
						<view class="value">0</view>
					</view>
					<view class="price-box">实付款：
						<text class="price">226</text>
					</view>
					
				</view>
		</view>
		
		
		<view class="footer">
			<text class="del">删除</text>
			<text class="resale">再次购买</text>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				orderItem:{},
				order_code:'',
				
			};
		},
		onLoad(option) {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage',(data)=>{
				this.order_code = data.order_code
			})
			this.getOrderInfo()
		},
		//事件处理
		methods: {
			async getOrderInfo(){
				try{
					let res = await this.$u.api.getOrderInfo({order_code:this.order_code})
					this.orderItem = Object.assign(res.data,this.orderStatusExp(res.data.status))
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
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
		},
	}
</script>

<style lang="scss" scoped>

.content{
		background: #f8f8f8;
		display: flex;
		flex-direction: column;
		padding-bottom: 80upx;
	}
	.orderStatus{
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 50upx;
		padding-bottom: 50upx;
		
	}
	
	.address{
		margin: 16upx 0;
		padding: 30upx 0upx;
		background: #fff;
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 20upx;
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
	}
	.item-box{
		margin-bottom: 16upx;
		border-radius: 20upx;
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
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
	.tips{
		border-radius: 20upx;
		.orderDetail{
			padding: 30upx;
			display: flex;
			flex-direction: column;
			margin-bottom: 20upx;
			background: #fff;
			.tip{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 26upx;
				line-height: 50upx;
			}
			.title{
				color: #606266;
				margin-right: 20upx;
				&:after{
					content: ":";
				}
			}
			.value{
				flex: 1;
				color: #303133;
				font-weight: bold;
			}
		}
		.right{
			.value{
				text-align: right;
				padding-right: 20upx;
			}
		}
		.price-box{
			display: flex;
			align-items: center;
			justify-content: flex-end;
			height: 70upx;
			.price{
				font-size: 32upx;
				color: #fa436a;
				&:before{
					content: "￥";
				}
			}
		}
	}
	.footer{
		box-shadow:0upx -5upx 10upx rgba($color: #000000, $alpha: .2);
		border-top: 1upx solid #f8f8f8;
		width: 750upx;
		height: 70upx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20upx;
		
		.resale{
			border: 1px soli #fff;
			background: #fa436a;
			color: #fff;
			border-radius: 25upx;
			text-align: center;
			padding: 5upx 20upx;
		}
	}
</style>
