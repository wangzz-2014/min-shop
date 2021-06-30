<template>
	<view class="content">
		<u-form :model="addressData" ref="uForm">
				<u-form-item label-width="150" label="联系人" prop="name"><u-input type="text" v-model="addressData.name" placeholder="收货人姓名" placeholder-class="placeholder" /></u-form-item>
				<u-form-item label-width="150" prop="phone" label="手机号"><u-input type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder"/></u-form-item>
				<u-form-item label-width="150" label="地址" @tap="openPicker">
					<u-picker v-model="showPicker" @confirm="confirmAddress" mode="region" :params="params">
					</u-picker>
					<view>{{addressData.province+addressData.city+addressData.area}}</view>
				</u-form-item>
				<u-form-item prop="detailed" label-width="150" label="门牌号">
					<u-input type="type" v-model="addressData.detailed" placeholder="楼号、门牌" placeholder-class="placeholder"/>
				</u-form-item>
				<!-- <u-form-item label-width="150" label="标签">
					<u-checkbox-group @change="checkboxGroupChange">
						<u-checkbox v-model="item.checked" v-for="(item, index) in tagsList" :key="index" :name="item.name">
							{{ item.name }}
						</u-checkbox>
					</u-checkbox-group>
				</u-form-item> -->
				<u-form-item label-width="150" label="设为默认">
					<u-switch v-model="checked" slot="right" active-color="#fa436a" inactive-color="#eee" @change="changeStatus"></u-switch>
				</u-form-item>
			</u-form>
			<u-button :custom-style="customStyle" @click="confirm">提交</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				manageType:'add',
				params:{
					province: true,
					city: true,
					area: true
				},
				showPicker:false,
				checked:false,
				tagsList:[
					{
						name:'家',
						checked:false,
						disabled:false
					},
					{
						name:'学校',
						checked:false,
						disabled:false
					},
					{
						name:'公司',
						checked:false,
						disabled:false
					},
					{
						name:'快递柜',
						checked:false,
						disabled:false
					},
				],
				addressData:{
					name:'',
					phone:'',
					province:'',
					city:'',
					area:'',
					detailed:'',
					// tags:[],
					is_defaule:false
				},
				customStyle:{
					backgroundColor:'#fa436a',
					color: '#fff',
					margin: '30px auto'
					
				},
				rules:{
					name:[
						{
							required:true,
							message:'请填写收货人姓名',
							trigger:['blur','change']
						}
					],
					detailed:[
						{
							required:true,
							message:'请填写门牌号信息',
							trigger:['blur','change']
						}
					],
					phone:[
						{
							required: true, 
							message: '请输入正确的手机号码',
							trigger: ['change','blur'],
						},
						{
							validator:(rule,value,callback)=>{
								return this.$u.test.mobile(value)
							},
							message:'手机号码不正确',
							trigger:['change','blur']
						},
					]
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(options) {
			let title = '新增收货地址'
			if(options.type === 'edit'){
				title = '编辑收货地址'
				let mydata = JSON.parse(options.data)
				this.addressData = mydata
				this.id = mydata.id
				this.addressData.province = mydata.province
				this.addressData.city = mydata.city
				this.addressData.area = mydata.area
				this.checked = mydata.is_default
			}
			this.manageType = options.type
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			openPicker(){
				this.showPicker = true
			},
			confirmAddress(item){
				this.addressData.province = item.province.label 
				this.addressData.city = item.city.label
				this.addressData.area = item.area.label
			},
			checkboxGroupChange(arr){
				this.addressData.tags = arr
				
			},
			changeStatus(status){
				this.addressData.is_defaule = status
			},
			//提交表单
			 confirm(){
				this.$refs.uForm.validate( async valid=>{
					if(valid){
						let data = this.addressData
						if(!data.province){
							this.$msg('请选择所在位置');
							return;
						}
						if(this.manageType == 'add'){
							let res = await this.$u.api.addressAdd(data)
							if(res.data){
								uni.showToast({
									title:'地址添加成功',
									icon:'success',
									duration:1000
								})
								uni.navigateBack()
							}
						}else{
							let res = await this.$u.api.addressUpdate(this.id,data)
							console.log(res)
							if(res.data){
								uni.showToast({
									title:'地址修改成功',
									icon:'success',
									duration:1000
								})
								uni.navigateBack()
							}
						}
					}else{
						uni.showToast({
							title:'请检查输入',
							icon:'loading'
						})
						return false
					}
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #f8f8f8;
	padding-top: 16upx;
}
.content{
	background: #fff;
	padding: 0 30upx;
}
</style>

