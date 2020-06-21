<template>
  <div class="distribution_management">
    <!-- <div class="title">
            <span></span>{{distributor.distributor_management}}</div> -->
    <!-- <div v-show="!is_loading"> -->
    <div>
      <!-- <vTitle :title="distributor.distributor_management"></vTitle> -->
      <div class="time">
        <div class="block">
          <span class="demonstration">{{distributor.Creation_time}}: </span>
          <el-date-picker size="small" prefix-icon="el-icon-date" :editable="false" @change="getSTime" v-model="value1" type="datetime" :picker-options="pickerOptionsStartDate" :placeholder="$t('order_manager.Select_time')"></el-date-picker>
        </div>
        <div class="block">-</div>
        <div class="block">
          <el-date-picker size="small" v-model="value2" prefix-icon="el-icon-date" @change="getSTimes" :editable="false" type="datetime" :picker-options="pickerOptionsDate" :placeholder="$t('order_manager.Select_time')"></el-date-picker>
        </div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="distributor.deliMan">
          <el-input v-model="formInline.user" size="small" placeholder=""></el-input>
        </el-form-item>
        <el-form-item :label="distributor.deliverer">
          <el-input v-model="formInline.deliveryName" size="small" placeholder=""></el-input>
        </el-form-item>
        <el-form-item :label="distributor.tel">
          <el-input v-model="formInline.tel" size="small" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="search" size="mini" icon="el-icon-search">{{distributor.search}}</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="todoBtn">
            <el-button type="primary" size="mini" @click="addShow">{{distributor.add}}</el-button>
        </div> -->
      <el-table :data="tableData.slice((currentPage-1)*pages,currentPage*pages)" :empty-text="empty" stripe style="width: 100%" v-loading="loading">
        <el-table-column min-width="120" prop="deliveryId" :label="distributor.deliMan" align="center"></el-table-column>
        <el-table-column min-width="110" prop="userName" :label="distributor.VendorName"></el-table-column>
        <el-table-column prop="deliveryName" :label="distributor.name"></el-table-column>
        <el-table-column min-width="120" prop="tel" :label="distributor.phone"></el-table-column>
        <el-table-column min-width="120" prop="mail" :label="distributor.email"></el-table-column>
        <el-table-column min-width="90" :label="distributor.isBind" prop="bindCard">
          <!-- <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">{{scope.row.date}}查看</el-button>
                </template> -->
        </el-table-column>
        <el-table-column :label="distributor.userScore" align="center" min-width="110">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">{{scope.row.deliveryScore}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="distributor.sellerScore" align="center" min-width="140">
          <template slot-scope="scope">
            <el-button @click="handleScore(scope.$index, scope.row)" type="text" size="small">{{scope.row.sellerCommentScore}}</el-button>
          </template>
        </el-table-column>
        <el-table-column min-width="150" align="center" prop="todayOrderCounts" :label="distributor.Completed_today"></el-table-column>
        <el-table-column min-width="90" align="center" prop="ordersTotal" :label="distributor.completed"></el-table-column>
        <el-table-column prop="createTime" min-width="110" :label="distributor.Creation_time"></el-table-column>
        <el-table-column prop="enable" :label="distributor.state"></el-table-column>
        <el-table-column :label="distributor.todo" width="130">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="danger" plain size="mini">{{distributor.look_at}}</el-button>
            <span class="lock_button" v-if="!scope.row.isActive" @click="changeButton(scope.row)">{{distributor.locking}}</span>
            <span class="lock_buttons" v-else @click="changeButton(scope.row)">{{distributor.unlock}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" v-if="parseInt(total)>1">
        <span>{{distributor.the}}{{currentPage}}{{distributor.page}}，{{distributor.shows}}{{pages}}{{distributor.count}}，{{distributor.total}}{{total}}{{distributor.count}}</span>
        <!-- <span>{{distributor.the}}{{currentPage}}{{distributor.page}}，{{distributor.shows}}{{showCount}}{{distributor.count}}，{{distributor.total}}{{total}}{{distributor.count}}</span> -->
        <div class="u-pagination">
          <el-pagination background layout="prev, pager, next" :total="total" :page-size="pages" :current-page="parseInt(currentPage)" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vTitle from "../../components/v_title.vue";
import store from "../../store";
import { formatDateTime } from "../../utils";
import { mapState, mapMutations } from "vuex";
export default {
  name: "distribution_management",
  data() {
    return {
      value1: "",
      value2: "",
      formInline: {
        region: "",
        user: "",
        deliveryName: "",
        tel: ""
      },
      tableData: [],
      pickerOptionsStartDate: {
        disabledDate: time => {
          if (this.value2) {
            return (
              time.getTime() > Date.now() - 8.64e6 ||
              time.getTime() > this.value2
            );
          } else {
            return time.getTime() > Date.now() - 8.64e6;
          }
        }
      },
      pickerOptionsDate: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() - 8.64e6 || time.getTime() < this.value1
          );
        }
      },
      empty: this.$t("no_pass_management.empty"),
      total: "",
      currentPage: 1,
      pages: 7,
      showCount: 100000,
      totalPage: "",
      loading: false
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.path != ('/details_of_the_distributor' || '/evaluation_of_distribution_staff')) {
      store.state.disPage = ''
    }
    next()
  },
  components: {
    vTitle
  },
  computed: {
    ...mapState(["disPage"]),
    distributor() {
      let distributor = this.$t("distributor");
      return distributor;
    }
  },
  mounted() {
    console.log(this.disPage, "disPage")
    this.currentPage = this.disPage ? this.disPage : 1;
    this.getDeliveryList();
  },
  methods: {
    ...mapMutations(["updatePages"]),
    getSTime() {
      console.log(
        "===============",
        new Date().getFullYear(),
        this.value1.getFullYear()
      );
      if (this.value1.getFullYear() > new Date().getFullYear()) {
        this.value1 = new Date();
      }
    },
    getSTimes() {
      console.log(
        "===============",
        new Date().getFullYear(),
        this.value2.getFullYear()
      );
      if (this.value2.getFullYear() > new Date().getFullYear()) {
        this.value2 = new Date();
      }
    },
    getMonthMaxDay(nowdate) {
      nowdate.setMonth(nowdate.getMonth() - 1);
      var y = nowdate.getFullYear();
      var m = nowdate.getMonth() + 1;
      var d = nowdate.getDate();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      return y + "-" + m + "-" + d;
    },
    search() {
      if (this.formInline.tel) {
        let num = /^\d{4,16}$/;
        if (!num.test(this.formInline.tel)) {
          this.$message.error(this.$t("rider_manage.phone_rule"));
          return;
        }
      }
      this.currentPage = 1;
      this.getDeliveryList();
    },
    getDeliveryList() {
      this.loading = true;
      let params = {
        page: this.currentPage,
        limit: this.showCount,
        time: new Date().getTime()
        // startTime: this.value1,
        // endTime: this.value2,
        // deliveryId: this.formInline.user,
        // deliveryName: this.formInline.deliveryName,
        // phone: this.formInline.tel
      };
      if (this.value1) {
        params.startTime = formatDateTime(this.value1);
      }
      if (this.value2) {
        params.endTime = formatDateTime(this.value2);
      }
      if (this.formInline.user) {
        params.deliveryId = this.formInline.user;
      }
      if (this.formInline.deliveryName) {
        params.deliveryName = this.formInline.deliveryName;
      }
      if (this.formInline.tel) {
        params.phone = this.formInline.tel;
      }
      store
        .dispatch("getDeliveryListApi", { params })
        .then(res => {
          console.log("getDeliveryListApi", res);
          if (res.data.code == 1) {
            this.loading = false;
            this.tableData = res.data.data;
            this.tableData.forEach(item => {
              if (item.BankCardbindStatus == "false") {
                item.bindCard = this.$t("distributor.bindCards");
              } else {
                item.bindCard = this.$t("distributor.bindCard");
              }
              if (item.disableStatus == 0) {
                item.enable = this.$t("distributor.enable");
              } else {
                item.enable = this.$t("distributor.unable");
              }
              if (item.disableStatus == 0) {
                item.isActive = false;
              } else {
                item.isActive = true;
              }
              item.createTime = formatDateTime(item.createTime);
            });
            this.total = this.tableData.length;
            this.totalPage = Math.ceil(this.total / this.pages);
          } else {
            this.$message.error(res.data.message);
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    handleClick(row) {
      console.log(this.currentPage, 11111111111);
      this.updatePages(this.currentPage);
      this.$router.push({
        path: "/details_of_the_distributor",
        query: {
          id: row.deliveryId
        }
      });
    },
    handleEdit(index, row) {
      this.updatePages(this.currentPage);
      console.log(index, row);
      this.$router.push({
        path: "/evaluation_of_distribution_staff",
        query: {
          id: row.deliveryId,
          userScore: row.deliveryScore,
          sellerScore: row.sellerCommentScore,
          eval: 1
        }
      });
    },
    handleScore(index, row) {
      this.updatePages(this.currentPage);
      this.$router.push({
        path: "/evaluation_of_distribution_staff",
        query: {
          id: row.deliveryId,
          userScore: row.deliveryScore,
          sellerScore: row.sellerCommentScore,
          eval: 2
        }
      });
    },
    changeButton(row) {
      console.log("row0000", row);
      let type = "";
      row.isActive = !row.isActive;
      if (row.isActive) {
        type = 1;
      } else {
        type = 0;
      }
      store
        .dispatch("lockOrUnlockDeliveryManApi", {
          type: type,
          deliveryId: row.deliveryId
          // deliveryId: 14
        })
        .then(res => {
          console.log("545545", res);
          if (res.data.code == 1) {
            this.$message.success(res.data.message);
            this.getDeliveryList();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // addShow() {
    //     this.$router.push('/edit_the_details_of_the_distributor')
    // },
    changePage(page) {
      this.currentPage = page;
      // this.getDeliveryList()
    }
  }
};
</script>

<style scoped lang="scss">
.distribution_management {
  background: #fff;
  .time {
    padding: 25px 40px;
    .block {
      display: inline-block;
      span {
        color: #6d6d6d;
        font-size: 14px;
      }
    }
  }
  .el-form {
    margin: 23px 0 23px 0;
    padding-left: 40px;
    border-bottom: 1px solid #ededed;
  }
  .el-table {
    padding: 0 20px;
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
  .todoBtn {
    float: right;
    margin-right: 34px;
  }
  .u-pagination {
    display: inline-block;
    float: right;
    margin-right: 20px;
  }
  .lock_button {
    display: inline-block;
    font-size: 12px;
    color: #ff3633;
    border: 1px solid #ff3633;
    border-radius: 4px;
    padding: 0 6px;
    background: #fbfbfb;
    cursor: pointer;
  }
  .lock_buttons {
    display: inline-block;
    font-size: 12px;
    color: #ffffff;
    border: 1px solid #ff3633;
    border-radius: 4px;
    padding: 0 6px;
    background: #ff0000;
    cursor: pointer;
  }
}
</style>
