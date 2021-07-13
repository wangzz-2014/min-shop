import store from "../store/index.js"
import httpApi from '@/common/http.api.js'
// callbackToPromise
export const promiseFn =
	(fn) =>
	(params) =>
	new Promise((resolve, reject) =>
		fn({
			...params,
			success: (res) => resolve(res),
			fail: (error) => reject(error)
		}))



const install = (vue,vm) => {
	vue.prototype.$login = {
		//登录结束方法
		wxLoginInit: (fn) => {
			// 如果已经登录直接执行该方法
			if (store.state.loginState) return fn()
			store.commit("loginInitFn", fn)
		},
		// 登录方法
		wxLogin: async () => {
			try {
				// 获取jscode
				const {
					code
				} = await promiseFn(wx.login)()
				let data = await vm.$u.api.login({
					js_code: code
				})
				// delete data.data.jwt_data.token
				store.commit('jwtData',data.data.jwt_data)
				store.commit("userLogin", data.data.user)
				
				console.log("登录成功")
				// uni.setStorageSync('user', data.data.user)
				store.state.loginInitFn.forEach(fn => {
					try {
						if (typeof fn == "function") fn()
					} catch (error) {
						console.log(error)
					}
				})
			} catch (e) {
				console.log(e)
				uni.showModal({
					title: '温馨提示',
					content: '登录失败，请联系管理员',
					showCancel: false,
				})
			}
		}
	}
}

export default{
	install
}