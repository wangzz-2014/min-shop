<template>
	<view class="content">
		<!-- 支付结果 -->
		<view class="payStatus">
			<u-icon v-if="payStatus" name="checkmark-circle-fill" size="160" color="#59BB73"></u-icon>
			<u-icon v-else name="close-circle-fill" size="160" color="#E74940"></u-icon>
			<text class="tit">支付{{payStatus ? '成功' : '失败'}}</text>
		</view>
		
		<!-- 页面跳转 -->
		<view class="jump">
			<navigator :url="'/pages/order/order?status='+status" open-type="redirect" class="mix-btn">查看订单</navigator>
			<navigator url="/pages/index/index" open-type="switchTab" class="mix-btn gotoIndex">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				payStatus:false,
				status:0
			}
		},
		onLoad(options) {
			let payStatus = options.payStatus
			console.log(options)
			if(payStatus==="requestPayment:ok"){
				this.payStatus = true
				uni.setNavigationBarTitle({
				    title: '支付成功'
				});
				this.status = 2
			}else{
				this.payStatus = false
				uni.setNavigationBarTitle({
				    title: '支付失败'
				});
				this.status = 1
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.payStatus{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 100upx;
		.tit{
			font-size: 38upx;
			color: #303133;
		}
	}
	.jump{
		padding-top: 100upx;
		.mix-btn{
			margin-top: 30upx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 600upx;
			height: 80upx;
			font-size: 32upx;
			color: #fff;
			background: #fa436a;
			border-radius: 10upx;
			&.gotoIndex{
				color: #303133;
				background: #fff;
				border: 1px solid #ccc;
			}
		}
	}
</style>
