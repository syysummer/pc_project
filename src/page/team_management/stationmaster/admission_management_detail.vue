<template>
  <div class="management-detail" v-if="display">
    <!-- <vTitle :title="rider_detail.rider_entry_details"></vTitle> -->
    <div class="manage-info">
      <div class="info-title">{{rider_detail.rider_entry_details}}</div>
      <div class="info-content">{{rider_detail.applicant_name}}：{{ recruitMap.delivery_name }}</div>
      <div class="info-content">{{rider_detail.applicant_phone}}：+{{recruitMap.global_code}} {{recruitMap.phone}}</div>
      <div class="info-content">{{rider_detail.age}}：{{recruitMap.age}}</div>
      <div class="info-content">{{rider_detail.job_type}}：{{recruitMap.work_type==1?rider_detail.full_time:rider_detail.part_time}}</div>
      <div class="info-content">{{rider_detail.application_area}}：{{recruitMap.workProvinc}} {{recruitMap.workCity}}</div>
      <div class="info-content">{{rider_detail.ways_registration}}：{{way_Registration(recruitMap.registration_form)}}</div>
    </div>
    <div class="manage-info">
      <div class="info-title">{{rider_detail.platform_review}}</div>
      <div class="info-content">{{rider_detail.approval_status}}：
        <span :class="{act:recruitAuditListMap.agree_status==1}">{{recruitAuditListMap.agree_status==1?rider_detail.by:rider_detail.fail}}</span> {{formatTime(recruitAuditListMap.create_time)}}</div>
      <div class="info-content">{{rider_detail.chinese_reasons}}：{{recruitAuditListMap.description}}</div>
      <div class="info-content">{{rider_detail.english_reasons}}：{{recruitAuditListMap.description_en}}</div>
      <div class="info-content">{{rider_detail.distribution_stationmaster}}：{{recruitAuditListMap.dcName}}</div>
      <div class="info-content">{{rider_detail.webmaster_contact}}：+{{recruitAuditListMap.dcOwnerPhonepre}} {{recruitAuditListMap.dcOwnerPhone}}</div>
    </div>
    <div class="authent-info">
      <div class="info-title">{{rider_detail.applicant_information}}</div>
      <div class="info-subtitle">{{rider_detail.basic_info}}</div>
      <div class="info-content">
        <div class="msg">{{rider_detail.name}}：{{certificationMap.delivery_name}}</div>
        <div class="msg">{{rider_detail.phone}}：+{{certificationMap.global_code}} {{certificationMap.phone}}</div>
        <div class="msg">{{rider_detail.birth}}：{{formatTime(certificationMap.birth_date,'ymd')}}</div>
        <div class="msg">{{rider_detail.marital_status}}：{{certificationMap.marital_status==1?rider_detail.married:rider_detail.unmarried}}</div>
        <div class="msg">{{rider_detail.gender}}：{{certificationMap.gender==1?rider_detail.male:rider_detail.female}}</div>
      </div>
      <div class="info-subtitle">{{rider_detail.contact_information}}：</div>
      <div class="info-content">
        <div class="msg">{{rider_detail.area}}：{{certificationMap.contactProvinc}} {{certificationMap.contactCity}}</div>
        <div class="msg">{{rider_detail.address}}：{{certificationMap.detailed_address}}</div>
      </div>
      <div class="info-content">
        <div class="msg">{{rider_detail.postal_code}}：{{certificationMap.zip_code}}</div>
        <div class="msg">{{rider_detail.emergency_name}}：{{certificationMap.emergency_contact}}</div>
        <div class="msg">{{rider_detail.emergency_number}}：{{certificationMap.emergency_phone}}</div>
      </div>
      <div class="info-subtitle">{{rider_detail.identity_information}}：</div>
      <div class="info-content">
        <div class="msg">{{rider_detail.type_certificate}}：{{certificationMap.card_type}}</div>
        <div class="msg">{{rider_detail.id_number}}：{{certificationMap.card_num}}</div>
      </div>
      <div class="info-content card-box">
        <div class="id-card">
          <div class="id-message">{{rider_detail.document_front}}：</div>
          <div class="id-img" v-if="certificationMap.card_pic_face">
            <img :src="baseUrl+certificationMap.card_pic_face" alt="">
          </div>
          <img src="../../../assets/images/front_photo.png" alt="" v-else>
        </div>
        <div class="id-card-face">

          <div class="id-message">{{rider_detail.front_photo}}：</div>
          <div class="id-img" v-if="certificationMap.card_pic_back">
            <img :src="baseUrl+certificationMap.card_pic_back" alt="">
          </div>
          <img src="../../../assets/images/document_front.png" alt="" v-else>
        </div>
      </div>
    </div>
    <div class="follow-record">
      <div class="info-title">{{rider_detail.webmaster_record}}</div>
      <div class="record-line" ref="record_line"></div>
      <div class="record-message" ref="record_message">
        <div class="record-list">
          <img src="../../../assets/icons/progress2.png" alt="" class="record-img" v-if="certificationAuditMap[1] && certificationAuditMap[1].review_status==1">
          <img src="../../../assets/icons/progress1.png" alt="" class="record-img" v-else>
          <div class="record-msg">
            <div class="record-status" :class="{act:certificationAuditMap[1] && certificationAuditMap[1].review_status==1}">{{rider_detail.identity_verification}}</div>
            <div v-if="certificationAuditMap[1] || (review_status==0 && certificationAuditMap[0])">
              <div class="record-time" v-if="certificationAuditMap[1]">{{formatTime(certificationAuditMap[1].review_time)}}</div>
              <div class="record-time" v-else>{{formatTime(certificationAuditMap[0].review_time)}}</div>
              <div class="record-result" v-if="certificationAuditMap[1]">{{rider_detail.review_certification_results}}：{{certificationAuditMap[1].review_status?rider_detail.by:rider_detail.fail}}</div>
              <div class="record-result" v-else>{{rider_detail.review_certification_results}}：{{certificationAuditMap[0].review_status?rider_detail.by:rider_detail.fail}}</div>
              <div class="record-result" v-if="certificationAuditMap[1]">{{rider_detail.follow_stationmaster}}：{{certificationAuditMap[1].ownerName}}</div>
              <div class="record-result" v-else>{{rider_detail.follow_stationmaster}}：{{certificationAuditMap[0].ownerName}}</div>
              <div v-if="certificationAuditMap[1]">
                <div class="record-result" v-if="language=='zh'">{{rider_detail.instruction_manual}}：{{certificationAuditMap[1].review_desc}}</div>
                <div class="record-result" v-if="language=='en'">{{rider_detail.instruction_manual}}：{{certificationAuditMap[1].review_desc_en}}</div>
              </div>
              <div v-else>
                <div class="record-result" v-if="language=='zh'">{{rider_detail.instruction_manual}}：{{certificationAuditMap[0].review_desc}}</div>
                <div class="record-result" v-if="language=='en'">{{rider_detail.instruction_manual}}：{{certificationAuditMap[0].review_desc_en}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="record-list">
          <img src="../../../assets/icons/progress2.png" alt="" class="record-img" v-if="certificationAuditMap[2] && certificationAuditMap[2].review_status==1">
          <img src="../../../assets/icons/progress1.png" alt="" class="record-img" v-else>
          <div class="record-msg">
            <div class="record-status">{{rider_detail.offline_training}}</div>
            <div v-if="certificationAuditMap[2]">
              <div class="record-time">{{formatTime(certificationAuditMap[2].review_time)}}</div>
              <div class="record-result">{{rider_detail.review_certification_results}}：{{certificationAuditMap[2].review_status?rider_detail.by:rider_detail.fail}}</div>
              <div class="record-result">{{rider_detail.follow_stationmaster}}：{{certificationAuditMap[2].ownerName}}</div>
              <div class="record-result" v-if="language=='zh'">{{rider_detail.instruction_manual}}：{{certificationAuditMap[2].review_desc}}</div>
              <div class="record-result" v-if="language=='en'">{{rider_detail.instruction_manual}}：{{certificationAuditMap[2].review_desc_en}}</div>
            </div>
          </div>
        </div>
        <div class="record-list">
          <img src="../../../assets/icons/progress2.png" alt="" class="record-img" v-if="certificationAuditMap[3] && certificationAuditMap[3].review_status==1">
          <img src="../../../assets/icons/progress1.png" alt="" class="record-img" v-else>
          <div class="record-msg">
            <div class="record-status">{{rider_detail.signing_contract}}</div>
            <div v-if="certificationAuditMap[3]">
              <div class="record-time">{{formatTime(certificationAuditMap[3].review_time)}}</div>
              <div class="record-result">{{rider_detail.review_certification_results}}：{{certificationAuditMap[3].review_status?rider_detail.by:rider_detail.fail}}</div>
              <div class="record-result">{{rider_detail.follow_stationmaster}}：{{certificationAuditMap[3].ownerName}}</div>
              <div class="record-result" v-if="language=='zh'">{{rider_detail.instruction_manual}}：{{certificationAuditMap[3].review_desc}}</div>
              <div class="record-result" v-if="language=='en'">{{rider_detail.instruction_manual}}：{{certificationAuditMap[3].review_desc_en}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="examine-result" v-if="review_status != 0" ref="emamine_res" id="emamine_res">
      <div class="info-title" v-if="review_types==1">{{rider_detail.certification_result}}</div>
      <div class="info-title" v-if="review_types==2">{{rider_detail.offline_results}}</div>
      <div class="info-title" v-if="review_types==3">{{rider_detail.sign_result}}</div>
      <el-form ref="form" :model="form" label-position="left" :label-width="labelWidth">
        <el-form-item :label="rider_detail.whether_pass">
          <el-radio-group v-model="form.result_flag" class="examine-flag">
            <el-radio label="1">{{rider_detail.by}}</el-radio>
            <el-radio label="0">{{rider_detail.fail}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-show="form.result_flag==1">
          <el-form-item :label="rider_detail.supplementary_chinese" class="description">
            <el-input type="textarea" v-model="form.des_zh" :rows="4" :maxlength="200" resize="none"></el-input>
            <div class="word-limit" :class="{act:this.language=='en'}">0-200{{rider_detail.word}}</div>
          </el-form-item>
          <el-form-item :label="rider_detail.supplementary_explanation" class="description">
            <el-input type="textarea" v-model="form.des_en" :rows="4" :maxlength="200" resize="none"></el-input>
            <div class="word-limit" :class="{act:this.language=='en'}">0-200{{rider_detail.word}}</div>
          </el-form-item>
        </div>
        <div v-show="form.result_flag==0">
          <el-form-item :label="rider_detail.failure_reason" class="description">
            <el-input type="textarea" v-model="form.des_zh" :rows="4" :maxlength="200" :placeholder="rider_detail.required_field" resize="none"></el-input>
            <div class="word-limit" :class="{act:this.language=='en'}">0-200{{rider_detail.word}}</div>
          </el-form-item>
          <el-form-item :label="rider_detail.failure_reason_English" class="description">
            <el-input type="textarea" v-model="form.des_en" :rows="4" :maxlength="200" :placeholder="rider_detail.required_field" resize="none"></el-input>
            <div class="word-limit" :class="{act:this.language=='en'}">0-200{{rider_detail.word}}</div>
          </el-form-item>
        </div>
        <el-form-item class="submit-button">
          <el-button type="primary" size="medium" @click="back">{{rider_detail.return}}</el-button>
          <el-button type="primary" size="medium" @click="onSubmit" :loading="isLoading">{{rider_detail.submit}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import vTitle from '../../../components/v_title.vue'
import { formatDateTime } from '../../../utils/index'
export default {
  data() {
    return {
      form: {
        result_flag: '1',
        des_zh: '',
        des_en: ''
      },
      baseUrl: 'https://img.hzxindakeji.com/',
      review_status: this.$route.query.review_status,
      recruitMap: [],
      recruitAuditListMap: [],
      certificationMap: [],
      certificationAuditMap: [],
      review_types: '',
      display: false,
      language: getCookie('lang'),
      labelWidth: '',
      isLoading: false
    }
  },
  components: {
    vTitle
  },
  mounted() {
    if (this.language == 'en') {
      this.labelWidth = 198 + 'px'
    }
    this.getRiderDetail()
  },
  methods: {
    back() {
      this.$router.push('/admission_management')
    },
    onSubmit() {
      if (this.form.result_flag == 0) {
        if (!this.form.des_zh || !this.form.des_en) {
          if (this.language == 'zh') {
            this.$message.error('输入框不能为空哦')
          } else {
            this.$message.error('Input box cannot be empty')
          }
          return
        }
      }
      this.isLoading = true
      let params = {
        certificationId: this.certificationMap.certification_id,
        reviewType: this.review_types,
        reviewStatus: this.form.result_flag
      }
      if (this.form.des_zh) {
        params.reviewDesc = this.form.des_zh
      }
      if (this.form.des_en) {
        params.reviewDescEn = this.form.des_en
      }
      this.$axios
        .get('/innerService/auditCertification', {
          params
        })
        .then(res => {
          this.isLoading = false
          if (res.data.code == 1) {
            this.$message.success(res.data.message)
            this.$router.push('/admission_management')
          } else {
            this.$message.error(res.data.message)
          }
        })
    },
    getRiderDetail() {
      let params = { certificationId: this.$route.query.id }
      this.$axios
        .get('/innerService/getDeliveryAuditDetails', {
          params
        })
        .then(res => {
          if (res.data.code == 1) {
            this.recruitMap = res.data.data.recruitMap
            this.recruitAuditListMap = res.data.data.recruitAuditListMap
            this.certificationMap = res.data.data.certificationMap
            this.certificationAuditMap = res.data.data.certificationAuditMap
            this.display = true
            let num = 0
            this.certificationAuditMap.forEach(item => {
              if (item.review_type > num) {
                num = item.review_type
              }
            })
            this.review_types = num + 1
            this.$nextTick(() => {
              if (this.review_types == 4) {
                document.getElementById('emamine_res').style.display = 'none'
              } else {
                document.getElementById('emamine_res').style.display = 'block'
              }
            })
          }
        })
    },
    way_Registration(registration) {
      switch (registration) {
        case 1:
          return this.rider_manage.takeaway_app
          break
        case 2:
          return this.rider_manage.takeaway_h
          break
        case 3:
          return this.rider_manage.takeaway_pc
          break
        case 4:
          return this.rider_manage.delivery_staff
          break
      }
    },
    formatTime(time, type = '') {
      return formatDateTime(time, type)
    }
  },
  computed: {
    rider_detail() {
      let rider_detail = this.$t('rider_detail')
      return rider_detail
    },
    rider_manage() {
      let rider_manage = this.$t('rider_manage')
      return rider_manage
    }
  },
  watch: {
    certificationAuditMap() {
      setTimeout(() => {
        this.$refs.record_line.style.height =
          this.$refs.record_message.offsetHeight + 'px'
      }, 20)
    }
  }
}
</script>

<style  scoped lang="scss">
.management-detail {
  width: 100%;
  border-radius: 5px;
  background: #ffffff;
  border-radius: 5px;
  font-size: 16px;
  color: #474747;
  .manage-info {
    padding-bottom: 17px;
    border-bottom: 1px solid #f1f5fa;
    .info-title {
      font-size: 16px;
      padding: 28px 0 30px 39px;
    }
    .info-content {
      padding: 0 0 8px 62px;
      font-size: 12px;
    }
    .act {
      font-size: 12px;
      color: red;
    }
  }
  .authent-info {
    padding-bottom: 17px;
    border-bottom: 1px solid #f1f5fa;
    .info-title {
      font-size: 16px;
      padding: 28px 0 0 41px;
    }
    .info-subtitle {
      font-size: 12px;
      font-weight: 700;
      padding: 25px 0 0 41px;
      color: #435c77;
    }
    .info-content {
      padding: 0 0 5px 62px;
      .msg {
        font-size: 12px;
        padding: 10px 0 0 0;
      }
    }
  }
  .card-box {
    display: flex;
    .id-card {
      margin-right: 100px;
      display: flex;
      justify-content: flex-start;
      font-size: 14px;
      .id-img {
        width: 230px;
        img {
          width: 100%;
        }
      }
      .id-message {
        font-size: 12px;
      }
    }
    .id-card-face {
      display: flex;
      justify-content: flex-start;
      font-size: 14px;
      .id-img {
        width: 230px;
        img {
          width: 100%;
        }
      }
      .id-message {
        font-size: 12px;
      }
    }
  }
  .follow-record {
    position: relative;
    padding-bottom: 17px;
    border-bottom: 1px solid #f1f5fa;
    .info-title {
      font-size: 16px;
      padding: 28px 0 0 41px;
      color: #474747;
    }
    .record-line {
      border: 1px dashed #f1f5fa;
      width: 0;
      height: 0;
      position: absolute;
      left: 78px;
      top: 80px;
      z-index: 1;
    }
    .record-message {
      position: relative;
      z-index: 2;
      padding-left: 64px;
      .record-list {
        display: flex;
        align-items: flex-start;
        margin-top: 31px;
        .record-msg {
          padding-left: 14px;
          color: #6d6d6d;
          .record-status {
            font-size: 16px;
          }
          .act {
            color: #00a0e9;
          }
          .record-time {
            font-size: 12px;
            padding-bottom: 8px;
          }
          .record-result {
            font-size: 14px;
            color: #6d6d6d;
            padding-top: 5px;
            word-wrap: break-word;
          }
        }
        .record-img {
          width: 31px;
          height: 32px;
        }
      }
    }
  }
  .record-detail-box {
    margin: 40px 0 0 0;
  }
  .record-detail-list {
    border-top: 1px solid #c1c1c1;
    padding: 20px 0;
    width: 500px;
    .record-detail-content {
      display: flex;
      justify-content: space-between;
      div {
        padding: 5px 0;
      }
    }
  }
  .el-textarea {
    width: 440px;
  }
  .through-icon {
    margin-left: 100px;
  }
  .examine-result {
    .info-title {
      font-size: 16px;
      padding: 28px 0 0 41px;
      color: #474747;
    }
    .examine-flag {
      margin-left: 25px;
    }
  }
  .el-form {
    padding: 34px 0 54px 62px;
    border-bottom: 1px solid #ededed;
  }
}
.button-handle {
  font-size: 14px;
}
.submit-button {
  margin-left: 97px;
}
.word-limit {
  position: absolute;
  left: 487px;
  bottom: -9px;
  font-size: 12px;
  color: #435c77;
  &.act {
    left: 372px;
  }
}
.description {
  position: relative;
}
</style>
