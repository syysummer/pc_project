import store from './index'

export default {
	updateLoading(state, status) {
		state.is_loading = status
	},
	updatePage(state, page = '') {
		state.page = page
	},
	updatePages(state, disPage = '') {
		state.disPage = disPage
	},
	updateReassignmentNum(state, list) {
		state.rescheduleNum = list
	},
	// 登陆
	// loginMu(state, user) {
	//     Object.assign(state.userInfo, user)
	// },

	// // 商户信息列表
	// accountInfo(state, data) {
	//     console.log(data)
	//     Object.assign(state.accountInfo, data)
	// }
	saveFulltime(state, { data }) {
		state.new_fulltime = data
	},
	saveParttime(state, { data }) {
		state.new_parttime = data
	},
	updateIsMenuList(state, { data }) {
		state.isMenuList = data
	},
	newScheduleType(state, data) {
		state.new_schedule_type = data
	},
	getSalaryPartTime(state, { data }) {
		state.salary_partTime = data
	},
	getSalaryFullTime(state, { data }) {
		state.salary_fullTime = data
	},
	updateScheduleDate(state, { data }) {
		state.scheduleDate = data
	}
}