<template>
	<view class="productList" :productList="productList">
		<view class="item-box" v-for="(item,index) in productList" :key="index" @click="gotoProduct(item.id)">
			<view class="img-wrapper">
				<image :src="item.spu_head_img" mode="aspectFill" class="img"/>
			</view>
			
			<view class="desc-box">
				<text class="title">{{item.spu_name}}</text>
				<text class="price">￥{{item.show_price}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			productList:{
				type:Array
			}
		},
		name:"product",
		data() {
			return {
				
			};
		},
		methods:{
			gotoProduct(id){
				uni.navigateTo({
					url:'/pages/product/product?id='+id,
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
.productList{
	padding: 0 30upx;
	background-color: #fff;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	
	.item-box{
		width: 48%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 40upx;
		 &:nth-child(2n+1){
			 margin-right: 4%;
		 }
		 .img-wrapper{
			 background-color: #f3f3f3;
			 width: 100%;
			 height: 330upx;
			 overflow: hidden;
			  border-radius: 6upx;
			 .img{
				 width: 100%;
				 height: 100%;
			 }
		 }
		 
		 .desc-box{
			  width: 100%;
			 display: flex;
			 flex-direction: column;
			 align-items: flex-start;
			.title{
				width: 100%;
				font-size: 32upx;
				color: #303133;
				line-height: 80upx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.price{
				font: 32upx;
				color: #fa436a;
				line-height: 1;
			}
		 }
	}
}
</style>
