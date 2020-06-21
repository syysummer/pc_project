<template>
  <div class="balance_full_container">
    <div class="balance_full_header">
      <div class="delivery_info_header">
        <div class="delivery_info">
          <div>
            <span>{{$t('order_manager.deliMan')}}:</span>
            <span>{{deliveryInfo.deliveryName}}</span>
          </div>
          <div>
            <span>{{$t("reschedule.phone_number")}}:</span>
            <span>{{deliveryInfo.deliveryPhone}}</span>
          </div>
          <div>
            <span>{{$t("balance_list.deliveryId")}}:</span>
            <span>{{deliveryId}}</span>
          </div>
          <div>
            <span>{{$t("salary_list.type")}}:</span>
            <span>{{$t("salary_list.full")}}</span>
          </div>
        </div>
        <div class="btn"><el-button type="primary" size="mini" @click="goBack">{{$t("evaluation_of_distribution_staff.back")}}</el-button></div>
      </div>
    </div>
    <div class="balance_full">
      <div class="list_nav">
        <div class="work">
          <div :class="{active: isFull==1}" @click="changeList(1)">{{$t("balance_list.income_record")}}</div>
          <span class="border_line">|</span>
          <div :class="{active: isFull==2}" @click="changeList(2)">{{$t("balance_list.spend_record")}}</div>
        </div>
      </div>
      <div class="balance_account">
        <div>
          <span v-if="isFull==1">{{$t("balance_list.balance30")}}:</span>
          <span v-else>{{$t("balance_list.spend30")}}:</span>
          <span>{{srmoney || 0}}P</span>
        </div>
        <!-- <div>
          <span v-if="isFull==1">{{$t("balance_list.balance1")}}:</span>
          <span v-else>{{$t("balance_list.balance2")}}:</span>
          <span v-if="isFull==1">{{srmoney || 0}}P</span>
          <span v-if="isFull==2">{{zcmoney || 0}}P</span>
        </div> -->
      </div>
      <el-table :data="balanceData" stripe style="width: 100%" v-if="isFull==1" :key="isFull" v-loading="loading" @sort-change="tableSortChange">
        <el-table-column prop="AccountType" :label="$t('balance_list.info')"></el-table-column>
        <el-table-column prop="money" :label="$t('balance_list.balance_come')" sortable='custom' min-width="110"></el-table-column>
        <el-table-column prop="createTime" :label="$t('balance_list.time_come')" sortable='custom' min-width="130"></el-table-column>
        <el-table-column :label="$t('order_manager.state')">
          <template slot-scope="scope">
            <span class="circle"></span>
            <span>{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalanceType" :label="$t('balance_list.type_income')"></el-table-column>
      </el-table>
      <el-table :data="balanceAllData" stripe style="width: 100%" v-else :key="isFull" v-loading="loading" @sort-change="tableSortChange">
        <el-table-column prop="AccountType" :label="$t('balance_list.spend_account')"></el-table-column>
        <el-table-column prop="money" :label="$t('balance_list.spend_balance')" sortable='custom' min-width="110"></el-table-column>
        <el-table-column prop="createTime" :label="$t('balance_list.time_out')" sortable='custom' min-width="130"></el-table-column>
        <el-table-column prop="accountBalanceType" :label="$t('balance_list.type_out')"></el-table-column>
        <el-table-column :label="$t('order_manager.state')">
          <template slot-scope="scope">
            <span class="circle"></span>
            <span>{{scope.row.status}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" v-if="parseInt(total)>1">
        <span>{{$t('distributor.the')}}{{currentPage}}{{$t('distributor.page')}}，{{$t('distributor.shows')}}{{showCount}}{{$t('distributor.count')}}，{{$t('distributor.total')}}{{total}}{{$t('distributor.count')}}</span>
        <div class="u-pagination">
          <el-pagination background layout="prev, pager, next" :total="total" :page-size="showCount" :current-page="parseInt(currentPage)" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../../store"
import { formatDateTime } from "../../utils";
export default {
  name: "balance_list",
  data() {
    return {
      total: 100,
      currentPage: 1,
      showCount: 7,
      balanceData: [],
      balanceAllData: [],
      isFull: 1,
      deliveryInfo: {},
      deliveryList: "",
      loading: false,
      status: 3,
      deliveryId: "",
      srmoney: "",
      zcmoney: ""
    };
  },
  mounted() {
    this.deliveryId = this.$route.query.id;
    let deliveryInfo = localStorage.getItem("deliveryInfo");
    if (deliveryInfo) {
      this.deliveryInfo = JSON.parse(deliveryInfo);
    }
    this.getRecordOfIncome();
  },
  methods: {
    getRecordOfIncome() {
      this.loading = true;
      store
        .dispatch("getRecordOfIncome", {
          deliveryId: this.$route.query.id,
          workType: 1,
          currentPage: this.currentPage,
          showCount: this.showCount,
          status: this.status
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.loading = false;
            res.data.data.RecordOfIncomeList.forEach(item => {
              item.createTime = formatDateTime(item.createTime);
              if (item.accountBalanceType == "6") {
                item.accountBalanceType = this.$t('balance_list.balance10');
              } else if (item.accountBalanceType == "7") {
                item.accountBalanceType = this.$t('balance_list.balance_fre');
              } else if (item.accountBalanceType == "5") {
                item.accountBalanceType = this.$t('balance_list.balance_fre1');
              } else if (item.accountBalanceType == "9") {
                item.accountBalanceType = this.$t('balance_list.income1');
              } else if (item.accountBalanceType == "36" || item.accountBalanceType == "32") {
                item.accountBalanceType = this.$t('balance_list.balance5');
              } else if (item.accountBalanceType == "38") {
                item.accountBalanceType = this.$t('balance_list.income2');
              } else if (item.accountBalanceType == "11") {
                item.accountBalanceType = this.$t('balance_list.balance_fre2');
              } else if (item.accountBalanceType == "24") {
                item.accountBalanceType = this.$t('balance_list.balance_fre3');
              } else if (item.accountBalanceType == "34") {
                item.accountBalanceType = this.$t('balance_list.balance_fre4');
              }else if (item.accountBalanceType == "39") {
                item.accountBalanceType = this.$t('balance_list.income3');
              }
              item.money = item.money + "P";
              item.status = this.$t('balance_list.status');
            });
            this.balanceData = res.data.data.RecordOfIncomeList;
            this.deliveryList = res.data.data.deliveryList;
            this.srmoney = res.data.data.srmoney;
            this.total = res.data.data.totalResult;
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
    getRecordOfExpenditure() {
      this.loading = true;
      store
        .dispatch("getRecordOfExpenditure", {
          deliveryId: this.$route.query.id,
          workType: 1,
          currentPage: this.currentPage,
          showCount: this.showCount,
          status: this.status
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.loading = false;
            res.data.data.expenditureList.forEach(item => {
              item.createTime = formatDateTime(item.createTime);
              if (item.accountBalanceType == "3") {
                item.accountBalanceType = this.$t('balance_list.withdrawal');
              } else if (item.accountBalanceType == "4") {
                item.accountBalanceType = this.$t('balance_list.balance_fre6');
              } else if (item.accountBalanceType == "8") {
                item.accountBalanceType = this.$t('balance_list.balance_fre7');
              } else if (item.accountBalanceType == "23") {
                item.accountBalanceType = this.$t('balance_list.balance9');
              } else if (item.accountBalanceType == "31") {
                item.accountBalanceType = this.$t('balance_list.balance6');
              } else if (item.accountBalanceType == "35") {
                item.accountBalanceType = this.$t('balance_list.balance7');
              } else if (item.accountBalanceType == "37") {
                item.accountBalanceType = this.$t('balance_list.balance_fre9');
              } else if (item.accountBalanceType == "44") {
                item.accountBalanceType = this.$t('balance_list.balance_fre10');
              }
              item.money = item.money + "P";
              item.status = this.$t('balance_list.status_out');
            });
            this.balanceAllData = res.data.data.expenditureList;
            this.srmoney = res.data.data.zcmoney;
            this.zcmoney = res.data.data.zcmoney;
            this.total = res.data.data.totalResult;
          } else {
            this.loading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    tableSortChange({ column, prop, order }) {
      console.log(prop, order, "order");
      if (prop == "money") {
        if (order == "descending") {
          this.status = 1;
        } else {
          this.status = 2;
        }
      } else if (prop == "createTime") {
        if (order == "descending") {
          this.status = 3;
        } else {
          this.status = 4;
        }
      }
      if (this.isFull == 1) {
        this.getRecordOfIncome();
      } else {
        this.getRecordOfExpenditure();
      }
    },
    changeList(num) {
      this.isFull = num;
      this.currentPage = 1;
      this.balanceData = [];
      if (this.isFull == 1) {
        this.getRecordOfIncome();
      } else {
        this.getRecordOfExpenditure();
      }
    },
    goBack() {
      this.$router.push({
        path: "/balance_list",
        query: {balanceType: 2}
      })
    },
    changePage(page) {
      this.currentPage = page;
      if (this.isFull == 1) {
        this.getRecordOfIncome();
      } else {
        this.getRecordOfExpenditure();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.balance_full_container {
  .balance_full_header {
    background: #fff;
    margin-bottom: 12px;
    padding: 10px 30px;
    .delivery_info_header {
      display: flex;
      align-items: center;
      .delivery_info {
        flex: 1;
        display: flex;
        div {
          margin-right: 0.5rem;
          color: #333333;
          span {
            &:last-child {
              color: #999999;
            }
            font-size: 13px;
          }
        }
      }
    }
    .balance_info {
      display: flex;
      padding: 18px 0 10px;
      .account {
        display: flex;
        align-items: center;
        margin-right: 100px;
        .icon_color {
          width: 38px;
          height: 38px;
          line-height: 35px;
          background: #ffb470;
          color: #fff;
          border-radius: 20px;
          text-align: center;
          margin-right: 10px;
          i {
            font-size: 24px;
          }
        }
        .icon_colors {
          width: 38px;
          height: 38px;
          line-height: 38px;
          background: #3ea2ff;
          color: #fff;
          border-radius: 20px;
          text-align: center;
          margin-right: 10px;
          i {
            font-size: 20px;
          }
        }
        .info {
          div {
            &:first-child {
              font-size: 15px;
              color: #666;
            }
            &:last-child {
              font-size: 24px;
              color: #333;
            }
          }
        }
      }
    }
  }
  .balance_full {
    background: #ffffff;
    padding: 10px 30px 20px;
    .list_nav {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ededed;
      margin-bottom: 15px;
      height: 45px;
      .work {
        display: flex;
        flex: 1;
        height: 45px;
        line-height: 40px;
        div {
          padding: 0 5px;
          font-size: 14px;
          margin: 0 15px;
          color: #333333;
          cursor: pointer;
        }
        .active {
          color: #ff725d;
          border-bottom: 2px solid #ff644d;
          background: #fff;
        }
        span {
          color: #e8e8e8;
        }
      }
    }
    .balance_account {
      display: flex;
      margin-left: 20px;
      margin-bottom: 10px;
      div {
        color: #373737;
        margin-right: 30px;
        span {
          &:first-child {
            font-size: 13px;
          }
          &:last-child {
            font-size: 20px;
            color: #191919;
          }
        }
      }
    }
    .page {
      display: flex;
      align-items: center;
      margin: 20px 0 0;
      .u-pagination {
        text-align: right;
        flex: 1;
      }
    }
    .cell {
      span {
        font-size: 14px;
      }
      .circle {
        background: #52c41a;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
  }
}
</style>
