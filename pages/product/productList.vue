<template>
	<view class="content">
		<view class="navBar">
			<view class="nav-item" :class="{current:filterIndex ===0}" @click="tabClick(0)" >综合排序</view>
			<view class="nav-item" :class="{current:filterIndex ===1}" @click="tabClick(1)" >销量优先</view>
			<view class="nav-item three" :class="{current:filterIndex === 2}" @click="tabClick(2)" >
				<text>价格</text>
				<view class="p-box">
					<text :class="{active:filterIndex === 2 && priceOrder === 1}" class="yticon icon-shang"></text>
					<text :class="{active:filterIndex === 2 && priceOrder === 2}" class="yticon xia icon-shang"></text>
				</view>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<product :productList="productList"/>
		<!-- 加载更多 -->
		<u-loadmore :status="status" margin-top="50" margin-bottom="30" />
		<!-- 右侧筛选 -->
		
	</view>
</template>

<script>
	import product from '@/components/product/product.vue'
	export default {
		components:{
			product
		},
		data() {
			return {
				productList:[],
				pageOptions:{
					page:1,
					size:10
				},
				total:0,
				pageSize:0,
				status:'loadmore',
				//分类索引，默认是0 综合排序
				filterIndex:0,
				//价格索引 , 1 正序  2 倒叙 
				priceOrder:0,
				filterType:'multiple',
				categoryId:'',
				spu_name:''
			};
		},
		onLoad(options) {
			this.categoryId = options.id
			this.spu_name = options.spu_name
			this.getProductList()
		},
		onPullDownRefresh() {
			this.productList = []
			this.pageOptions = {
				page:1,
				size:10
			}
			this.getProductList()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			this.pageSize = this.total / this.pageOptions.size
			if(this.pageSize>this.pageOptions.page){
				this.status = 'loading'
				this.pageOptions = {
					page:this.pageOptions.page + 1,
					size:10
				}
				this.getProductList()
			}else{
				this.status = 'nomore'
			}
		},
		methods:{
			async getProductList(){
				let res = await this.$u.api.getGoodsList(this.pageOptions,this.filterType,this.categoryId,this.spu_name)
				this.status = 'nomore'
				let goodsArr = res.data.data
				if(this.pageOptions.page===1){
					this.productList = goodsArr
				}else{
					this.productList = [...this.productList,...goodsArr]
				}
				this.total = res.data.total
			},
			tabClick(index){
				this.filterType = 'multiple'
				this.filterIndex = index
				if(index===1){
					this.filterType = 'sales_desc'
				}else if(index === 2){
					this.priceOrder = this.priceOrder === 1 ? 2 : 1
					if(this.priceOrder === 1){
						this.filterType = 'price_asc'
					}
					if(this.priceOrder === 2){
						this.filterType = 'price_desc'
					}
				}else{
					this.priceOrder = 0
				}
				this.pageOptions = {
					page:1,
					size:10
				}
				this.getProductList()
			}
		}
	}
</script>

<style lang="scss" scoped>
page,.content{
	background: #f8f8f8;
	min-height: 100vh;
}
.content{
	padding-top: 96upx;
}
.navBar{
	display: flex;
	position: fixed;
	left: 0;
	top: var(--window-top);
	width: 100%;
	height: 80upx;
	background: #fff;
	box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
	z-index: 10;
	
	.nav-item{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 30upx;
		color: #303133;
		position: relative;
		
		&.current{
			color: #fa436a;
			&:after{
				content: '';
				width: 120upx;
				height: 0;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				border-bottom: 4upx solid #fa436a;
			}
		}
	}
	.p-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		.yticon{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 30upx;
			height: 14upx;
			line-height: 1;
			margin-left: 4upx;
			font-size: 26upx;
			color: #888;
			&.active{
				color: #fa436a;
			}
		}
		.xia{
			transform: scaleY(-1);
		}
	}
	
}
</style>
