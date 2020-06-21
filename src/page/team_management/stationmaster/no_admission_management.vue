<template>
  <div class="no_admission_management">
    <!-- <vTitle :title="no_pass_management.title"></vTitle> -->
    <el-form :inline="true" :model="rider" class="demo-form-inlines">
      <el-form-item :label="no_pass_management.phone">
        <el-input v-model="rider.phone" size="small" placeholder="" @blur="checkNum"></el-input>
      </el-form-item>
      <el-form-item :label="no_pass_management.name">
        <el-input v-model="rider.name" size="small" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="no_pass_management.source">
        <el-select v-model="rider.source" size="small">
          <el-option :label="$t('evaluation_of_distribution_staff.all')" value=""></el-option>
          <el-option :label="no_pass_management.take" value="1"></el-option>
          <el-option :label="no_pass_management.take_h5" value="2"></el-option>
          <el-option :label="no_pass_management.take_pc" value="3"></el-option>
          <el-option :label="no_pass_management.take_app" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="no_pass_management.job_address">
        <el-select v-model="rider.provinceId" size="small" @change="changeLocationValue">
          <el-option :label="$t('evaluation_of_distribution_staff.all')" value=""></el-option>
          <el-option v-for="item in addressList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="rider.cityId" size="small">
          <el-option :label="$t('evaluation_of_distribution_staff.all')" value=""></el-option>
          <el-option v-for="items in cityList" :key="items.id" :value="items.id" :label="items.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="no_pass_management.time" class="noPass_time">
        <el-col :span="11">
          <el-date-picker size="small" type="date" :editable="false" :placeholder="$t('order_manager.Select_time')" prefix-icon="el-icon-date" v-model="rider.date1" :picker-options="pickerOptionsStartDate" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="11">
          <el-date-picker size="small" type="date" :editable="false" :placeholder="$t('order_manager.Select_time')" prefix-icon="el-icon-date" v-model="rider.date2" :picker-options="pickerOptionsDate" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchRider" size="mini" icon="el-icon-search">{{rider_manage.search}}</el-button>
        <el-button type="warning" @click="resetRider" size="mini" icon="el-icon-search">{{rider_manage.reset}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData.slice((currentPage-1)*showCount,currentPage*showCount)" :empty-text="empty" stripe style="width: 100%">
      <!-- <el-table-column prop="certification_id" :label="rider_manage.rider_column.id"></el-table-column> -->
      <el-table-column type="index" width="50" :index="typeIndex" :label="rider_manage.rider_column.id"></el-table-column>
      <el-table-column prop="phone" width="130" :label="rider_manage.rider_column.phone"></el-table-column>
      <el-table-column prop="delivery_name" :label="rider_manage.rider_column.name"></el-table-column>
      <el-table-column width="145" prop="contactProvincCity" :label="no_pass_management.city"></el-table-column>
      <el-table-column prop="enrolmentSource" :label="rider_manage.rider_column.enrolmentSource"></el-table-column>
      <el-table-column width="145" prop="workProvincCity" :label="no_pass_management.job_add"></el-table-column>
      <el-table-column prop="status" width="180" :label="rider_manage.rider_column.status"></el-table-column>
      <el-table-column prop="create_time" width="110" :label="rider_manage.rider_column.enrolmentTime"></el-table-column>
      <el-table-column prop="review_time" width="110" :label="no_pass_management.time_n"></el-table-column>
      <el-table-column :label="rider_manage.rider_column.operation" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="danger" size="mini" class="button-handle">{{no_pass_management.look}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page" v-if="parseInt(total)>=1">
      <span>{{distributor.the}}{{currentPage}}{{distributor.page}}，{{distributor.shows}}{{showCount}}{{distributor.count}}，{{distributor.total}}{{total}}{{distributor.count}}</span>
      <div class="u-pagination">
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="parseInt(currentPage)" :page-size="showCount" @current-change="changePage"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import vTitle from "../../../components/v_title.vue";
import store from "../../../store";
import { formatDateTime } from "../../../utils";
export default {
  name: "no_admission_management",
  data() {
    return {
      rider: {
        phone: "",
        name: "",
        source: "",
        provinceId: "",
        cityId: "",
        date1: "",
        date2: ""
      },
      empty: this.$t("no_pass_management.empty"),
      pickerOptionsStartDate: {
        disabledDate: time => {
          if (this.rider.date2) {
            return time.getTime() > this.rider.date2;
          }
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      pickerOptionsDate: {
        disabledDate: time => {
          return (
            time.getTime() < this.rider.date1 ||
            time.getTime() > Date.now() - 8.64e6
          );
        }
      },
      tableData: [],
      total: "",
      currentPage: 1,
      showCount: 7,
      addressList: [],
      cityList: [],
      totalPage: ""
    };
  },
  components: {
    vTitle
  },
  mounted() {
    this.getCertificationFailList();
    this.getAddress();
    this.getAreaCityList();
  },
  methods: {
    checkNum() {
      // if (this.rider.phone) {
      //   let num = /^\d{4,16}$/;
      //   if (!num.test(this.rider.phone)) {
      //     this.$message.error(this.$t("rider_manage.phone_rule"));
      //   }
      // }
    },
    searchRider() {
      if (this.rider.phone) {
        let num = /^\d{4,16}$/;
        if (!num.test(this.rider.phone)) {
          this.$message.error(this.$t("rider_manage.phone_rule"));
          return;
        }
      }
      console.log("this.value", this.rider.source);
      this.currentPage = 1;
      this.getCertificationFailList();
    },
    changeLocationValue(val) {
      console.log("val", val);
      this.rider.cityId = "";
      this.getAreaCityList();
    },
    resetRider() {
      this.rider.phone = "";
      this.rider.name = "";
      this.rider.source = "";
      this.rider.cityId = "";
      (this.rider.provinceId = ""),
        (this.rider.date1 = ""),
        (this.rider.date2 = ""),
        (this.currentPage = 1);
    },
    handleClick(row) {
      console.log(row);
      this.$router.push({
        path: "/admission_management_detail",
        query: {
          id: row.certification_id,
          review_status: row.review_status
        }
      });
    },
    getAddress() {
      store
        .dispatch("getAreaRegionListApi", {})
        .then(res => {
          console.log("res1111", res);
          if (res.data.code == 1) {
            this.addressList = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAreaCityList() {
      store
        .dispatch("getAreaCityListApi", { regionId: this.rider.provinceId })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.cityList = res.data.data;
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCertificationFailList() {
      let params = {
        page: this.currentPage,
        limit: this.showCount,
        time: new Date().getTime()
      };
      if (this.rider.phone != "") {
        params.phone = this.rider.phone;
      }
      if (this.rider.name != "") {
        params.deliveryName = this.rider.name;
      }
      if (this.rider.provinceId != "") {
        params.provinceId = this.rider.provinceId;
      }
      if (this.rider.cityId != "") {
        params.cityId = this.rider.cityId;
      }
      if (this.rider.source != "") {
        params.registrationForm = this.rider.source;
      }
      if (this.rider.date1 != "") {
        params.startTime = formatDateTime(this.rider.date1, "ymd");
      }
      if (this.rider.date2 != "") {
        params.endTime = formatDateTime(this.rider.date2, "ymd");
      }
      store
        .dispatch("getCertificationFailListApi", { params })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.tableData = res.data.data;
            this.tableData.forEach(item => {
              console.log("item", item.review_type);
              if (item.review_type == 1) {
                item.status = this.$t("no_pass_management.no_pass_id");
              } else if (item.review_type == 0) {
                item.status = this.$t("no_pass_management.no_pass_phone");
              } else if (item.review_type == 2) {
                item.status = this.$t("no_pass_management.no_pass_downLine");
              } else if (item.review_type == 3) {
                item.status = this.$t("no_pass_management.no_pass_contract");
              }
              if (item.registration_form == 1) {
                item.enrolmentSource = this.$t("no_pass_management.take");
              } else if (item.registration_form == 2) {
                item.enrolmentSource = this.$t("no_pass_management.take_h5");
              } else if (item.registration_form == 3) {
                item.enrolmentSource = this.$t("no_pass_management.take_pc");
              } else if (item.registration_form == 4) {
                item.enrolmentSource = this.$t("no_pass_management.take_app");
              }
              item.create_time = formatDateTime(item.create_time);
              item.review_time = formatDateTime(item.review_time);
            });
            this.total = this.tableData.length;
            this.totalPage = Math.ceil(this.total / this.showCount);
            console.log("res", this.tableData);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changePage(page) {
      this.currentPage = page;
      // this.getCertificationFailList()
    },
    typeIndex(index) {
      let val = index + (this.currentPage - 1) * this.showCount + 1;
      return val;
    }
  },
  computed: {
    no_pass_management() {
      let no_pass_management = this.$t("no_pass_management");
      return no_pass_management;
    },
    rider_manage() {
      let rider_manage = this.$t("rider_manage");
      return rider_manage;
    },
    distributor() {
      let distributor = this.$t("distributor");
      return distributor;
    }
  }
};
</script>

<style  scoped lang="scss">
.no_admission_management {
  background: #fff;
  .el-form {
    padding: 23px 0 23px 30px;
    border-bottom: 1px solid #ededed;
    .el-col-1 {
      display: flex;
      justify-content: center;
    }
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
  .u-pagination {
    display: inline-block;
    float: right;
  }
}
.button-handle {
  font-size: 14px;
}
</style>
