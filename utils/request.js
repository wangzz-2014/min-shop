import axios from "axios-miniprogram"
import store from "@/store/index.js"
//@todo 通过配置文件读取
const base_url = "https://api.ahh5.com/go_shop"
// 不需要token 列表
const noTokenUrl = [
	"/api/auth/refresh_token"
]

// 刷新token后的任务队列
let refreshTokenArray = []
// 是否正在刷新token
let refreshTokenLoding = false

axios.defaults.baseURL = base_url;
axios.defaults.timeout = 100000
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

// 获取token
async function getJwtToekn() {
	let jwtData = store.state.jwt_data
	if (jwtData.expires_at > new Date().getTime()&&jwtData.token) {
		return jwtData.token
	} else if (jwtData.refresh_expires_at > new Date().getTime()) {
		// 是否正在执行刷新token
		return await pipeNoAuthResponse(1)
	} else {
		// 重新登录
		return jwtData.token
	}
	return jwtData.token
}

/**
 * 刷新token，重新请求
 */
const refreshTokenFn = async () => {
	let jwtData = store.state.jwt_data
	// 判断是否有刷新token
	const refreshToken = jwtData.refresh_token || ''
	// 如果刷新token存在,并且在有效期
	if (refreshToken && (jwtData.refresh_expires_at > new Date().getTime())) {
		// 使用重新创建的axios请求，防止递归调用
		try {
			const {
				data
			} = await axios({
				method: 'POST',
				url: '/api/auth/refresh_token',
				data: {
					refresh_token: refreshToken
				}
			})
			store.commit('jwtData', data.jwt_data)
			store.commit('userLogin', data.user)
			console.log("通过refresh_token，已刷新token")
			return true
		} catch (e) {
			throw new Error('refreshToken get is error ', e)
		}
	}
	throw new Error('refreshToken not find')
}

// 重发请求封装 
// type: 1=request , 2=response 
const pipeNoAuthResponse = async (type,config) => {
	if (!refreshTokenLoding) {
		refreshTokenLoding = true
		// 尝试使用 refresh_token 获取新的 access_token
		try {
			// 执行刷新token
			await refreshTokenFn()
			// 执行刷新后任务队列
			refreshTokenArray.forEach(item => item())
			//清除任务队列
			refreshTokenArray = []
			// 请求拦截器
			if(type===1){
				// 返回当前token
				return store.state.jwt_data.token
			}
			// 相应拦截器
			if(	type===2){
				// 重发当前请求
				return axios(config)
			}
		} catch (error) {
			console.log(error)
			// 如果失败 跳转至登录
			uni.showModal({
				title: '温馨提示',
				content: '登录刷新失败，请联系管理员',
				showCancel: false,
			});
		} finally {
			refreshTokenLoding = false
		}
	} else {
		// 如果当前正在请求
		return new Promise(resolve => {
			// 当前请求的config投递至刷新后的任务队列中
			refreshTokenArray.push(function() {
				// 请求拦截器
				if(type===1){
					// 返回当前token
					resolve(axios(store.state.jwt_data.token))
				}
				// 相应拦截器
				if(	type===2){
					// 重发当前请求
					resolve(axios(config))
				}
				
			})
		})
	}
}

// 添加请求拦截器
axios.interceptors.request.use(
	async function(config) {
			// 如果需要token
			if (noTokenUrl.indexOf(config.url) === -1) {
				// 获取jwt
				let token = await getJwtToekn()
				config.headers["Authorization"] = `Bearer ${token}`
			}
			return config;
		},
		function(error) {
			//处理请求错误
			return Promise.reject(error);
		}
);

// 添加响应拦截器
axios.interceptors.response.use(
	function(response) {
		// 请求成功后做些什么
		return response.data || response;
	},
	async function(error) {
		let code = error?.response?.data?.code
		if (code === 401) {
			return await pipeNoAuthResponse(2,error.config)
		}
		console.log(error)
		// 处理响应错误
		return Promise.reject(error);
	}
);


// axios.get("/api/order/list").then(res=>{
// 	console.log(res,12345)
// })
setTimeout(() => {
	axios({
		url: "/api/order/list",
		mehtod: "GET",
	}).then(res => {
		console.log(res)
	})
}, 3000)
// refreshTokenFn()

export default axios
