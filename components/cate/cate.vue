<template>
	<view class="cateList" :cateList="cateList">
		<view class="cate-item" v-for="(item,index) in cateList" :key="index">
			<image :src="item.image"/>
			<text>{{item.title}}</text>
		</view>
	</view>
	
</template>

<script>
	export default {
		name:"cate",
		props:{
			cateList:{
				type:Array
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.cateList{
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-wrap: wrap;
	padding: 30upx 22upx;
	background-color: #fff;
	.cate-item{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 22upx;
		color: #333;
		
		image{
			width: 88upx;
			height: 88upx;
			opacity: 0.6;
			border-radius: 50%;
			margin-bottom: 14upx;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.7);
		}
	}
}
</style>
