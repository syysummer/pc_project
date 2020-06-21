<template>
  <div class="scheTime_contain">
    <div class="time_header cannot_select">
      <p class="today_txt" v-if="language=='zh'">今日</p>
      <p class="today_txt" v-if="language=='en'">Today</p>
      <div class="cur_date_contain">
        <div class="cur_day">{{ new Date().getDate() }}</div>
        <div class="cur_date" v-if="language=='zh'">
          <p v-if="new Date().getDay() == 0">星期日</p>
          <p v-if="new Date().getDay() == 1">星期一</p>
          <p v-if="new Date().getDay() == 2">星期二</p>
          <p v-if="new Date().getDay() == 3">星期三</p>
          <p v-if="new Date().getDay() == 4">星期四</p>
          <p v-if="new Date().getDay() == 5">星期五</p>
          <p v-if="new Date().getDay() == 6">星期六</p>
          <p>
            <span>
              {{ (new Date().getMonth()+1) }}月
            </span>
            {{ new Date().getFullYear() }}
          </p>
        </div>
        <div class="cur_date" v-if="language=='en'">
          <p v-if="new Date().getDay() == 0">Sunday</p>
          <p v-if="new Date().getDay() == 1">Monday</p>
          <p v-if="new Date().getDay() == 2">Tuesday</p>
          <p v-if="new Date().getDay() == 3">Wednesday</p>
          <p v-if="new Date().getDay() == 4">Thursday</p>
          <p v-if="new Date().getDay() == 5">Friday</p>
          <p v-if="new Date().getDay() == 6">Saturday</p>
          <p>
            <span v-if="new Date().getMonth() == 0">Jan.</span>
            <span v-if="new Date().getMonth() == 1">Feb.</span>
            <span v-if="new Date().getMonth() == 2">Mar.</span>
            <span v-if="new Date().getMonth() == 3">Apr.</span>
            <span v-if="new Date().getMonth() == 4">May.</span>
            <span v-if="new Date().getMonth() == 5">Jun.</span>
            <span v-if="new Date().getMonth() == 6">Jul.</span>
            <span v-if="new Date().getMonth() == 7">Mar.</span>
            <span v-if="new Date().getMonth() == 8">Sept.</span>
            <span v-if="new Date().getMonth() == 8">Oct.</span>
            <span v-if="new Date().getMonth() == 10">Nov.</span>
            <span v-if="new Date().getMonth() == 11">Dec.</span>
            {{ new Date().getFullYear() }}
          </p>
        </div>
      </div>
    </div>
    <div class="schedules_detail cannot_select" :class="{hasremark: getFullTimeDeliverySchedule.remark && getFullTimeDeliverySchedule.remark!=null && getFullTimeDeliverySchedule.remark!=''}"
      v-if="getFullTimeDeliverySchedule.resultList && getFullTimeDeliverySchedule.resultList.length!=0">

      <div class="schedules_item_contain" v-for="(item, index) in getFullTimeDeliverySchedule.resultList[0].resultDate"
        :key="index">
        <div class="schedules_items" :class="{is_over: item.status!=0}">
          {{chinanum(index)}}
          (
          {{item.beginTime}} -
          {{item.endTime}}
          )
        </div>
        <div class="tip tip_zh" v-if="language=='zh'">
          <div class="book">
            <span></span>
            <span>
              预约{{item.groupAppointmentNum || 0}}人
            </span>
          </div>
          <div class="online" v-if="item.status!=0">
            <span></span>
            <span>
              在勤{{item.regularNum || 0}}人
            </span>
          </div>
        </div>
        <div class="tip" v-if="language=='en'">
          <div class="book">
            <span></span>
            <span>
              {{item.groupAppointmentNum || 0}} rider reserved
            </span>
          </div>
          <div class="online" v-if="item.status!=0">
            <span></span>
            <span>
              {{item.regularNum || 0}} rider on duty
            </span>
          </div>
        </div>
      </div>

    </div>
    <div class="note_contain" v-if="getFullTimeDeliverySchedule.remark && getFullTimeDeliverySchedule.remark!=null && getFullTimeDeliverySchedule.remark!=''">
      <p class="note_title">{{$t('order_details.remark')}}</p>
      <p>
        {{getFullTimeDeliverySchedule.remark}}
      </p>
    </div>
  </div>
</template>

<script>
  import store from '../../../store';
  export default {
    data() {
      return {
        language: ''
      }
    },
    computed: {
      getFullTimeDeliverySchedule() {
        return store.state.getTodaySchedule;
      }
    },
    created () {
      this.language = getCookie('lang');
      this.reqScheduleDetail();
    },
    methods: {
      // 查看当前日期班期详情
      reqScheduleDetail() {
        store.dispatch('reqScheduleDetail', {
          scheduleId: localStorage.getItem('scheduleId'),
          scheduleType: 0,
          year: new Date().getFullYear(),
          month: new Date().getMonth()+1,
          day: new Date().getDate()  // 当前日期
        }).then(res => {
          if (res.data.code == 1) {
            Object.assign(store.state.getTodaySchedule, res.data.data);
          } else {
            this.$message.error(res.data.message);
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

<style lang="scss" scoped type="text/css">
  .scheTime_contain::-webkit-scrollbar {
    width: 0;
  }

  .scheTime_contain {
    width: 100%;
    height: 100%;
    padding: 0 3%;
    overflow-y: scroll;

    .time_header {
      padding: 2% 0;
      border-bottom: 2px solid #e9e9e9;
      width: 100%;

      .today_txt {
        font-size: 20px;
        font-weight: bold;
      }

      .cur_date_contain {
        display: flex;

        .cur_day {
          font-size: 50px;
          font-weight: bold;
          margin-right: 5%;
        }

        .cur_date {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }

    .schedules_detail.hasremark {
      height: 330px;
    }

    .schedules_detail {
      width: 100%;
      height: 440px;
      overflow: hidden;

      .schedules_item_contain {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;

        .schedules_items {
          width: 90%;
          height: 50px;
          background: #1890FF;
          border-radius: 25px;
          text-align: center;
          line-height: 50px;
          color: #fff;
        }

        .is_over {
          background: #C3C3C3;
        }

        .tip.tip_zh {
          display: flex;
          justify-content: space-between;

          .book {
            margin-right: 20px;
          }
        }

        .tip {
          margin-top: 10px;
          height: 40px;

          .book {
            display: flex;
            align-items: center;
            line-height: 20px;

            span:first-child {
              display: inline-block;
              width: 6px;
              height: 6px;
              background-color: #1890ff;
              border-radius: 3px;
              overflow: hidden;
              margin-right: 5px;
            }
          }

          .online {
            display: flex;
            align-items: center;
            line-height: 20px;

            span:first-child {
              margin-right: 5px;
              display: inline-block;
              width: 6px;
              height: 6px;
              background-color: #F5A623;
              border-radius: 3px;
              overflow: hidden;
            }
          }
        }
      }

      .gray {
        .schedules_items {
          background: #c3c3c3;
        }

        .tip {

          .book span,
          .online span {
            background: #c3c3c3;
          }
        }
      }
    }

    .note_contain {
      margin-top: 20px;

      p.note_title {
        padding-bottom: 5%;
        border-bottom: 2px solid #e9e9e9;
      }

      p {
        margin: 5% 0;
        font-size: 14px;
      }
    }
  }

</style>
