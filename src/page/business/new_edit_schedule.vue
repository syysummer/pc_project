<template>
	<div class="new_edit_schedule_wrap">
		<!-- 当前进入的状态 -->
		<div class="new_header" v-if="isNew">
			<div class="delivery_type">{{edit_schedule.delivery_type}}</div>
			<div class="radio_wrap">
				<el-radio v-model="radio" label="1">{{edit_schedule.fulltime}}</el-radio>
				<el-radio v-model="radio" label="2">{{edit_schedule.parttime}}</el-radio>
			</div>
		</div>
		<div class="edit_header" v-if="!isNew">
			<div class="delivery_type">{{edit_schedule.delivery_type}}</div>
			<div class="type_wrap">
				<div class="fulltime_title" v-if="distrubute_type == 'fulltime'">{{edit_schedule.fulltime}}</div>
				<div class="parttime_title" v-if="distrubute_type == 'parttime'">{{edit_schedule.parttime}}</div>
			</div>
		</div>
		<!-- 选择薪酬 -->
		<div class="select_salary">
			<div class="salary_label">{{edit_schedule.select_salary}} : </div>
			<div class="block">
				<el-select class="new_salary_wrap" v-model="salaryValue" @change="changeSalaryTime" :placeholder="edit_schedule.please_select">
					<el-option v-for="item in salaryOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
		</div>
		<!-- 排班日期 -->
		<div class="schedule_date" :class="{isPartNew: isNew && schedule_type === 0, isEnglish: lang == 'en'}">
			<div class="date_label">{{edit_schedule.schedule_date}}</div>
			<div class="block syy_date_select">
				<el-date-picker :picker-options="pickerOptions" :disabled="!isNew" v-model="timeData" @change="dateChange" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :start-placeholder="edit_schedule.start_date" :end-placeholder="edit_schedule.end_date" :default-time="['00:00:00', '23:59:59']">
				</el-date-picker>
				<p class="prompt" v-if="isNew && schedule_type === 0">{{edit_schedule.new_part_prompt}}</p>
			</div>
		</div>
		<!-- 选择班期 -->
		<div class="select_schedule">
			<div class="select_schedule_label">{{edit_schedule.select_schedule}}</div>
			<div class="select_schedule_list">
				<div class="schedule_row" v-for="(item, index) in scheduleList">
					<div class="shift_title">{{chinanum(index)}} {{edit_schedule.shift}}
						<span class="addSchedule" v-if="index == 0" @click="addSchedule">{{edit_schedule.add}}</span>
						<span class="removeSchedule" v-if="index != 0" @click="removeSchedule(index,item.groupId)">{{edit_schedule.remove}}</span>
					</div>
					<div class="shift_time">
						<el-time-picker class="el-time-select" size="small" :placeholder="edit_schedule.starttime" v-model="item.beginTime" format="HH:mm" value-format="HH:mm" :picker-options="{
										format:'HH:mm'
										}">
						</el-time-picker>
						<span class="middle_line"></span>
						<el-time-picker class="el-time-select" size="small" :placeholder="edit_schedule.endtime" v-model="item.endTime" format="HH:mm" value-format="HH:mm" :picker-options="{
										 	format:'HH:mm'
										}">
						</el-time-picker>
						<span v-if="radio == '2' || distrubute_type == 'parttime'" class="need_people">{{edit_schedule.need_people}}</span>
						<input v-if="radio == '2' || distrubute_type == 'parttime'" class="need_people_inp" v-model="item.needNum" type="text" @blur="checkPeople(item.needNum, index)" :placeholder="edit_schedule.please_ente">
						<br/>
						<span class="salary_label">{{edit_schedule.select_salary}}</span>
						<el-select class="select_item_salary" size="small" v-model="item.timeSalaryRule" :placeholder="edit_schedule.please_select_salary">
							<el-option v-for="item in itemSalaryOptions" :key="item.value" :label="item.label" :value="item.label">
								<span style="float: left">{{ item.label }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
							</el-option>
						</el-select>
					</div>
				</div>
			</div>
		</div>

		<!-- 预约设置 -->
		<div class="reservation_setting" v-if="radio == '2' || distrubute_type == 'parttime'">
			<div class="reservation_label">{{edit_schedule.reservation_setting}}</div>
			<div class="reservation_inp_wrap">
				<input type="text" class="reservation_inp" :placeholder="edit_schedule.reservation_inp" @blur="checkReservation(reservationSetting)" v-model="reservationSetting">
				<span class="hour">H</span>
			</div>
		</div>

		<!-- 备注 -->
		<div class="remarks">
			<div class="remarks_label">{{edit_schedule.remarks}}
				<p>{{edit_schedule.optional}}</p>
			</div>
			<div class="remarks_inp_wrap">
				<el-input class="remarks_inp" maxLength="100" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" :placeholder="edit_schedule.input_content" v-model="remarksMsg">
				</el-input>
				<span class="max_length">{{remarksMsg.length}} / 100</span>
			</div>
		</div>

		<!-- 确认与取消 -->
		<div class="btn_wrap">
			<div class="confirm" @click="confirmSubmit">{{edit_schedule.confirm}}</div>
			<div class="cancel" @click="cancelSubmit">{{edit_schedule.cancel}}</div>
		</div>

	</div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { formatDateTime } from '../../utils/index'
import { getCookie } from '../../utils/cookies.js'
export default {
  data() {
    return {
      isNew: true, // true表示是新建, false表示是编辑
      distrubute_type: '', //只有是编辑排班的时候才会使用
      radio: '1', // 1表示全职, 2表示兼职
      timeData: '', //当前时间,
      currentSchedule: 0, //当前班次
      reservationSetting: '', //预约设置
      remarksMsg: '', //备注的内容
      isSubmitComfirm: false, // 标识当前是否确定新建或修改
      scheduleId: '',
      lang: getCookie('lang'),
      scheduleList: [
        {
          beginTime: '',
          endTime: '',
          needNum: '',
          timeSalaryRule: '',
          id: '',
          groupId: ''
        }
      ],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      salaryData: [],
      salaryValue: '', //当前薪酬配置
      salaryOptions: [], // 请求回来的薪酬列表
      itemSalaryOptions: [], //单个班次薪酬可选值
      deliverySalaryId: '', // 薪酬id
      deliverySalaryLabel: '' // 薪酬时间
    }
  },
  mounted() {
    // 新建排班时实现自动切换兼职和全职
    if (
      this.$route.query.type == 'new' &&
      this.$route.query.schedule_type == 'parttime'
    ) {
      this.radio = '2'
    }
    // 编辑未发布排班时自动展示兼职和全职
    if (this.$route.query.type == 'edit') {
      this.isNew = false
      if (this.$route.query.schedule_type == 'parttime') {
        this.distrubute_type = 'parttime'
      } else {
        this.distrubute_type = 'fulltime'
      }
      // 调用当前班次的接口更新相应的数据
      this.scheduleId = this.$route.query.scheduleId
      this.EditUnPublishSchedule()
    }
    this.getSalaryList() // 获取薪酬列表需要获取当期配送状态之后再请求
  },
  computed: {
    ...mapState(['new_fulltime', 'new_parttime']),
    currentScheduleData() {
      if (this.radio == '1') {
        return this.new_fulltime
      } else {
        return this.new_parttime
      }
    },
    edit_schedule() {
      return this.$t('edit_schedule')
    },
    schedule_type() {
      if (
        (this.isNew && this.radio == '1') ||
        (!this.isNew && this.distrubute_type == 'fulltime')
      ) {
        return parseInt(1)
      } else if (
        (this.isNew && this.radio == '2') ||
        (!this.isNew && this.distrubute_type == 'parttime')
      ) {
        return parseInt(0)
      }
    }
  },
  methods: {
    ...mapMutations(['saveFulltime', 'saveParttime', 'updateIsMenuList']),
    ...mapActions([
      'newEditSchedule',
      'getDeliverySalaryList',
      'getUnPublishSchedule',
      'updateUnPublishSchedule',
      'deleteSingleSchedule'
    ]),
    checkPeople(value, index) {
      let reg = /[^\d]/g
      if (reg.test(value)) {
        // 暂不处理
      }
    },
    checkReservation(value) {
      // 暂不做处理
    },
    isEmojiCharacter(substring) {
      for (var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i)
        if (0xd800 <= hs && hs <= 0xdbff) {
          if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1)
            var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true
            }
          }
        } else if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1)
          if (ls == 0x20e3) {
            return true
          }
        } else {
          if (0x2100 <= hs && hs <= 0x27ff) {
            return true
          } else if (0x2b05 <= hs && hs <= 0x2b07) {
            return true
          } else if (0x2934 <= hs && hs <= 0x2935) {
            return true
          } else if (0x3297 <= hs && hs <= 0x3299) {
            return true
          } else if (
            hs == 0xa9 ||
            hs == 0xae ||
            hs == 0x303d ||
            hs == 0x3030 ||
            hs == 0x2b55 ||
            hs == 0x2b1c ||
            hs == 0x2b1b ||
            hs == 0x2b50
          ) {
            return true
          }
        }
      }
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
    dateChange() {
      // 选择的时间发生变化时的回调
    },
    async EditUnPublishSchedule() {
      // 编辑未发布的班期
      let params = {
        id: this.$route.query.scheduleId + '',
        date: this.$route.query.date
      }
      let res = await this.getUnPublishSchedule({ params })
      if (res.data.code == 1) {
        let data = res.data.data.result
        this.deliverySalaryId = data.deliverySalaryId
        this.timeData = [data.beginDate, data.endDate]
        if (data.scheduleType == '0') {
          this.distrubute_type = 'parttime'
        }
        data.groupList.forEach(item => {
          // 统一编辑和新建时的薪酬显示效果
          item.timeSalaryRule = item.timeSalaryRule + 'P/min'
        })
        this.scheduleList = data.groupList
        this.reservationSetting = data.deliveryMaxTime
        if (data.remark) {
          this.remarksMsg = data.remark
        }
        this.getSalaryList() //当数据请求回来之后判断
      } else {
        this.$message.error(res.data.message)
        this.$router.go(-1)
      }
    },
    async getSalaryList() {
      // 请求薪酬列表数据
      let res = await this.getDeliverySalaryList({
        type: this.schedule_type,
        showCount: 7
      })
      if (res.data.code == 1) {
        let data = res.data.data
        let salaryOptions = []
        this.salaryData = data
        data.deliverySalaryList.forEach((item, index) => {
          console.log('item', item)
          let createTime = formatDateTime(item.createTime, 'ymd')
          let value =
            createTime +
            ' ' +
            item.minTime +
            ' ~ ' +
            createTime +
            ' ' +
            item.maxTime
          let obj = {
            label: value,
            value: `${index}`,
            id: item.id
          }
          salaryOptions.push(obj)
        })
        this.salaryOptions = salaryOptions
        // 更新薪酬部分
        salaryOptions.forEach((item, index) => {
          if (this.deliverySalaryId === item.id) {
            this.deliverySalaryLabel = item.value
            this.salaryValue = item.value
            let itemSalaryOptions = []
            let salaryRule = JSON.parse(
              this.salaryData.deliverySalaryList[item.value].salaryRule
            )
            console.log('salaryRule=====', this.salaryOptions)
            if (salaryRule) {
              salaryRule.forEach((item, index) => {
                let message = item.startTime + '~' + item.endTime
                let obj = {
                  label: `${item.salary}P/min`,
                  value: message
                }
                itemSalaryOptions.push(obj)
              })
              this.itemSalaryOptions = itemSalaryOptions
              // 以上更新薪酬部分
            }
          }
        })
        if (!salaryOptions.length) {
          this.$message.info(this.edit_schedule.salary_forbid_null)
          this.$router.push('/salary_set?id=' + this.radio)
        }
      } else {
        this.$message.error(res.data.message)
      }
    },
    changeSalaryTime(value) {
      this.deliverySalaryId = this.salaryOptions[value].id
      this.deliverySalaryLabel = this.salaryOptions[value].label
      this.scheduleList.forEach(item => {
        item.timeSalaryRule = ''
      })
      let itemSalaryOptions = []
      let salaryRule = JSON.parse(
        this.salaryData.deliverySalaryList[value].salaryRule
      )
      salaryRule.forEach((item, index) => {
        let message = item.startTime + '~' + item.endTime
        let obj = {
          label: `${item.salary}P/min`,
          value: message
        }
        itemSalaryOptions.push(obj)
      })
      this.itemSalaryOptions = itemSalaryOptions
    },
    addSchedule() {
      //请求添加一个班次
      if (this.scheduleList.length >= 12 && this.radio == '2' && this.isNew) {
        this.$message.warning(this.edit_schedule.parttime_most)
        return
      }
      if (this.scheduleList.length >= 4 && this.radio == '1' && this.isNew) {
        this.$message.warning(this.edit_schedule.fulltime_most)
        return
      }
      if (
        this.scheduleList.length >= 12 &&
        this.distrubute_type == 'parttime' &&
        !this.isNew
      ) {
        this.$message.warning(this.edit_schedule.parttime_most)
        return
      }
      if (
        this.scheduleList.length >= 4 &&
        this.distrubute_type == 'fulltime' &&
        !this.isNew
      ) {
        this.$message.warning(this.edit_schedule.fulltime_most)
        return
      }
      this.currentSchedule = this.scheduleList.length
      this.scheduleList.push({
        needNum: '',
        beginTime: '',
        endTime: '',
        timeSalaryRule: '',
        id: '',
        groupId: ''
      })
    },
    removeSchedule(index, id) {
      // 移除一个班次
      if (id) {
        let groupId = id
        this.deleteSSchedule(groupId)
      }
      this.scheduleList.splice(index, 1)
      this.currentSchedule = this.scheduleList.length - 1
    },
    async confirmSubmit() {
      if (this.isSubmitComfirm) {
        return
      }
      //提交相应的班期
      if (!this.salaryValue) {
        this.$message.warning(this.edit_schedule.salary_null)
        return
      }
      if (!this.timeData) {
        this.$message.warning(this.edit_schedule.schedule_time_null)
        return
      }
      let flag = true
      let flagNum = true
      this.scheduleList.forEach(element => {
        console.log('element', element.beginTime)
        if (!element.beginTime) {
          this.$message.warning(this.edit_schedule.starttime_null)
          flag = false
          return
        } else if (!element.endTime) {
          this.$message.warning(this.edit_schedule.endtime_null)
          flag = false
          return
        } else if (
          (this.radio == '2' && element.needNum === '') ||
          (this.distrubute_type == 'parttime' && element.needNum === '')
        ) {
          flag = false
          this.$message.warning(this.edit_schedule.needPeople_null)
          return
        } else if (
          this.schedule_type === 0 &&
          element.needNum &&
          /[^\d]/g.test(element.needNum)
        ) {
          flag = false
          this.$message.error(this.edit_schedule.needPeople_must_number)
          return
        } else if (!element.timeSalaryRule) {
          flag = false
          this.$message.warning(this.edit_schedule.salary_null)
          return
        }
      })
      if (!flag) {
        return
      }
      if (this.schedule_type === 0 && !this.reservationSetting) {
        this.$message.warning(this.edit_schedule.reservation_setting_null)
        return
      } else if (
        this.schedule_type === 0 &&
        this.reservationSetting &&
        /[^\d]/g.test(this.reservationSetting)
      ) {
        this.$message.error(this.edit_schedule.reservation_must_number)
        return
      }
      if (this.remarksMsg && this.isEmojiCharacter(this.remarksMsg)) {
        this.$message.error(this.edit_schedule.remark_smile)
        return
      }
      // 保存新建信息
      let scheduleList = []
      this.scheduleList.forEach(item => {
        let scheduleItem = JSON.parse(JSON.stringify(item))
        if (/[P]/g.test(scheduleItem.timeSalaryRule)) {
          console.log(
            'scheduleItem.timeSalaryRule',
            scheduleItem.timeSalaryRule
          )
          scheduleItem.timeSalaryRule =
            parseFloat(scheduleItem.timeSalaryRule) + '' // 转化成字符串
        }
        scheduleList.push(scheduleItem)
      })
      // 更新state中的日期状态
      let date = this.timeData
      localStorage.setItem('scheduleDate', JSON.stringify(date))
      // 新建时保存新建信息
      this.isSubmitComfirm = true // 更新isSubmitComfirm的值
      if (this.isNew) {
        let param
        if (this.radio == '1') {
          param = {
            scheduleType: this.schedule_type,
            beginDate: this.timeData[0],
            endDate: this.timeData[1],
            groupList: JSON.stringify(scheduleList),
            remark: this.remarksMsg,
            deliverySalaryId: this.deliverySalaryId
          }
        } else {
          param = {
            scheduleType: this.schedule_type,
            beginDate: this.timeData[0],
            endDate: this.timeData[1],
            groupList: JSON.stringify(scheduleList),
            deliveryMaxTime: this.reservationSetting,
            remark: this.remarksMsg,
            deliverySalaryId: this.deliverySalaryId
          }
        }
        let res = await this.newEditSchedule(param)
        if (res.data.code == 1) {
          //保存成功的逻辑
          localStorage.setItem('scheduleId', res.data.data)
          this.updateIsMenuList({ data: 'false' })
          this.$router.push({
            path: '/business/business_sche',
            query: {
              id: res.data.data,
              edit_type: 'new',
              scheduleFlag: this.radio, // "1"全职, "2"兼职
              status: '0',
              scheduleType: this.schedule_type
            }
          })
          this.isSubmitComfirm = false
        } else {
          this.isSubmitComfirm = false
          this.$message.error(res.data.message)
        }
      } else {
        // 编辑时保存修改信息
        let params
        if (this.distrubute_type == 'parttime') {
          params = {
            id: this.scheduleId,
            remark: this.remarksMsg,
            bespeakTime: parseInt(this.reservationSetting),
            groupList: JSON.stringify(scheduleList),
            deliverySalaryId: this.deliverySalaryId
          }
        } else {
          params = {
            id: this.scheduleId,
            remark: this.remarksMsg,
            groupList: JSON.stringify(scheduleList),
            deliverySalaryId: this.deliverySalaryId
          }
        }
        console.log('schedule_type', this.schedule_type)
        let res = await this.updateUnPublishSchedule(params)
        if (res.data.code == '1') {
          // 编辑成功
          //保存成功的逻辑
          localStorage.setItem('scheduleId', this.scheduleId)
          this.$router.push({
            path: '/business/business_sche',
            query: {
              id: this.scheduleId,
              edit_type: 'new',
              status: '0',
              scheduleFlag: this.distrubute_type, // "parttime", "fulltime"
              scheduleType: this.schedule_type
            }
          })
          this.isSubmitComfirm = false
        } else {
          this.isSubmitComfirm = false
          this.$message.error(res.data.message)
        }
      }
    },
    async deleteSSchedule(groupId) {
      let params = {
        id: groupId
      }
      let res = await this.deleteSingleSchedule({ params })
    },
    cancelSubmit() {
      //取消相应的班期
      this.updateIsMenuList({ data: 'false' })
      this.$router.replace({
        path: '/schedule_lists',
        query: {
          isBack: 'true',
          scheduleType: this.schedule_type,
          scheduleId: this.scheduleId
        }
      })
    }
  },
  watch: {
    radio() {
      // 清空薪酬信息
      this.salaryValue = ''
      this.deliverySalaryId = ''
      this.itemSalaryOptions = []
      this.scheduleList.forEach(item => {
        item.timeSalaryRule = ''
      })
      // 监听兼职与全职的切换, 保存当前的数据
      if (this.radio == '1') {
        let parttimeData = {
          timeData: this.timeData,
          salaryOptions: this.salaryOptions,
          currentSchedule: this.currentSchedule,
          reservationSetting: this.reservationSetting,
          remarksMsg: this.remarksMsg,
          scheduleList: this.scheduleList
        }
        this.saveParttime({ data: parttimeData })
      } else {
        let fulltimeData = {
          timeData: this.timeData,
          salaryOptions: this.salaryOptions,
          currentSchedule: this.currentSchedule,
          reservationSetting: this.reservationSetting,
          remarksMsg: this.remarksMsg,
          scheduleList: this.scheduleList
        }
        this.saveFulltime({ data: fulltimeData })
      }
      this.timeData = this.currentScheduleData.timeData
      this.salaryOptions = this.currentScheduleData.salaryOptions
      this.currentSchedule = this.currentScheduleData.currentSchedule
      this.reservationSetting = this.currentScheduleData.reservationSetting
      this.remarksMsg = this.currentScheduleData.remarksMsg
      this.scheduleList = this.currentScheduleData.scheduleList
      this.getSalaryList()
    }
  },
  beforeRouteLeave(to, from, next) {
    // 离开当前页面是清空数据
    this.saveFulltime({
      data: {
        timeData: '',
        currentSchedule: 0,
        reservationSetting: '',
        remarksMsg: '',
        scheduleList: [
          {
            beginTime: '',
            endTime: '',
            needNum: '',
            timeSalaryRule: '',
            id: '',
            groupId: ''
          }
        ]
      }
    })
    this.saveParttime({
      data: {
        timeData: '',
        currentSchedule: 0,
        reservationSetting: '',
        remarksMsg: '',
        scheduleList: [
          {
            beginTime: '',
            endTime: '',
            needNum: '',
            timeSalaryRule: '',
            id: '',
            groupId: ''
          }
        ]
      }
    })
    next()
  }
}
</script>

