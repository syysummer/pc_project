export default {
	is_loading: true,
	page: "",
	disPage: "",
	isMenuList: "true", // 标识是否是从菜单进入类表页面
	rescheduleNum: {
		agreeNum: 0,
		checkNum: 0,
		rejectNum: 0
	},
	new_fulltime: {
		timeData: [],
		currentSchedule: 0,
		reservationSetting: '',
		remarksMsg: '',
		scheduleList: [{
			beginTime: '',
			endTime: '',
			needNum: '',
			timeSalaryRule: '',
			id: '',
			groupId: ''
		}]
	},
	new_parttime: {
		timeData: [],
		currentSchedule: 0,
		reservationSetting: '',
		remarksMsg: '',
		scheduleList: [{
			beginTime: '',
			endTime: '',
			needNum: '',
			timeSalaryRule: '',
			id: '',
			groupId: ''
		}]
	},
	salary_partTime: [{
		startTime: '',
		endTime: '',
		salary: ''
	}],
	salary_fullTime: [{
		startTime: '',
		endTime: '',
		salary: ''
	}],

	// 查看整月班期
	getMonthSchedule: {
		resultList: [{
			groupData: '',
			resultDate: [{
				beginTime: '',
				endTime: ''
			}]
		}]
	},

	// 查看今天班期
	getTodaySchedule: {
		resultList: [{
			groupData: '',
			resultDate: [{
				beginTime: '',
				endTime: ''
			}]
		}]
	},

	// 查看所选日期班期
	getSelectSchedule: {
		resultList: [{
			groupData: '',
			resultDate: [{
				beginTime: '',
				endTime: ''
			}]
		}]
	},

}
