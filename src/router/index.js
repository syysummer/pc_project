import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import HelloWorld from '@/components/HelloWorld'

import home from '@/page/home'
import Login from '@/page/login'
import team_home from '@/page/team_home'
import history_order from '@/page/order_management/history_order'
import financial_management from '@/page/financial_management'
import team_details from '@/page/team_management/team_details'
import distribution_management from '@/page/team_management/distribution_management'
import cash_order_statistics from '@/page/team_management/cash_order_statistics'
import delivery_order_detail from '@/page/team_management/delivery_order_detail'
import distribution_supervisor_monitoring from '@/page/team_management/distribution_supervisor_monitoring'
import bank_card_information from '@/page/team_management/bank_card_information'
import evaluation_of_distribution_staff from '@/page/team_management/evaluation_of_distribution_staff'
import details_of_the_distributor from '@/page/team_management/details_of_the_distributor'
import edit_the_details_of_the_distributor from '@/page/team_management/edit_the_details_of_the_distributor'
import admission_management from '@/page/team_management/stationmaster/admission_management'
import admission_management_detail from '@/page/team_management/stationmaster/admission_management_detail'
import no_admission_management from '@/page/team_management/stationmaster/no_admission_management'
import schedule_list from '@/page/delivery_mode/schedule_list'
import waiting_single from '@/page/delivery_mode/schedule_lists/waiting_single'
import pick_up from '@/page/delivery_mode/schedule_lists/pick_up'
import services from '@/page/delivery_mode/schedule_lists/services'
import statistics_data from '@/page/delivery_mode/schedule_lists/statistics_data'
import order_detail from '@/page/delivery_mode/order_detail'

import compensation from '@/page/business/compensation'
import salary_set from '@/page/business/salary_set'
import salary_list from '@/page/business/salary_list'
import balance_list from '@/page/balance/balance_list'
import balance_part from '@/page/balance/balance_part'
import balance_full from '@/page/balance/balance_full'



import reschedule from '@/page/delivery_mode/reschedule'
import reschedule_detail from '@/page/delivery_mode/reschedule_detail'
import reschedule_waiting from '@/page/delivery_mode/reschedule_lists/waiting'
import reschedule_success from '@/page/delivery_mode/reschedule_lists/success'
import reschedule_refuse from '@/page/delivery_mode/reschedule_lists/refuse'

// 配送排期相关
import business from '@/page/business/business'
import delivery_schedules from '@/page/business/delivery_schedules'
import employee_delivery_details from '@/page/business/employee_delivery_details'
import schedule_lists from '@/page/business/schedule_lists/schedule_lists'
import edit_schedule from '@/page/business/new_edit_schedule'

Vue.use(Router)

