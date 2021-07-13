import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		loginState: false,
		userInfo: uni.getStorageSync('user') || {
			"id": "",
			"created_at": "",
			"mini_openid": "",
			"union_id": "",
			"edges": {}
		},
		jwt_data:uni.getStorageSync('jwt_data') || {
			"expires_at":"",
			"refresh_expires_at":"",
			"refresh_token":"",
			"token":""
		},
		cart: uni.getStorageSync('cart') ? JSON.parse(uni.getStorageSync('cart')) : [],
		loginInitFn: []
	},
	getters: {},
	mutations: {
		jwtData(state,payload){
			state.jwt_data = payload
			uni.setStorageSync('jwt_data',payload)
		},
		loginInitFn(state, payload) {
			state.loginInitFn = [...state.loginInitFn, payload]
		},
		userLogin(state, payload) {
			// 登录状态
			state.loginState = true
			// 用户信息
			state.userInfo = payload
			// 缓存用户信息
			uni.setStorageSync('user', payload)
		},
		userLogout(state) {
			state.loginState = false
			state.userInfo = {
				name: '未知用户',
				avatar: '/static/missing-face.png',
			}
		},
	},
	actions: {
		userLoginAction(context, payload) {
			context.commit('userLogin', payload)
		},
		userLogoutAction(context) {
			context.commit('userLogout')
			uni.clearStorageSync('loginState')
			uni.clearStorageSync('userInfo')
			uni.clearStorageSync('token')
		}
	}
})

export default store
