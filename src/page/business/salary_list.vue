<template>
  <div class="salary_list_container">
    <div class="list_nav">
      <div class="work">
        <div :class="{active: isFull==1}" @click="changeList(1)">{{$t("salary_list.full")}}</div>
        <span class="border_line">|</span>
        <div :class="{active: isFull==2}" @click="changeList(2)">{{$t("rider_detail.part_time")}}</div>
      </div>
      <div class="btn"><el-button type="danger" size="small" @click="goSalary">{{$t("salary_list.balance_set")}}</el-button></div>
    </div>
    <el-table :data="salaryData" style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.salaryRule" style="width: 55%" class="time_table">
            <el-table-column prop="date"></el-table-column>
            <el-table-column prop="salary"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="date" :label="$t('salary_list.time')"></el-table-column>
      <el-table-column prop="" :label="$t('salary_list.min_balance')"></el-table-column>
      <el-table-column prop="createTime" :label="$t('salary_list.createTime')"></el-table-column>
      <el-table-column :label="$t('salary_list.operation')" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t("salary_list.look")}}</el-button>
          <span style="color: #409EFF">|</span>
          <el-button type="text" size="small" @click="handleEdit(scope.row)">{{$t("salary_list.edit")}}</el-button>
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
import store from "../../store"
import { formatDateTime } from "../../utils"
import { mapState, mapMutations } from "vuex";
export default {
  name: "salary_list",
  data() {
    return {
      total: 0,
      currentPage: 1,
      showCount: 7,
      salaryData: [],
      isFull: 1,
      loading: false
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.path != "/salary_set") {
      store.state.page = "";
    }
    next();
  },
  computed: {
    ...mapState(["page"])
  },
  mounted() {
    this.currentPage = this.page ? this.page : 1
    let id = this.$route.query.id
    if (id) {
      this.isFull = id
    }
    this.getDeliverySalaryList()
  },
  methods: {
    ...mapMutations(["updatePage"]),
    getDeliverySalaryList() {
      this.loading = true
      let type
      if (this.isFull==2) {
        type = 0
      } else {
        type = 1
      }
      store.dispatch("getDeliverySalaryList", {
        type: type,
        currentPage: this.currentPage,
        showCount: this.showCount
      }).then(res=> {
        console.log(res)
        if (res.data.code==1) {
          this.loading = false
          res.data.data.deliverySalaryList.forEach(item=> {
            item.salaryRule = JSON.parse(item.salaryRule)
            item.salaryRule.forEach(item=> {
              item.date = item.startTime + " - " + item.endTime
              item.salary = item.salary + "P"
            })
            item.createTime = formatDateTime(item.createTime)
            item.date = item.minTime + " - " + item.maxTime
          })
          this.salaryData = res.data.data.deliverySalaryList
          this.total = res.data.data.totalResult
        } else {
          this.loading = false
          this.$message.error(res.data.message)
        }
      }).catch(err=> {
        this.loading = false
        console.error(err)
      })
    },
    handleClick(row) {
      console.log(row);
      this.updatePage(this.currentPage)
      this.$router.push({
        path: "/salary_set",
        query: {edit: 1, id: this.isFull, salaryId: row.id}
      })
    },
    handleEdit(row) {
      this.updatePage(this.currentPage)
      this.$router.push({
        path: "/salary_set",
        query: {edit: 2, id: this.isFull, salaryId: row.id}
      })
    },
    goSalary() {
      this.$router.push({
        path: '/salary_set',
        query: {id: this.isFull}
      })
    },
    changeList(num) {
      this.isFull = num
      this.salaryData = []
      this.currentPage = 1
      this.getDeliverySalaryList()
    },
    changePage(page) {
      this.currentPage = page;
      this.getDeliverySalaryList()
    }
  }
};
</script>
<style scoped lang="scss">
.salary_list_container {
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
        padding: 0 12px;
        font-size: 16px;
        margin: 0 10px;
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
  .page {
    display: flex;
    align-items: center;
    margin: 20px 0 0;
    span {
      color: #666;
    }
    .u-pagination {
      text-align: right;
      flex: 1;
    }
  }
}
</style>
