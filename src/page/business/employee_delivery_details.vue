<template>
	<div class="detail_contain">
		<div class="schedules_contain">
			<!-- 头部部分 -->
			<div class="details_header">
				<div class="schedules_time_scope">
					<div class="detail_time">{{emp_del_det.schedule_date}}{{beginDate}} ～ {{endDate}}</div>
					<div class="detail_des">
						<span>{{emp_del_det.remarks}} </span>{{remarkMsg}}
					</div>
				</div>
				<div class="back" @click="goBack">{{emp_del_det.back}}</div>
			</div>

			<!-- 详情部分 -->
			<div class="details_content">
				<div class="time_list">
					<div class="item" @click="changeTime(item, index)" :class="{active: item.isActive}" v-for="(item, index) in timeList">
						<span>{{item.name}}</span>
					</div>
				</div>
				<!-- 班次列表 -->
				<div class="schedules_list">
					<div class="schedule_item" v-for="(item, index) in scheduleData">
						<div class="schedule_item_title">
							<div class="specific_time">
								<span class="icon">
									<i class="iconfont icon-shijian"></i>
								</span>
								{{chinanum(index)}}{{emp_del_det.shift}} {{item.beginTime}} ~ {{item.endTime}}
								<span class="salary"> {{emp_del_det.schedule_salary}} : {{item.timeSalaryRule}}P/min</span>
							</div>
							<div class="people_number">
								<div class="appointments_number" v-if="scheduleType == '1'">{{emp_del_det.plan_people}}{{item.planNum}}</div>
								<div class="appointments_number" v-if="scheduleType == '0'">{{emp_del_det.appointments_people}} {{item.bespeak}}</div>
								<div class="attendees_number">{{emp_del_det.attendees_people}} {{item.Attendance}}</div>
							</div>
						</div>
						<el-table :data="item.list" :header-cell-style='styleObj' style="width: 100%" stripe v-loading="loading" :default-sort="{prop: 'totalWorkTime', order: 'descending'}">
							<el-table-column prop="deliveryName" align="center" :label="emp_del_det.delivery" min-width="100" show-overflow-tooltip></el-table-column>
							<el-table-column v-if="scheduleType == '0'" prop="reserveTime" align="center" :label="emp_del_det.Appointment" min-width="175"></el-table-column>
							<el-table-column prop="beginWorkTime" align="center" :label="emp_del_det.go_worktime" min-width="175"></el-table-column>
							<el-table-column prop="endWorkTime" align="center" :label="emp_del_det.off_worktime" min-width="175"></el-table-column>
							<el-table-column prop="totalWorkTime" align="center" :sortable='true' :label="emp_del_det.total_worktime" min-width="120"></el-table-column>
							<el-table-column prop="absenceWorkTime" align="center" :label="emp_del_det.Absence_time" min-width="120"></el-table-column>
							<el-table-column v-if="scheduleType == '0'" prop="totalMoney" align="center" :sortable='true' :label="emp_del_det.total_income" min-width="140"></el-table-column>
							<el-table-column v-if="scheduleType == '0'" prop="logcs" align="center" :sortable='true' :label="emp_del_det.delivery_income" min-width="160"></el-table-column>
							<!-- <el-table-column v-if="scheduleType == '1'" prop="subsidy" align="center" :label="emp_del_det.salary_income" min-width="100"></el-table-column> -->
							<el-table-column v-if="scheduleType == '0'" prop="timeIncome" align="center" :label="emp_del_det.hour_income" min-width="120"></el-table-column>
							<el-table-column v-if="scheduleType == '0'" prop="reward" align="center" :label="emp_del_det.reward" min-width="150"></el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { formatDateTime } from '../../utils/index.js'
