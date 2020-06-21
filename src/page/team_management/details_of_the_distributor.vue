<template>
    <div class="public_box">
      <div v-loading="is_loading">
        <vTitle :title="details_distributor.distributor_detail"></vTitle>
        <div class="details_of_the_distributor">
          <div class="basic_info">{{details_distributor.basic_info}}</div>
          <div class="context">
            <div>
              <div class="left">
                <div>{{details_distributor.name}}: </div>
                <div>{{details_distributor.userName}}: </div>
                <div>{{details_distributor.birth}}: </div>
                <div>{{details_distributor.sex}}: </div>
                <div>{{details_distributor.tel}}: </div>
                <div>{{details_distributor.email}}: </div>
                <!-- <div>{{details_distributor.Reserve_payment}}: </div> -->
                <div>{{details_distributor.Num}}: </div>
              </div>
              <div class="right">
                <div>{{deliveryManDetail.deliveryName}}</div>
                <div>{{deliveryManDetail.userName}}</div>
                <div>{{deliveryManDetail.birthDate}}</div>
                <div>{{deliveryManDetail.manSex}}</div>
                <div>+{{deliveryManDetail.globalCode}} {{deliveryManDetail.tel}}</div>
                <div>{{deliveryManDetail.mail}}</div>
                <!-- <div>{{deliveryManDetail.provisionMoney || 0}}P</div> -->
                <div>{{deliveryManDetail.idCard}}</div>
              </div>
            </div>
            <div class="images">
              <div class="lefts">
                <div>{{details_distributor.front}}: </div>
                <div><img :src="deliveryManDetail.idCardPic1" alt=""></div>
              </div>
              <div class="rights">
                <div>{{details_distributor.behind}}: </div>
                <div><img :src="deliveryManDetail.idCardPic2" alt=""></div>
              </div>
            </div>
              <!-- <div class="person">
                  <div>{{details_distributor.photo}}: </div>
                  <img :src="deliveryManDetail.personalPhoto" alt="">
              </div> -->
          </div>
        </div>
        <div class="concact_type">
          <div class="titles">{{details_distributor.concact_type}}</div>
          <div class="left">
            <div>{{details_distributor.area}}: </div>
            <div>{{details_distributor.address}}: </div>
            <div>{{details_distributor.code}}: </div>
            <div>{{details_distributor.urgent_person}}: </div>
            <div>{{details_distributor.urgent_tel}}: </div>
          </div>
          <div class="right">
            <div>{{deliveryManDetail. provinceName}}{{deliveryManDetail. cityName}}</div>
            <div>{{deliveryManDetail.detailedAddress}}</div>
            <div>{{deliveryManDetail.zipCode}}</div>
            <div>{{deliveryManDetail.emergencyContact}}</div>
            <div>{{deliveryManDetail.emergencyGlobalCode}}{{deliveryManDetail.emergencyPhone}}</div>
          </div>
        </div>
        <div class="distributor_btn">
          <el-button type="primary" size="small" @click="goBack">{{details_distributor.back}}</el-button>
          <!-- <el-button type="warning" size="small">{{details_distributor.edit}}</el-button> -->
        </div>
      </div>
    </div>
</template>

<script>
import vTitle from "../../components/v_title.vue";
import store from "../../store";
import { formatDateTime } from "../../utils";
export default {
  name: "details_of_the_distributor",
  data() {
    return {
      deliveryManDetail: {},
      is_loading: false,
      logoImg:
        'this.src="' + require("../../assets/images/lazy_default.jpg") + '"'
    };
  },
  components: {
    vTitle
  },
  computed: {
    details_distributor() {
      let details_distributor = this.$t("details_distributor");
      return details_distributor;
    }
  },
  mounted() {
    this.getDeliveryManDetail();
  },
  methods: {
    getDeliveryManDetail() {
      this.is_loading = true;
      let params = {
        deliveryId: this.$route.query.id
        // deliveryId: 14
      };
      store
        .dispatch("getDeliveryManDetailApi", { params })
        .then(res => {
          console.log("restest1", res);
          if (res.data.code == 1) {
            this.is_loading = false;
            this.deliveryManDetail = res.data.data;
            if (this.deliveryManDetail.sex == 0 || this.deliveryManDetail.sex == 1) {
              this.deliveryManDetail.manSex = this.$t("rider_detail.male");
            } else if (this.deliveryManDetail.sex == 2) {
              this.deliveryManDetail.manSex = this.$t("rider_detail.female");
            }
            if (this.deliveryManDetail.birthDate) {
              this.deliveryManDetail.birthDate = formatDateTime(
                this.deliveryManDetail.birthDate,
                "ymd"
              );
            }
          } else {
            this.$message.error(res.data.code);
            this.is_loading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.is_loading = false;
        });
    },
    goBack() {
      this.$router.push("/distribution_management");
    }
  }
};
</script>

<style scoped lang="scss">
.public_box {
  .details_of_the_distributor {
    margin: 25px 35px;
    padding-bottom: 20px;
    .basic_info {
      font-size: 16px;
      margin-bottom: 10px;
      color: #333333;
    }
    .context {
      .left {
        float: left;
        margin-right: 0.3rem;
        div {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #666666;
        }
      }
      .right {
        div {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #666666;
        }
      }
    }
    .images {
      display: flex;
      margin-top: 10px;
      .lefts {
        width: 350px;
        display: flex;
        margin-right: 25px;
        div {
          font-size: 14px;
          &:last-child {
            margin-left: 10px;
            width: 275px;
          }
        }
        img {
          width: 100%;
        }
      }
      .rights {
        width: 390px;
        display: flex;
        div {
          font-size: 14px;
          &:last-child {
            margin-left:10px;
            width: 275px;
          }
        }
        img {
          width: 100%;
        }
      }
    }
    .person {
      position: relative;
      min-height: 170px;
      // clear: both;
      // margin-top: 1rem;
      img {
        position: absolute;
        top: 4px;
        left: 75px;
        height: 100%;
      }
    }
  }
  .distributor_btn {
    margin: 40px 0 0 100px;
    padding-bottom: 30px;
  }
  .concact_type {
    .titles {
      padding: 1px 0 6px 30px;
      border-bottom: 1px solid #ededed;
      margin-bottom: 16px;
      color: #333333;
    }
    .left {
      margin-left: 30px;
      float: left;
      margin-right: 0.3rem;
      div {
        height: 30px;
        line-height: 30px;
        color: #666666;
        font-size: 14px;
      }
    }
    .right {
      div {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #666666;
      }
    }
  }
}

@media screen and (max-width: 1110px) {
  .public_box {
    .details_of_the_distributor {
      .images {
        // height: 140px;
        .lefts {
          width: 290px;
          div {
            &:last-child {
              width: 215px;
            }
          }
        }
        .rights {
          width: 330px;
          div {
            &:last-child {
              width: 215px;
            }
          }
        }
      }
    }
  }
}
</style>