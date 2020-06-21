<template>
  <div class="pick_up">
    <div class="schedule_content">
      <div class="form_search">
        <el-form :inline="true" :model="formPickInline" class="demo-form-inline">
          <el-form-item :label="schedule_list.order">
            <el-input v-model="formPickInline.customer" size="small" :placeholder="schedule_list.order_num"></el-input>
          </el-form-item>
          <el-form-item :label="schedule_list.seller_name">
            <el-input v-model="formPickInline.seller_name" size="small" :placeholder="schedule_list.sellerPlaceholder"></el-input>
          </el-form-item>
          <el-form-item :label="schedule_list.delivery">
            <el-input v-model="formPickInline.delivery" size="small" :placeholder="schedule_list.namePlaceholder"></el-input>
          </el-form-item>
          <el-form-item :label="schedule_list.order_type">
            <el-select v-model="formPickInline.oderType" size="small">
              <el-option :label="$t('rider_manage.all')" value=""></el-option>
              <el-option :label="schedule_list.xitong" value="1"></el-option>
              <el-option :label="schedule_list.orderPlaceholder" value="0"></el-option>
              <el-option :label="schedule_list.xitongs" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="schedule_list.look_status">
            <el-select v-model="formPickInline.lookState" size="small">
              <el-option :label="$t('rider_manage.all')" value=""></el-option>
              <el-option :label="schedule_list.viewed" value="1"></el-option>
              <el-option :label="schedule_list.xitongs" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="onSubmit" size="mini">{{schedule_list.search}}</el-button>
            <el-button @click="reset" size="mini">{{schedule_list.reset}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_schedule">
        <el-table :row-class-name="tableRowClassName" :header-cell-style="{'background-color': '#F6F9FF'}" stripe :data="table_pick_data" :empty-text="empty" style="width: 100%" v-loading="isLoading">
          <!-- <el-table-column prop="certification_id" :label="rider_manage.rider_column.id"></el-table-column> -->
          <el-table-column type="index" :index="typeIndex" :label="schedule_list.num"></el-table-column>
          <el-table-column prop="id" :label="schedule_list.order_num" min-width="120"></el-table-column>
          <el-table-column min-width="140" :label="schedule_list.delivery_name">
            <template slot-scope="scope">
              <div>{{scope.row.deliveryName}}</div>
              <div>{{scope.row.deliveryPhone}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" min-width="170" :label="schedule_list.customer_time"></el-table-column>
          <el-table-column prop="clerkOrderTime" min-width="160" :label="schedule_list.orders_time"></el-table-column>
          <el-table-column prop="distributionTime" min-width="115" align="center" :label="schedule_list.delivery_time"></el-table-column>
          <el-table-column prop="sellerName" :label="schedule_list.seller" min-width="120"></el-table-column>
          <el-table-column prop="address" min-width="150" :label="schedule_list.customer_address" class-name="address-hidden"></el-table-column>
          <el-table-column prop="sellerUserkm" min-width="120" align="center" :label="schedule_list.delivery_distances"></el-table-column>
          <el-table-column prop="orderType" min-width="100" :label="schedule_list.order_types"></el-table-column>
          <el-table-column prop="lookState" min-width="105" :label="schedule_list.look_state"></el-table-column>
          <el-table-column :label="schedule_list.order_detail" min-width="120" align="center">
            <template slot-scope="scope">
              <div class="order-handle">
                <span class="order-left" @click="handleClick(scope.row)">{{$t('schedule_list.look')}}</span>
              </div>
              <!-- <el-button @click="handleClick(scope.row)" type="danger" plain size="mini" class="button-handle">{{$t('schedule_list.look')}}</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="page" v-if="parseInt(totalResult)>=1">
          <span>{{$t('distributor.the')}}{{currentPage}}{{$t('distributor.page')}}，{{$t('distributor.shows')}}{{showCount}}{{$t('distributor.count')}}，{{$t('distributor.total')}}{{totalResult}}{{$t('distributor.count')}}</span>
          <div class="u-pagination">
            <el-pagination background layout="prev, pager, next" :total="totalResult" :current-page="parseInt(currentPage)" :page-size="showCount" @current-change="changePage"></el-pagination>
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
  name: 'pick_up',
  data() {
    return {
      table_pick_data: [],
      empty: this.$t('no_pass_management.empty'),
      total: 3,
      currentPage: 1,
      showCount: 7,
      totalResult: 0,
      active_now: 1,
      formPickInline: {
        customer: '',
        seller_name: '',
        delivery: '',
        oderType: '',
        lookState: ''
      },
      isLoading: false
    }
  },
  mounted() {
    this.currentPage = this.page ? this.page : 1
    this.getPickGoods()
  },
  computed: {
    ...mapState(['page']),
    schedule_list() {
      let schedule_list = this.$t('schedule_list')
      return schedule_list
    }
  },
  methods: {
    ...mapMutations(['updatePage']),
    getPickGoods() {
      this.isLoading = true
      store
        .dispatch('getPickGoods', {
          currentPage: this.currentPage,
          showCount: this.showCount,
          orderId: this.formPickInline.customer,
          sellerName: this.formPickInline.seller_name,
          deliveryName: this.formPickInline.delivery,
          isHandle: this.formPickInline.oderType,
          lookOver: this.formPickInline.lookState
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            res.data.data.pickGoodsList.forEach(item => {
              item.createTime = formatDateTime(item.createTime)
              item.clerkOrderTime = formatDateTime(item.clerkOrderTime)
              item.sellerUserkm = parseFloat(item.sellerUserkm.toFixed(2))
              item.address = item.houseNumber + ', ' + item.address
              if (item.isHandle == 0) {
                item.orderType = this.$t('schedule_list.orderPlaceholder')
              } else if (item.isHandle == 1) {
                item.orderType = this.$t('schedule_list.xitong')
              } else {
                item.orderType = this.$t('schedule_list.xitongs')
              }
              if (item.lookOver == 0) {
                item.lookState = this.$t('schedule_list.not_viewed')
              } else {
                item.lookState = this.$t('schedule_list.viewed')
              }
            })
            this.table_pick_data = res.data.data.pickGoodsList
            this.totalResult = res.data.data.totalResult
            console.log('totla', this.table_pick_data)
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
      this.getPickGoods()
    },
    reset() {
      this.formPickInline.customer = ''
      this.formPickInline.seller_name = ''
      this.formPickInline.delivery = ''
      this.formPickInline.oderType = ''
    },
    handleClick(row) {
      this.updatePage(this.currentPage)
      this.$router.push({
        path: '/order_detail',
        query: {
          id: row.id,
          status: 2
        }
      })
    },
    typeIndex(index) {
      let val = index + (this.currentPage - 1) * this.showCount + 1
      return val
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(rowIndex)
      // if (rowIndex % 2 == 0) {
      //   return "warning-row";
      // }
      // return "";
      if (row.distributionTime >= 60) {
        return 'warning-row-red'
      }
      return ''
    },
    changePage(page) {
      this.currentPage = page
      this.getPickGoods()
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: #fafafa;
}
.el-table .warning-row-red {
  color: red;
}
</style>
<style lang="scss" scoped>
.pick_up {
  .schedule_content {
    padding: 10px 30px;
    .form_search {
      padding-left: 10px;
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
      cursor: pointer;
      font-size: 14px;
    }
  }
  .u-pagination {
    display: inline-block;
    float: right;
  }
}
</style>
