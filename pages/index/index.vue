<template>
	<view class="content">
		<view class="wrap">
			<m-swiper :swiperList="swiperList"></m-swiper>
		</view>
		<view class="search">
			<search-box />
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<cate :cateList="cateList" />
		</view>
		<!-- 猜你喜欢 -->
		<title-header :title="title" :subtitle="subtitle" />

		<!-- 商品展示 -->
		<product :productList="productList" />
		<u-loadmore :status="status" margin-top="50" margin-bottom="30" />
	</view>
</template>

<script>
	import mSwiper from '@/components/m-swiper/m-swiper.vue'
	import searchBox from '@/components/search-box/search-box.vue'
	import cate from '@/components/cate/cate.vue'
	import titleHeader from '@/components/title-header/title-header.vue'
	import product from '@/components/product/product.vue'
	export default {
		data() {
			return {
				status: 'loadmore',
				pageOptions: {
					page: 1,
					size: 10
				},
				pageSize: 0,
				total: 0,
				title: '猜你喜欢',
				subtitle: 'Guess Like You It',
				swiperList: [],
				cateList: [{
						image: '/static/temp/c3.png',
						title: '环球美食'
					},
					{
						image: '/static/temp/c5.png',
						title: '个护美妆'
					},
					{
						image: '/static/temp/c6.png',
						title: '营养保健'
					},
					{
						image: '/static/temp/c7.png',
						title: '家具厨卫'
					},
					{
						image: '/static/temp/c8.png',
						title: '速食生鲜'
					}
				],
				productList: []
			}
		},
		components: {
			mSwiper,
			searchBox,
			cate,
			titleHeader,
			product
		},
		onLoad() {
		
		},
		onShow() {
			this.$login.wxLoginInit(()=>{
				console.log("登录结束")
			})
			this.getSwiperList()
			this.pageOptions = {
				page: 1,
				size: 10
			}
			this.getProductList()
		},
		onPullDownRefresh() {
			this.swiperList = []
			this.getSwiperList()
			this.productList = []
			this.pageOptions = {
				page: 1,
				size: 10
			}
			this.getProductList()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			this.pageSize = this.total / this.pageOptions.size
			if (this.pageOptions.page < this.pageSize) {
				this.status = 'loading';
				this.pageOptions = {
					page: this.pageOptions.page + 1,
					size: 10
				}
				this.getProductList()

			} else {
				this.status = 'nomore';
			}
		},
		methods: {
			async getSwiperList() {
				let res = await this.$u.api.getSwiper()
				this.swiperList = res.data
			},
			async getProductList() {
				let res = await this.$u.api.getGoodsList(this.pageOptions)
				this.status = 'nomore'
				let goodsArr = res.data.data
				if (this.pageOptions.page === 1) {
					this.productList = goodsArr
				} else {
					this.productList = [...this.productList, ...goodsArr]
				}
				this.total = res.data.total
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
	}

	.content {
		.wrap {
			height: 400rpx;
			position: relative;
		}

		.search {
			position: absolute;
			top: 60rpx;
			left: 0;
			right: 0;
		}

		.cate-section {
			margin-top: -20upx;
			border-radius: 20upx 20upx 0 0;
			overflow: hidden;
			z-index: 99;
			position: relative;
		}
	}
</style>
