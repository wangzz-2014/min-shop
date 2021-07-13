import {request} from '@/utils/myRequest.js'

//登录
export const login = (data) => request({
	url:'/api/auth/min_chat_login',
	method:"POST",
	isNoToken:true,
	data
})

//刷新token
export const refreshToken = (data) => request({
	url:'/api/auth/refresh_token',
	method:'POST',
	isNoToken:true,
	data
})

//获取轮播图列表
export const getSwiper = (data) => request({
	url:'/api/banner/list/1',
	isNoToken:true,
	data
})

//获取商品列表
export const getGoodsList = (params,sort,classify_id,spu_name) => {
	if(classify_id){
		if(sort){
			return request({
				url:'/api/goods/list?classify_id='+classify_id+'&sort='+sort,
				isNoToken:true,
				params
			})
		}else{
			return request({
				url:'/api/goods/list?classify_id='+classify_id,
				isNoToken:true,
				params
			})
		}
	}else if(spu_name){
			return request({
				url:'/api/goods/list?spu_name='+spu_name,
				isNoToken:true,
				params
			})
		}else{
			return request({
				url:'/api/goods/list',
				isNoToken:true,
				params
			})
		}
} 

//获取地址列表
export const getaddressList = (data) => request({
	url:'/api/customer/address/list',
	data
})

//添加地址
export const addressAdd = () => request({
	
})
