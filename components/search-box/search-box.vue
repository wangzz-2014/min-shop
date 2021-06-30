<template>
	<view class="mp-search-box">
		<input class="ser-input" type="text" placeholder="输入关键字搜索" />
	</view>
</template>

<script>
	export default {
		name:"search-box",
		data() {
			return {
				keyword:""
			};
		}
	}
</script>

<style lang="scss" scoped>
	.mp-search-box{
		position:absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;
		.ser-input{
			flex:1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color:#606266;
			border-radius: 20px;
			background: rgba(255,255,255,.6);
		}
	}
</style>
