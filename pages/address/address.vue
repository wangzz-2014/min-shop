<template>
	<view class="content">
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in addressList" :key="item.id" @click="click" @open="open" :options="options">
			<view class="list b-b" @click="checkAddress(item)">
				<view class="wrapper">
					<view class="address-box">
						<view class="box-top">
							<block>
								<block v-for="(tag, index) in item.tags" :key="index">
									<text class="tag">{{ tag }}</text>
								</block>
								<text v-if="item.is_default" class="tag">默认</text>
							</block>

							<view class="address">{{ item.address }}</view>
						</view>
						<text class="addressName">{{ item.detailed }}</text>
						<view class="u-box">
							<text class="name">{{ item.name }}</text>
							<text class="mobile">{{ item.phone }}</text>
						</view>
					</view>
					<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
				</view>
			</view>
		</u-swipe-action>
		<u-loadmore :status="status" margin-top="50" margin-bottom="30" />
		<button class="add-btn" @click="addAddress('add')">+ 新增地址</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			source: 0,
			addressList: [],
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			pageOptions: {
				page: 1,
				size: 10
			},
			total: 0,
			pageSize: 0,
			status: 'loadmore',
		};
	},

	onPullDownRefresh() {
		this.addressList = [];
		this.pageOptions = {
			page: 1,
			size: 10
		};
		this.getaddressList();
		uni.stopPullDownRefresh();
	},
	onReachBottom() {
		this.pageSize = this.total / this.pageOptions.size;
		if (this.pageOptions.page < this.pageSize) {
			this.status = 'loading';
			this.pageOptions = {
				page: this.pageOptions.page + 1,
				size: 10
			};
			this.getaddressList();
		} else {
			this.status = 'nomore';
		}
	},
	onShow() {
		this.pageOptions = {
			page: 1,
			size: 10
		};
		this.getaddressList();
	},
	methods: {
		async click(index, index1) {
			let res = await this.$u.api.addressDel(this.addressList[index].id);
			if (res.data) {
				this.$u.toast(`删除地址成功`);
				this.pageOptions = {
					page: 1,
					size: 10
				};
				this.getaddressList();
				uni.pageScrollTo({
				    scrollTop: 0,
				    duration: 300
				});
			}
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.addressList[index].show = true;
			this.addressList.map((val, idx) => {
				if (index != idx) this.addressList[idx].show = false;
			});
		},
		//提交订单选择收货地址
		checkAddress(item) {
			if (this.source == 1) {
				//this.$api.prePage()获取上一页实例，在APP.vue定义
				this.$api.prePage().addressData = item;
				uni.navigateBack();
			}
		},
		addAddress(type, item) {
			uni.navigateTo({
				url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
			});
		},
		//添加或修改成功后的回调
		async getaddressList() {
			let res = await this.$u.api.getaddressList(this.pageOptions);
			this.status = 'loading';
			let addresslist = res.data.data.map(item => ({
				...item,
				address: item.province + item.city + item.area,
				show: false
			}));
			if (this.pageOptions.page === 1) {
				this.addressList = addresslist;
			} else {
				this.addressList = [...this.addressList, ...addresslist];
			}

			this.total = res.data.total;
		}
	}
};
</script>

<style lang="scss">
page {
	padding-bottom: 120upx;
}
.content {
	position: relative;
}
.tip {
	width: 100%;
	height: 100upx;
	text-align: center;
	font-size: 24upx;
	line-height: 100upx;
	color: #666;
}
.list {
	display: flex;
	align-items: center;
	padding: 20upx 30upx;
	background: #fff;
	position: relative;
}
.wrapper {
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;

	.address-box {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		.box-top {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.tag {
				font-size: 24upx;
				color: #fa436a;
				margin-right: 10upx;
				border: 1px solid #ffb4c7;
				border-radius: 4upx;
				padding: 4upx 10upx;
				line-height: 1;
			}
			.address {
				font-size: 28upx;
				color: #909399;
			}
		}
		.addressName {
			font-size: 30upx;
			color: #303133;
			margin-top: 16upx;
		}
		.u-box {
			font-size: 28upx;
			color: #909399;
			margin-top: 16upx;
			.name {
				margin-right: 30upx;
			}
		}
	}
}
.icon-bianji {
	display: flex;
	align-items: center;
	height: 80upx;
	font-size: 40upx;
	color: #909399;
	padding-left: 30upx;
}
.add-btn {
	position: fixed;
	left: 30upx;
	right: 30upx;
	bottom: 16upx;
	z-index: 99;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 690upx;
	height: 80upx;
	font-size: 32upx;
	color: #fff;
	background-color: #fa436a;
	border-radius: 10upx;
	box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
