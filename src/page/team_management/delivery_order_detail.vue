<template>
  <div class="delivery_order_detail">
    <div class="delivery_info">
      <div class="red_line"></div>
      <div>{{$t('schedule_list.delivery')}}{{delive_name}}</div>
      <div>{{$t('rider_manage.phone')}}：{{delive_tel}}</div>
    </div>
    <div class="content">
      <div class="amount_list">
        <div class="box">
          <div class="icon_red icon">
            <div>
              <i class="iconfont icon-zhanghuyue"></i>
            </div>
          </div>
          <div class="notes">
            <div>{{$t('cash_order_statistics.total_amount')}}</div>
            <div>{{settledMoney || 0}}P</div>
          </div>
        </div>
        <div class="box">
          <div class="icon_yellow icons">
            <div>
              <i class="iconfont icon-dingdan-blue-copy-copy"></i>
            </div>
          </div>
          <div class="notes">
            <div>{{$t('cash_order_statistics.total_orders')}}</div>
            <div>{{settledNum || 0}}</div>
          </div>
        </div>
        <div class="box">
          <div class="icon_blue icon">
            <div>
              <i class="iconfont icon-zhanghuyue"></i>
            </div>
          </div>
          <div class="notes">
            <div>{{$t('cash_order_statistics.unsettled_amount')}}</div>
            <div>{{unsettleMoney || 0}}P</div>
          </div>
        </div>
        <div class="box">
          <div class="icon_orange icons">
            <div>
              <i class="iconfont icon-dingdan-blue-copy-copy"></i>
            </div>
          </div>
          <div class="notes">
            <div>{{$t('cash_order_statistics.unsettled_orders')}}</div>
            <div>{{unsettleNum || 0}}</div>
          </div>
        </div>
      </div>
      <div class="form-inline">
        <el-form :inline="true" :model="formCashOrder" class="demo-form-inline" size="small">
          <el-form-item :label="$t('cash_order_statistics.name')">
            <el-input v-model="formCashOrder.delivery_name" size="small" :placeholder="$t('cash_order_statistics.name_place')" class="delivery_name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cash_order_statistics.date')" class="noPass_time">
            <el-col :span="11">
              <el-date-picker size="small" type="datetime" :editable="false" @change="getSTime" :placeholder="$t('order_manager.Select_time')" prefix-icon="el-icon-date" v-model="formCashOrder.date1" :picker-options="pickerOptionsStartDate" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="1">&nbsp;-</el-col>
            <el-col :span="11">
              <el-date-picker size="small" type="datetime" :editable="false" @change="getSTime2" :placeholder="$t('order_manager.Select_time')" prefix-icon="el-icon-date" v-model="formCashOrder.date2" :picker-options="pickerOptionsDate" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('cash_order_statistics.billing_status')">
            <el-select v-model="formCashOrder.billing_status" size="small">
              <el-option :label="$t('evaluation_of_distribution_staff.all')" value=""></el-option>
              <el-option :label="$t('cash_order_statistics.pending')" value="1"></el-option>
              <el-option :label="$t('cash_order_statistics.normal')" value="2"></el-option>
              <el-option :label="$t('cash_order_statistics.abnormal')" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('no_pass_management.phone')">
            <el-input v-model="formCashOrder.tel" size="small" :placeholder="$t('cash_order_statistics.tel_place')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cash_order_statistics.order_status')">
            <el-select v-model="formCashOrder.order_status" size="small">
              <el-option :label="$t('evaluation_of_distribution_staff.all')" value=""></el-option>
              <el-option :label="$t('schedule_list.pick_up')" value="2"></el-option>
              <el-option :label="$t('schedule_list.service')" value="5"></el-option>
              <el-option :label="$t('cash_order_statistics.arrived')" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="onSubmit">{{$t('schedule_list.search')}}</el-button>
            <el-button type="primary" @click="resect">{{$t('schedule_list.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-branch">
        <el-table :data="branchTable" style="width: 100%" :row-class-name="tableRowClassName" v-loading="loading">
          <el-table-column prop="id" :label="$t('cash_order_statistics.order_num')" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" :label="$t('order_details.name')" min-width="125"></el-table-column>
          <el-table-column prop="phone" :label="$t('rider_manage.phone')" min-width="150"></el-table-column>
          <el-table-column prop="orderTime" :label="$t('order_detail.order_time')" min-width="160"></el-table-column>
          <el-table-column prop="actualPrice" :label="$t('schedule_list.order_amount')" min-width="145"></el-table-column>
          <el-table-column prop="orderState" :label="$t('order_detail.status')" min-width="130"></el-table-column>
          <el-table-column prop="settleState" :label="$t('order_detail.state')" min-width="145"></el-table-column>
          <el-table-column prop="bookedTime" :label="$t('cash_order_statistics.billing_time')" min-width="160"></el-table-column>
          <el-table-column :label="$t('distributor.todo')" min-width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="danger" plain size="small">{{$t('no_pass_management.look')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="branch-page" v-if="total >= 1">
        <span class="span_block">{{$t('distributor.the')}}{{currentPage}}{{$t('distributor.page')}}，{{$t('distributor.shows')}}{{showPage}}{{$t('distributor.count')}}，{{$t('distributor.total')}}{{total}}{{$t('distributor.count')}}</span>
        <el-pagination :page-size="showPage" background layout="prev, pager, next" @current-change="changePage" :total="total" :current-page="currentPage"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import store from '../../store'
import { mapState, mapMutations } from 'vuex'
import { formatDateTime } from '../../utils/index.js'
// import vTitle from "../../components/v_title";
export default {
  name: 'delivery_order_detail',
  data() {
    return {
      formCashOrder: {
        delivery_name: '',
        tel: '',
        date1: '',
        date2: '',
        billing_status: '',
        order_status: ''
      },
      pickerOptionsStartDate: {
        disabledDate: time => {
          if (this.formCashOrder.date2) {
            return time.getTime() > this.formCashOrder.date2
          }
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      pickerOptionsDate: {
        disabledDate: time => {
          return (
            time.getTime() < this.formCashOrder.date1 ||
            time.getTime() > Date.now() - 8.64e6
          )
        }
      },
      state: '',
      restaurants: [],
      timeout: null,
      branchTable: [],
      total: 0,
      currentPage: 1,
      showPage: 7,
      settledMoney: '',
      settledNum: '',
      unsettleMoney: '',
      unsettleNum: '',
      delive_name: '',
      delive_tel: '',
      loading: false
    }
  },
  // components: { vTitle },
  mounted() {
    this.currentPage = this.page ? this.page : 1
    this.settledMoney = this.$route.query.mn1
    this.settledNum = this.$route.query.no1
    this.unsettleMoney = this.$route.query.mn2
    this.unsettleNum = this.$route.query.no2
    this.delive_name = this.$route.query.name
    this.delive_tel = this.$route.query.tel
    this.getDeliveryAllOrderList()
  },
  computed: {
    ...mapState(['page'])
  },
  methods: {
    ...mapMutations(['updatePage']),
    ...mapActions(['getSellerList']),
    tableRowClassName({ row, rowIndex }) {
      // console.log(rowIndex)
      if (rowIndex % 2 == 0) {
        return 'warning-row'
      }
      return ''
    },
    getSTime() {
      console.log(
        '===============',
        new Date().getFullYear(),
        this.formCashOrder.date1.getFullYear()
      )
      if (this.formCashOrder.date1.getFullYear() > new Date().getFullYear()) {
        this.formCashOrder.date1 = new Date()
      }
    },
    getSTime2() {
      console.log(
        '??????????????????',
        new Date().getFullYear(),
        this.formCashOrder.date2.getFullYear()
      )
      if (this.formCashOrder.date2.getFullYear() > new Date().getFullYear()) {
        this.formCashOrder.date2 = new Date()
      }
    },
    getMonthMaxDay(nowdate) {
      nowdate.setMonth(nowdate.getMonth() - 1)
      var y = nowdate.getFullYear()
      var m = nowdate.getMonth() + 1
      var d = nowdate.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      return y + '-' + m + '-' + d
    },
    getDeliveryAllOrderList() {
      let startTime, endTime
      if (this.formCashOrder.date1) {
        startTime = formatDateTime(this.formCashOrder.date1)
      }
      if (this.formCashOrder.date2) {
        endTime = formatDateTime(this.formCashOrder.date2)
      }
      this.loading = true
      store
        .dispatch('getDeliveryAllOrderList', {
          currentPage: this.currentPage,
          showCount: this.showPage,
          deliveryId: this.$route.query.id,
          name: this.formCashOrder.delivery_name,
          settleStatus: this.formCashOrder.billing_status,
          phone: this.formCashOrder.tel,
          orderStatus: this.formCashOrder.order_status,
          startTime: startTime,
          endTime: endTime
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.loading = false
            res.data.data.deliveryAllOrderList.forEach(item => {
              item.orderTime = formatDateTime(item.orderTime)
              if (item.settleStatus == 1) {
                item.bookedTime = ''
              }
              if (item.bookedTime) {
                item.bookedTime = formatDateTime(item.bookedTime)
              }
              if (item.orderStatus == 3 || item.orderStatus == 9) {
                item.orderState = this.$t('schedule_list.pick_up')
                item.status = 2
              } else if (item.orderStatus == 5) {
                item.orderState = this.$t('schedule_list.service')
                item.status = 3
              } else {
                item.orderState = this.$t('cash_order_statistics.arrived')
                item.status = 4
              }
              if (item.settleStatus == 1) {
                item.settleState = this.$t('cash_order_statistics.pending')
              } else if (item.settleStatus == 2) {
                item.settleState = this.$t('cash_order_statistics.normal')
              } else {
                item.settleState = this.$t('cash_order_statistics.abnormal')
              }
            })
            this.branchTable = res.data.data.deliveryAllOrderList
            this.total = res.data.data.totalResult
          } else {
            this.$message.error(res.data.message)
            this.loading = false
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    onSubmit() {
      this.currentPage = 1
      this.getDeliveryAllOrderList()
    },
    resect() {
      console.log(111111)
      this.formCashOrder.delivery_name = ''
      this.formCashOrder.billing_status = ''
      this.formCashOrder.tel = ''
      this.formCashOrder.order_status = ''
      this.formCashOrder.date1 = ''
      this.formCashOrder.date2 = ''
    },
    handleClick(row) {
      this.updatePage(this.currentPage)
      console.log(row)
      this.$router.push({
        path: '/order_detail',
        query: {
          id: row.id,
          status: row.status,
          settleStatus: row.settleStatus,
          settlementType: row.settlementType,
          actualPrice: row.actualPrice
        }
      })
    },
    changePage(page) {
      this.currentPage = page
      this.getDeliveryAllOrderList()
      // this.getRiderList()
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
.delivery_order_detail {
  background: #fff;
  .content {
    padding: 5px 40px 20px;
    // margin: 24px;
  }
  .delivery_info {
    border-bottom: 1px solid #ededed;
    display: flex;
    padding: 7px 15px 5px;
    .red_line {
      width: 5px;
      margin-right: 15px;
      background: #ff3633;
      border-radius: 5px;
      font-size: 12px;
    }
    div {
      font-size: 13px;
      margin-right: 40px;
      color: #333;
    }
  }
  .amount_list {
    display: flex;
    padding: 20px;
    border: 1px solid #ededed;
    margin: 15px 0 18px;
    border-radius: 6px;
    .box {
      display: flex;
      margin-right: 12px;
      align-items: center;
      flex: 1;
      .icon {
        div {
          width: 30px;
          height: 30px;
          line-height: 27px;
          text-align: center;
          border-radius: 16px;
          color: #fff;
          margin-right: 10px;
          i {
            font-size: 19px;
          }
        }
      }
      .icons {
        div {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 16px;
          color: #fff;
          margin-right: 10px;
          i {
            font-size: 19px;
          }
        }
      }
      .icon_red {
        div {
          background: #ee6e56;
        }
      }
      .icon_yellow {
        div {
          background: #edbc41;
        }
      }
      .icon_blue {
        div {
          background: #95bced;
        }
      }
      .icon_orange {
        div {
          background: #e59558;
        }
      }
      .notes {
        color: #666666;
        div {
          &:last-child {
            color: #ff3633;
            font-size: 19px;
          }
          font-size: 13px;
        }
      }
    }
  }
  .branch-page {
    margin-top: 20px;
    display: flex;
    .span_block {
      display: inline-block;
      flex: 1;
      margin-top: 5px;
      color: #606266;
      font-size: 14px;
    }
    .el-pagination {
      text-align: right;
    }
  }
}
</style>
