<template>
  <div class="main_contain">
    <!-- 全职和兼职排班 -->
    <div class="schedule_list">
      <div class="btn_contain">
        <div class="switch_type">
          <el-button size="small" @click="goEditSchedule" type="primary" icon="el-icon-plus">{{delivery_sche.new_schedule}}</el-button>
          <el-button-group>
            <el-button size="small" v-if="!showContain" class="isActive">{{delivery_sche.parttime_schedule}}</el-button>
            <el-button size="small" v-if="showContain" class="isActive">{{delivery_sche.fulltime_schedule}}</el-button>
          </el-button-group>
        </div>
        <div class="btn_right">
          <el-button size="small" v-if="isNotPublish" type="danger" @click="goPublish">{{delivery_sche.publish}}</el-button>
          <el-button size="small" @click="saveSchedule" v-if="isNotPublish && schedule_type == 'fulltime'" type="primary">{{delivery_sche.save}}</el-button>
          <el-button size="small" @click="goBack" type="primary">{{delivery_sche.back}}</el-button>
        </div>
      </div>
      <div class="schedules_contain">
        <!-- 全职排班 -->
        <div v-if="showContain" class="fulltime_contain">
          <FullTimeSchedule ref="fulltime" />
        </div>
        <!-- 兼职排班 -->
        <div v-if="!showContain" class="parttime_contain">
          <div class="schedules_time">
            <ScheTime></ScheTime>
          </div>
          <div class="calendar_contain">
            <PartTimeSchedule ref="parttime"></PartTimeSchedule>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FullTimeSchedule from './fulltime_schedule'
import PartTimeSchedule from './components/calendar'
import ScheTime from './components/schedules_time'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      showContain: true, //标记当前是兼职还是全职
      schedule_type: 'fulltime', //标识当前是兼职还是全职
      isNotPublish: true // 标记当前是查看还是排班
    }
  },
  computed: {
    ...mapState(['new_schedule_type']),
    scheduleId() {
      return this.$route.query.id
    },
    delivery_sche() {
      return this.$t('delivery_schedules')
    }
  },
  beforeMount() {
    if (this.$route.query.schedule_type == 'parttime') {
      // 排班列表页进来并且是兼职
      this.showContain = false
      this.schedule_type = 'parttime'
    }
    if (
      this.$route.query.edit_type == 'new' &&
      this.$route.query.scheduleFlag == '2'
    ) {
      // 是新建并且是兼职
      this.schedule_type = 'parttime'
    }
    localStorage.setItem('status', this.$route.query.status)
    // 新建也和排班也都已传id
    localStorage.setItem('scheduleId', this.$route.query.id)

    // 新建页面和排班列表页面都有该字段
    localStorage.setItem('scheduleType', this.$route.query.scheduleType)
    if (
      this.$route.query.scheduleFlag == '2' ||
      this.$route.query.scheduleFlag == 'parttime'
    ) {
      // 新建页进来
      this.showContain = false
      this.schedule_type = 'parttime'
    }
    // 新建页面和排班列表页都有该字段(返回不起效)
    if (this.$route.query.status != '0') {
      // 查看, 已经发布过了
      this.isNotPublish = false
      localStorage.setItem('isNotPublish', false)
    } else {
      // 未发布过是排班请求排班的接口
      this.isNotPublish = true
      localStorage.setItem('isNotPublish', true)
    }
  },
  methods: {
    ...mapMutations(['updateIsMenuList']),
    goPublish() {
      // 发布排班前二次确认
      let message
      let title
      if (this.schedule_type == 'fulltime') {
        title = this.delivery_sche.full_publish_title
        message = this.delivery_sche.full_publish_msg
      } else {
        title = this.delivery_sche.part_publish_title
        message = this.delivery_sche.part_publish_msg
      }
      this.$confirm(`${message}`, `${title}`, {
        confirmButtonText: this.delivery_sche.confirm,
        cancelButtonText: this.delivery_sche.cancel,
        type: 'warning'
      })
        .then(() => {
          // 请求发布相关接口
          if (this.schedule_type == 'fulltime') {
            this.$refs.fulltime.publishScheduleDeatils()
          } else if (this.schedule_type == 'parttime') {
            this.$refs.parttime.publishScheduleDeatils()
          }
        })
        .catch(() => {
          // 点击了取消的逻辑
        })
    },
    saveSchedule() {
      // 保存当前班期信息
      this.updateIsMenuList({ data: 'false' })
      this.$refs.fulltime.saveScheduleDetails()
    },
    goBack() {
      // 判断当前是哪个页面跳转过来的再返回
      this.updateIsMenuList({ data: 'false' })
      this.$router.go(-1)
    },
    goEditSchedule() {
      // 点击新建按钮
      this.$router.push({
        path: '/edit_schedule',
        query: {
          type: 'new',
          scheduleId: this.scheduleId,
          schedule_type: this.schedule_type
        }
      })
    }
  },
  components: {
    FullTimeSchedule,
    PartTimeSchedule,
    ScheTime
  }
}
</script>

<style lang="scss" scoped type="text/css">
  @import '../../assets/css/fulltime.css';

  .main_contain {
    width: 100%;
    height: 100%;

    .schedule_list {
      width: 100%;
      height: 100%;

      .btn_contain {
        display: flex;
        justify-content: space-between;

        &>div {
          width: 50%;

          &.btn_right {
            text-align: right;
          }
        }

        .switch_type {
          .isActive {
            background: #ffffff;
            border: 1px solid #1890ff;
            color: #1890ff;
          }
        }

        .el-button-group {
          padding-left: 5%;
        }
      }

      .schedules_contain {
        width: 100%;
        height: 90%;
        margin-top: 2%;
        display: flex;
        flex-direction: row;
        padding: 0 30px;

        .parttime_contain,
        .fulltime_contain {
          width: 100%;
          height: 100%;
        }

        .parttime_contain {
          display: flex;
        }

        .schedules_time {
          width: 29%;
          background-color: #fff;
          margin-right: 2%;
        }

        .calendar_contain {
          background-color: #fff;
          width: 69%;
        }
      }
    }
  }

</style>
