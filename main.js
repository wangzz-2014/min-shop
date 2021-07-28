import Vue from 'vue'
import App from './App'
// 引入uView UI 插件仓库
import uView from 'uview-ui'
import login from "@/common/login.js"
import request from "@/utils/request.js"
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

const timerFN =()=>new Promise((r)=>{
	setTimeout(()=>{
		r()
	},10000)
})
uni.addInterceptor('request', {
  // 请求前
   async invoke (args) {
	   await timerFN()
    // 对请求头处理事情
    args.header = {
      ...args.header,
      token: 'xxx'
    }
    return args
  },
  // 返回值
  returnValue (e) {
    // 处理返回结果
    return e
  }
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

// 在http后挂载 login相关
// import login from "@/common/login.js"
// Vue.use(login, app)

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

Vue.use(login, app)

app.$mount()

