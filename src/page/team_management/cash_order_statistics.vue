<template>
  <div class="cash_order_statistics">
    <!-- <vTitle :title="$t('public_model.cash_order_statistics')"></vTitle> -->
    <div class="content">
      <div class="amount_list">
        <div class="box">
          <div class="icon_red icon">
            <div><i class="iconfont icon-zhanghuyue"></i></div>
          </div>
          <div class="notes">
            <div>{{$t('cash_order_statistics.total_amount')}}</div>
            <div>{{settledInfo.settledMoney || 0}}P</div>
          </div>
        </div>
        <div class="box">
          <div class="icon_yellow icons">
            <div><i class="iconfont icon-dingdan-blue-copy-copy"></i></div>
          </div>
          <div class="notes">
            <div>{{$t('cash_order_statistics.total_orders')}}</div>
            <div>{{settledInfo.settledNum || 0}}</div>
          </div>
        </div>
        <div class="box">
          <div class="icon_blue icon">
            <div><i class="iconfont icon-zhanghuyue"></i></div>
          </div>
          <div class="notes">
            <div>{{$t('cash_order_statistics.unsettled_amount')}}</div>
            <div>{{unsettleInfo.unsettledMoney || 0}}P</div>
          </div>
        </div>
        <div class="box">
          <div class="icon_orange icons">
            <div><i class="iconfont icon-dingdan-blue-copy-copy"></i></div>
          </div>
          <div class="notes">
            <div>{{$t('cash_order_statistics.unsettled_orders')}}</div>
            <div>{{unsettleInfo.unsettledNum || 0}}</div>
          </div>
        </div>
      </div>
      <div class="form-inline">
        <el-form :inline="true" :model="formCashOrder" class="demo-form-inline" size="small">
          <el-form-item :label="$t('order_manager.deliverer')">
            <el-input v-model="formCashOrder.delivery_name" size="small" :placeholder="$t('schedule_list.deliver_name')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('no_pass_management.phone')">
            <el-input v-model="formCashOrder.tel" size="small" :placeholder="$t('schedule_list.deliver_phone')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="onSubmit">{{$t('schedule_list.search')}}</el-button>
            <el-button type="primary" @click="resect">{{$t('schedule_list.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-branch">
        <el-table :data="branchTable" style="width: 100%" :row-class-name="tableRowClassName" :default-sort = "{prop: 'unsettledMoney', order: 'descending'}" @sort-change="tableSortChange" v-loading="loading">
          <el-table-column prop="deliveryName" :label="$t('cash_order_statistics.delivery')" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deliveryTel" :label="$t('rider_manage.phone')" min-width="125"></el-table-column>
          <el-table-column prop="unsettledMoney" :label="$t('cash_order_statistics.amount_tab')" min-width="175" sortable='custom'></el-table-column>
          <el-table-column prop="unsettledNum" :label="$t('cash_order_statistics.orders_tab')" min-width="165" sortable='custom'></el-table-column>
          <el-table-column prop="settleMoney" :label="$t('cash_order_statistics.amount')" min-width="155" sortable='custom'></el-table-column>
          <el-table-column prop="settleNum" :label="$t('cash_order_statistics.orders')" min-width="155" sortable='custom'></el-table-column>
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
import { mapActions } from "vuex";
import vTitle from "../../components/v_title";
import store from "../../store";
export default {
  name: "cash_order_statistics",
  data() {
    return {
      formCashOrder: {
        delivery_name: "",
        tel: ""
      },
      branchTable: [],
      total: 0,
      currentPage: 1,
      showPage: 7,
      unsettleMoney: 1,
      unsettleNum: "",
      settledMoneys: "",
      settledNum: "",
      unsettleInfo: {},
      settledInfo: {},
      loading: false
    };
  },
  components: { vTitle },
  mounted() {
    this.getDeliverySettleList();
  },
  methods: {
    ...mapActions(["getSellerList"]),
    tableRowClassName({ row, rowIndex }) {
      // console.log(rowIndex)
      if (rowIndex % 2 == 0) {
        return "warning-row";
      }
      return "";
    },
    tableSortChange({ column, prop, order }) {
      console.log(prop, order, "order");
      if (prop == "unsettledMoney") {
        if (order == "descending") {
          this.unsettleMoney = 1;
          this.unsettleNum = "";
          this.settledMoneys = "";
          this.settledNum = "";
        } else {
          this.unsettleMoney = 2;
          this.unsettleNum = "";
          this.settledMoneys = "";
          this.settledNum = "";
        }
      } else if (prop == "unsettledNum") {
        if (order == "descending") {
          this.unsettleNum = 1;
          this.unsettleMoney = "";
          this.settledMoneys = "";
          this.settledNum = "";
        } else {
          this.unsettleNum = 2;
          this.unsettleMoney = "";
          this.settledMoneys = "";
          this.settledNum = "";
        }
      } else if (prop == "settleMoney") {
        if (order == "descending") {
          this.settledMoneys = 1;
          this.unsettleNum = "";
          this.unsettleMoney = "";
          this.settledNum = "";
        } else {
          this.settledMoneys = 2;
          this.unsettleNum = "";
          this.unsettleMoney = "";
          this.settledNum = "";
        }
      } else if (prop == "settleNum") {
        if (order == "descending") {
          this.settledNum = 1;
          this.unsettleNum = "";
          this.unsettleMoney = "";
          this.settledMoneys = "";
        } else {
          this.settledNum = 2;
          this.unsettleNum = "";
          this.unsettleMoney = "";
          this.settledMoneys = "";
        }
      }
      this.getDeliverySettleList();
    },
    getDeliverySettleList() {
      this.loading = true;
      store
        .dispatch("getDeliverySettleList", {
          currentPage: this.currentPage,
          showCount: this.showPage,
          deliveryName: this.formCashOrder.delivery_name,
          phone: this.formCashOrder.tel,
          unsettleMoney: this.unsettleMoney,
          unsettleNum: this.unsettleNum,
          settledMoney: this.settledMoneys,
          settledNum: this.settledNum
        })
        .then(res => {
          console.log(res.data.data);
          if (res.data.code == 1) {
            this.loading = false;
            this.unsettleInfo = res.data.data.dcSettleInfo.unsettleInfo;
            this.settledInfo = res.data.data.dcSettleInfo.settledInfo;
            // res.data.data.deliverySettleList.deliverySettleList.forEach(item=> {
            //   item.settledMoney = item.settledInfo.settledMoney
            //   item.settledNum = item.settledInfo.settledNum
            //   item.unsettleMoney = item.unsettledInfo.unsettleMoney
            //   item.unsettleNum = item.unsettledInfo.unsettleNum
            // })
            this.branchTable =
              res.data.data.deliverySettleList.deliverySettleList;
            this.total = res.data.data.deliverySettleList.totalResult;
          } else {
            this.loading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
        });
    },
    onSubmit() {
      this.currentPage = 1;
      this.getDeliverySettleList();
    },
    resect() {
      this.formCashOrder.delivery_name = "";
      this.formCashOrder.tel = "";
    },
    handleClick(row) {
      console.log(row);
      this.$router.push({
        path: "/delivery_order_detail",
        query: {
          id: row.deliveryId,
          mn1: row.settleMoney,
          no1: row.settleNum,
          mn2: row.unsettledMoney,
          no2: row.unsettledNum,
          name: row.deliveryName,
          tel: row.deliveryTel
        }
      });
    },
    changePage(page) {
      this.currentPage = page;
      this.getDeliverySettleList();
      // this.getRiderList()
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: #fafafa;
}
</style>

<style scoped lang="scss">
.cash_order_statistics {
  background: #fff;
  .content {
    padding: 5px 30px 20px;
    // margin: 24px;
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
