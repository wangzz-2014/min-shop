<template>
	<view class="content">
		<!-- 购物车没有数据时 -->
		<view class="empty" v-if="empty === true || !hasLogin">
			<u-empty text="购物车为空" mode="car">
				<u-button v-if="hasLogin" slot="bottom" @click="gotoIndex" open-type="switchTab" type="error" :custom-style="customStyle" plain size="medium">随便逛逛</u-button>
				<u-button v-else slot="bottom" type="error" plain size="medium" :custom-style="customStyle">去登陆</u-button>
			</u-empty>
		</view>
		<!-- 购物车列表 -->
		<view class="cart-list" v-else>
			<block v-for="(item,index) in cartList" :key="index">
				<view class="cart-item" :class="{'b-b':index !== cartList.length-1}">
					<!-- 左侧图片与复选框 -->
					<view class="image-wraper">
						<image :src="item.image" mode="aspectFill" :lazy-load="true"/>
						<view class="yticon icon-xuanzhong2 checkbox" :class="{checked:item.checked}" @click="check('item',index)"></view>
					</view>
					<!-- 右侧商品数量规格信息 -->
					<view class="item-right">
						<text class="title">{{item.spu_name}}</text>
						<text class="attr" v-if="item.sku_name">{{item.sku_name}}</text>
						<text class="price">￥{{item.price/100}}</text>
						<!-- 数量步进器 -->
						<u-number-box :input-height="60" :min="1" :max="100" v-model="item.count" :index="index" @change="valChange"></u-number-box>
					</view>
					<text class="yticon icon-fork del-btn" @click="delCartItem(index)"></text>
				</view>
			</block>
		</view>
		
		<!-- 底部结算按钮 -->
		<view class="action-section" v-if="cartList.length>0">
			<view class="checkbox">
				<image :src="allChecked ? '/static/selected.png' : '/static/select.png'" mode="aspectFit" @click="check('all')"/>
				<view class="clear-btn" :class="{show:allChecked}" @click="clearCart">清空</view>
			</view>
			<view class="total-box">
				<text class="price">总价：￥{{totalPrice/100}}</text>
				<text class="coupon">已优惠<text>￥0</text>元</text>
			</view>
			<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			customStyle: {
					color: '#fa436a !important;'
				},
			empty: false,
			hasLogin:true,
			cartList:[],
			totalPrice:0,
			allChecked:true
		};
	},
	onLoad() {
		this.getCartList()
	},
	onShow() {
		this.getCartList()
	},
	methods: {
		getCartList(){
			if(uni.getStorageSync('cart')){
				this.cartList = JSON.parse(uni.getStorageSync('cart'))
				if(this.cartList.length>0){
					this.empty = false
					this.cartList.map(item=>(
						item.checked = true
					))
					//计算总价
					this.getTotalPrice()
				}else{
					this.empty = true
				}
			}else{
				this.empty = true
			}
		},
		//计算总价
		getTotalPrice(){
			this.totalPrice = this.cartList.reduce((prev,cur)=>{
				if(cur.checked){
					return prev += cur.price*cur.count
				}else{
					return prev
				}
			},0)
		},
		//修改商品数量
		valChange(obj){
			let index = obj.index
			let value = obj.value
			this.cartList[index].count = value
			this.getTotalPrice()
			uni.setStorageSync('cart',JSON.stringify(this.cartList))
		},
		// 右侧删除按钮
		delCartItem(index){
			uni.showModal({
				content:'确定删除该商品吗？',
				success:(res)=>{
					if(res.confirm){
						this.cartList.splice(index,1)
						uni.showToast({
							title:'删除成功',
							icon:"success"
						})
						uni.setStorageSync('cart',JSON.stringify(this.cartList))
						this.getCartList()
					}else if (res.cancel){
						return
					}
				}
			})
		},
		clearCart(){
			uni.showModal({
				content:'确定清空购物车吗？',
				success:(res)=>{
					if(res.confirm){
						this.cartList = []
						uni.showToast({
							title:'清空成功',
							icon:"success"
						})
						uni.clearStorageSync('cart')
						this.getCartList()
						this.getTotalPrice()
					}else if (res.cancel){
						return
					}
				}
			})
		},
		//商品的选择按钮
		check(str,index){
			if(str==='item'){
				//单个商品选择状态
				// this.cartList[index].checked = !this.cartList[index].checked
				
				this.$set(this.cartList[index],"checked",!this.cartList[index].checked)
			}else{
				//全部商品的选择状态
				const checked = !this.allChecked
				this.cartList.forEach(item=>(
					item.checked = checked
				))
			}
			let result = this.cartList.every(item=>{
				return item.checked
			})
			this.allChecked = result
			this.getTotalPrice()
		},
		// 购物车无商品时跳转首页
		gotoIndex(){
			uni.switchTab({
				url:'/pages/index/index'
			})
		},
		//创建订单
		createOrder(){
			let goodsList = []
			this.cartList.forEach(item=>{
				if(item.checked){
					goodsList.push({
						sku_id:item.id,
						amount:item.count
					})
				}
			})
			uni.navigateTo({
				url:'/pages/order/createOrder'
			})
			uni.setStorageSync('preList',JSON.stringify(goodsList))
		}
	}
};
</script>

<style lang="scss" scoped>
	page,.content{
		height: 100vh;
	}
	// 空白页
	.empty{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	// 购物车列表
	.cart-list{
		margin-bottom: 134upx;
	}
	.cart-item{
		display: flex;
		padding: 30upx 40upx;
		position: relative;
		.image-wraper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;
			image{
				width: 100%;
				height: 100%;
				border-radius: 8upx;
			}
		}
		.checkbox{
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 9;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: #C0C4CC;
			background: #fff;
			border-radius: 50px;
		}
		
		.item-right{
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;
			justify-content: space-between;
			
			.title,.price{
				font-size: 30upx;
				color: #303133;
				height: 40upx;
				line-height: 40upx;
			}
			.title{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.price{
				height: 50upx;
				line-height: 50upx;
			}
			.attr{
				font-size: 26upx;
				color: #909399;
				height: 50upx;
				line-height: 50upx;
			}
		}
		.del-btn{
			padding: 0upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: #909399;
		}
	}
	
	// 底部结算按钮
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position: fixed;
		bottom: 30upx;
		left: 30upx;
		z-index: 95;
		width: 690upx;
		height: 100upx;
		display: flex;
		align-items: center;
		padding: 0 30upx;
		border-radius: 16upx;
		box-shadow: 0 0 20upx 0 rgba($color: #000000, $alpha: 0.5);
		background: #fff;
		.checkbox{
			height: 52upx;
			position: relative;
			
			image{
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}
		
		.clear-btn{
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: 28upx;
			color: #fff;
			background: #c0c4cc;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: 0.2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;
			
			.price{
				font-size: 32upx;
				color: #303133;
			}
			.coupon{
				font-size: 24upx;
				color: #909399;
				text{
					color: #303133;
				}
			}
		}
		.confirm-btn{
			height: 76upx;
			line-height: 76upx;
			font-size: 30upx;
			background: #fa436a;
			box-shadow: 1px 2px 5px rgba(217,60,93,.7);
			padding: 0 30upx;
			margin: 0;
			border-radius: 100px;
			
		}
	}
	.action-section .checkbox.checked,.cart-item .checkbox.checked{
		color: #fa436a;
	}
</style>
