<template>
  <div class="admission_management">
    <!-- <vTitle :title="public_model.admission_management"></vTitle> -->
    <el-form :inline="true" :model="rider" class="demo-form-inlines">
      <el-form-item :label="rider_manage.phone">
        <el-input v-model="rider.phone" size="small" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="rider_manage.name">
        <el-input v-model="rider.deliveryName" size="small" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="rider_manage.source">
        <el-select v-model="rider.registrationForm" size="small">
          <el-option :label="rider_manage.all" value=""></el-option>
          <el-option :label="rider_manage.takeaway_app" value="1"></el-option>
          <el-option :label="rider_manage.takeaway_h" value="2"></el-option>
          <el-option :label="rider_manage.takeaway_pc" value="3"></el-option>
          <el-option :label="rider_manage.delivery_staff" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="rider_manage.status">
        <el-select v-model="rider.reviewType" size="small">
          <el-option :label="rider_manage.all" value=""></el-option>
          <el-option :label="rider_manage.waiting_review" value="0"></el-option>
          <el-option :label="rider_manage.underline_training" value="1"></el-option>
          <el-option :label="rider_manage.pending_contract" value="2"></el-option>
          <el-option :label="rider_manage.signed_contract" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchRider" size="mini" icon="el-icon-search">{{rider_manage.search}}</el-button>
        <el-button type="warning" @click="resetRider" size="mini" icon="el-icon-search">{{rider_manage.reset}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="riderData.slice((currentPage-1)*showCount,currentPage*showCount)" :empty-text="empty" stripe style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column type="index" width="50" :index="typeIndex" :label="rider_manage.rider_column.id">
      </el-table-column>
      <el-table-column min-width="125" prop="phone" :label="rider_manage.rider_column.phone"></el-table-column>
      <el-table-column prop="delivery_name" :label="rider_manage.rider_column.name"></el-table-column>
      <el-table-column prop="work_type" :label="rider_manage.rider_column.work_type"></el-table-column>
      <el-table-column prop="registration_form" min-width="140" :label="rider_manage.rider_column.enrolmentSource"></el-table-column>
      <el-table-column prop="create_time" width="110" :label="rider_manage.rider_column.enrolmentTime"></el-table-column>
      <el-table-column prop="review_type" min-width="120" :label="rider_manage.rider_column.status">
        <template slot-scope="scope">
          <!--<span v-if="scope.row.review_type==0">{{rider_manage.waiting_interview}}</span>-->
          <!--<span v-if="scope.row.review_type==1">{{rider_manage.waiting_review}}</span>-->
          <span v-if="scope.row.review_type==0">{{rider_manage.waiting_review}}</span>
          <span v-if="scope.row.review_type==1">{{rider_manage.underline_training}}</span>
          <span v-if="scope.row.review_type==2">{{rider_manage.pending_contract}}</span>
          <span v-if="scope.row.review_type==3">{{rider_manage.signed_contract}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140" :label="rider_manage.rider_column.operation">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary" size="mini" class="button-handle" v-if="scope.row.review_type==3">{{rider_manage.rider_column.see_details}}</el-button>
          <el-button @click="handleClick(scope.row)" type="primary" size="mini" class="button-handle" v-else>{{rider_manage.rider_column.look_handle}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page" v-if="parseInt(total)>=1">
      <span>{{distributor.the}}{{currentPage}}{{distributor.page}}，{{distributor.shows}}{{showCount}}{{distributor.count}}，{{distributor.total}}{{total}}{{distributor.count}}</span>
      <div class="u-pagination">
        <el-pagination background layout="prev, pager, next" :current-page="parseInt(currentPage)" :page-size="showCount" :total="total" @current-change="changePage"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import vTitle from '../../../components/v_title.vue'
import { formatDateTime } from '../../../utils/index'
import { mapState, mapMutations } from "vuex";
import store from '../../../store'
export default {
  data() {
    return {
      rider: {
        phone: '',
        deliveryName: '',
        registrationForm: '',
        reviewType: ''
      },
      total: 0,
      currentPage: 1,
      showCount: 7,
      empty: this.$t('no_pass_management.empty'),
      riderData: []
    }
  },
  components: {
    vTitle
  },
  beforeRouteEnter(to, from, next) {
    console.log(from.path)
    if (from.path != "/admission_management_detail") {
      store.state.page = ""
    }
    next()
  },
  mounted() {
    console.log(this.page, "3333333333333")
    if (this.$route != "/admission_management_detail") {
      // this.updatePage()
    }
    this.currentPage = this.page ? this.page : 1;
    this.getRiderList()
  },
  watch: {
    $route(newVal, oldVal) {
      // return this.currentPage
      console.log(newVal,2222222222)
    }
  },
  methods: {
    ...mapMutations(["updatePage"]),
    tableRowClassName({ row, rowIndex }) {
      if (row.review_type === 0 && row.timeFlag == 1) {
        return 'success-row'
      }
      return ''
    },
    searchRider() {
      this.currentPage = 1
      this.getRiderList()
    },
    resetRider() {
      this.rider.phone = ''
      this.rider.deliveryName = ''
      this.rider.registrationForm = ''
      this.rider.reviewType = ''
      this.currentPage = 1
    },
    handleClick(row) {
      this.updatePage(this.currentPage);
      console.log(this.currentPage, 11111111111)
      // console.log(this.$router)
      this.$router.push({
        path: '/admission_management_detail',
        query: {
          id: row.certification_id,
          review_status: row.review_status,
          color_status: 1
        }
      })
    },
    changePage(page) {
      this.currentPage = page
      // this.getRiderList()
    },
    getRiderList() {
      let params = {
        page: this.currentPage,
        limit: this.showCount,
        time: new Date().getTime()
      }
      if (this.rider.phone) {
        let reg = /^\d{4,16}$/
        if (!reg.test(this.rider.phone)) {
          this.$message.error(this.rider_manage.phone_rule)
          return
        }
        params.phone = this.rider.phone
      }
      if (this.rider.deliveryName) {
        params.deliveryName = this.rider.deliveryName
      }
      if (this.rider.registrationForm) {
        params.registrationForm = this.rider.registrationForm
      }
      if (this.rider.reviewType) {
        params.reviewType = this.rider.reviewType
      }
      store.dispatch('getCertificationAuditList', { params }).then(res => {
        if (res.data.code == 1) {
          this.riderData = res.data.data
          this.total = this.riderData.length
          this.riderData.forEach((item, index) => {
            item.create_time = formatDateTime(item.create_time)
            item.phone = '+' + item.global_code + ' ' + item.phone
            if (item.work_type == 1) {
              item.work_type = this.rider_detail.full_time
            } else {
              item.work_type = this.rider_detail.part_time
            }
            switch (item.registration_form) {
              case 1:
                item.registration_form = this.rider_manage.takeaway_app
                break
              case 2:
                item.registration_form = this.rider_manage.takeaway_h
                break
              case 3:
                item.registration_form = this.rider_manage.takeaway_pc
                break
              case 4:
                item.registration_form = this.rider_manage.delivery_staff
                break
            }
          })
        }
      })
    },
    typeIndex(index) {
      let val = index + (this.currentPage - 1) * this.showCount + 1
      return val
    }
  },
  computed: {
    ...mapState(['page']),
    public_model() {
      let public_model = this.$t('public_model')
      return public_model
    },
    rider_manage() {
      let rider_manage = this.$t('rider_manage')
      return rider_manage
    },
    rider_detail() {
      let rider_detail = this.$t('rider_detail')
      return rider_detail
    },
    distributor() {
      let distributor = this.$t('distributor')
      return distributor
    }
  }
}
</script>
<style>
.el-table .success-row {
  color: red;
}
</style>
<style  scoped lang="scss">
.admission_management {
  background: #fff;
  .el-form {
    padding: 23px 0 23px 30px;
    border-bottom: 1px solid #ededed;
  }
  .el-table {
    padding: 0 20px;
  }
}
.button-handle {
  font-size: 14px;
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
</style>
