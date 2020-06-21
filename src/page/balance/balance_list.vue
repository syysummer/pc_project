<template>
  <div class="balance_container">
    <div class="list_nav">
      <div class="work">
        <div :class="{active: isFull==2}" @click="changeList(2)">{{$t("salary_list.full")}}({{deliveryAllSum || 0}})</div>
        <span class="border_line">|</span>
        <div :class="{active: isFull==1}" @click="changeList(1)">{{$t("salary_list.part")}}({{deliveryParJobSum || 0}})</div>
      </div>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
      <el-form-item :label="$t('balance_list.recharge_time')">
        <el-date-picker v-model="formInline.value" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetimerange" align="center" :start-placeholder="$t('balance_list.start')" :end-placeholder="$t('balance_list.end')" :default-time="['00:00:00', '23:59:00']" :picker-options="pickerOptionsDate"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('order_manager.deliMan')">
        <el-input v-model="formInline.customer" size="small" :placeholder="$t('reschedule.please_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('reschedule.phone_number')">
        <el-input v-model="formInline.phone" size="small" :placeholder="$t('reschedule.please_mobile_number')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="onSubmit">{{$t('reschedule.search')}}</el-button>
        <el-button  @click="reset">{{$t('reschedule.reset')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="balanceData" stripe style="width: 100%" v-if="isFull==1" :key="isFull" @sort-change="tableSortChange" v-loading="loading">
      <el-table-column prop="deliveryName" :label="$t('cash_order_statistics.delivery')" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deliveryPhone" :label="$t('rider_manage.phone')" min-width="125"></el-table-column>
      <el-table-column prop="accountBalance" :label="$t('balance_list.balance')" min-width="165" sortable='custom'></el-table-column>
      <el-table-column prop="creditAccountBalance" :label="$t('balance_list.xyBalance')" min-width="150" sortable='custom'></el-table-column>
      <el-table-column prop="createTime" :label="$t('balance_list.recent')" min-width="160"></el-table-column>
      <el-table-column prop="accountBalanceType" :label="$t('balance_list.recent_account')" min-width="135"></el-table-column>
      <el-table-column prop="money" :label="$t('balance_list.recent_balance')" min-width="150" sortable='custom'></el-table-column>
      <el-table-column prop="paycreateTime" :label="$t('balance_list.recent_spending')" min-width="160"></el-table-column>
      <el-table-column prop="payAccountBalanceType" :label="$t('balance_list.spend_account')" min-width="130"></el-table-column>
      <el-table-column prop="paymoney" :label="$t('balance_list.spend_balance')" min-width="155" sortable='custom'></el-table-column>
      <el-table-column :label="$t('distributor.todo')" min-width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('salary_list.look')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="balanceAllData" stripe style="width: 100%" v-if="isFull==2" :key="isFull" @sort-change="tableSortChange" v-loading="loading">
      <el-table-column prop="deliveryName" :label="$t('cash_order_statistics.delivery')" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deliveryPhone" :label="$t('rider_manage.phone')" min-width="125"></el-table-column>
      <el-table-column prop="accountBalance" :label="$t('balance_list.balance')" min-width="165" sortable='custom'></el-table-column>
      <el-table-column prop="createTime" :label="$t('balance_list.recent_income')" min-width="165"></el-table-column>
      <el-table-column prop="money" :label="$t('balance_list.income_balance')" min-width="150" sortable='custom'></el-table-column>
      <el-table-column prop="paycreateTime" :label="$t('balance_list.recent_spending')" min-width="160"></el-table-column>
      <el-table-column prop="payAccountBalanceType" :label="$t('balance_list.spend_account')" min-width="130"></el-table-column>
      <el-table-column prop="paymoney" :label="$t('balance_list.spend_balance')" min-width="155" sortable='custom'></el-table-column>
      <el-table-column :label="$t('distributor.todo')" min-width="100">
        <template slot-scope="scope">
          <el-button @click="handleClicks(scope.row)" type="text" size="small">{{$t('salary_list.look')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page" v-if="parseInt(total)>=1">
      <span>{{$t('distributor.the')}}{{currentPage}}{{$t('distributor.page')}}，{{$t('distributor.shows')}}{{showCount}}{{$t('distributor.count')}}，{{$t('distributor.total')}}{{total}}{{$t('distributor.count')}}</span>
      <div class="u-pagination">
        <el-pagination background layout="prev, pager, next" :total="total" :page-size="showCount" :current-page="parseInt(currentPage)" @current-change="changePage"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import store from "../../store";
import { formatDateTime } from "../../utils";
import compensationVue from "../business/compensation.vue";
export default {
  name: "balance_list",
  data() {
    return {
      total: 0,
      currentPage: 1,
      showCount: 7,
      balanceData: [],
      balanceAllData: [],
      isFull: 2,
      formInline: {
        value: "",
        customer: "",
        phone: ""
      },
      stutas: "",
      loading: false,
      deliveryAllSum: "",
      deliveryParJobSum: "",
      pickerOptionsDate: {
        disabledDate: time => {
          return (
            // time.getTime() < this.formInline.value[1] ||
            time.getTime() > Date.now() - 8.64e6
          );
        }
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.path != "/balance_part") {
      store.state.page = "";
    }
    if (from.path != "/balance_full") {
      store.state.disPage = "";
    }
    next();
  },
  computed: {
    ...mapState(["page", "disPage"])
  },
  mounted() {
    let balanceType = this.$route.query.balanceType;
    console.log(balanceType, "balanceType");
    if (balanceType) {
      if (balanceType == 1) {
        this.isFull = 1;
        this.currentPage = this.page ? this.page : 1;
      } else {
        this.isFull = 2;
        this.currentPage = this.disPage ? this.disPage : 1;
      }
    } else {
      this.isFull = 2;
    }
    if (this.isFull == 1) {
      this.getDeliveredSalary();
    } else {
      this.getFullDeliveredSalary();
    }
    let jspang = Symbol()
    let obj = {
      name: "技术胖",
      skill: "web"
    }
    let setArr = new Set(['jspang','技术胖','web','jspang']);
    // console.log(setArr)
    for (let item of setArr){
      console.log(item);
    }
    console.log(setArr.size);
  },
  methods: {
    ...mapMutations(["updatePage", "updatePages"]),
    getDeliveredSalary() {
      this.loading = true;
      let params = {
        currentPage: this.currentPage,
        showCount: this.showCount,
        deliveryName: this.formInline.customer,
        phone: this.formInline.phone,
        stutas: this.stutas
      };
      if (this.formInline.value) {
        params.startDate = this.formInline.value[0];
        params.endDate = this.formInline.value[1];
      }
      store
        .dispatch("getDeliveredSalary", params)
        .then(res => {
          console.log(res);
          if (res.data.code === 1) {
            this.loading = false;
            res.data.data.deliveryListPage.forEach(item => {
              if (item.createTime) {
                item.createTime = formatDateTime(item.createTime);
              }
              if (item.paycreateTime) {
                item.paycreateTime = formatDateTime(item.paycreateTime);
              }
              console.log(item.paycreateTime);
              item.accountBalance = item.accountBalance + "P";
              item.creditAccountBalance = item.creditAccountBalance + "P";
              item.money = item.money + "P";
              item.paymoney = item.paymoney + "P";
              if (
                item.payAccountBalanceType == "23" ||
                item.payAccountBalanceType == "3" ||
                item.payAccountBalanceType == "4" ||
                item.payAccountBalanceType == "8" ||
                item.payAccountBalanceType == "44"
              ) {
                item.payAccountBalanceType = this.$t(
                  "balance_list.balance_account"
                );
              } else if (
                item.payAccountBalanceType == "35" ||
                item.payAccountBalanceType == "37" || 
                item.payAccountBalanceType == "31"
              ) {
                item.payAccountBalanceType = this.$t("balance_list.xyAccount");
              } else {
                item.payAccountBalanceType = "";
              }
              if (
                item.accountBalanceType == "34" ||
                item.accountBalanceType == "39" || 
                item.accountBalanceType == "32"
              ) {
                item.accountBalanceType = this.$t("balance_list.xyAccount");
              } else if (
                item.accountBalanceType == "38" ||
                item.accountBalanceType == "9" ||
                item.accountBalanceType == "11" ||
                item.accountBalanceType == "7" ||
                item.accountBalanceType == "5" ||
                item.accountBalanceType == "6" ||
                item.accountBalanceType == "24" ||
                item.accountBalanceType == "36"
              ) {
                item.accountBalanceType = this.$t(
                  "balance_list.balance"
                );
              } else {
                item.accountBalanceType = "";
              }
            });
            this.deliveryAllSum = res.data.data.deliveryAllSum;
            this.deliveryParJobSum = res.data.data.deliveryParJobSum;
            this.balanceData = res.data.data.deliveryListPage;
            this.total = res.data.data.totalResult;
            console.log(res.data.data.totalResult, "total");
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
    getFullDeliveredSalary() {
      this.loading = true;
      let params = {
        currentPage: this.currentPage,
        showCount: this.showCount,
        deliveryName: this.formInline.customer,
        phone: this.formInline.phone,
        stutas: this.stutas
      };
      if (this.formInline.value) {
        params.startDate = this.formInline.value[0];
        params.endDate = this.formInline.value[1];
      }
      store
        .dispatch("getFullDeliveredSalary", params)
        .then(res => {
          console.log(res);
          if (res.data.code === 1) {
            this.loading = false;
            res.data.data.deliveryListPage.forEach(item => {
              if (item.createTime) {
                item.createTime = formatDateTime(item.createTime);
              }
              if (item.paycreateTime) {
                item.paycreateTime = formatDateTime(item.paycreateTime);
              }
              item.accountBalance = item.accountBalance + "P";
              item.money = item.money + "P";
              item.paymoney = item.paymoney + "P";
              if (item.payAccountBalanceType == "31") {
                item.payAccountBalanceType = this.$t(
                  "balance_list.xyAccount"
                );
              } else if (item.payAccountBalanceType == "35") {
                item.payAccountBalanceType = this.$t(
                  "balance_list.xyAccount"
                );
              } else if (item.payAccountBalanceType == "37") {
                item.payAccountBalanceType = this.$t(
                  "balance_list.xyAccount"
                );
              } else if (item.payAccountBalanceType == "3") {
                item.payAccountBalanceType = this.$t(
                  "balance_list.balance_account"
                );
              } else if (item.payAccountBalanceType == "4") {
                item.payAccountBalanceType = this.$t(
                  "balance_list.balance_account"
                );
              } else if (item.payAccountBalanceType == "8") {
                item.payAccountBalanceType = this.$t(
                  "balance_list.balance_account"
                );
              } else if (item.payAccountBalanceType == "23") {
                item.payAccountBalanceType = this.$t(
                  "balance_list.balance_account"
                );
              } else if (item.payAccountBalanceType == "44") {
                item.payAccountBalanceType = this.$t(
                  "balance_list.balance_account"
                );
              } else {
                item.payAccountBalanceType = "";
              }
            });
            this.deliveryAllSum = res.data.data.deliveryAllSum;
            this.deliveryParJobSum = res.data.data.deliveryParJobSum;
            this.balanceAllData = res.data.data.deliveryListPage;
            this.total = res.data.data.totalResult;
            console.log(res.data.data.totalResult, "total");
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
    tableSortChange({ column, prop, order }) {
      console.log(prop, order, "order");
      if (prop == "accountBalance") {
        if (order == "descending") {
          this.stutas = 1;
        } else {
          this.stutas = 2;
        }
      } else if (prop == "money") {
        if (order == "descending") {
          this.stutas = 5;
        } else {
          this.stutas = 6;
        }
      } else if (prop == "creditAccountBalance") {
        if (order == "descending") {
          this.stutas = 3;
        } else {
          this.stutas = 4;
        }
      } else if (prop == "payMoney") {
        if (order == "descending") {
          this.stutas = 7;
        } else {
          this.stutas = 8;
        }
      }
      if (this.isFull == 1) {
        this.getDeliveredSalary();
      } else {
        this.getFullDeliveredSalary();
      }
    },
    handleClick(row) {
      console.log(row);
      this.updatePage(this.currentPage);
      localStorage.setItem("deliveryInfo", JSON.stringify(row));
      this.$router.push({
        path: "/balance_part",
        query: { id: row.delivery_id }
      });
    },
    handleClicks(row) {
      console.log(row, "row");
      localStorage.setItem("deliveryInfo", JSON.stringify(row));
      this.updatePages(this.currentPage);
      this.$router.push({
        path: "/balance_full",
        query: { id: row.delivery_id }
      });
    },
    changeList(num) {
      this.currentPage = 1;
      this.formInline.customer = "";
      this.formInline.phone = "";
      this.formInline.value = "";
      this.isFull = num;
      if (this.isFull == 1) {
        this.getDeliveredSalary();
      } else {
        this.getFullDeliveredSalary();
      }
    },
    onSubmit() {
      this.currentPage = 1;
      if (this.isFull == 1) {
        this.getDeliveredSalary();
      } else {
        this.getFullDeliveredSalary();
      }
    },
    reset() {
      this.formInline.value = "";
      this.formInline.customer = "";
      this.formInline.phone = "";
      if (this.isFull == 1) {
        this.getDeliveredSalary();
      } else {
        this.getFullDeliveredSalary();
      }
    },
    changePage(page) {
      this.currentPage = page;
      if (this.isFull == 1) {
        this.getDeliveredSalary();
      } else {
        this.getFullDeliveredSalary();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.el-main {
  background: #ffffff;
}
.balance_container {
  background: #ffffff;
  padding: 10px 30px 20px;
  .list_nav {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ededed;
    margin-bottom: 20px;
    height: 45px;
    .work {
      display: flex;
      flex: 1;
      height: 45px;
      line-height: 40px;
      div {
        padding: 0 5px;
        font-size: 16px;
        margin: 0 15px;
        color: #333333;
        cursor: pointer;
      }
      .active {
        color: #ff725d;
        border-bottom: 2px solid #ff644d;
        background: #ffffff;
      }
      span {
        color: #e8e8e8;
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
}
</style>
