<template>
  <div class="calendar_content cannot_select">
    <div class="calendar_haeader">
      <el-date-picker v-model="value" type="month" @change="setMonth" format="yyyy-MM" value-format="yyyy-MM"
        :clearable=false>
      </el-date-picker>
      <span class="demonstratioån"></span>
    </div>
    <ul v-if="language == 'zh'" class="week_contain">
      <li v-for="(item, index) in week_data_zh" :key="index">{{item}}</li>
    </ul>
    <ul v-if="language == 'en'" class="week_contain">
      <li v-for="(item, index) in week_data_en" :key="index">{{item}}</li>
    </ul>
    <div class="calendar_detail">

      <!-- 月排班展示 -->
      <ul class="details_contain">
        <li v-for="(item, index) in dateArray" :key="index">
          <div class="gray_mask"></div>
          <div class="date_top">
            <div class="date_top_box" :class="{is_today: item.daysNum==new Date().getDate() && (value.split('-')[1] == (new Date().getMonth()+1)) && value.split('-')[0] == new Date().getFullYear() }">
              {{item.daysNum}}
            </div>
          </div>
          <div class="schedules_contain" :class="{is_today: item.daysNum==new Date().getDate() && (value.split('-')[1] == (new Date().getMonth()+1)) && value.split('-')[0] == new Date().getFullYear() }"
            v-if="item.daysNum != ''" @click="show_details(item.daysNum)">
            <p v-if="item.gradeContent[0]">
              <span v-if="language=='zh'">1班</span>
              <span v-if="language=='en'">1st</span>:
              {{item.gradeContent[0].regularNum}}/{{item.gradeContent[0].groupAppointmentNum}}
            </p>
            <p v-if="item.gradeContent[1]">
              <span v-if="language=='zh'">2班</span>
              <span v-if="language=='en'">2nd</span>:
              {{item.gradeContent[1].regularNum}}/{{item.gradeContent[1].groupAppointmentNum}}
            </p>
            <p v-if="item.gradeContent[2]">
              <span v-if="language=='zh'">3班</span>
              <span v-if="language=='en'">3ed</span>:
              {{item.gradeContent[2].regularNum}}/{{item.gradeContent[2].groupAppointmentNum}}
            </p>
          </div>
        </li>
      </ul>

    </div>

    <!-- 右侧详情框遮罩 -->
    <div class="schedule-dialog-task" v-if="dialogShow"></div>
    <!-- 右侧详情框 -->
    <div class="schedule-dialog" :class="{moveShow: dialogShow}" @click="dialogShow=false">
      <div class="dialog-box">
        <div class="close">
          <i class="el-icon-close" @click="dialogShow=false"></i>
        </div>
        <div class="date-box">
          <div class="day">{{ new Date(getSelectSchedule.timeStamp).getDate() }}</div>
          <div class="date" v-if="language=='zh'">
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 0">星期日</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 1">星期一</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 2">星期二</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 3">星期三</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 4">星期四</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 5">星期五</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 6">星期六</p>
            <div>
              <span>
                {{ new Date(getSelectSchedule.timeStamp).getMonth() + 1 }}月
              </span>
              {{ new Date(getSelectSchedule.timeStamp).getFullYear() }}
            </div>
          </div>
          <div class="date" v-if="language=='en'">
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 0">Sunday</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 1">Monday</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 2">Tuesday</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 3">Wednesday</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 4">Thursday</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 5">Friday</p>
            <p v-if="new Date(getSelectSchedule.timeStamp).getDay() == 6">Saturday</p>
            <div>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 0">Jan.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 1">Feb.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 2">Mar.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 3">Apr.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 4">May.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 5">Jun.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 6">Jul.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 7">Mar.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 8">Sept.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 8">Oct.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 10">Nov.</span>
              <span v-if="new Date().getMonth(getSelectSchedule.timeStamp) == 11">Dec.</span>
              {{ new Date(getSelectSchedule.timeStamp).getFullYear() }}
            </div>
          </div>
          <!-- 状态图标 -->
          <div class="status_img" v-if="language=='zh'">
            <img v-if="getSelectSchedule.resultDate[getSelectSchedule.resultDate.length-1].status == 0" src="../../../assets/images/ing.png" />
            <img v-if="getSelectSchedule.resultDate[getSelectSchedule.resultDate.length-1].status == 1" src="../../../assets/images/is_over.png" />
            <img v-if="getSelectSchedule.resultDate[getSelectSchedule.resultDate.length-1].status == 2" src="../../../assets/images/appointment.png" />
            <img v-if="getSelectSchedule.resultDate[getSelectSchedule.resultDate.length-1].status == 3" src="../../../assets/images/unpublished.png" />
          </div>
          <div class="status_img" v-if="language=='en'">
            <img v-if="getSelectSchedule.resultDate[getSelectSchedule.resultDate.length-1].status == 0" src="../../../assets/images/ing_en.png" />
            <img v-if="getSelectSchedule.resultDate[getSelectSchedule.resultDate.length-1].status == 1" src="../../../assets/images/is_over_en.png" />
            <img v-if="getSelectSchedule.resultDate[getSelectSchedule.resultDate.length-1].status == 2" src="../../../assets/images/appointment_en.png" />
            <img v-if="getSelectSchedule.resultDate[getSelectSchedule.resultDate.length-1].status == 3" src="../../../assets/images/unpublished_en.png" />
          </div>
        </div>
        <div class="schedule-box-list">
          <!-- 班次列表 -->
          <div class="list-detail" v-for="(item, index) in getSelectSchedule.resultDate" :key="index">
            <div class="time">
              <img src="../../../assets/icons/el-icon-time.png" />
            </div>
            <div class="list-right">
              <div class="list-top" :class="{is_over: item.status==1}">
                {{chinanum(index)}}（{{item.beginTime}} - {{item.endTime}}）
              </div>
              <div class="person-list">
                <div class="person" :class="{absence: elem.openStatus==1}" v-for="(elem, index) in item.groupDeliveryInfoList"
                  :key="index">
                  {{elem.deliveryName}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="schedule-edit">
          <div class="edit-button" @click="to_edit" v-if="getSelectSchedule.resultDate[0].status == 3">{{$t('salary_list.edit')}}</div>
          <div class="edit-button" @click="look_details" v-if="getSelectSchedule.resultDate[0].status == 1 || getSelectSchedule.resultDate[0].status == 2">{{$t('salary_list.look')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { setCookie, getCookie, removeCookie } from '@/utils/cookies';
    import store from '../../../store';
    export default {
      data() {
        return {
          week_data_zh: ['一', '二', '三', '四', '五', '六', '七'],
          week_data_en: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
          days: [],
          dateArray: [
            {
              daysNum: '',
              gradeContent: [
                {
                  beginTime: ''
                }
              ]
            }
          ],
          value: new Date(),
          year: '',
          month: '',
          dayCount: Number,
          language: getCookie('lang'),
          dialogShow: false,
          selectValue: ''
        }
      },
      mounted () {
        this.value = new Date().getFullYear()+'-'+ (new Date().getMonth()+1);
        this.selectValue = new Date().getFullYear()+'-'+ (new Date().getMonth()+1);
        this.setMonth();
      },
      computed: {
        getMonthSchedule() {
          return store.state.getMonthSchedule.resultList;
        },
        getSelectSchedule() {
          return store.state.getSelectSchedule.resultList[0];
        }
      },
      methods: {
        setMonth(val) {
          this.selectValue = val;
          this.days = []
          let year = this.value.split('-')[0]
          let month = this.value.split('-')[1]
          let curDate = new Date(year, month, 0)
          let weekDay = [7, 1, 2, 3, 4, 5, 6]
          this.dayCount = curDate.getDate()
          curDate.setDate(1)
          for (let i = 0; i < this.dayCount; i++) {
            if (i < 9) {
              this.days[i] = '0' + (i + 1)
            } else {
              this.days[i] = i + 1 + ''
            }
          }
          for (let i = 1; i < weekDay[curDate.getDay()]; i++) {
            this.days.unshift('')
          }

          let dateArrayMsg = [];
          for(let i=0; i<this.days.length; i++) {
            this.dateArray.length = this.days.length;
            for(let j=0; j<this.dateArray.length; j++) {
              dateArrayMsg[j] = {
                daysNum: this.days[j],
                gradeContent: []
              }
            }
          }
          this.dateArray = dateArrayMsg;

          // 查看整月班期
          store.dispatch('reqScheduleDetail', {
            scheduleId: localStorage.getItem('scheduleId'),
            scheduleType: 0,
            year: this.value.split('-')[0],
            month: this.value.split('-')[1]
          }).then(res => {
            if (res.data.code == 1) {
              Object.assign(store.state.getMonthSchedule, res.data.data);

              for(let i=0; i<this.dateArray.length; i++) {
                for(let j=0; j<store.state.getMonthSchedule.resultList.length; j++) {

                  let timeStamp = store.state.getMonthSchedule.resultList[j].timeStamp;
                  let newDate = '';
                  if (new Date(timeStamp).getDate() < 10) {
                    newDate = '0' + new Date(timeStamp).getDate();
                  } else {
                    newDate = '' + new Date(timeStamp).getDate();
                  }

                  if (this.dateArray[i].daysNum == newDate) {
                    let newResultData = store.state.getMonthSchedule.resultList[j].resultDate;
                    this.dateArray[i].gradeContent = newResultData;
                  }
                }
              }

            } else {
              this.$message.error(res.data.message);
            }
          })


        },

        // 详情弹窗
        show_details(index) {
          this.dialogShow=true;
          // 获取所选日期班期详情
          store.dispatch('reqScheduleDetail', {
            scheduleId: localStorage.getItem('scheduleId'),
            scheduleType: 0,
            year: this.value.split('-')[0],
            month: this.value.split('-')[1],
            day: index  // 所选日期
          }).then(res => {
            if (res.data.code == 1) {
              Object.assign(store.state.getSelectSchedule, res.data.data);
            } else {
              this.$message.error(res.data.message);
            }
          })
        },

        // 发布
        publishScheduleDeatils() {
          store.dispatch('publishSchedule', {
            scheduleId: localStorage.getItem('scheduleId'),
            scheduleType: 0
          }).then(res => {
            if (res.data.code == 1) {
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          })
        },

        // 编辑
        to_edit() {
          let scheduleTime = JSON.parse(localStorage.getItem('scheduleDate'))[0]
          this.$router.push({
            path: '/edit_schedule',
            query: {
              type: 'edit',
              scheduleId: localStorage.getItem('scheduleId'),
              schedule_type: "parttime",
              date: scheduleTime // 开始日期
            }
          })
        },

        // 查看
        look_details() {
          let scheduleTime = JSON.parse(localStorage.getItem('scheduleDate'))[0] + ' ~ ' +JSON.parse(localStorage.getItem('scheduleDate'))[1]
          let sdate = JSON.parse(localStorage.getItem('scheduleDate'))[0]
          let edate = JSON.parse(localStorage.getItem('scheduleDate'))[1]
          let scheduleId = localStorage.getItem('scheduleId')
          let scheduleType = 0
          let status = JSON.parse(localStorage.getItem('scheduleDate'))[2]
          this.$router.push({
            path: '/employee_delivery_details',
            query: {
              details: 'true',
              sdate: sdate,
              edate: edate,
              scheduleId: scheduleId,
              scheduleType: scheduleType,
              status: status
            }
          })
        },
        chinanum(num) {
          let china
          if (getCookie('lang') == 'zh') {
            china = new Array(
              '一班',
              '二班',
              '三班',
              '四班',
              '五班',
              '六班',
              '七班',
              '八班',
              '九班',
              '十班',
              '十一班',
              '十二班'
            )
          } else {
            china = new Array(
            '1st shift',
            '2nd shift',
            '3rd shift',
            '4th shift',
            '5th shift',
            '6th shift',
            '7th shift',
            '8th shift',
            '9th shift',
            '10th shift',
            '11th shift',
            '12th shift'
            )
          }
          var arr = new Array()
          var english = (num + ',').split(',')
          for (var i = 0; i < english.length; i++) {
            arr[i] = china[english[i]]
          }
          return arr.join('')
        }
      }
    }
  </script>

<style lang="scss" type="text/css">
  .calendar_detail::-webkit-scrollbar {
    width: 2px;
    height: 1px;
  }

  .calendar_detail::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #959595;
  }

  .calendar_detail::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #EDEDED;
  }

  .calendar_content {
    width: 100%;
    height: 100%;

    .schedule-dialog-task {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      left: 0;
    }

    .schedule-dialog.moveShow {
      right: 0;
      transition: right 1s;
      -moz-transition: right 1s;
      -webkit-transition: right 1s;
      -o-transition: right 1s;
    }

    .schedule-dialog {
      position: fixed;
      right: -1920px;
      top: 0;
      width: 100%;
      height: 100%;
      /* background: rgba(0, 0, 0, 0.5); */

      .dialog-box {
        position: absolute;
        right: 0;
        transition: right 1s;
        -moz-transition: right 1s;
        -webkit-transition: right 1s;
        -o-transition: right 1s;
        top: 0;
        bottom: 0;
        width: 334px;
        background: #fff;

        .close {
          text-align: right;
          height: 7%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 20px;

          i {
            color: rgba(0, 0, 0, 0.45);
          }
        }

        .date-box {
          display: flex;
          align-items: center;
          padding-left: 16px;
          position: relative;
          height: 6%;

          .day {
            font-size: 40px;
            font-family: PingFangSC-Semibold;
            color: #000000;
            font-weight: 700;
            margin-right: 12px;
          }

          .date {
            div {
              font-size: 14px;
              color: rgba(0, 0, 0, 0.65);
            }
          }

          .status_img {
            position: absolute;
            right: 25px;
            top: 0;
          }
        }


        .schedule-box-list::-webkit-scrollbar {
          width: 2px;
        }

        .schedule-box-list::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #959595;
        }

        .schedule-box-list::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          background: #EDEDED;
        }

        .schedule-box-list {
          margin: 3% 0 0 12px;
          border-top: 1px solid #e9e9e9;
          height: 80%;
          padding-top: 20px;
          overflow-y: scroll;
          padding-bottom: 15%;

          .list-detail {
            display: flex;
            margin: 25px 34px 0 0;

            .time {
              margin: 0 13px 0 3px;
            }

            .list-right {
              .list-top {
                font-size: 16px;
                color: #000000;
                font-weight: 700;
              }

              .is_over {
                color: #d5d5d5;
              }

              .person-list {
                overflow: hidden;

                .person {
                  float: left;
                  font-size: 12px;
                  color: #666666;
                  margin: 8px 24px 0 0;
                }

                .person.absence {
                  color: #d5d5d5;
                }
              }
            }
          }
        }

        .schedule-edit {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-top: 1px solid #e9e9e9;
          text-align: right;
          background: #ffffff;
          z-index: 999;
          height: 7%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 20px;

          .edit-button {
            display: inline-block;
            background: #3ea2ff;
            border-radius: 4px;
            width: 65px;
            font-size: 14px;
            line-height: 32px;
            text-align: center;
            color: #fff;
          }
        }
      }
    }

    .calendar_haeader {
      text-align: right;
      padding: 2% 2% 0 2%;
    }

    .week_contain {
      margin-top: 2%;
      width: 100%;
      padding: 1%;
      background: #F3F9FF;
      margin-right: 5px;

      li {
        display: inline-block;
        text-align: right;
        width: 13%;
        margin: 0 0.6%;
        padding-right: 2%;
        font-weight: bold;
      }
    }

    .calendar_detail {
      width: 100%;
      height: 80%;
      overflow-y: scroll;

      .details_contain {
        width: 100%;
        height: 100%;
        padding: 1%;

        // background-color: red;
        // display: flex;
        li {
          display: inline-block;
          text-align: right;
          width: 13%;
          margin: 1% 0.6%;
          height: 25%;
          padding-top: 1%;
          vertical-align: top;

          .gray_mask {
            background-color: #eee;
            height: 5%;
            width: 100%;
          }

          .date_top {
            padding-top: 5%;
            padding-right: 10%;
            display: flex;
            justify-content: flex-end;

            .date_top_box {
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #ffffff;
            }

            .date_top_box.is_today {
              background: #1890FF;
              color: #ffffff;
            }
          }

          .schedules_contain {
            margin-top: 5%;
            text-align: center;
            color: #666;
          }

          .schedules_contain.is_today {
            color: #000000;
          }
        }
      }
    }
  }

  .el-date-editor.el-input {
    width: 150px;
  }

</style>
