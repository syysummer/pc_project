<template>
  <div>
    <!-- 团队信息 -->
    <div class="team_information">
      <vTitle :title="team_home.team_info"></vTitle>
      <div class="team_information_body clearFloat">
        <div class="team_header_img">
          <img :src="profilePhoto || defaultImg" />
        </div>
        <div class="team_information_card">
          <div class="team_name" @click="goDetail">
            {{stationInfo.dcName}}
            <img src="../assets/icons/goto@2x.png" alt="" />
          </div>
          <div class="person_in_charge">
            {{team_home.person_in_charge}}：{{stationInfo.ownerName}}
          </div>
          <div class="num_info clearFloat">
            <div class="num_info_body">
              <div class="num_info_body_box">
                <div>
                  {{stationCount.deliveryTotal}}
                </div>
                <div>
                  {{team_home.cooperative_distributor}}
                </div>
              </div>
            </div>
            <div class="num_info_body">
              <div class="num_info_body_box">
                <div>
                  {{stationCount.onlineDeliveryCount}}
                </div>
                <div>
                  {{team_home.online_num}}
                </div>
              </div>
            </div>
            <div class="num_info_body">
              <div class="num_info_body_box">
                <div>
                  {{stationCount.offlineDeliveryCount}}
                </div>
                <div>
                  {{team_home.offline_num}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 配送信息 -->
    <div class="distribution_box clearFloat">
      <div class="distribution_singular">
        <div class="distribution_title">
          {{team_home.distribution_singular}}
        </div>
        <div class="distribution_body clearFloat">
          <div class="distribution_body_icon">
            <img src="../assets/images/home_orders.png" />
          </div>
          <div class="distribution_body_statistics">
            <div class="distribution_num">
              {{stationCount.currOrdersNum || 0}}
            </div>
            <div>
              {{team_home.today_distribution_singular}}
            </div>
          </div>
        </div>
      </div>
      <div class="distribution_amount">
        <div class="distribution_title">
          {{team_home.distribution_amount}}
        </div>
        <div class="distribution_body clearFloat">
          <div class="distribution_body_icon">
            <img src="../assets/images/home_amount.png" />
          </div>
          <div class="distribution_body_statistics">
            <div class="distribution_num">
              {{currShippingFee || 0}}P
            </div>
            <div>
              {{team_home.distribution_today}}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 折线图 -->
    <div class="statistical_chart">
      <div id="statistical_chart" style="width: 100%; height:35vh;"></div>
    </div>
  </div>
</template>

<script>
  import vTitle from "../components/v_title.vue";
  import store from "../store";
  import defaultImg from "../assets/images/lazy_default.jpg";
  export default {
    name: "team_home",
    data() {
      return {
        defaultImg,
        stationInfo: "",
        stationCount: {},
        optionDate: [],
        optionData: [],
        optionShippingFee: [],
        profilePhoto: "",
        currShippingFee: "",
        option: {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              axis: 'x',
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          legend: {
            selectedMode: false, //取消图例上的点击事件
            data: [
              this.$t("team_home.distribution_singular"),
              this.$t("team_home.distribution_fee")
            ]
          },
          toolbox: {
            feature: {
              saveAsImage: {
                title: this.$t("team_home.save")
              }
            }
          },
          grid: {
            left: "4%",
            right: "8%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [{
            type: "category",
            boundaryGap: false,
            data: []
            // data: JSON.stringify(this.optionDate)
          }],
          yAxis: [{
            type: "value",
            minInterval: 100
          }],
          series: [{
              name: this.$t("team_home.distribution_singular"),
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {}
              },
              data: [],
              tooltip: {
                trigger: "axis",
                formatter: "{b} <br/>{a0} : {c0}"
              }
            },
            {
              name: this.$t("team_home.distribution_fee"),
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {}
              },
              data: [],
              tooltip: {
                trigger: "axis",
                formatter: "{b} <br/>{a0} : {c0} P"
              }
            }
          ]
        }
      };
    },
    components: {
      vTitle
    },
    computed: {
      team_home() {
        let team_home = this.$t("team_home");
        return team_home;
      }
    },
    mounted() {
      console.log(this.optionDate);
      let stationInfo = JSON.parse(localStorage.getItem("masterInfo"));
      this.getDeliveryStatistics();
      this.stationInfo = stationInfo.dcObj;
      this.profilePhoto = stationInfo.profilePhoto;
    },
    methods: {
      getDeliveryStatistics() {
        store
          .dispatch("getDeliveryStatisticsApi", {})
          .then(res => {
            if (res.data.code == 1) {
              this.stationCount = res.data.data;
              this.currShippingFee = parseFloat(
                parseFloat(this.stationCount.currShippingFee).toFixed(2)
              );
              console.log("qq", parseFloat(2.3));
              this.stationCount.countWeeklyOrdersList.forEach(item => {
                this.optionDate.push(item.creteTime);
                this.optionData.push(item.num);
                this.optionShippingFee.push(parseFloat(item.shippingFee));
              });
              console.log("qq", this.optionShippingFee);
              // console.log('aaaaaaa', this.option)
              let myChart = echarts.init(
                document.getElementById("statistical_chart")
              );
              // console.log(this.optionDate)
              this.option.xAxis[0].data = this.optionDate.reverse();
              this.option.series[0].data = this.optionData.reverse();
              this.option.series[1].data = this.optionShippingFee.reverse();
              myChart.setOption(this.option);
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            // console.log("err",err.status)
            // if (err.status==401) {
            //   this.$message.error(this.$t('public_model.noLogin'))
            //   localStorage.removeItem('masterInfo')
            //   this.$router.push('/login')
            // } else if (err.status==410) {
            //   this.$message.error(this.$t('public_model.otherLogin'))
            //   localStorage.removeItem('masterInfo')
            //   this.$router.push('/login')
            // }
          });
      },
      goDetail() {
        this.$router.push("/team_details");
      }
    }
  };

