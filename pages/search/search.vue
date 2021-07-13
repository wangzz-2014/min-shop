<template>
	<view class="content">
		<u-search placeholder="请输入关键字" v-model="keyword" animation height="70" @custom="searchProduct" @search="searchProduct"></u-search>
		<view class="keyword-box">
			<text class="title">搜索记录</text>
			<view class="keyword-item" v-for="(item, index) in keywordList" :key="index">
				<view class="text">
					<text @click="reKeyword(item)">{{ item }}</text>
					<u-icon name="close" color="#fa436a" size="20" @click="deleteKeyword(index)"></u-icon>
				</view>
				<u-line />
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			keywordList: [],
		};
	},
	onLoad() {
		if(uni.getStorageSync('keywordList')){
			this.keywordList = JSON.parse(uni.getStorageSync('keywordList'))
		}
	},
	methods: {
		searchProduct(value) {
			if(value==''){
				uni.showToast({
					title:'请输入关键字',
					icon:"none"
				})
				return
			}
			this.keyword = value
			this.keywordList.unshift(value)
			if(this.keywordList.length>10){
				this.keywordList = this.keywordList.splice(0,10)
			}
			uni.navigateTo({
				url:'/pages/product/productList?spu_name='+this.keyword
			})
			this.keyword = ''
			uni.setStorageSync('keywordList',JSON.stringify(this.keywordList))
			
		},
		deleteKeyword(index){
			this.keywordList.splice(index,1)
			uni.setStorageSync('keywordList',JSON.stringify(this.keywordList))
		},
		reKeyword(keyword){
			if(keyword){
				this.keyword = keyword
				this.searchProduct(this.keyword)
			}
			
		}
	}
};
</script>

<style lang="scss" scoped>
page,
content {
	background-color: #fff;
	height: 100%;
}
.content {
	padding: 20upx 30upx;
	display: flex;
	flex-direction: column;
}
.keyword-box {
	padding-top: 30upx;
	display: flex;
	flex-direction: column;
}
.title{
	font-size: 28upx;
	color: #909399;
	margin-bottom: 20upx;
}
.keyword-item{
	height: 60upx;
	font-size: 26upx;
	color: #606266;
	padding: 10upx 20upx;
	align-items: center;
	.text{
		display: flex;
		justify-content: space-between;
		line-height: 30upx;
		padding-bottom: 10upx;
	}
}
</style>
