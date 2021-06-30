<template>
	<view class="content">
		<view class="list-cell" :class="border" @click="eventClick" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-icon yticon" :class="icon" v-if="icon" :style="[{
				color:iconColor
			}]"></text>
			<text class="cell-tit clamp">{{title}}</text>
			<text v-if="tips" class="cell-tips">{{tips}}</text>
			<text class="cell-more yticon" :class="typeList[navigateType]"></text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"list-cell",
		props:{
			icon:{
				type:String,
				default:''
			},
			title:{
				type:String,
				default:''
			},
			tips:{
				type:String,
				default:''
			},
			navigateType:{
				type:String,
				default:'right'
			},
			border:{
				type:String,
				default:'b-b'
			},
			hoverClass:{
				type:String,
				default:'cell-hover'
			},
			iconColor:{
				type:String,
				default:'#333'
			}
		},
		data() {
			return {
				typeList:{
					left:'icon-zuo',
					right:'icon-you',
					up:'icon-shang',
					down:'icon-xia'
				}
			};
		},
		methods:{
			eventClick(){
				this.$emit('eventClick')
			}
		}
	}
</script>

<style lang="scss">
.icon .list-cell.b-b:after{
	left: 90upx;
}
.list-cell{
	display: flex;
	align-items: baseline;
	padding: 20upx 30upx;
	line-height: 60upx;
	position: relative;
	
	&.cell-hover{
		background: #fafafa;
	}
	&.b-b:after{
		left: 30upx;
	}
	
	.cell-icon{
		align-self: center;
		width: 56upx;
		max-height: 60upx;
		font-size: 38upx;
	}
	
	.cell-more{
		align-self: center;
		font-size: 30upx;
		color: #606266;
		margin-left: 10upx;
	}
	.cell-tit{
		flex: 1;
		font-size: 28upx;
		color: #303133;
		margin-right: 10upx;
	}
	.cell-tips{
		font-size: 26upx;
		color: #909399;
	}
}
</style>
