<template>
	<view class="content">
		<u-search placeholder="请输入关键字" v-model="keyword" animation height="70" @search="searchProduct"></u-search>
		<view class="keyword-box">
			<view class="keyword-item" v-for="(item,index) in keywordList" :key="index">
				<view class="">{{item}}</view>
				<u-line/>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword:'',
				keywordList:[]
			};
		},
		methods:{
			searchProduct(value){
				console.log(value)
			}
		}
	}
</script>

<style lang="scss" scoped>
page,content{
	background-color: #fff;
	height: 100%;
}
.content{
	padding: 20upx 30upx;
	display: flex;
	flex-direction: column;
}
.keyword-box{
	display: flex;
	flex-direction: column;
}
</style>
