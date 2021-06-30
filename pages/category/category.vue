<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view class="f-item b-b" v-for="(item,index) in flist" @click="tabtap(item)" :key="item.id" :class="{active:item.id === currentId}">{{item.classify_name}}</view>
		</scroll-view>
		<scroll-view scroll-y class="right-aside" scroll-with-animation  :scroll-top="tabScrollTop">
			<view class="s-list" v-for="(sitem,index) in slist" :key="sitem.id" :id="'main-'+sitem.id">
				<text class="s-item">{{sitem.classify_name}}</text>
				<view class="t-list">
					<view class="t-item" v-for="titem in sitem.children" :key="titem.id" @click="navToList(titem.id)" v-if="titem.pid === sitem.id">
						<image :src="titem.icon"/>
						<text>{{titem.classify_name}}</text>
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
				currentId:1,
				id:'',
				sizeCalcState:false
			}
		},
		onLoad() {
			this.getCategory()
		},
		methods: {
			async getCategory(){
				try{
					let res = await this.$u.api.getCategory()
					this.flist = res.data
					this.id = this.flist[0].id
					this.getTwoCategory()
				}catch(e){
					//TODO handle the exception
					if(res.code>=400 || ress.code>= 400){
						console.log(e)
						return 
					}
				}
			},
			//获取二级分类
			async getTwoCategory(){
				let ress = await this.$u.api.getCategory(this.id)
				this.slist = ress.data
			},
			tabtap(item){
				this.currentId = item.id
				this.id = item.id
				this.getTwoCategory()
				let index = this.slist.findIndex(sitem=>sitem.pid===item.id)
				this.tabScrollTop = 0
			},
			//跳转到商品列表页面
			navToList(id){
				uni.navigateTo({
					url:'/pages/product/productList?id='+id
				})
			}
			//计算右侧栏每个tab的高度
			// calcSize(){
			// 	let h = 0
			// 	this.slist.forEach(item=>{
			// 		let view = uni.createSelectorQuery().select("#main-"+item.id)
			// 		view.fields({
			// 			size:true
			// 		},data=>{
			// 			item.top = h
			// 			h+=data.height
			// 			item.bottom=h
			// 		}).exec()
			// 	})
			// 	this.sizeCalcState = true
			// }
			
		}
	}
</script>

<style lang="scss" scoped>
page,.content{
	height: 100%;
}
.content{
	background-color: #f8f8f8;
	display: flex;
}
.left-aside{
	flex-shrink: 0;
	width: 200upx;
	height: 100%;
	min-height: 100vh;
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
	height: 100vh;
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
