const gotoWebUrl = (item) => {
	console.log(item)
	//获取edges.basic_link.type.link_type
	let type = item.edges.basic_link.link_type
	let url = item.edges.basic_link.link_address
	let appid = item.edges.basic_link.appid
	switch (type){
		//H5跳转
		case "0":
			uni.navigateTo({
				url:'/pages/webview/webview?url='+encodeURI(url)
			})
			break;
		//小程序内部跳转
		case "1":
			uni.navigateTo({
				url:url
			})
			break;
		//外部小程序跳转
		case "2":
			uni.navigateToMiniProgram({
			  appId: appid,
			  path: url,
			})
			break;
		default:
			uni.navigateTo({
				url:'/pages/index/index.vue'
			})
			break;
	}
}

/**
 * 返回传值方法封装
 * @param {*} items 赋值对象
 * @param {*} method 调用犯法
 * @param {*} index 返回层级  默认2为上一级
 */
export function backSetData(data,key, index = 2) {
	const uniCurrPage = getCurrentPages() //获取当前页面的页面栈
    let uniPrevPage = uniCurrPage[uniCurrPage.length - index] //获取上级页面的page对象
	// #ifndef H5
	uniPrevPage = uniPrevPage.$vm
	// #endif
    if (uniPrevPage) {
		uniPrevPage.$set(uniPrevPage,key,data)
        uni.navigateBack({
            delta: index - 1,
        })
    }
}
export default {
	gotoWebUrl,
}