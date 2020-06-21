<template>
  <div class="reschedule_waiting">
    <div class="schedule_content">
      <div class="form_search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item :label="reschedule.order">
            <el-input v-model="formInline.orderId" size="small" :placeholder="reschedule.please_order_number"></el-input>
          </el-form-item>
          <el-form-item :label="reschedule.time" class="noPass_time">
            <el-date-picker v-model="formInline.time" size="small" type="daterange" unlink-panels range-separator="-" :start-placeholder="reschedule.starting_time" :end-placeholder="reschedule.end_time" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="reschedule.delivery_staff">
            <el-input v-model="formInline.deliveryName" size="small" :placeholder="reschedule.please_name"></el-input>
          </el-form-item>
          <el-form-item :label="reschedule.phone_number">
            <el-input v-model="formInline.deliveryTel" size="small" :placeholder="reschedule.please_mobile_number"></el-input>
          </el-form-item>
          <el-form-item :label="$t('reschedule.pay_type')">
            <el-select v-model="formInline.isOrderPayment" size="small">
              <el-option :label="$t('evaluation_of_distribution_staff.all')" value=""></el-option>
              <el-option :label="$t('order_detail.line')" value="1"></el-option>
              <el-option :label="schedule_list.cash" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="search" @click="onSubmit">{{reschedule.search}}</div>
            <div class="reset" @click="reset">{{reschedule.reset}}</div>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_schedule">
        <el-table :row-class-name="tableRowClassName" :data="table_schedule" :header-cell-style="tableHeaderColor" :empty-text="empty" style="width: 100%" v-loading="isLoading">
          <el-table-column prop="orderId" :label="reschedule.order_number" min-width="150"></el-table-column>
          <el-table-column prop="deliveryName" :label="reschedule.delivery_staff" min-width="145"></el-table-column>
          <el-table-column prop="isOrderPayment" :label="$t('reschedule.pay_type')" min-width="125"></el-table-column>
          <el-table-column prop="deliveryTel" :label="reschedule.phone_number" min-width="170"></el-table-column>
          <el-table-column prop="logistics" :label="reschedule.shipping_fee" min-width="110"></el-table-column>
          <el-table-column prop="distance" :label="reschedule.delivery_distance" min-width="110"></el-table-column>
          <el-table-column prop="applyNum" align="center" :label="reschedule.number_applications" min-width="100"></el-table-column>
          <el-table-column prop="applyReason" align="center" :label="reschedule.reason_application" min-width="145">
            <template slot-scope="scope">
              <el-popover placement="top-start" width="500" trigger="hover" :content="scope.row.applyReason">
                <span slot="reference" class="ellip-txt">{{scope.row.applyReason}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" align="center" :label="reschedule.application_time" min-width="105"></el-table-column>
          <el-table-column prop="orderStatus" align="center" :label="reschedule.delivery_status" min-width="145"></el-table-column>
          <el-table-column :label="$t('rider_manage.rider_column.operation')" min-width="230" align="center">
            <template slot-scope="scope">
              <div class="order-handle">
                <div class="order-right">
                  <div @click="handleClick(scope.row)">{{reschedule.see_details}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="page" v-if="parseInt(totalResult)>1">
          <span>{{$t('distributor.the')}}{{currentPage}}{{$t('distributor.page')}}，{{$t('distributor.shows')}}{{showCount}}{{$t('distributor.count')}}，{{$t('distributor.total')}}{{totalResult}}{{$t('distributor.count')}}</span>
          <div class="u-pagination">
            <el-pagination background layout="prev, pager, next" :total="totalResult" :page-size="showCount" :current-page="parseInt(currentPage)" @current-change="changePage"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from '../../../store'
import { mapState, mapMutations } from 'vuex'
import { formatDateTime } from '../../../utils/index'
export default {
  name: 'waiting_single',
  data() {
    return {
      table_schedule: [],
      empty: this.$t('no_pass_management.empty'),
      currentPage: 1,
      showCount: 7,
      totalResult: 0,
      deliver: '',
      formInline: {
        orderId: '',
        deliveryTel: '',
        deliveryName: '',
        time: '',
        isOrderPayment: ''
      },
      table_deliver: [],
      isLoading: false
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.path != '/reschedule_detail') {
      store.state.page = ''
    }
    next()
  },
  computed: {
    ...mapState(['page']),
    reschedule() {
      let reschedule = this.$t('reschedule')
      return reschedule
    },
    schedule_list() {
      let schedule_list = this.$t('schedule_list')
      return schedule_list
    }
  },
  mounted() {
    console.log(this.page, this.pageState, 'page')
    this.currentPage = this.page ? this.page : 1
    this.getReassignmentOrderListPage()
  },
  methods: {
    ...mapMutations(['updatePage', 'updateReassignmentNum']),
    getReassignmentOrderListPage() {
      this.isLoading = true
      let params = {
        currentPage: this.currentPage,
        showCount: this.showCount,
        applyStatus: 3,
        orderId: this.formInline.orderId,
        deliveryTel: this.formInline.deliveryTel,
        deliveryName: this.formInline.deliveryName,
        startTime: this.formInline.time ? this.formInline.time[0] : '',
        endTime: this.formInline.time ? this.formInline.time[1] : '',
        isOrderPayment: this.formInline.isOrderPayment
      }
      store
        .dispatch('getReassignmentOrderListPage', params)
        .then(res => {
          if (res.data.code == 1) {
            console.log(res.data.data.agreeNum)
            this.updateReassignmentNum({
              agreeNum: res.data.data.agreeNum,
              checkNum: res.data.data.checkNum,
              rejectNum: res.data.data.rejectNum
            })
            res.data.data.reassignmentOrderList.forEach(item => {
              item.applyTime = formatDateTime(item.applyTime)
              item.distance =
                parseFloat(parseFloat(item.distance).toFixed(2)) + 'km'
              if (item.isOrderPayment == 1) {
                item.isOrderPayment = this.$t('order_detail.line')
              } else {
                item.isOrderPayment = this.$t('schedule_list.cash')
              }
              if (item.orderStatus == 3 || item.orderStatus == 9) {
                item.orderStatus = this.$t('reschedule.status2')
              } else if (item.orderStatus == 7) {
                item.orderStatus = this.$t('reschedule.cancelled')
              } else {
                item.orderStatus = this.$t('reschedule.status3')
              }
            })
            this.table_schedule = res.data.data.reassignmentOrderList
            this.total = res.data.data.totalPage * 10
            this.totalResult = res.data.data.totalResult
            this.isLoading = false
          } else {
            this.$message.error(res.data.message)
            this.isLoading = false
          }
        })
        .catch(err => {
          console.log(err)
          this.isLoading = false
        })
    },
    onSubmit() {
      this.currentPage = 1
      this.getReassignmentOrderListPage()
    },
    reset() {
      this.formInline.customer = ''
      this.formInline.seller_name = ''
    },
    handleClick(row) {
      this.updatePage(this.currentPage)
      this.$router.push({
        path: '/reschedule_detail',
        query: {
          orderId: row.orderId,
          status: 3
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'warning-row'
      }
      return ''
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #F6F9FF;color: rgba(0,0,0,0.85);font-weight: 700;'
      }
    },
    changePage(page) {
      this.currentPage = page
      this.getReassignmentOrderListPage()
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: #fafafa;
}
</style>
<style scoped lang="scss">
.reschedule_waiting {
  .delivery-box {
    border-top: 1px solid #ededed;
    margin-top: 10px;
  }
  .ellip-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .distribution {
    display: flex;
    margin-left: 108px;
    div {
      background: #ffffff;
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      width: 93px;
      height: 43px;
      line-height: 43px;
      text-align: center;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      margin-right: 59px;
      margin-top: 30px;
    }
  }
  .distribution-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 4vh;
    div {
      margin: 0 0 28px 0;
      &:first-child {
        border: 1px solid #dcdfe6;
        color: #606266;
        border-radius: 4px;
        padding: 10px 20px;
        font-size: 14px;
        margin-right: 10px;
      }
      &:last-child {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        padding: 10px 20px;
        border-radius: 4px;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 14px;
      }
      cursor: pointer;
    }
  }
  .dialog_table1 {
    margin-top: 14px;
  }
  .button-handle {
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
  }
  .schedule_content {
    padding: 25px 30px 18px 30px;
    .form_search {
      max-width: 900px;
      margin-bottom: 18px;
      .search {
        background: #ff644d;
        border-radius: 4px;
        color: #fff;
        width: 65px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        margin-top: 4px;
        margin-left: 40px;
        font-size: 14px;
      }
      .reset {
        background: #ffffff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        color: #666666;
        width: 65px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        margin-top: 4px;
        font-size: 14px;
      }
    }
  }
  .page {
    height: 29px;
    line-height: 29px;
    margin: 20px 0 0 40px;
    padding-bottom: 65px;
    span {
      font-size: 14px;
      color: #666666;
    }
  }
  .order-handle {
    display: flex;
    color: #1890ff;
    justify-content: center;
    .order-left {
      padding-right: 10px;
      height: 15px;
      line-height: 15px;
      border-right: 1px solid #1890ff;
      cursor: pointer;
      font-size: 14px;
    }
    .order-right {
      padding-left: 10px;
      line-height: 15px;
      div {
        &:last-child {
          margin-top: 8px;
        }
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
  .u-pagination {
    display: inline-block;
    float: right;
    padding-top: 15px;
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 4vh;
    div {
      &:first-child {
        border: 1px solid #dcdfe6;
        color: #606266;
        border-radius: 4px;
        padding: 10px 20px;
        font-size: 14px;
        margin-right: 10px;
      }
      &:last-child {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        padding: 10px 20px;
        border-radius: 4px;
        margin-left: 10px;
        font-size: 14px;
      }
      cursor: pointer;
    }
  }
  .add_order {
    display: flex;
    padding: 5px 20px 10px;
    div {
      flex: 1;
      text-align: left;
      span {
        font-size: 18px;
      }
    }
    .order_type {
      max-width: 260px;
      span {
        color: red;
      }
    }
    .order_amount {
      span {
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
}
</style>
