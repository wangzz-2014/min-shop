<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view class="f-item b-b" v-for="(item,index) in flist" @click="tabtap(item)" :key="item.id" :class="{active:item.id === currentId}">{{item.name}}</view>
		</scroll-view>
		<scroll-view scroll-y class="right-aside" scroll-with-animation @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view class="s-list" v-for="item in slist" :key="item.id" :id="'main-'+item.id">
				<text class="s-item">{{item.name}}</text>
				<view class="t-list">
					<view class="t-item" v-for="titem in tlist" :key="titem.id" @click="navToList(item.id,titem.id)" v-if="titem.id===item.id">
						<image :src="titem.picture"/>
						<text>{{titem.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabScrollTop:0,
				flist:[],
				slist:[],
				tlist:[],
				currentId:1
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
page,.content{
	height: 100%;
	background-color: #f8f8f8;
}
.content{
	display: flex;
}
.left-aside{
	flex-shrink: 0;
	width: 200upx;
	height: 100%;
	background-color: #fff;
}
.f-item{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100upx;
	font-size: 28upx;
	color: #606266;
	position: relative;
	&.active{
		color: #fa436a;
		background-color: #f8f8f8;
		&::before{
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			height: 36upx;
			width: 8upx;
			background-color: #fa436a;
			border-radius: 0 4px 4px 0;
			opacity: .8;
		}
	}
}
.right-aside{
	flex: 1;
	overflow: hidden;
	padding-left: 20upx;
}
.s-item{
	display: flex;
	align-items: center;
	height: 70upx;
	padding-top: 8upx;
	font-size: 28upx;
	color: #303133;
}
.t-list{
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	background-color: #fff;
	padding-top: 12upx;
	&:after{
		content: '';
		flex: 99;
		height: 0;
	}
}
.t-item{
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 176upx;
	font-size: 26upx;
	color: #666;
	padding-bottom: 20upx;
	
	image{
		width: 140upx;
		height: 140upx;
	}
}
</style>
