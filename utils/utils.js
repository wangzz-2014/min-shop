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

export default {
	gotoWebUrl
}