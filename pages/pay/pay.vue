<template>
	<view class="content">
		<!-- 支付金额 -->
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{(totalPrice/100).toFixed(2)}}</text>
		</view>
		
		<!-- 支付列表 -->
		<view class="payType-list">
			<view class="typeItem b-b" @click="changePayType(1)">
				<text class="yticon icon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio"><radio color="#fa436a" value="" :checked="payType === 1" /></label>
			</view>
			<view class="typeItem b-b" @click="changePayType(2)">
				<text class="yticon icon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio"><radio color="#fa436a" value="" :checked="payType === 2" /></label>
			</view>
			<view class="typeItem" @click="changePayType(3)">
				<text class="yticon icon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额￥20000.00</text>
				</view>
				<label class="radio"><radio color="#fa436a" value="" :checked="payType === 3" /></label>
			</view>
		</view>
		
		<!-- 确认支付按钮 -->
		<text class="submit" @click="submit">确认支付</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order_code:'',
				totalPrice:0,
				payType:1,
				orderInfo:{}
			}
		},
		onLoad(options) {
			this.payType = options.payType
			this.order_code = uni.getStorageSync('order_code')
			this.totalPrice = uni.getStorageSync('totalPrice')
		},
		methods: {
			changePayType(type){
				this.payType = type
			},
			async submit(){
				try{
					let res = await this.$u.api.wechatPay({order_code:this.order_code})
					if(res.code === 200){
						this.orderInfo = res.data
						wx.requestPayment({
							timeStamp: this.orderInfo.timeStamp,
							nonceStr: this.orderInfo.nonceStr,
							package: this.orderInfo.package,
							signType: this.orderInfo.signType,
							paySign: this.orderInfo.paySign,
							complete:(res)=>{
								if(res.errMsg){
									uni.navigateTo({
										url:'/pages/pay/payStatus?payStatus='+res.errMsg
									})
								}
							}
						})
					}
				}catch(e){
					console.log(e)
				}
				
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	width: 100%;
	background: #fff;
}
.price-box{
	height: 265upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #909399;
	font-size: 28upx;
	
	.price{
		color: #303133;
		font-size: 50upx;
		margin-top: 12upx;
		&:before{
			content: "￥";
			font-size: 40upx;
		}
	}
}
.payType-list{
	margin-top: 20upx;
	padding:0 60upx;
	
	.typeItem{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 120upx;
		padding: 20upx 0;
		font-size: 30upx;
		position: relative;
	}
	.icon{
		width: 100upx;
		font-size: 52upx;
	}
	.icon-erjiye-yucunkuan{
		color: #fe8e2e;
	}
	.icon-weixinzhifu{
		color: #36cb59;
	}
	.icon-alipay{
		color: #01aaef;
	}
	.con{
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: 24upx;
		color: #909399;
		.tit{
			font-size: 32upx;
			color: #303133;
			margin-bottom: 4upx;
		}
	}
}
.submit{
		width: 630upx;
		height: 80upx;
		background: #fa436a;
		color: #fff;
		font-size: 32upx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 60upx auto 30upx;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219,63,96,.4);
	}
</style>