<style lang="scss" scoped type="text/css">
@import '../../assets/css/fulltime.css';
.new_edit_schedule_wrap {
  width: 100%;
  height: 100%;
  min-width: 850px;
  background: #fff;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 30px;
  overflow: auto;
  .new_header {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    .delivery_type {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 22px;
    }
    .radio_wrap {
      height: 100%;
      margin-left: 20px;
      line-height: 22px;
    }
  }
  .edit_header {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    .delivery_type {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 22px;
    }
    .type_wrap {
      height: 100%;
      margin-left: 20px;
      line-height: 22px;
    }
  }
  .select_salary {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    margin-bottom: 10px;
    .salary_label {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .block {
      height: 100%;
      margin-left: 20px;
    }
  }
  .schedule_date {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    margin-top: 5px;
    .date_label {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .block {
      height: 100%;
      width: 40%;
      min-width: 650px;
      margin-left: 20px;
      .prompt {
        font-size: 14px;
        color: #ababab;
        width: 100%;
      }
    }
    &.isPartNew {
      height: 60px;
      &.isEnglish {
        height: 68px;
        .prompt {
          line-height: 20px;
        }
      }
    }
  }
  .select_schedule {
    width: 100%;
    margin-top: 10px;
    display: flex;
    .select_schedule_label {
      height: 40px;
      width: 100px;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      margin-right: 20px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .select_schedule_list {
      // padding-right: 10px;
      width: 40%;
      min-width: 650px;
      .schedule_row {
        width: 100%;
        min-width: 650px;
        background: #fbfbfb;
        padding: 20px;
        padding-right: 10px;
        margin-top: 10px;
        padding-top: 10px;
        .shift_title {
          font-family: PingFangSC-Semibold;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.9);
          line-height: 22px;
          margin-bottom: 10px;
          .addSchedule {
            margin-left: 20px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #1890ff;
            line-height: 22px;
            cursor: pointer;
            float: right;
            margin-right: 5px;
          }
          .removeSchedule {
            margin-left: 20px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #1890ff;
            line-height: 22px;
            cursor: pointer;
            float: right;
            margin-right: 5px;
          }
        }
        .shift_time {
          line-height: 40px;
          .el-time-select {
            width: 140px;
          }
          .middle_line {
            width: 30px;
            display: inline-block;
            border: 1px solid #d9d9d9;
          }
          .need_people,
          .salary_label {
            margin-left: 15px;
            margin-right: 5px;
          }
          .salary_label {
            margin-left: 0px;
            margin-top: 5px;
          }
          .need_people_inp,
          .salary_input {
            display: inline-block;
            height: 30px;
            width: 140px;
            background: #ffffff;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            padding-left: 10px;
            line-height: 30px;
          }
          .need_people_inp::-webkit-input-placeholder {
            font-size: 14px;
          }
        }
      }
    }
  }
  .reservation_setting {
    width: 100%;
    height: 40px;
    display: flex;
    line-height: 40px;
    margin-top: 20px;
    .reservation_label {
      width: 100px;
      height: 100%;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .reservation_inp_wrap {
      height: 100%;
      margin-left: 20px;
      position: relative;
      .reservation_inp {
        background: #ffffff;
        width: 286px;
        height: 40px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding-left: 10px;
        // &.notDisable {
        //   cursor: no-drop;
        // }
      }
      .hour {
        height: 40px;
        line-height: 40px;
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
  }
  .remarks {
    width: 100%;
    display: flex;
    margin-top: 20px;
    .remarks_label {
      width: 100px;
      height: 60px;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      text-align: left;
      color: rgba(0, 0, 0, 0.9);
      line-height: 30px;
      p {
        color: #ababab;
      }
    }
    .remarks_inp_wrap {
      height: 100%;
      position: relative;
      margin-left: 20px;
      .remarks_inp.el-textarea {
        background: #ffffff;
        width: 600px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 18px;
        line-height: 40px;
      }
      .max_length {
        position: absolute;
        bottom: 4px;
        right: 20px;
        font-size: 12px;
        color: #c3c3c3;
      }
    }
  }
  .btn_wrap {
    margin-left: 120px;
    display: flex;
    margin-top: 30px;
    justify-content: start;
    > div {
      width: 80px;
      height: 40px;
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }
    .confirm {
      background: #1890ff;
      color: #fff;
    }
    .cancel {
      border: 1px solid #d9d9d9;
      margin-left: 30px;
    }
  }
}
</style>