export default {
  data() {
    return {
      isFulltime: false, // 是否是全职详情(具体可根据是否有预约时间来判断)
      loading: false, //表格数据是否在加载中
      beginDate: '',
      endDate: '',
      remarkMsg: '',
      scheduleId: '', //当前请求班期id
      sdate: '', //当前请求时间
      edate: '', //当前请求结束时间(暂时不需传参)
      status: '', // 当前请求班期状态
      scheduleType: '', // 当前请求班期类型
      styleObj: {
        background: '#F6F9FF'
      },
      currentScheduleIndex: 0, //当前选中的班次
      scheduleData: [],
      timeList: [] //班次列表
    }
  },
  computed: {
    emp_del_det() {
      return this.$t('employee_delivery_details')
    }
  },
  beforeMount() {
    if (this.$route.query.details) {
      // 从列表页面进来
      this.scheduleId = this.$route.query.scheduleId
      this.sdate = this.$route.query.sdate
      this.edate = this.$route.query.edate
      this.status = this.$route.query.status
      this.scheduleType = this.$route.query.scheduleType
    } else {
      // 从排班页面进来
      this.scheduleId = localStorage.getItem('scheduleId')
      this.sdate = JSON.parse(localStorage.getItem('scheduleDate'))[0]
      this.edate = JSON.parse(localStorage.getItem('scheduleDate'))[1]
      this.status = localStorage.getItem('status')
      this.scheduleType = localStorage.getItem('scheduleType')
    }
  },
  mounted() {
    this.getAllScheduleDetails()
  },
  methods: {
    ...mapActions(['checkScheduleDetails']),
    ...mapMutations(['updateIsMenuList']),
    goBack() {
      this.updateIsMenuList({ data: 'false' })
      this.$router.go(-1)
    },
    Formatter(row, column, cellValue, index) {
      console.log(cellValue, '=======')
    },
    chinanum(num) {
      let china
      if (getCookie('lang') == 'zh') {
        china = new Array(
          '一',
          '二',
          '三',
          '四',
          '五',
          '六',
          '七',
          '八',
          '九',
          '十',
          '十一',
          '十二'
        )
      } else {
        china = new Array(
          '1st',
          '2nd',
          '3rd',
          '4th',
          '5th',
          '6th',
          '7th',
          '8th',
          '9th',
          '10th',
          '11th',
          '12th'
        )
      }
      var arr = new Array()
      var english = (num + ',').split(',')
      for (var i = 0; i < english.length; i++) {
        arr[i] = china[english[i]]
      }
      return arr.join('')
    },
    changeTime(item, index) {
      if (index === this.currentScheduleIndex) return
      this.timeList[this.currentScheduleIndex].isActive = false
      item.isActive = true
      this.currentScheduleIndex = index
      this.sdate = item.name
      // 根据当前排班时间请求后天数据
      this.getAllScheduleDetails()
    },
    async getAllScheduleDetails() {
      // 首次渲染机切换日期时调用
      this.loading = true
      let params = {
        scheduId: this.scheduleId,
        sdate: this.sdate,
        status: this.status,
        scheduleType: this.scheduleType
      }
      let res = await this.checkScheduleDetails({ params })
      if (res.data.code == '1') {
        let data = res.data.data
        this.beginDate = data.beginDate
        this.endDate = data.endDate
        let timeList = []
        data.groupDateList.forEach((element, index) => {
          let item = {}
          item.name = element
          if (index == this.currentScheduleIndex) {
            item.isActive = true
          } else {
            item.isActive = false
          }
          timeList.push(item)
        })
        this.timeList = timeList
        data.dcGroup.forEach(elem => {
          elem.list.forEach(item => {
            // 格式化时间
            if (item.beginWorkTime) {
              item.beginWorkTime = formatDateTime(item.beginWorkTime)
            }
            if (item.endWorkTime) {
              item.endWorkTime = formatDateTime(item.endWorkTime)
            }
            if (item.reserveTime) {
              item.reserveTime = formatDateTime(item.reserveTime)
            }
          })
        })
        this.scheduleData = data.dcGroup
        this.remarkMsg = data.remark
        this.loading = false
      } else {
        this.loading = false
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped type="text/css">
@import '../../assets/css/fulltime.css';
.detail_contain {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .schedules_contain {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .details_header {
      width: 100%;
      height: 100px;
      display: flex;
      padding: 0 30px;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      .schedules_time_scope {
        display: flex;
        flex-direction: column;
        .detail_time {
          font-family: PingFangSC-Semibold;
          font-size: 20px;
          color: #333333;
          letter-spacing: 0;
          line-height: 26px;
        }
        .detail_des {
          font-family: PingFangSC-Semibold;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          line-height: 30px;
          span {
            font-size: 18px;
            color: #222222;
          }
        }
      }
      .back {
        width: 65px;
        height: 32px;
        background: #3ea2ff;
        border-radius: 4px;
        color: #fff;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
      }
    }
    .details_content {
      width: 100%;
      margin-top: 1%;
      background: #fff;
      padding: 0 30px;
      height: 93%;
      .time_list {
        width: 100%;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .item {
          margin-top: 10px;
          margin-bottom: 10px;
          min-width: 120px;
          height: 20px;
          border-right: 2px solid #eee;
          text-align: center;
          line-height: 20px;
          background: #fff;
          cursor: pointer;
          span {
            display: inline-block;
            height: 30px;
            line-height: 20px;
          }
          &.active {
            span {
              color: #ff725d;
              border-bottom: 2px solid #ff725d;
            }
          }
        }
      }
      .schedules_list {
        width: 100%;
        height: 92%;
        padding-bottom: 80px;
        box-sizing: border-box;
        overflow: auto;
        .schedule_item {
          width: 100%;
          .schedule_item_title {
            width: 100%;
            height: 40px;
            background: #e6f7ff;
            border: 1px solid #bae7ff;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 20px;
            padding-right: 20px;
            margin-bottom: 10px;
            .specific_time {
              .icon {
                display: inline-block;
                vertical-align: middle;
                width: 25px;
                height: 25px;
                text-align: center;
                line-height: 23px;
                background: #1890ff;
                border-radius: 50%;
                .icon-shijian {
                  font-size: 16px;
                  color: #fff;
                  line-height: 16px;
                  border-radius: 50%;
                  padding: 0;
                }
              }
              .salary {
                margin-left: 30px;
              }
            }
          }
          .people_number {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .attendees_number {
              margin-left: 50px;
            }
          }
        }
      }
    }
  }
}
</style>