import {
	getCookie
} from "../utils/cookies"
let lang = getCookie('lang') ? getCookie('lang') : 'zh'
const routes = [{
	path: '/HelloWorld',
	name: 'HelloWorld',
	component: HelloWorld
},
{
	path: '/',
	name: 'home',
	component: home,
	redirect: 'team_home',
	children: [{
		path: 'team_home',
		name: 'team_home',
		component: team_home,
		meta: {
			titles: lang == 'zh' ? '团队首页' : 'Team homepage'
		}
	},
	{
		path: 'history_order',
		name: 'history_order',
		component: history_order,
		meta: {
			titles: "配送员订单统计"
			// titles: lang == 'zh' ? '配送员订单统计' : 'Order management'
		}
	},
	{
		path: 'financial_management',
		name: 'financial_management',
		component: financial_management,
		meta: {
			titles: lang == 'zh' ? '财务管理' : 'Financial management'
		}
	},
	{
		path: 'team_details',
		name: 'team_details',
		component: team_details,
		meta: {
			titles: lang == 'zh' ? '配送站详情' : 'Delivery station details'
		}
	},
	{
		path: 'distribution_management',
		name: 'distribution_management',
		component: distribution_management,
		meta: {
			titles: lang == 'zh' ? '配送员管理' : 'Distributor management'
		}
	},
	{
		path: 'distribution_supervisor_monitoring',
		name: 'distribution_supervisor_monitoring',
		component: distribution_supervisor_monitoring,
		meta: {
			titles: lang == 'zh' ? '配送员监控' : 'Supervise riders'
		}
	},
	{
		path: 'admission_management',
		name: 'admission_management',
		component: admission_management,
		meta: {
			titles: lang == 'zh' ? '骑手管理' : 'Rider manage'
		}
	},
	{
		path: 'admission_management_detail',
		name: 'admission_management_detail',
		component: admission_management_detail,
		meta: {
			titles: lang == 'zh' ? '骑手入驻详情' : 'Rider entry details'
		}
	},
	{
		path: 'no_admission_management',
		name: 'no_admission_management',
		component: no_admission_management,
		meta: {
			titles: lang == 'zh' ? '骑手入驻申请列表(未通过)' : 'Rider entry list(not pass)'
		}
	},
	{
		path: 'cash_order_statistics',
		name: 'cash_order_statistics',
		component: cash_order_statistics,
		meta: {
			titles: lang == 'zh' ? '货到付款订单统计' : 'COD orders stats'
		}
	},
	{
		path: 'delivery_order_detail',
		name: 'delivery_order_detail',
		component: delivery_order_detail,
		meta: {
			titles: lang == 'zh' ? '货到付款订单统计' : 'COD orders stats'
		}
	},
	{
		path: 'bank_card_information',
		name: 'bank_card_information',
		component: bank_card_information,
		meta: {
			titles: lang == 'zh' ? '银行卡信息' : 'Bank card information'
		}
	},
	{
		path: 'evaluation_of_distribution_staff',
		name: 'evaluation_of_distribution_staff',
		component: evaluation_of_distribution_staff,
		meta: {
			titles: lang == 'zh' ? '配送员评价' : 'Comment rider'
		}
	},
	{
		path: 'details_of_the_distributor',
		name: 'details_of_the_distributor',
		component: details_of_the_distributor,
		meta: {
			titles: lang == 'zh' ? '配送员详情' : 'Distributor details'
		}
	},
	{
		path: 'edit_the_details_of_the_distributor',
		name: 'edit_the_details_of_the_distributor',
		component: edit_the_details_of_the_distributor,
		meta: {
			titles: lang == 'zh' ? '添加配送员' : 'Add deliverer'
		}
	},
	{
		path: 'schedule_list',
		name: 'schedule_list',
		component: schedule_list,
		redirect: '/schedule_list/waiting_single',
		children: [{
			path: 'waiting_single',
			name: 'waiting_single',
			component: waiting_single,
			meta: {
				titles: lang == 'zh' ? '调度订单列表' : 'Scheduled order list'
			}
		},
		{
			path: 'pick_up',
			name: 'pick_up',
			component: pick_up,
			meta: {
				titles: lang == 'zh' ? '调度订单列表' : 'Scheduled order list'
			}
		},
		{
			path: 'services',
			name: 'services',
			component: services,
			meta: {
				titles: lang == 'zh' ? '调度订单列表' : 'Scheduled order list'
			}
		},
		{
			path: 'statistics_data',
			name: 'statistics_data',
			component: statistics_data,
			meta: {
				titles: lang == 'zh' ? '调度订单列表' : 'Scheduled order list'
			}
		}
		]
	},
	{
		path: 'reschedule_detail',
		name: 'reschedule_detail',
		component: reschedule_detail,
		meta: {
			titles: lang == 'zh' ? '改派申请详情' : ' Re-assign request details'
		}
	},
	{
		path: 'reschedule',
		name: 'reschedule',
		component: reschedule,
		redirect: '/reschedule/reschedule_waiting',
		children: [{
			path: 'reschedule_waiting',
			name: 'reschedule_waiting',
			component: reschedule_waiting,
			meta: {
				titles: lang == 'zh' ? '改派订单' : 'Re-assign order'
			}
		},
		{
			path: 'reschedule_success',
			name: 'reschedule_success',
			component: reschedule_success,
			meta: {
				titles: lang == 'zh' ? '改派订单' : 'Re-assign order'
			}
		},
		{
			path: 'reschedule_refuse',
			name: 'reschedule_refuse',
			component: reschedule_refuse,
			meta: {
				titles: lang == 'zh' ? '改派订单' : 'Re-assign order'
			}
		}
		]
	},
	{
		path: 'order_detail',
		name: 'order_detail',
		component: order_detail,
		meta: {
			titles: lang == 'zh' ? '订单详情' : 'Order details'
		}
	},
	{
		path: 'compensation',
		name: 'compensation',
		component: compensation,
		meta: {
			titles: lang == 'zh' ? '配送配置' : 'Delivery set'
		}
	},
	{
		path: 'salary_set',
		name: 'salary_set',
		component: salary_set,
		meta: {
			titles: lang == 'zh' ? '薪酬配置' : 'Salary set '
		}
	},
	{
		path: 'salary_list',
		name: 'salary_list',
		component: salary_list,
		meta: {
			titles: lang == 'zh' ? '薪酬列表' : 'Salary list'
		}
	},
	{
		path: 'edit_schedule',
		name: 'edit_schedule',
		component: edit_schedule,
		meta: {
			titles: lang == 'zh' ? '新建排期' : 'Create shift'
		}
	},
	{
		path: '/business/business_sche',
		name: 'delivery_schedules',
		component: delivery_schedules,
		meta: {
			titles: lang == 'zh' ? '配送排期' : 'Scheduling'
		}
	},
	{
		path: 'schedule_lists',
		name: 'schedule_lists',
		component: schedule_lists,
		meta: {
			titles: lang == 'zh' ? '排班列表' : 'Schedule list'
		}
	},
	{
		path: 'employee_delivery_details',
		name: 'employee_delivery_details',
		component: employee_delivery_details,
		meta: {
			titles: lang == 'zh' ? '配送工期详情' : 'delivery scheduling'
		}
	},
	{
		path: 'balance_list',
		name: 'balance_list',
		component: balance_list,
		meta: {
			titles: lang == 'zh' ? '账户余额' : 'Credit balance'
		}
	},
	{
		path: 'balance_part',
		name: 'balance_part',
		component: balance_part,
		meta: {
			titles: lang == 'zh' ? '账户余额详情' : 'Account balance statement'
		}
	},
	{
		path: 'balance_full',
		name: 'balance_full',
		component: balance_full,
		meta: {
			titles: lang == 'zh' ? '账户余额详情' : 'Account balance statement'
		}
	}
	]
},
{
	path: '/login',
	name: 'login',
	component: Login
}
]

const router = new Router({
	// mode: 'history',
	// bash: '/h5/',
	routes
});


router.beforeEach((to, from, next) => {
	if (to.path != "/login" && !localStorage.getItem('masterInfo')) {
		next({
			path: '/login'
		})
	} else {
		next()
	}
})

export default router;
