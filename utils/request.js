import axios from "axios-miniprogram"
import store from "@/store/index.js"
//@todo 通过配置文件读取
const base_url = "https://api.ahh5.com/go_shop"
const noTokenUrl = [
	// "/api/goods/classify"
]

axios.defaults.baseURL = base_url;
axios.defaults.timeout = 100000
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

const testFN = (token) => new Promise((r, j) => {
	setTimeout(() => {
		
		console.log("耗时结束",token)
		r()
	}, 1000)
})


async function getJwtToekn(){
	let jwtData = store.state
	return 
}


// 添加请求拦截器
axios.interceptors.request.use(
	async function(config) {
			// 如果需要token
			if (noTokenUrl.indexOf(config.url) === -1) {
				// 获取jwt对象
				
				await testFN(true)
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
		console.log(response)
		return response.data || response;
	},
	function(error) {
		console.log(error)
		return true
		// 处理响应错误
		return Promise.reject(error);
	}
);


// axios.get("/api/goods/classify/1234").then(res=>{
// 	console.log(res,12345)
// })
axios({
	url: "/api/goods/classify",
	mehtod: "GET",
	isNoToken: true
}).then(res => {
	console.log(res)
})

export default axios
