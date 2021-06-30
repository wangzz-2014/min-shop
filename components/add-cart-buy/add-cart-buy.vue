<template>
	<view class="page-bottom">
		<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
			<text class="yticon icon-xiatubiao--copy"></text>
			<text>首页</text>
		</navigator>
		<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
			<text class="yticon icon-gouwuche"></text>
			<text>购物车</text>
		</navigator>
		<view class="p-b-btn" :class="{active:favorite}" @click="toFavorite">
			<text class="yticon icon-shoucang"></text>
			<text>收藏</text>
		</view>
		
		<view class="action-btn-group">
			<button type="primary" class=" action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
			<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
		</view>
	</view>
</template>

<script>
	export default {
		name:"add-cart-buy",
		data() {
			return {
				favorite: true,
			};
		},
		methods:{
			toFavorite(){
				this.favorite = !this.favorite
			},
			buy(){
				// console.log('立即购买')
				// uni.navigateTo({
				// 	url:'/pages/order/createOrder'
				// })
				this.$emit('listenBuy')
			},
			addCart(){
				this.$emit('listenAddCart')
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-bottom{
	position: fixed;
	left: 30upx;
	bottom: 30upx;
	z-index: 95;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 690upx;
	height: 100upx;
	background: rgba($color: #fff, $alpha: 0.9);
	box-shadow: 0 0 20upx 0 rgba($color: #000000, $alpha: 0.5);
	border-radius: 16upx;
	
	.p-b-btn{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #606266;
		width: 96upx;
		height: 80upx;
		
		.yticon{
			font-size: 40upx;
			line-height: 48upx;
			color: #909399;
		}
		
		&.active,&.active .yticon{
			color: #fa436a;
		}
		.icon-fenxiang2{
			font-size: 42upx;
			transform: translateY(-2upx);
		}
		.icon-shoucang{
			font-size: 46upx;
		}
	}
	.action-btn-group{
		display: flex;
		height: 76upx;
		border-radius: 100px;
		overflow: hidden;
		box-shadow: 0 20upx 40upx -16upx #fa436a;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		background: linear-gradient(to right,#ffac30,#fa436a,#f56c6c);
		margin-left: 20upx;
		position: relative;
		
		&:after{
			content: '';
			position: absolute;
			top: 50%;
			right: 50%;
			transform: translateY(-50%);
			height: 28upx;
			width: 0;
			border-right: 1px solid rgba(255,255,255,.5);
		}
		.action-btn{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 180upx;
			height: 100%;
			font-size: 28upx;
			padding: 0;
			border-radius: 0;
			background: transparent;
		}
	}
}
</style>
