import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueI18n from 'vue-i18n';
import store from './store'
import {
	setCookie,
	getCookie,
	removeCookie
} from './utils/cookies';
import './utils';
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
import Vuelazyload from 'vue-lazyload';
import locale from 'element-ui/lib/locale/lang/en'

// 公共样式表
import router from './router';
import './assets/css/elementUi.scss';
import './assets/css/public_style.css';
import './assets/css/fulltime.css'
Vue.use(VueI18n);
Vue.use(Vuelazyload, {
	loading: require('./assets/images/lazy_default.jpg')
})

Vue.config.productionTip = false

let lang = '';
let messages = '';
let language = '';
if (getCookie("lang") == '') {

	if (navigator.appName == 'Netscape') {
		language = navigator.language;
	} else {
		language = navigator.browserLanguage;
	}
	if (language.indexOf('en') > -1) {
		setCookie('lang', 'en', 365);
	} else if (language.indexOf('zh') > -1) {
		setCookie('lang', 'zh', 365);
	} else {
		setCookie('lang', 'en', 365);
	}

	lang = getCookie("lang");
} else {
	lang = getCookie("lang");
}
// setCookie('lang', 'zh', 365);
// lang = getCookie("lang");
switch (lang) {
	case 'zh':
		messages = require('@/assets/language/zh.json')
		Vue.use(ElementUI);
		break;
	case 'en':
		messages = require('@/assets/language/en.json')
		Vue.use(ElementUI, { locale })
		break;
}

const i18n = new VueI18n({
	locale: lang,
	messages
});

new Vue({
	el: '#app',
	i18n,
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})
