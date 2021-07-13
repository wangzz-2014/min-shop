/**
 * 公共请求方法
 * @param {Object} options
 * @param {String} options.baseUrl 请求地址前缀
 * @param {String} options.modulesPath 模块名字(一般情况无需修改)
 * @param {String} options.url 接口地址
 * @param {String} options.method 请求方式 GET|POST|PUT|DELETE
 * @param {String} options.baseUrl 请求地址前缀
 * @param {String} options.baseUrl 请求地址前缀
 * @param {Boolean} options.isTakeOverControl 是否接管处理
 * @param {Boolean} options.isNoToken 是否去除需要token
 * @param {Boolean} options.isNoEncrypt 是否去除加密信息
 * @param {Boolean} options.isShowToast 是否展示错误信息
 */
export const request = async ({
	baseUrl = 'https://api.ahh5.com/go_shop',
	url,
	method = 'GET',
	data = {},
	params = {},
	header = {},
	contentType = 'application/json',
	isTakeOverControl = false,
	isNoToken = false,
	isShowToast = true,
}) => {
	let requestDate = new Date().getTime()
	const options = {
		url:baseUrl + url + '?' + paramsToStr({
			...params,
			...(isNoToken ? {} : {
				token:uni.getStorageSync('jwt_data').token
			}),
		}),
		data:data,
		header:{
			'content-type':contentType,
			...header
		},
		method,
		dataType:'json',
		responseType:'text',
		complete(result){
			console.group(
			'%c当前请求详细信息：',
			'background:#000;color:#bada55'
			);
			console.log('%c请求url:','color:#A101A6;font-weight: 600', options.url);
			options.params && console.log('%cURL请求参数：', 'color:#A101A6;font-weight: 600', options.params)
			console.log('%c请求参数：', 'color:#A101A6;font-weight: 600', options.data)
			console.log(
				'%c请求耗时：',
                'color:#A101A6;font-weight: 600',
                `${((new Date().getTime()-requestDate)/1000).toFixed(2)} s`
			);
			console.log('%c响应结果：', 'color:#A101A6;font-weight: 600', result);
			console.groupEnd()
		}
	}
	
	options.url = options.url.replace(/\?$/,'')
	try{
		const {code,data} = await promiseFn(uni.request)(options)
		if(code > 400) throw{
			message:'服务器异常'
		}
		return data
	}catch(e){
		 throw e
	}
}

export const paramsToStr = (params) => {
	let str = ''
	const keys = Object.keys(params)
	keys.forEach((key,index)=>{
		str += `${key}=${params[key]}`
		if(index + 1 < keys.length){
			str += '&'
		}
	})
	return str
}

export const promiseFn =
    (fn) =>
    (params) =>
    new Promise((resolve, reject) =>
        fn({
            ...params,
            success: (res) => resolve(res),
            fail: (error) => reject(error)
 }))