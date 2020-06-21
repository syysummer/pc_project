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
            <!-- 新增订单类型 -->
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
          <el-table-column prop="orderStatus" align="center" :label="reschedule.delivery_status" min-width="130"></el-table-column>
          <el-table-column :label="$t('rider_manage.rider_column.operation')" min-width="230" align="center">
            <template slot-scope="scope">
              <div class="order-handle">
                <span class="order-left" @click="refuseOrder(scope.row)">{{reschedule.reject_application}}</span>
                <div class="order-right">
                  <div @click="handleClickUp(scope.row)">{{reschedule.immediate_order}}</div>
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
    <el-dialog :title="schedule_list.order_people" :visible.sync="dialogVisible" width="45%" center>

      <!-- <div class="add_order">
        <div class="order_type">{{schedule_list.order_type}}
          <span>{{order_payment_type}}</span>
        </div>
        <div class="order_amount">{{schedule_list.order_amount}}：
          <span>{{order_money}}P</span>
        </div>
      </div> -->
      <!-- <el-form :inline="true" ref="form" :model="deliveryType" class="delivery-box">
        <el-form-item :label="reschedule.choose_express">
          <el-radio-group v-model="deliveryType.type">
            <el-radio :label="1">{{reschedule.fast_delivery}}</el-radio>
            <el-radio :label="2">{{reschedule.third_delivery}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form> -->
      <div v-show="deliveryType.type==1">
        <el-form :inline="true" :model="dialogForm" class="demo-form-inline dialog-form1">
          <el-form-item>
            <el-input v-model="dialogForm.deliver_name" size="small" :placeholder="reschedule.please_distributor"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dialogForm.deliver_phone" size="small" :placeholder="reschedule.please_mobile_number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="search" size="mini">{{reschedule.search}}</el-button>
          </el-form-item>
        </el-form>
        <el-table class="dialog_table1" :row-class-name="tableRowClassName" fixed :data="table_deliver" :empty-text="empty" style="width: 100%; padding-bottom: 20px;" v-loading="loading" :default-sort="{prop: 'orderCount', order: 'descending'}" :header-cell-style="{'background-color': '#F6F9FF'}" @sort-change="tableSortChange">
          <!-- <el-table-column type="index" :index="typeIndex" :label="schedule_list.num"></el-table-column> -->
          <el-table-column prop="deliveryName" align="left" :label="$t('rider_manage.name')"></el-table-column>
          <el-table-column prop="deliveryManTel" align="left" :label="$t('rider_manage.rider_column.phone')" min-width="130"></el-table-column>
          <el-table-column prop="orderCount" align="center" :label="schedule_list.holding_amount" min-width="90" sortable='custom'></el-table-column>
          <el-table-column prop="distance" align="center" :label="distanceColumn" min-width="180" sortable='custom'></el-table-column>
          <el-table-column :label="$t('rider_manage.rider_column.operation')" min-width="155" align="center">
            <template slot-scope="scope">
              <div @click="handleClickOrder(scope.row)" type="primary" plain size="mini" class="button-handle">{{schedule_list.orderUp}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div v-show="deliveryType.type==2">
        <div class="distribution">
          <div v-for="(item,index) in distributionList" :class="{act:selectIndex==index}" @click="selectDistribution(index)">{{item.name}}</div>
        </div>
        <div class="distribution-footer">
          <div @click="dialogVisibleSub = false">{{$t('edit_distributor.cancel')}}</div>
          <div @click="confirmSub">{{$t('edit_distributor.confirm')}}</div>
        </div>
      </div> -->
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleSub" width="25%" top="30vh" class="dialog_small_box">
      <span>{{deliver}}&nbsp;{{distanceColumn}}&nbsp;{{distance}}km,{{$t('schedule_list.delivery_dan')}}{{orderCount}}{{$t('schedule_list.dan')}},{{$t('schedule_list.confirm_now')}}</span>
      <div class="dialog-footer">
        <div @click="dialogVisibleSub = false">{{$t('edit_distributor.cancel')}}</div>
        <div @click="confirmSub">{{$t('edit_distributor.confirm')}}</div>
      </div>
    </el-dialog>
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
      currentPages: 1,
      showCount: 7,
      totalResult: 0,
      totalResults: 0,
      deliver: '',
      formInline: {
        orderId: '',
        deliveryTel: '',
        deliveryName: '',
        time: '',
        isOrderPayment: ''
      },
      deliveryType: {
        type: 1
      },
      dialogForm: {
        deliver_name: '',
        deliver_phone: ''
      },
      table_deliver: [],
      dialogVisible: false,
      dialogVisibleSub: false,
      isLoading: false,
      loading: false,
      orderId: '',
      deliveryId: '',
      distance: '',
      distanceColumn: this.$t('reschedule.distance_seller'),
      orderCount: '',
      orderSort: 1,
      distanceSort: '',
      selectIndex: 0,
      distributionList: [
        {
          name: this.$t('reschedule.carat')
        },
        {
          name: 'Grab'
        }
      ]
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
    console.log(this.$route.name)
    // this.getAllDeliveryManByDcIdList()
  },
  methods: {
    ...mapMutations(['updatePage', 'updateReassignmentNum']),
    tableSortChange({ column, prop, order }) {
      console.log(prop, order, 'order')
      if (prop == 'orderCount') {
        if (order == 'descending') {
          this.orderSort = 1
          this.distanceSort = ''
        } else {
          this.orderSort = 2
          this.distanceSort = ''
        }
      } else if (prop == 'distance') {
        if (order == 'descending') {
          this.distanceSort = 1
          this.orderSort = ''
        } else {
          this.distanceSort = 2
          this.orderSort = ''
        }
      }
      this.getAllDeliveryManByDcIdList()
    },
    getReassignmentOrderListPage() {
      this.isLoading = true
      let params = {
        currentPage: this.currentPage,
        showCount: this.showCount,
        applyStatus: 1,
        orderId: this.formInline.orderId,
        deliveryTel: this.formInline.deliveryTel,
        deliveryName: this.formInline.deliveryName,
        startTime: this.formInline.time ? this.formInline.time[0] : '',
        endTime: this.formInline.time ? this.formInline.time[1] : '',
        isOrderPayment: this.formInline.isOrderPayment
      }
      // if (this.formInline.customer) {
      //   params.orderId = this.formInline.customer
      // }
      // if (this.formInline.seller_name) {
      //   params.sellerName = this.formInline.seller_name
      // }
      // if (this.formInline.order_type) {
      //   params.isOrderPayment = this.formInline.order_type
      // }
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
    search() {
      this.currentPages = 1
      this.getAllDeliveryManByDcIdList()
    },
    reset() {
      this.formInline = {
        orderId: '',
        deliveryTel: '',
        deliveryName: '',
        time: '',
        isOrderPayment: ''
      }
    },
    selectDistribution(index) {
      this.selectIndex = index
    },
    handleClick(row) {
      this.updatePage(this.currentPage)
      this.$router.push({
        path: '/reschedule_detail',
        query: {
          orderId: row.orderId,
          status: 1
        }
      })
    },
    refuseOrder(row) {
      this.$confirm(
        this.reschedule.sure_person,
        this.reschedule.sure_person.prompt,
        {
          confirmButtonText: this.$t('edit_distributor.confirm'),
          cancelButtonText: this.$t('edit_distributor.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          store
            .dispatch('rejectReassignmentOrder', { orderId: row.orderId })
            .then(res => {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.getReassignmentOrderListPage()
            })
        })
        .catch(() => {})
    },
    getAllDeliveryManByDcIdList() {
      this.loading = true
      store
        .dispatch('getAllDeliveryManByDcIdList', {
          deliveryName: this.dialogForm.deliver_name,
          phone: this.dialogForm.deliver_phone,
          orderId: this.orderId,
          reassignmentType: 3,
          orderSort: this.orderSort,
          distanceSort: this.distanceSort
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            res.data.data.deliveryList.forEach(item => {
              // item.phone = item.diliveryManGlobalCode + ' ' + item.deliveryManTel;
              item.distance = parseFloat(parseFloat(item.distance).toFixed(2))
            })
            this.table_deliver = res.data.data.deliveryList
            if (this.table_deliver) {
              if (this.table_deliver[0].distanceType == 1) {
                this.distanceColumn = this.$t('reschedule.distance_between')
              } else if (this.table_deliver[0].distanceType == 2) {
                this.distanceColumn = this.$t('reschedule.distance_delivery')
              } else if (this.table_deliver[0].distanceType == 3) {
                this.distanceColumn = this.$t('reschedule.distance_seller')
              }
            }
            // this.totalResults = res.data.data.totalResult;
            this.loading = false
            console.log(this.table_deliver)
          } else {
            this.$message.error(res.data.message)
            this.loading = false
          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    handleClickUp(row) {
      this.dialogForm.deliver_name = ''
      this.dialogForm.deliver_phone = ''
      this.orderId = row.orderId
      this.getAllDeliveryManByDcIdList()
      this.dialogVisible = true
    },
    handleClickOrder(row) {
      this.deliveryId = row.deliveryId
      this.distance = row.distance
      this.deliver = row.deliveryName
      this.orderCount = row.orderCount
      this.dialogVisibleSub = true
    },
    confirmSub() {
      store
        .dispatch('handleOrder', {
          orderId: this.orderId,
          reassignmentType: 3,
          deliveryId: this.deliveryId
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.$message.success(res.data.message)
            // this.getAllDeliveryManByDcIdList()
            this.getReassignmentOrderListPage()
          } else {
            this.getReassignmentOrderListPage()
            this.$message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.dialogVisibleSub = false
      this.dialogVisible = false
    },
    typeIndex(index) {
      let val = index + (this.currentPage - 1) * this.showCount + 1
      return val
    },
    tableRowClassName({ row, rowIndex }) {
      console.log('888888', rowIndex)
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
    },
    changePages(page) {
      this.currentPages = page
      this.getAllDeliveryManByDcIdList()
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
    margin: 10px 0 0 0;
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
      cursor: pointer;
      &.act {
        border: 1px solid #1890ff;
      }
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
