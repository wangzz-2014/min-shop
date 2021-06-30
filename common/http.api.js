const install = (Vue, vm) => {
	let api = {}
	//登录
	api.login = params => vm.$u.post('api/auth/min_chat_login', params)
	//获取地址列表
	api.getaddressList = params => vm.$u.get('api/customer/address/list',params)
	//添加地址
	api.addressAdd = params => vm.$u.post('api/customer/address', params)
	//修改地址
	api.addressUpdate = (id, params) => vm.$u.put('api/customer/address/' + id, params)
	//删除地址
	api.addressDel = id => vm.$u.delete('api/customer/address/'+id)
	
	//获取轮播图列表
	api.getSwiper = params => vm.$u.get('api/banner/list/1')
	
	//获取商品列表
	api.getGoodsList = params => vm.$u.get('api/goods/list',params)
	//获取商品详情
	api.getProductByIdDetail = id => vm.$u.get('api/goods/get',id)
	//获取商品sku
	api.getSku = params => vm.$u.post('api/goods/get_sku',params)
	//获取商品分类
	api.getCategory = id => {
		if(id){
			return vm.$u.get('api/goods/classify/?id='+id)
		}else{
			return vm.$u.get('api/goods/classify')
		}
	}
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = api
}

export default {
	install
}
