const baseUrl = 'https://api.ahh5.com/go_shop'
export const request = async ({
	baseUrl = baseUrl,
	url,
	method = 'GET',
	data = {},
	params = {},
	header = {},
	contentType = 'application/json',
	isNoToken = false
	isShowToast = true,
}) => {
	let requestDate = new Date().getTime()
	const options = {
		url:baseUrl + url + '?' + paramsToStr({
			...params,
			...(isNoToken ? {} : {
				token:uni.getStorageSync('jwt_data').token
			}),
		})
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
		const {code,data} = promiseFn(uni.request)(options)
		if(code > 400) throw{
			message:'服务器异常'
		}
		
	}catch(e){
		//TODO handle the exception
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