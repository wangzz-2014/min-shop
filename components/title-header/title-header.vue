<template>
	<view class="like-header">
		<view class="left">
			<image class="img1" src="/static/temp/h1.png"/>
			<view class="title-box">
				<text class="title">{{title}}</text>
				<text class="subtitle">{{subtitle}}</text>
			</view>
		</view>
		<image class="img2" src="/static/temp/more.png"/>
	</view>
</template>

<script>
	export default {
		name:"title-header",
		props:{
			title:{
				type:String
			},
			subtitle:{
				type:String
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.like-header{
	margin-top: 20upx;
	display: flex;
	align-items: center;
	height: 140upx;
	padding: 8upx 30upx;
	background-color: #fff;
	justify-content: space-between;
	.left{
		display: flex;
		align-items: center;
		.img1{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}
		.title-box{
			flex-shrink: 1;
			display: flex;
			flex-direction: column;
			.title{
				font-size: 34upx;
				color: #333;
				font-weight: bold;
			}
			.subtitle{
				font-size: 24upx;
				color: #666;
			}
		}
	}
	
	.img2{
		width: 60upx;
		height: 60upx;
	}
}
</style>
