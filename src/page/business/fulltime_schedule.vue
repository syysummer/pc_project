<template>
	<div class="fulltime_schedule">
		<div class="employ_all_wrap" v-if="!isPublish">
			<div class="employee">{{fulltimeSche.delivery_staff}}</div>
			<div class="employ_all">
				<draggable v-model="allArray" :options="{group: { name: 'people', pull: 'clone'}}" @start="drag=true" @end="handleEnd">
					<div class="employ_all_item" v-for="element in allArray " :key="element.deliveryId ">
						<span class="tag ">{{element.deliveryName.slice(0,1)}}</span>
						<span class="employ_name ">{{element.deliveryName}}</span>
					</div>
				</draggable>
			</div>
		</div>
		<div class="schedule_wrap " :class="{isPublish: isPublish} ">
			<!-- 排期日期选择及按钮部分 -->
			<div class="select_wrap ">
				<span class="label ">{{fulltimeSche.schedule_date}} :</span>
				<input v-model="timeValue" disabled :placeholder="fulltimeSche.please_select" class="syy_select_time" />
				<!-- <span class="wran ">{{fulltimeSche.restPre}}1{{fulltimeSche.restNext}}</span>  还差多少天作废暂时不做-->
				<div class="check_details " @click="checkDetails ">{{fulltimeSche.check_details}}</div>
			</div>
			<!-- 新建排期列表 -->
			<div class="schedule_list" v-if="!isPublish && scheduleList.length">
				<div class="schedule_item" v-for="(ele, index) in scheduleList">
					<div class="title ">{{chinanum(index)}}{{fulltimeSche.shift}}({{ele.beginTime}} ~ {{ele.endTime}})</div>
					<draggable class="drag_wrap" v-model="ele.groupDeliveryInfoList" :options="{group: 'people'} " @start="drag=true " @end="handleEnd">
						<div class="employ_specific_item" v-for="element in ele.groupDeliveryInfoList " :key="element.deliveryId ">
							<span class="tag ">{{element.deliveryName.slice(0,1)}}</span>
							<span class="employ_name ">{{element.deliveryName}}</span>
						</div>
					</draggable>
				</div>
			</div>
			<!-- 查看班期列表信息 -->
			<div class="schedule_list" v-if="isPublish && scheduleList.length">
				<div class="schedule_item" v-for="(ele, index) in scheduleList">
					<div class="title ">{{chinanum(index)}}{{fulltimeSche.shift}}({{ele.beginTime}} ~ {{ele.endTime}})
						<span v-if="ele.status != '0'">{{ele.regularNum}}/{{ele.arrangeDelivNum}}</span>
					</div>
					<draggable class="drag_wrap" :class="{didPublish: isPublish, isGray: ele.status == '1'|| ele.status == '2', isProcessing: ele.status == '0'}" v-model="ele.groupDeliveryInfoList" :options="{group: 'people', disabled: true} " @start="drag=true" @end="handleEnd">
						<div class="employ_specific_item" :class="{isAbsenceStatus: element.absenceStatus == '0', notAbsenceStatus : element.absenceStatus == '1'}" v-for="element in ele.groupDeliveryInfoList" :key="element.deliveryId ">
							<span class="tag">{{element.deliveryName.slice(0,1)}}</span>
							<span class="employ_name ">{{element.deliveryName}}</span>
						</div>
					</draggable>
				</div>
			</div>

			<!-- 数据为空时展示背景图, 暂时不需要 -->
			<!-- <div class="null_data" v-if="false">
				<div class="img_wrap">
					<img src="../../assets/images/null_data@2x.png" alt="">
					<div class="null_msg">暂无内容, 您可以新建班期</div>
				</div>
			</div> -->
		</div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getCookie } from '../../utils/cookies.js'