</script>

<style scoped>
  .team_information {
    width: 100%;
    border-radius: 5px;
    background: #ffffff;
    margin-bottom: 15px;
  }

  .team_information_body {
    width: 100%;
    padding: 8px 35px;
  }

  .team_header_img {
    float: left;
    margin-right: 1%;
    width: 25%;
    height: 25vh;
  }

  .team_header_img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .team_information_card {
    float: left;
    position: relative;
    width: 74%;
    height: 25vh;
    padding-top: 10px;
  }

  .team_name {
    color: #6d6d6d;
    cursor: pointer;
  }

  .team_name img {
    width: 10px;
    margin-left: 5px;
  }

  .person_in_charge {
    font-size: 12px;
    color: #6d6d6d;
    margin-top: 5px;
  }

  .num_info {
    position: absolute;
    bottom: 10px;
    width: 100%;
  }

  .num_info_body {
    float: left;
    width: 30%;
  }

  .num_info_body_box {
    width: 50%;
    text-align: center;
  }

  .num_info_body_box div:first-child {
    font-size: 24px;
    color: #555555;
  }

  .num_info_body_box div:last-child {
    font-size: 12px;
    color: #b7b7b7;
  }

  /* 配送信息 */

  .distribution_box {
    width: 100%;
    margin-bottom: 15px;
  }

  .distribution_singular,
  .distribution_amount {
    border-radius: 5px;
    background: #ffffff;
    width: 49%;
  }

  .distribution_singular {
    float: left;
  }

  .distribution_amount {
    float: right;
  }

  .distribution_title {
    width: 100%;
    padding: 8px 35px;
    border-bottom: 1px solid #ededed;
    font-weight: bold;
    color: #474747;
  }

  .distribution_body {
    width: 100%;
    padding: 15px 35px;
  }

  .distribution_body_icon {
    float: left;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .distribution_body_icon img {
    width: 100%;
    height: 100%;
  }

  .distribution_body_statistics {
    float: right;
    color: #474747;
  }

  .distribution_num {
    font-size: 24px;
    color: #ff3633;
    text-align: right;
  }

  /* 图表 */

  .statistical_chart {
    width: 100%;
    border-radius: 5px;
    background: #ffffff;
    padding: 15px 35px;
  }

  @media (min-width: 992px) and (max-width: 1400px) {
    .num_info_body_box div:first-child {
      font-size: 22px;
    }

    .distribution_num {
      font-size: 22px;
    }

    .num_info_body_box {
      width: 80%;
    }
  }

  @media (min-width: 768px) and (max-width: 992px) {
    .num_info_body_box div:first-child {
      font-size: 20px;
    }

    .distribution_num {
      font-size: 20px;
    }

    .num_info_body_box {
      width: 100%;
    }

    .distribution_body_icon {
      float: left;
      width: 45px;
      height: 45px;
      border-radius: 50%;
    }
  }

</style>
