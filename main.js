import Vue from 'vue'
import App from './App'
// 引入uView UI 插件仓库
import uView from 'uview-ui'
Vue.use(uView)
// 引入moment日期格式化函数
import Moment from 'moment'
// 定义全局时间戳过滤器
Vue.filter('formatDate', function(value) {
  return Moment(value).format('YYYY[年]MM[月]DD[日]')
})
//年月日时分秒时间过滤器
Vue.filter('formatDateTime',function(value){
	return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
Vue.prototype.$msg = msg;
const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
import store from 'store/index.js'

Vue.config.productionTip = false


App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

app.$mount()

