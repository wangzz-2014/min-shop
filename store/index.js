import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		loginState: false,
		userInfo: uni.getStorageSync('user') ? uni.getStorageSync('user') : {
			"id": "",
			"created_at": "",
			"mini_openid": "",
			"union_id": "",
			"edges": {}
		},
		cart: uni.getStorageSync('cart') ? JSON.parse(uni.getStorageSync('cart')) : [],
		loginInitFn: []
	},
	getters: {},
	mutations: {
		loginInitFn(state, payload) {
			state.loginInitFn = [...state.loginInitFn, payload]
		},
		userLogin(state, payload) {
			state.loginState = true
			state.userInfo = payload
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
