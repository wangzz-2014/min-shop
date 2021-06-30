import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		loginState:uni.getStorageSync('loginState') === 'ok' ? true : false,
		userInfo:uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {
			name:'未知用户',
			avatar:'/static/missing-face.png',
		}
	},
	getters:{},
	mutations:{
		userLogin(state,payload){
			state.loginState = true
			state.userInfo = payload
			uni.setStorageSync('loginState','ok')
			uni.setStorageSync('userInfo',JSON.stringify(payload))
		},
		userLogout(state){
			state.loginState = false
			state.userInfo = {
				name:'未知用户',
				avatar:'/static/missing-face.png',
			}
		}
	},
	actions:{
		userLoginAction(context,payload){
			context.commit('userLogin',payload)
		},
		userLogoutAction(context){
			context.commit('userLogout')
			uni.clearStorageSync('loginState')
			uni.clearStorageSync('userInfo')
			uni.clearStorageSync('token')
		}
	}
})

export default store