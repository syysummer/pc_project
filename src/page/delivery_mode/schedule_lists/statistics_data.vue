<template>
  <div class="statistics_data">
    <div class="schedule_content">
      <div class="form_search">
        <el-form :inline="true" :model="formPickInline" class="demo-form-inline">
          <el-form-item :label="schedule_list.delivery">
            <el-input v-model="formPickInline.seller_name" size="small" :placeholder="schedule_list.namePlaceholder"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="onSubmit" size="mini">{{schedule_list.search}}</el-button>
            <el-button @click="reset" size="mini">{{$t('reschedule.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_schedule">
        <el-table :data="table_pick_data" :row-class-name="tableRowClassName" :header-cell-style="{'background-color': '#F6F9FF'}" :empty-text="empty" style="width: 100%" v-loading="loading">
          <!-- <el-table-column prop="certification_id" :label="rider_manage.rider_column.id"></el-table-column> -->
          <el-table-column prop="deliveryId" :label="schedule_list.delivery_ID" align="center"></el-table-column>
          <el-table-column prop="userName" :label="schedule_list.username" min-width="115"></el-table-column>
          <el-table-column min-width="140" :label="schedule_list.delivery_name">
            <template slot-scope="scope">
              <div>{{scope.row.deliveryName}}</div>
              <div>{{scope.row.deliveryManTel}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="orderCount" :label="schedule_list.holding_amount" min-width="90" align="center"></el-table-column>
          <el-table-column prop="todayCompletedOrderList" min-width="160" :label="schedule_list.complete_today" align="center"></el-table-column>
          <el-table-column prop="cumulativeOrderList" min-width="130" :label="schedule_list.complete_all" align="center"></el-table-column>
          <el-table-column prop="todayGrabOrderList" min-width="130" :label="schedule_list.grab_order" align="center"></el-table-column>
          <el-table-column prop="cumulativeGrabOrderList" min-width="140" :label="schedule_list.grab_order_all" align="center"></el-table-column>
          <el-table-column prop="todaySystemOrderList" :label="schedule_list.system_order_today" min-width="150" align="center"></el-table-column>
          <el-table-column prop="cumulativeSystemOrderList" min-width="125" :label="schedule_list.system_order" align="center"></el-table-column>
          <!-- <el-table-column prop="refuse_order_today" min-width="110" :label="schedule_list.refuse_order_today"></el-table-column>
          <el-table-column prop="refuse_order" min-width="110" :label="schedule_list.refuse_order"></el-table-column> -->
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
export default {
  name: 'statistics_data',
  data() {
    return {
      table_pick_data: [],
      empty: this.$t('no_pass_management.empty'),
      currentPage: 1,
      showCount: 7,
      totalResult: 0,
      active_now: 1,
      formPickInline: {
        seller_name: ''
      },
      loading: false
    }
  },
  computed: {
    schedule_list() {
      let schedule_list = this.$t('schedule_list')
      return schedule_list
    }
  },
  mounted() {
    this.getSchedualStatics()
  },
  methods: {
    getSchedualStatics() {
      this.loading = true
      store
        .dispatch('getSchedualStatics', {
          currentPage: this.currentPage,
          showCount: this.showCount,
          content: this.formPickInline.seller_name
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.loading = false
            this.table_pick_data = res.data.data.staticsInfoList.deliveryList
            this.totalResult = res.data.data.staticsInfoList.totalResult
            console.log('table_pick_data', this.table_pick_data)
          } else {
            this.$message.error(res.data.message)
            this.loading = false
          }
        })
        .catch(err => {
          console.error(err)
          this.loading = false
        })
    },
    onSubmit() {
      this.currentPage = 1
      this.getSchedualStatics()
    },
    reset() {
      this.formPickInline.seller_name = ''
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(rowIndex)
      if (rowIndex % 2 !== 0) {
        return 'warning-row'
      }
      return ''
    },
    changePage(page) {
      this.currentPage = page
      this.getSchedualStatics()
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: #fafafa;
}
</style>
<style lang="scss" scoped>
.statistics_data {
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
  .u-pagination {
    display: inline-block;
    float: right;
  }
}
</style>
