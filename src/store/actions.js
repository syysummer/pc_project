import Vue from 'vue'
import axios from '../axiosPath'

export default {
	// post请求
	// loginBtn({ commit }, obj) {
	//     return axios.post('/Login', obj);
	// },

	// get方法
	// accountInfo({ commit }) {
	//     axios.get('/account').then(res => {
	//         console.log('res')
	//         var data = res.data;
	//         if (data.error_code == 0) {
	//             console.log(data);
	//             commit('accountInfo', data);
	//         }
	//     }).catch(err => {
	//         console.log('err')
	//         console.log(err)
	//     })
	// }

	// 获取上传图片token
	qiniuTokenApi({
		commit
	}, obj) {
		return axios.post('/openservice/getImgToken', obj)
	},

	// 获取图片验证码
	getCode({
		commit
	}, obj) {
		return axios.post('/openService/getCaptchaImage', obj, {
			responseType: 'arraybuffer'
		})
			.then(response => new Buffer(response.data, 'binary').toString('base64'))
			.then(data => {
				return 'data:image/png;base64,' + data
			});
	},

	// 登录
	loginApi({
		commit
	}, obj) {
		return axios.post('/openService/login', obj)
	},
	// 登出
	logoutApi({
		commit
	}, obj) {
		return axios.post('/openService/logout', obj)
	},
	// 审核不通过
	getCertificationFailListApi({
		commit
	}, obj) {
		return axios.get('/innerService/getCertificationFailList', obj)
	},
	// 获取省
	getAreaRegionListApi({
		commit
	}, obj) {
		return axios.post('/openService/getAreaRegionList', obj)
	},
	// 获取市
	getAreaCityListApi({
		commit
	}, obj) {
		return axios.post('/openService/getAreaCityList', obj)
	},
	// 统计配送中心下的配送员数据
	getDeliveryStatisticsApi({
		commit
	}, obj) {
		return axios.post('/innerService/getDeliveryStatistics', obj)
	},
	// 查询配送站下所有配送员列表
	getDeliveryListApi({
		commit
	}, obj) {
		return axios.get('/innerService/getDeliveryList', obj)
	},
	// 查询配送员详情
	getDeliveryManDetailApi({
		commit
	}, obj) {
		return axios.get('/innerService/getDeliveryManDetail', obj)
	},
	// 锁定、解锁配送员
	lockOrUnlockDeliveryManApi({
		commit
	}, obj) {
		return axios.post('/innerService/lockOrUnlockDeliveryMan', obj)
	},
	//获取骑手入驻列表页
	getCertificationAuditList({
		commit
	}, obj) {
		return axios.get('/innerService/getCertificationAuditList', obj)
	},
	//获取骑手入驻列表页
	getDcInfoByDcId({
		commit
	}, obj) {
		return axios.get('/innerService/getDcInfoByDcId', obj)
	},
	// 查询该配送站下所有配送员的信息
	getAllDeliveryManByDcIdList({
		commit
	}, obj) {
		return axios.post('/innerService/getAllDeliveryManByDcIdList', obj)
	},
	// 手动派单
	handleOrder({
		commit
	}, obj) {
		return axios.post('/innerService/handleOrder', obj)
	},
	// 查看订单详情
	getOrderDetails({
		commit
	}, obj) {
		return axios.post('/innerService/getOrderDetails', obj)
	},
	// 调度列表（待抢单）
	getPendingOrder({
		commit
	}, obj) {
		return axios.post('/innerService/getPendingOrder', obj)
	},
	// 调度列表（待取货）
	getPickGoods({
		commit
	}, obj) {
		return axios.post('/innerService/getPickGoods', obj)
	},
	// 调度列表（待送达）
	getDeliveredGoods({
		commit
	}, obj) {
		return axios.post('/innerService/getDeliveredGoods', obj)
	},
	// 调度列表（数据统计）
	getSchedualStatics({
		commit
	}, obj) {
		return axios.post('/innerService/getSchedualStatics', obj)
	},
	// 配送员评价(用户评价)
	getDeliveryCommentListPage({
		commit
	}, obj) {
		return axios.post('/innerService/getDeliveryCommentListPage', obj)
	},
	// 配送员评价(商家评价)
	getSellerCommentListPage({
		commit
	}, obj) {
		return axios.post('/innerService/getSellerCommentListPage', obj)
	},
	// 配送员监控列表
	deliveryMonitorList({
		commit
	}, obj) {
		return axios.post('/innerService/deliveryMonitorList', obj)
	},
	// 配送员货到付款结算信息统计
	getDeliverySettleList({
		commit
	}, obj) {
		return axios.post('/innerService/getDeliverySettleList', obj)
	},
	// 获取该配送员配送的所有订单信息
	getDeliveryAllOrderList({
		commit
	}, obj) {
		return axios.post('/innerService/getDeliveryAllOrderList', obj)
	},
	// 新建或编辑排期
	newEditSchedule({
		commit
	}, obj) {
		return axios.post('/innerService/addSchedule', obj)
	},
	// 获取排班列表
	getScheduleLists({
		commit
	}, obj) {
		return axios.post('/innerService/getTypesettingList', obj)
	},
	// 编辑(新建)排班时未发布数据
	getUnPublishSchedule({
		commit
	}, obj) {
		return axios.get('/innerService/getScheduleDetail', obj)
	},
	// 全职排班
	fulltimeSchedule({
		commit
	}, obj) {
		return axios.post('/innerService/getScheduleGroupInfo', obj)
	},
	// 删除班期
	deleteSchedule({
		commit
	}, obj) {
		return axios.delete('/innerService/deleteSchedule', obj)
	},
	// 编辑排班时编辑更新排班(类似新建)
	updateUnPublishSchedule({
		commit
	}, obj) {
		return axios.post('/innerService/updateSchedule', obj)
	},
	// 查看班期(已经发布过)
	reqScheduleDetail({
		commit
	}, obj) {
		return axios.post('/innerService/getFullTimeDeliverySchedule', obj)
	},
	// 保存班期信息 
	saveSchedule({
		commit
	}, obj) {
		return axios.post('/innerService/saveFullTimeSchedule', obj)
	},
	// 发布全职班期  
	publishSchedule({
		commit
	}, obj) {
		return axios.post('/innerService/releaseFullTimeSchedule', obj)
	},
	// 删除单个班次的信息 
	deleteSingleSchedule({
		commit
	}, obj) {
		return axios.delete('/innerService/deleteScGroup', obj)
	},
	// 查看工期 (详情页) 
	checkScheduleDetails({
		commit
	}, obj) {
		return axios.get('/innerService/getDeliveryTimeLimit', obj)
	},
	// 导出班期(Excel)功能
	exportScheduleDetails({
		commit
	}, obj) {
		return axios.get('/innerService/getScheduleExcel', obj)
	},
	// 配送员薪酬配置
	deliverySalaryConfigure({
		commit
	}, obj) {
		return axios.post('/innerService/deliverySalaryConfigure', obj)
	},
	// 配送员薪酬配置列表
	getDeliverySalaryList({
		commit
	}, obj) {
		return axios.post('/innerService/getDeliverySalaryList', obj)
	},
	// 查看配送员薪酬信息详情
	getDeliverySalaryInfo({
		commit
	}, obj) {
		return axios.post('/innerService/getDeliverySalaryInfo', obj)
	},
	// 编辑配送员薪酬信息
	updateDeliverySalaryInfo({
		commit
	}, obj) {
		return axios.post('/innerService/updateDeliverySalaryInfo', obj)
	},
	// 配送设置
	deliveryConfigure({
		commit
	}, obj) {
		return axios.post('/innerService/deliveryConfigure', obj)
	},
	// 查看配送设置 
	getDcDeliveryRuleInfo({
		commit
	}, obj) {
		return axios.post('/innerService/getDcDeliveryRuleInfo', obj)
	},
	// 兼职财务列表
	getDeliveredSalary({
		commit
	}, obj) {
		return axios.post('/innerService/getDeliveredSalary', obj)
	},
	// 全职财务列表
	getFullDeliveredSalary({
		commit
	}, obj) {
		return axios.post('/innerService/getFullDeliveredSalary', obj)
	},
	// 获取改派订单列表信息
	getReassignmentOrderListPage({
		commit
	}, obj) {
		return axios.post('/innerService/getReassignmentOrderListPage', obj)
	},
	// 驳回改派订单申请
	rejectReassignmentOrder({
		commit
	}, obj) {
		return axios.post('/innerService/rejectReassignmentOrder', obj)
	},
	// 获取改派订单详情
	getReassignmentOrderDetail({
		commit
	}, obj) {
		return axios.post('/innerService/getReassignmentOrderDetail', obj)
	},
	// 收入详情
	getRecordOfIncome({
		commit
	}, obj) {
		return axios.post('/innerService/getRecordOfIncome', obj)
	},
	// 支出详情
	getRecordOfExpenditure({
		commit
	}, obj) {
		return axios.post('/innerService/getRecordOfExpenditure', obj)
	},
}
