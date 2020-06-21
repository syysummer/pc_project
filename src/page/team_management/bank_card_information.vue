<template>
  <div>
    <div class="public_box">
      <!-- <vTitle :title="bank_card_information.title"></vTitle> -->
      <div class="detail_info_body">
        <div class="ditail_info clearFloat">
          <div>
            {{bank_card_information.username}}：
          </div>
          <div>
            syledsfleowt
          </div>
        </div>
        <div class="ditail_info clearFloat">
          <div>
            {{bank_card_information.tel}}：
          </div>
          <div>
            63-13480760778
          </div>
        </div>
        <div class="ditail_info clearFloat">
          <div v-if="lang=='zh'">
            国&nbsp;&nbsp;&nbsp;家：
          </div>
          <div v-if="lang=='en'">
            {{bank_card_information.country}}：
          </div>
          <div>
            中国
          </div>
        </div>
        <div class="ditail_info clearFloat">
          <div>
            {{bank_card_information.bank_name}}：
          </div>
          <div>
            中国建设银行
          </div>
        </div>
        <div class="ditail_info clearFloat">
          <div>
            {{bank_card_information.account_name}}：
          </div>
          <div>
            王牌配送员
          </div>
        </div>
        <div class="ditail_info clearFloat">
          <div>
            {{bank_card_information.bank_num}}：
          </div>
          <div>
            043809-9232434143
          </div>
        </div>
        <div class="ditail_info clearFloat">
          <div>
            {{bank_card_information.bind_time}}：
          </div>
          <div>
            2018-05-15&nbsp;&nbsp;14:45:49.0
          </div>
        </div>
        <div class="back_btn_box">
          <span class="back_btn" @click='back_btn_fn'>
            {{bank_card_information.back}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vTitle from '../../components/v_title.vue'
// 引入英文css样式表
import { setCookie, getCookie, removeCookie } from '../../utils/cookies'
let current_language = getCookie('lang')
// if (current_language == 'en') {
//   require('../../assets/css/bank_card_information.css')
// }
export default {
  name: 'bank_card_information',
  data() {
    return {
      lang: ''
    }
  },
  components: {
    vTitle
  },
  computed: {
    bank_card_information() {
      let bank_card_information = this.$t('bank_card_information')
      return bank_card_information
    }
  },
  created() {
    if (getCookie('lang') == 'zh') {
      this.lang = 'zh'
    } else if (getCookie('lang') == 'en') {
      this.lang = 'en'
    }
  },
  methods: {
    back_btn_fn() {
      history.go(-1)
    }
  }
}
</script>

<style scoped>
.public_box {
  width: 100%;
  background: #ffffff;
  border-radius: 5px;
}

.detail_info_body {
  width: 100%;
  padding: 15px 35px;
}

.ditail_info div {
  float: left;
  color: #6d6d6d;
  margin-bottom: 8px;
}

.ditail_info div:first-child {
  width: 10%;
}

.ditail_info div:last-child {
  width: 90%;
}

.map_box {
  width: 100%;
  height: 50vh;
  background: gainsboro;
}

.back_btn_box {
  margin-top: 10px;
}

.back_btn {
  background: #44a4ff;
  border-radius: 5px;
  padding: 3px 20px;
  color: #ffffff;
}

@media (min-width: 992px) and (max-width: 1400px) {
  .ditail_info div:first-child {
    width: 12%;
  }

  .ditail_info div:last-child {
    width: 88%;
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  .ditail_info div:first-child {
    width: 15%;
  }

  .ditail_info div:last-child {
    width: 85%;
  }
}
</style>