export default {
  data() {
    return {
      allArray: [], // 所有配送员
      scheduleList: [] // 班次列表
    }
  },
  computed: {
    ...mapState(['new_fulltime']),
    timeValue() {
      // 当前选中的时间
      let scheduleDate = JSON.parse(localStorage.getItem('scheduleDate'))
      if (scheduleDate) {
        return scheduleDate[0] + ' ~ ' + scheduleDate[1]
      }
    },
    fulltimeSche() {
      return this.$t('fulltime_schedule')
    },
    isPublish() {
      // 当前班期是否已经发布过
      let isNotPublish = localStorage.getItem('isNotPublish')
      if (isNotPublish == 'false') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    let isNotPublish = localStorage.getItem('isNotPublish')
    if (isNotPublish == 'false') {
      // 已经发布过了
      this.reqDidPublishSchedule()
    } else {
      // 根据scheduleId去请求数据
      this.getFulltimeSchedule()
    }
    this.$nextTick(() => {
      this.handleEnd()
    })
  },
  methods: {
    ...mapActions([
      'fulltimeSchedule',
      'saveSchedule',
      'publishSchedule',
      'reqScheduleDetail'
    ]),
    ...mapMutations(['updateIsMenuList']),
    chinanum(num) {
      // 将index转化为汉字
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
    handleEnd(evt) {
      // 拖拽的逻辑去重的逻辑
      let text = evt ? evt.clone.innerText.split(' ')[1] : ''
      this.drag = false
      // 对所有配送员去重
      for (let i = 0; i < this.allArray.length; i++) {
        for (let j = i + 1; j < this.allArray.length; j++) {
          if (this.allArray[i].deliveryId == this.allArray[j].deliveryId) {
            this.allArray.splice(j, 1)
            j--
          }
        }
      }
      this.allArray.sort((a, b) => {
        return a.deliveryName.charCodeAt(0) - b.deliveryName.charCodeAt(0)
      })
      // 去重逻辑(单个班次)
      this.scheduleList.forEach((ele, index) => {
        for (let i = 0; i < ele.groupDeliveryInfoList.length; i++) {
          for (let j = i + 1; j < ele.groupDeliveryInfoList.length; j++) {
            if (
              ele.groupDeliveryInfoList[i].deliveryId ==
              ele.groupDeliveryInfoList[j].deliveryId
            ) {
              this.$message.warning(`${text} ${this.fulltimeSche.arranged}`)
              ele.groupDeliveryInfoList.splice(j, 1)
              j--
            }
          }
        }
      })
    },
    checkDetails() {
      let scheduleId = localStorage.getItem('scheduleId')
      this.$router.push({
        path: '/employee_delivery_details',
        query: {
          scheduleId
        }
      })
    },
    async getFulltimeSchedule() {
      // 排班接口
      let scheduleId = localStorage.getItem('scheduleId')
      let scheduleType = localStorage.getItem('scheduleType')
      let res = await this.fulltimeSchedule({
        scheduleId,
        scheduleType
      })
      if (res.data.code == 1) {
        let data = res.data.data
        this.allArray = data.allFullTimeDeliveryList
        let scheduleList = []
        data.allGroupList.forEach(item => {
          if (item.groupDeliveryInfoList && item.groupDeliveryInfoList.length) {
          } else {
            item.groupDeliveryInfoList = []
          }
          scheduleList.push(item)
        })
        this.scheduleList = scheduleList
      } else {
        this.$message.error(res.data.message)
      }
    },
    async saveScheduleDetails() {
      // 保存的接口
      let deliveryId = []
      let flag = true
      this.scheduleList.forEach(item => {
        let deliveryItem = ''
        if (!item.groupDeliveryInfoList.length) {
          flag = false
          return
        }
        item.groupDeliveryInfoList.forEach((ele, index) => {
          if (index == 0) {
            deliveryItem += ele.deliveryId
          } else {
            deliveryItem = deliveryItem + ',' + ele.deliveryId
          }
        })
        deliveryId.push({ id: deliveryItem })
      })
      if (!flag) {
        // 有些班次没有安排配送员
        this.$message.error(this.fulltimeSche.delivery_must)
        return
      }
      let obj
      if (deliveryId.length) {
        // 安排了配送员
        obj = {
          scheduleId: localStorage.getItem('scheduleId'),
          deliveryId: JSON.stringify(deliveryId)
        }
      } else {
        // 未安排配送员
        obj = {
          scheduleId: localStorage.getItem('scheduleId'),
          deliveryId: JSON.stringify(deliveryId)
        }
      }
      let res = await this.saveSchedule(obj)
      if (res.data.code == '1') {
        this.updateIsMenuList({ data: 'false' })
        this.$router.replace({
          path: '/schedule_lists',
          query: {
            scheduleType: res.data.data
          }
        })
      } else {
        this.$message.error(res.data.message)
      }
    },
    async publishScheduleDeatils() {
      // 发布班期
      // 标记当前是否有班次没有没有安排配送员
      let flag = true
      let deliveryId = []
      this.scheduleList.forEach(item => {
        let deliveryItem = ''
        if (!item.groupDeliveryInfoList.length) {
          flag = false
          return
        }
        item.groupDeliveryInfoList.forEach((ele, index) => {
          if (index == 0) {
            deliveryItem += ele.deliveryId
          } else {
            deliveryItem = deliveryItem + ',' + ele.deliveryId
          }
        })
        deliveryId.push({ id: deliveryItem })
      })
      if (!flag) {
        // 有些班次没有安排配送员
        this.$message.error(this.fulltimeSche.schedule_need_people)
        return
      }
      let obj = {
        scheduleId: localStorage.getItem('scheduleId'),
        deliveryId: JSON.stringify(deliveryId),
        scheduleType: localStorage.getItem('scheduleType')
      }
      let res = await this.publishSchedule(obj)
      if (res.data.code == '1') {
        this.updateIsMenuList({ data: 'false' })
        this.$router.replace({
          path: '/schedule_lists',
          query: {
            scheduleType: res.data.data
          }
        })
      } else {
        this.$message.error(res.data.message)
      }
    },
    async reqDidPublishSchedule() {
      let scheduleId = localStorage.getItem('scheduleId')
      let scheduleType = localStorage.getItem('scheduleType')
      let res = await this.reqScheduleDetail({
        scheduleId: scheduleId,
        scheduleType: scheduleType
      })
      if (res.data.code == 1) {
        let data = res.data.data
        this.allArray = data.allFullTimeDeliveryList
        this.scheduleList = data.allGroupList
      } else {
        this.$message.error(res.data.message)
      }
    }
  },
  components: {
    draggable
  }
}
</script>

<style lang="scss" scoped type="text/css">
@import '../../assets/css/fulltime.css';
.fulltime_schedule {
  width: 100%;
  height: 100%;
  /*min-height: 400px;*/
  display: flex;
  justify-content: space-between;
  .employ_all_wrap {
    width: 22%;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    border-radius: 2px;
    .employee {
      width: 90%;
      height: 50px;
      margin: 0 auto;
      text-align: center;
      line-height: 50px;
      border-bottom: 1px solid #eee;
    }
    .employ_all {
      overflow: hidden;
      height: 93%;
      width: 100%;
      overflow: auto;
      .employ_all_item {
        width: 90%;
        height: 50px;
        margin: 6% auto;
        display: flex;
        justify-content: space-around;
        line-height: 50px;
        align-items: center;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        padding-bottom: 20px;
        color: rgba(255, 255, 255, 0.85);
        &:hover {
          transform: scale(1.05);
        }
        .tag {
          width: 40px;
          height: 40px;
          background: #42a4ff;
          border-radius: 50%;
          text-align: center;
          vertical-align: middle;
          line-height: 40px;
        }
        .employ_name {
          width: 70%;
          height: 40px;
          background: #42a4ff;
          border-radius: 19px;
          line-height: 40px;
          padding-left: 19px;
          padding-right: 19px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .schedule_wrap {
    width: 76%;
    height: 100%;
    background: #fff;
    padding-top: 5px;
    overflow: hidden;
    &.isPublish {
      width: 100%;
    }
    .select_wrap {
      height: 40px;
      padding-left: 20px;
      line-height: 40px;
      position: relative;
      .syy_select_time {
        width: 240px;
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
        border: 1px solid #ddd;
        outline: none;
        padding-left: 10px;
        background: #fff;
        cursor: no-drop;
      }
      .wran {
        margin-left: 20px;
        font-family: PingFangSC-Semibold;
        font-size: 13px;
        color: #ff644d;
        letter-spacing: 0;
      }
      .check_details {
        background: #3ea2ff;
        border-radius: 6px;
        width: 100px;
        height: 26px;
        line-height: 26px;
        color: #fff;
        text-align: center;
        border: none;
        position: absolute;
        right: 20px;
        top: 7px;
        cursor: pointer;
      }
    }
    .schedule_list {
      width: 100%;
      height: 94%;
      margin-top: 2px;
      display: flex;
      > div {
        width: 25%;
        flex: 1;
        text-align: center;
        border-right: 1px dashed #eee;
        padding-bottom: 5px;
        &:last-child {
          border-right: 0px dashed #eee;
        }
        .title {
          height: 40px;
          line-height: 40px;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #333333;
          background: rgba(228, 237, 252, 0.94);
        }
        .drag_wrap {
          height: 92%;
          width: 100%;
          overflow: auto;
          .employ_specific_item {
            width: 90%;
            max-width: 400px;
            height: 50px;
            margin: 4% auto;
            display: flex;
            justify-content: space-around;
            line-height: 50px;
            align-items: center;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.85);
            .tag {
              width: 40px;
              height: 40px;
              background: #5acb75;
              border-radius: 50%;
              text-align: center;
              vertical-align: middle;
              line-height: 40px;
            }
            .employ_name {
              width: 70%;
              height: 40px;
              background: #5acb75;
              border-radius: 19px;
              line-height: 40px;
              padding-left: 19px;
              text-align: left;
              padding-right: 19px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          &.didPublish {
            cursor: no-drop;
            &.isGray {
              .tag {
                background: #d2d2d2;
              }
              .employ_name {
                background: #d2d2d2;
              }
            }
            &.isProcessing {
              .isAbsenceStatus {
                .tag {
                  background: #ff644d;
                }
                .employ_name {
                  background: #ff644d;
                }
              }
              .notAbsenceStatus {
                .tag {
                  background: #3ea2ff;
                }
                .employ_name {
                  background: #3ea2ff;
                }
              }
            }
          }
        }
      }
    }
    .null_data {
      width: 100%;
      height: 100%;
      .img_wrap {
        width: 400px;
        margin: 100px auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .null_msg {
        margin: 50px auto;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.45);
        letter-spacing: 0;
        line-height: 28px;
      }
    }
  }
}
</style>
