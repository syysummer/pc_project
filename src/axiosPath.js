import Vue from 'vue';
import axios from 'axios';
import {
	Message
} from 'element-ui';
Vue.prototype.$axios = axios;
import qs from 'qs';
Vue.prototype.$qs = qs;
import store from './store'
import router from './router';
import {
	setCookie,
	getCookie,
	removeCookie
} from './utils/cookies'

// axios 配置
axios.defaults.timeout = 5000;
// axios.defaults.baseURL = "https://loong.ph/waimai/";
// axios.defaults.baseURL = "https://dev.loong.ph/dc/"; 
axios.defaults.baseURL = "https://sit.loong.ph/dc/"
// axios.defaults.baseURL = "http://lzx.loong.ph:8091";
// axios.defaults.baseURL = "http://caojun.loong.ph:8091";
// axios.defaults.baseURL = "http://yc.loong.ph:8091";
// axios.defaults.baseURL = "http://lfl.loong.ph:8091";

//axios.defaults.baseURL = "http://feng.loong.ph:8091";
// axios.defaults.baseURL = "http://mao.loong.ph:8091";
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true


// http request 拦截器
axios.interceptors.request.use(
	config => {

		config.headers['Accept-Language'] = getCookie('lang');

		if (config.method == 'post') {
			config.data = qs.stringify(config.data)
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	});

// http response 拦截器
axios.interceptors.response.use(
	response => {

		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					localStorage.removeItem('masterInfo')
					router.push({
						path: '/login'
					});
					// 返回 401 清除token信息并跳转到登录页面
					// if (lang == 'zh') {
					//     Vue.prototype.$toast.warning('您还未登录')
					// } else if (lang == 'en') {
					//     Vue.prototype.$toast.warning('You are not logged in')
					// }
					// setTimeout(function () {
					//     Vue.prototype.$toast.close()
					// }, 1000);
					break;
				case 410:

					//账号在其它设备登录
					localStorage.removeItem('masterInfo')
					router.push({
						path: '/login'
					});
					if (lang == 'zh') {
						Vue.prototype.$message.warning('您的账号在其他设备登录')
					} else if (lang == 'en') {
						Vue.prototype.$message.warning('Your account is logged in on other devices')
					}
			}
		}

		return Promise.reject(error.response) // 返回接口返回的错误信息
	});
export default axios;
