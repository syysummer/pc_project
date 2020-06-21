<template>
	<div class="schedules_list_contain">
		<div class="schedules_inner_contain">
			<!-- 头部部分 -->
			<div class="schedules_header">
				<div class="block select_time">
					<span class="demonstration">{{schedule_lists.schedule_date}}</span>
					<el-date-picker v-model="valueTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" :placeholder="schedule_lists.select_date">
					</el-date-picker>
				</div>
				<div class="select_status">
					<span class="detail_time">{{schedule_lists.status}} </span>
					<el-select v-model="valueStatus" :placeholder="schedule_lists.please_select" ref="state">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="inquire_contain" @click="queryScheduleLists">{{schedule_lists.inquire}}</div>
				<el-button class="export_button" @click="exportFile" size="small" icon="el-icon-upload">{{schedule_lists.export}}</el-button>
			</div>
			<!-- 详情部分 -->
			<div class="schedules_list_content">
				<div class="switch_schedules">
					<div class="schedule_item" @click="changeSchedule('fulltime')" :class="{active: isActive == 'fulltime'}">
						<span>{{schedule_lists.fulltime}}</span>
					</div>
					<div class="schedule_item" @click="changeSchedule('parttime')" :class="{active: isActive == 'parttime'}">
						<span>{{schedule_lists.parttime}}</span>
					</div>
				</div>
				<!--表格列表和分页器全职-->
				<div class="table_branch">
					<el-table :data="scheduleTable" :header-cell-style='styleObj' style="width: 100%" stripe v-loading="loading">
						<el-table-column prop="schedule" align="center" :label="schedule_lists.schedule" min-width="200" show-overflow-tooltip></el-table-column>
						<el-table-column prop="groupNumber" align="center" :label="schedule_lists.schedule_time" min-width="100"></el-table-column>
						<el-table-column prop="count" v-if="isActive=='fulltime'" align="center" :label="schedule_lists.people_number" min-width="125"></el-table-column>
						<el-table-column prop="count" v-if="isActive=='parttime'" align="center" :label="schedule_lists.appointments_people" min-width="125"></el-table-column>
						<el-table-column prop="scheduleStatus" align="center" :label="schedule_lists.status" min-width="125">
							<template slot-scope="scope">
								<div class="schedule_status">
									<div class="not_publish" v-if="scope.row.scheduleStatus == '0'">
										<span class="not_publish"></span>
										<span class="status_content">{{schedule_lists.not_publish}}</span>
									</div>
									<div class="did_finished" v-if="scope.row.scheduleStatus == '2'">
										<span class="did_finished"></span>
										<span class="status_content">{{schedule_lists.did_finished}}</span>
									</div>
									<div class="in_appointment" v-if="scope.row.scheduleStatus == '3'">
										<span class="in_appointment"></span>
										<span class="status_content">{{schedule_lists.in_appointment}}</span>
									</div>
									<div class="in_handing" v-if="scope.row.scheduleStatus == '4'">
										<span class="in_handing"></span>
										<span class="status_content">{{schedule_lists.in_handing}}</span>
									</div>
									<div class="did_publish" v-if="scope.row.scheduleStatus == '5'">
										<span class="did_publish"></span>
										<span class="status_content">{{schedule_lists.did_publish}}</span>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column :label="schedule_lists.operation" min-width="220" align="center">
							<template slot-scope="scope">
								<div class="schedule_handle" v-if="scope.row.scheduleStatus == '0'">
									<div @click="scheduling(scope.row)">{{schedule_lists.scheduling}}</div>
									<div @click="handleWrite(scope.row)">{{schedule_lists.writing}}</div>
									<div @click="handlereomve(scope.row)">{{schedule_lists.reomve}}</div>
								</div>
								<div class="schedule_handle" v-if="scope.row.scheduleStatus != '0'">
									<div @click="checkDeatils(scope.row) ">{{schedule_lists.check_details}}</div>
									<div @click="checkSchedule(scope.row) ">{{schedule_lists.schedule}}</div>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<!--分页器-->
				<div class="branch_pagination schedules_list_pagination " v-if="!loading ">
					<span class="span_block ">{{schedule_lists.the}}{{currentPage}}{{schedule_lists.page}}，{{schedule_lists.shows}}{{pagesize}}{{schedule_lists.count}}，{{schedule_lists.total}}{{total}}{{schedule_lists.count}}</span>
					<el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page.sync="currentPage " :page-size="pagesize " background layout="prev, pager, next " :total="total ">
					</el-pagination>
				</div>
			</div>
		</div>

		<!-- 导出弹窗 -->
		<el-dialog class="export_file" :title="schedule_lists.schedule_export" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item :label="schedule_lists.schedule_type">
					<el-radio-group v-model="form.export_popup_radio_msg" @change="export_popup_radio">
						<el-radio :label="schedule_lists.all"></el-radio>
						<el-radio :label="schedule_lists.parttime"></el-radio>
						<el-radio :label="schedule_lists.fulltime"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item :label="schedule_lists.select_time">
					<div class="block">
						<el-date-picker v-model="export_popup_date" type="datetimerange" :start-placeholder="schedule_lists.start_date" value-format="yyyy-MM-dd HH:mm:ss" :end-placeholder="schedule_lists.end_date" @change="export_popup_date_fn">
						</el-date-picker>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="exportScheduleFile">{{schedule_lists.confirm}}</el-button>
				<el-button @click="dialogFormVisible = false">{{schedule_lists.cancel}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { formatDateTime } from '../../../utils/index'
import axios from '../../../axiosPath.js'
export default {
  data() {
    return {
      currentPage: 1, // 当前显示哪一页
      total: 0, // 数据的总条数
      pagesize: 7, // 每一页显示的条数
      pagercount: 9, // 分页器显示的个数,多余这个个数隐藏显示
      valueTime: '',
      valueStatus: '', //表示当前的状态
      isActive: 'fulltime', // 标记当前选择的是全职还是兼职
      branchTable: [],
      showPage: 2,
      isFulltime: false, // 是否是全职详情(具体可根据是否有预约时间来判断)
      loading: true, //表格数据是否在加载中
      styleObj: {
        background: '#F6F9FF'
      },
      scheduleTable: [], //班次配送员信息
      dialogFormVisible: false, //控制导出弹框的显示隐藏
      form: {
        export_popup_radio_msg: this.$t('schedule_lists.all')
      },
      export_popup_date: '' //导出日期
    }
  },
  beforeRouteLeave(to, from, next) {
    // 当组件离开列表页时记录当前的列表状态
    let param = {
      scheduleType: this.schedule_type,
      time: this.valueTime,
      status: this.$refs.state.value,
      currentPage: this.currentPage,
      showCount: this.pagesize
    }
    this.updateIsMenuList({ data: 'true' })
    localStorage.setItem('param', JSON.stringify(param))
    next()
  },
  computed: {
    ...mapState(['isMenuList']),
    schedule_lists() {
      return this.$t('schedule_lists')
    },
    schedule_type: {
      get() {
        if (this.isActive == 'parttime') {
          return parseInt(0)
        } else {
          return parseInt(1)
        }
      },
      set(newValue) {
        if (newValue == 1) {
          this.isActive = 'fulltime'
        } else {
          this.isActive = 'parttime'
        }
      }
    },
    currentStatus() {
      // 当前状态 全部 "" , 未发布 "0", 已发布 "1", 已结束 "2", 预约中 "3", 进行中 "4"
      return this.$refs.state.value
    },
    statusOptions() {
      if (this.isActive == 'parttime') {
        return [
          {
            value: '',
            label: this.$t('schedule_lists.all')
          },
          {
            value: '0',
            label: this.$t('schedule_lists.not_publish')
          },
          {
            value: '2',
            label: this.$t('schedule_lists.did_finished')
          },
          {
            value: '3',
            label: this.$t('schedule_lists.in_appointment')
          },
          {
            value: '4',
            label: this.$t('schedule_lists.in_handing')
          }
        ]
      } else {
        return [
          {
            value: '',
            label: this.$t('schedule_lists.all')
          },
          {
            value: '0',
            label: this.$t('schedule_lists.not_publish')
          },
          {
            value: '2',
            label: this.$t('schedule_lists.did_finished')
          },
          {
            value: '4',
            label: this.$t('schedule_lists.in_handing')
          },
          {
            value: '5',
            label: this.$t('schedule_lists.did_publish')
          }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.query.scheduleType == '1') {
      this.isActive = 'fulltime'
    } else if (this.$route.query.scheduleType == '0') {
      this.isActive = 'parttime'
    }
    console.log('isBack', this.$route.query)
    if (
      (!this.$route.query.scheduleType && this.isMenuList == 'false') ||
      this.$route.query.isBack == 'true'
    ) {
      console.log('params', JSON.parse(localStorage.getItem('param')))
      let params = JSON.parse(localStorage.getItem('param'))
      this.schedule_type = params.scheduleType
      this.valueTime = params.time
      this.$refs.state.value = params.status
      this.currentPage = params.currentPage
      this.pagesize = params.showCount
    }
    this.reqScheduleLists()
  },
  methods: {
    ...mapActions([
      'getScheduleLists',
      'deleteSchedule',
      'exportScheduleDetails'
    ]),
    ...mapMutations(['updateScheduleDate', 'updateIsMenuList']),
    async reqScheduleLists() {
      this.loading = true
      // 请求列表数据
      let param
      param = {
        scheduleType: this.schedule_type,
        time: this.valueTime,
        status: this.$refs.state.value,
        currentPage: this.currentPage,
        showCount: this.pagesize
      }
      let res = await this.getScheduleLists(param)
      if (res.data.code == 1) {
        this.total = res.data.data.totalResult
        let scheduleLists = []
        res.data.data.typesettingList.forEach(element => {
          let beginDate = formatDateTime(element.beginDate, 'ymd')
          let endDate = formatDateTime(element.endDate, 'ymd')
          let item = {
            schedule: `${beginDate} ~ ${endDate}`,
            beginDate: element.beginDate,
            endDate: element.endDate,
            count: element.count,
            id: element.id,
            scheduleStatus: element.scheduleStatus,
            groupNumber: element.groupNumber
          }
          scheduleLists.push(item)
        })
        this.scheduleTable = scheduleLists
        this.loading = false
      } else {
        this.$message.error(res.data.message)
        this.loading = false
      }
    },
    queryScheduleLists() {
      this.currentPage = 1
      this.reqScheduleLists()
    },
    changeSchedule(type) {
      //切换兼职或全职
      this.currentPage = 1
      if (type == 'parttime') {
        this.isActive = 'parttime'
      } else {
        this.isActive = 'fulltime'
      }
      this.scheduleTable = []
      this.reqScheduleLists()
    },
    changePage() {},
    handleSizeChange() {},
    handleCurrentChange(page) {
      // 点击分页器
      this.currentPage = page
      this.reqScheduleLists()
    },
    scheduling(row, index) {
      //点击排期的逻辑
      console.log(row.scheduleStatus)
      let date = [row.beginDate, row.endDate, row.scheduleStatus]
      localStorage.setItem('scheduleDate', JSON.stringify(date))
      let scheduleTime = row.schedule
      this.$router.push({
        path: '/business/business_sche',
        query: {
          id: row.id,
          schedule_type: this.isActive,
          scheduleType: this.schedule_type,
          status: row.scheduleStatus
        }
      })
    },
    handleWrite(row) {
      // 点击编辑的逻辑
      let scheduleTime = row.schedule.split(' ~ ')[0]
      this.$router.push({
        path: '/edit_schedule',
        query: {
          type: 'edit',
          scheduleId: row.id,
          schedule_type: this.isActive,
          date: scheduleTime
        }
      })
    },
    handlereomve(row) {
      // 点击删除的逻辑
      this.$confirm(
        `${this.schedule_lists.ask_delete_schedule}`,
        `${this.schedule_lists.confirm_again}`,
        {
          distinguishCancelAndClose: true,
          confirmButtonText: `${this.schedule_lists.confirm}`,
          cancelButtonText: `${this.schedule_lists.cancel}`,
          type: 'warning'
        }
      )
        .then(async () => {
          // 处理删除的逻辑(此处请求参数拼接在url后面)
          let params = {
            id: row.id
          }
          let res = await this.deleteSchedule({ params })
          if (res.data.code == '1') {
            this.reqScheduleLists() // 获取最新数据
            this.$message({
              type: 'success',
              message: `${this.schedule_lists.delete_success}`
            })
          }
        })
        .catch(action => {
          if (action == 'cancel') {
            this.$message({
              type: 'info',
              message: `${this.schedule_lists.cancel_delete}`
            })
          }
        })
    },
    checkDeatils(row) {
      //查看详情的逻辑
      let scheduleTime = row.schedule
      let sdate = row.beginDate
      let edate = row.endDate
      let scheduleId = row.id
      let scheduleType = this.schedule_type
      this.$router.push({
        path: '/employee_delivery_details',
        query: {
          details: 'true',
          sdate: sdate,
          edate: edate,
          scheduleId: scheduleId,
          scheduleType: scheduleType,
          status: row.scheduleStatus
        }
      })
    },
    checkSchedule(row) {
      // 查看班期的逻辑点击排期的逻辑
      let date = [row.beginDate, row.endDate, row.scheduleStatus]
      localStorage.setItem('scheduleDate', JSON.stringify(date))
      let scheduleTime = row.schedule
      this.$router.push({
        path: '/business/business_sche',
        query: {
          id: row.id,
          schedule_type: this.isActive,
          scheduleType: this.schedule_type,
          status: row.scheduleStatus
        }
      })
    },
    exportFile() {
      // 点击导出,(弹出导出弹框)
      this.dialogFormVisible = true
    },
    // 导出弹窗班期选择
    export_popup_radio(val) {
      console.log('val', val)
      this.form.export_popup_radio_msg = val
    },
    // 导出弹窗日期选择
    export_popup_date_fn(val) {
      if (val) {
        console.log(val)
        this.export_popup_start_time = val[0]
        this.export_popup_end_time = val[1]
      }
    },
    // 配送效率导出按钮
    async exportScheduleFile() {
      let status
      if (
        this.form.export_popup_radio_msg == '全部' ||
        this.form.export_popup_radio_msg == 'All'
      ) {
        status = 2
      } else if (
        this.form.export_popup_radio_msg == '兼职' ||
        this.form.export_popup_radio_msg == 'Part-timer'
      ) {
        status = 0
      } else if (
        this.form.export_popup_radio_msg == '全职' ||
        this.form.export_popup_radio_msg == 'Fulltimer'
      ) {
        status = 1
      }
      let sdate = this.export_popup_start_time
      let edate = this.export_popup_end_time
      let params = {
        status: status,
        sdate: sdate,
        edate: edate
      }
      window.location.href = `${
        axios.defaults.baseURL
      }innerService/getScheduleExcel?sdate=${sdate}&edate=${edate}&status=${status}`
      this.dialogFormVisible = false
    }
  }
}
</script>
<style lang="scss" scoped type="text/css">
@import '../../../assets/css/fulltime.css';
.schedules_list_contain {
  width: 100%;
  height: 100%;
  overflow: auto;
  .schedules_inner_contain {
    width: 100%;
    height: 92%;
    .schedules_header {
      width: 100%;
      height: 80px;
      display: flex;
      padding: 0 30px;
      align-items: center;
      background: #fff;
      .select_status {
        margin-left: 30px;
      }
      .inquire_contain {
        background: #ff644d;
        border-radius: 4px;
        width: 70px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        cursor: pointer;
        color: #fff;
        margin-left: 30px;
      }
      .export_button {
        margin-left: 30px;
      }
    }
    .schedules_list_content {
      margin-top: 20px;
      width: 100%;
      padding-bottom: 10px;
      padding-left: 30px;
      padding-right: 30px;
      background: #fff;
      .switch_schedules {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        .schedule_item {
          width: 100px;
          height: 20px;
          background: #fff;
          border-right: 2px solid #eee;
          float: left;
          text-align: center;
          line-height: 20px;
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
      .table_branch {
        .schedule_status {
          width: 100%;
          height: 100%;
          > div {
            text-align: center;
            span:first-child {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              vertical-align: middle;
            }
            .not_publish {
              background: #52c41a;
            }
            .did_publish {
              background: #a8a9eb;
            }
            .in_handing {
              background: #ff644d;
            }
            .in_appointment {
              background: #2094fe;
            }
            .did_finished {
              background: #b9b9b9;
            }
          }
        }
        .schedule_handle {
          display: flex;
          justify-content: center;
          align-items: center;
          > div {
            min-width: 65px;
            padding-right: 5px;
            text-align: center;
            border-right: 1px solid #1890ff;
            color: #1890ff;
            height: 18px;
            line-height: 18px;
            cursor: pointer;
            &:last-child {
              border-right: 0px solid #1890ff;
            }
          }
        }
      }
    }
    .branch_pagination {
      text-align: right;
      margin-top: 20px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .span_block {
        vertical-align: middle;
        color: #606266;
        font-size: 14px;
        display: inline-block;
        height: 32px;
        line-height: 32px;
      }
    }
  }
}
</style>
