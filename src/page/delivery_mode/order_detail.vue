<template>
  <div class="order_detail">
    <div v-if="!isLoading">
      <!-- <vTitle :title="order_detail.title"></vTitle> -->
      <div class="cash_order" v-if="is_show">
        <div>{{order_detail.state}}：
          <span>{{settleState}}{{deliveryInfo.settlementType}}</span>
        </div>
        <div>
          <div v-if="$route.query.settlementType==0&&$route.query.settleStatus!=1">
            {{order_detail.bill_type}}：
            <span>{{order_detail.financial}}</span>
          </div>
          <div v-if="$route.query.settlementType==1&&$route.query.settleStatus!=1">
            {{order_detail.bill_type}}：
            <span>{{order_detail.balance}}</span>
          </div>
        </div>
        <div>{{order_detail.amount}}：
          <span class="bold_size" v-if="payment_name=='货到付款' || payment_name=='Cash on delivery'">{{$route.query.actualPrice}}P</span>
          <span class="bold_size" v-else>{{deliveryInfo.actual_price}}P</span>
        </div>
      </div>
      <div class="order_info_container">
        <div class="order_info_detail">
          <div class="order_info" :class="{cash_order_info: is_show}">
            <div class="title">
              <span></span>{{order_detail.order_info}}</div>
            <div class="context">
              <div class="info_left">
                <div>{{order_detail.status}}</div>
                <div>{{order_detail.num}}</div>
                <div v-if="payment_name=='货到付款' || payment_name=='Cash on delivery'">{{$t('reschedule.creation_time')}}</div>
                <div v-else>{{order_detail.order_time}}</div>
                <div>{{order_detail.type}}</div>
                <div v-if="payment_name=='货到付款' || payment_name=='Cash on delivery'">{{$t('order_details.order_time')}}</div>
                <div v-else>{{order_detail.pay_time}}</div>
              </div>
              <div class="info_right">
                <div class="red">{{status}}</div>
                <div>{{orderInfos.orderId}}</div>
                <!-- <div>{{orderInfos.orderTime}}</div> -->
                <div>{{formatDateTime(orderInfos.orderTime)}}</div>
                <div v-if="is_show">{{payment_name}}</div>
                <div v-else>{{payment_name}}{{order_detail.line}}</div>
                <!-- <div>{{orderInfos.payTime}}</div> -->
                <div>{{formatDateTime(orderInfos.payTime)}}</div>
              </div>
            </div>
          </div>
          <div class="order_info">
            <div class="title">
              <span></span>{{order_detail.delivery_info}}</div>
            <div class="address_content">
              <div :class="{address_eng: isEnglish, address_zh: !isEnglish}">{{order_detail.address}}</div>
              <div>{{deliveryInfo.house_number}}, {{deliveryInfo.address}}</div>
            </div>
            <div class="context">
              <div class="info_left" :class="{info_eng: isEnglish, info_zh: !isEnglish}">
                <div>{{order_detail.concat}}</div>
                <div>{{order_detail.tel}}</div>
                <div>{{order_detail.note}}</div>
              </div>
              <div class="info_right">
                <div>{{deliveryInfo.name}}</div>
                <div>{{deliveryInfo.receiverPhone}}</div>
                <div>{{deliveryInfo.remark}}</div>
              </div>
            </div>
          </div>
          <div class="order_content">
            <div class="title">
              <span></span>{{order_detail.order_content}}</div>
            <div class="seller_info">
              <div class="seller_img"><img :src="deliveryInfo.seller_logo" alt=""></div>
              <div class="info">
                <div>{{deliveryInfo.sellerName}}</div>
                <div>{{order_detail.shop_tel}}：{{deliveryInfo.sellerPhone}}</div>
              </div>
            </div>
            <div class="table_food">
              <el-table :data="tableData" style="width: 100%" :header-cell-style="{'background-color': '#fafafa'}" v-loading="loading">
                <el-table-column prop="goods_name" :label="order_detail.food"></el-table-column>
                <el-table-column prop="num" :label="order_detail.count"></el-table-column>
                <el-table-column prop="present_price" :label="order_detail.price"></el-table-column>
                <el-table-column prop="total_price" :label="order_detail.acount"></el-table-column>
              </el-table>
              <div class="total_lunchbox_price">
                <span>{{order_detail.total_lunchbox_price}}</span>
                <span>{{deliveryInfo.total_lunchbox_price}}P</span>
              </div>
              <div class="logistics">
                <span>{{order_detail.logistics}}</span>
                <span v-if="deliveryInfo.platormSubsidyMoney!=0">
                  <div style="text-decoration:line-through;color:#949494;font-size:12px;display:inline-block;">{{deliveryInfo.logistics}}P&nbsp;</div>{{parseFloat(deliveryInfo.logistics)-parseFloat(deliveryInfo.platormSubsidyMoney)}}P</span>
                </span>
                <span v-else>
                  {{deliveryInfo.logistics}}P
                </span>
              </div>
              <div class="total">{{order_detail.price_total}}：
                <span>{{deliveryInfo.actual_price}}P</span>
              </div>
            </div>
          </div>
        </div>
        <div class="order_map_info">
          <div class="order_info">
            <div class="title">
              <span></span>{{order_detail.order_map}}</div>
            <div id="googleMap" style="width:100%;height:352px;"></div>
          </div>
        </div>
      </div>
      <div class="back">
        <el-button type="primary" size="small" @click="back">{{$t('rider_detail.return')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import vTitle from '../../components/v_title'
import { formatDateTime } from '../../utils/index'
import { getCookie } from '../../utils/cookies'
import store from '../../store'
export default {
  name: 'order_detail',
  data() {
    return {
      tableData: [],
      orderId: '',
      orderInfos: {},
      deliveryInfo: {},
      status: '',
      loading: false,
      isLoading: false,
      payment_name: '',
      isEnglish: false,
      is_show: false,
      settleState: '',
      map: '',
      mapProp: {
        center: new google.maps.LatLng(22.5428388201, 114.0595442861),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      mapList: []
    }
  },
  components: { vTitle },
  computed: {
    order_detail() {
      let order_detail = this.$t('order_detail')
      return order_detail
    }
  },
  mounted() {
    let lang = getCookie('lang')
    if (lang == 'en') {
      this.isEnglish = true
    } else {
      this.isEnglish = false
    }
    let orderId = this.$route.query.id
    let settleStatus = this.$route.query.settleStatus
    if (settleStatus == 1) {
      this.settleState = this.$t('cash_order_statistics.pending')
    } else if (settleStatus == 2) {
      this.settleState = this.$t('cash_order_statistics.normal')
    } else if (settleStatus == 3) {
      this.settleState = this.$t('cash_order_statistics.abnormal')
    } else {
      this.settleState = this.$t('cash_order_statistics.pending')
    }
    this.orderId = orderId
    this.getOrderDetails()
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    formatDateTime(time, type) {
      return formatDateTime(time)
    },
    getOrderDetails() {
      this.isLoading = true
      let status = this.$route.query.status
      if (status == 1) {
        this.status = this.$t('schedule_list.status1')
      } else if (status == 2) {
        this.status = this.$t('schedule_list.status2')
      } else if (status == 3) {
        this.status = this.$t('schedule_list.status3')
      } else {
        this.status = this.$t('cash_order_statistics.arrived')
      }
      this.loading = true
      store
        .dispatch('getOrderDetails', {
          // orderId: "01930966201808202456"
          orderId: this.orderId
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.orderInfos = res.data.data.orderInfo
            this.tableData = res.data.data.orderContent
            this.deliveryInfo = res.data.data.deliveryInfo
            if (res.data.data.orderInfo.orderInfo.payment_name == '微信支付') {
              res.data.data.orderInfo.orderInfo.payment_name = '微信'
            }
            if (
              res.data.data.orderInfo.orderInfo.payment_name == '货到付款' ||
              res.data.data.orderInfo.orderInfo.payment_name ==
                'Cash on delivery'
            ) {
              this.is_show = true
            } else {
              this.is_show = false
            }
            this.payment_name = res.data.data.orderInfo.orderInfo.payment_name
            this.loading = false
            this.isLoading = false
            this.positionInfo = res.data.data.positionInfo
            if (this.positionInfo.sellerPosition) {
              this.mapList.push({
                lat: Number(this.positionInfo.sellerPosition.lat),
                lng: Number(this.positionInfo.sellerPosition.lon),
                icon: require('../../assets/icons/seller@2x.png')
              })
            }
            if (this.positionInfo.deliveryPosition) {
              this.mapList.push({
                lat: Number(this.positionInfo.deliveryPosition.lat),
                lng: Number(this.positionInfo.deliveryPosition.lon),
                icon: require('../../assets/icons/delivy@2x.png')
              })
            }
            if (this.positionInfo.memberPosition) {
              this.mapList.push({
                lat: Number(this.positionInfo.memberPosition.lat),
                lng: Number(this.positionInfo.memberPosition.lon),
                icon: require('../../assets/icons/addree@2x.png')
              })
            }
            this.initialize()
            google.maps.event.addDomListener(window, 'load', this.initialize)
          } else {
            this.$message.error(res.data.message)
            this.loading = false
            this.isLoading = false
          }
        })
        .catch(err => {
          this.loading = false
          // this.isLoading = false;
          console.log(err)
        })
    },
    initialize() {
      let marker

      this.$nextTick(() => {
        this.map = new google.maps.Map(
          document.getElementById('googleMap'),
          this.mapProp
        )
        this.mapList.forEach((item, index) => {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng({
              lat: item.lat,
              lng: item.lng
            }),
            icon: item.icon,
            map: this.map
          })
          this.map.setCenter({
            lat: item.lat,
            lng: item.lng
          })
        })
        /*
         * 配送路线（暂时不做）
         */
        var directionsService = new google.maps.DirectionsService()
        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: this.map
        })
        // 商家位置坐标
        let start_latlng = (
          this.positionInfo.sellerPosition.lat.toString() +
          ',' +
          this.positionInfo.sellerPosition.lon.toString()
        ).trim()
        // 收货地址坐标
        let end_latlng = (
          this.positionInfo.memberPosition.lat.toString() +
          ',' +
          this.positionInfo.memberPosition.lon.toString()
        ).trim()
        // 配送员位置坐标
        let driver_latlng = ''
        if (this.positionInfo.deliveryPosition) {
          driver_latlng = (
            this.positionInfo.deliveryPosition.lat.toString() +
            ',' +
            this.positionInfo.deliveryPosition.lon.toString()
          ).trim()
        }
        let self = this
        //商家到收货地址路线（取货前）
        let request = {
          origin: JSON.stringify(start_latlng),
          destination: JSON.stringify(end_latlng),
          travelMode: 'DRIVING'
        }
        directionsService.route(request, function(response, status) {
          self.draw_line(response, status)
        })
        //配送员到商家路线（暂时不做）
        if (this.positionInfo.deliveryPosition) {
          let no_go_request = {
            origin: JSON.stringify(driver_latlng),
            destination: JSON.stringify(start_latlng),
            travelMode: 'DRIVING'
          }
          directionsService.route(no_go_request, function(response, status) {
            self.draw_line(response, status)
          })
        }
        // let lngLat = this.mapList.slice()
        // lngLat.forEach((item, index) => {
        //   delete item.icon
        // })
        // var flightPath = new google.maps.Polyline({
        //   path: lngLat,
        //   strokeColor: '#FF644D',
        //   strokeOpacity: 1,
        //   StrokeStyle: 'dashed',
        //   strokeWeight: 2
        // })
        // flightPath.setMap(this.map)
      })
    },
    draw_line(response, status) {
      let self = this
      if (status == 'OK') {
        // 默认展示路线方法（存在缺陷）
        // directionsDisplay.setDirections(response)

        // 自定义路线
        var myRoute = response.routes[0].legs[0]
        var locations = []
        for (var i = 0; i < myRoute.steps.length; i++) {
          // 多边形
          locations.push(myRoute.steps[i].start_point)
          var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 2
          }
          var polyOptions = {
            strokeColor: '#FF644D',
            strokeOpacity: 1,
            strokeWeight: 0,
            icons: [
              {
                icon: lineSymbol,
                offset: '0',
                repeat: '8px'
              }
            ]
          }
          var poly = new google.maps.Polyline(polyOptions)
          poly.setMap(self.map)
          for (var j = 0; j < locations.length; j++) {
            var loc = locations[j]
              .toString()
              .split('(')[1]
              .split(')')[0]
              .replace(', ', ',')
              .split(',')
            var path = poly.getPath()
            path.push(new google.maps.LatLng(loc[0], loc[1]))
          }
        }
      } else {
        // 无法获取路线信息
      }
    }
  }
}
</script>
<style scoped lang="scss">
.order_detail {
  background: #fff;
  padding-top: 10px;
  .cash_order {
    display: flex;
    padding: 10px 0 0;
    margin: 0 30px;
    border-bottom: 1px solid #ededed;
    div {
      // &:first-child {
      //   flex: 1;
      // }
      // &:last-child {
      //   margin-right: 50px;
      // }
      margin-right: 50px;
      padding-bottom: 10px;
      color: #333;
      span {
        font-size: 18px;
        color: #333;
        font-weight: 600;
      }
      .bold_size {
        font-size: 20px;
        color: #ff3633;
      }
    }
  }
  .order_info_container {
    display: flex;
    margin: 20px 30px;
    .order_info_detail {
      flex: 1;
      border: 1px solid #ededed;
      border-radius: 2px;
    }
    .order_map_info {
      flex: 1;
      border: 1px solid #ededed;
      border-radius: 2px;
      margin-left: 30px;
    }
  }
  .order_info {
    padding: 15px 17px;
    .title {
      padding-bottom: 10px;
      font-size: 15px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      border-bottom: 1px solid #ededed;
      margin-bottom: 10px;
      span {
        display: inline-block;
        width: 4px;
        height: 17px;
        background: #ff3633;
        margin: 0 8px -3px 3px;
      }
    }
    .context {
      padding-left: 3px;
      display: flex;
      .info_left {
        margin-right: 35px;
        // min-width: 60px;
        div {
          padding: 5px 0;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
      .info_eng {
        min-width: 100px;
      }
      .info_zh {
        min-width: 60px;
      }
      .info_right {
        div {
          padding: 5px 0;
          font-size: 12px;
          color: #949494;
        }
        // .red {
        //   color: #fd4c31;
        // }
      }
    }
    .address_content {
      display: flex;
      padding: 5px 0 5px 3px;
      div {
        &:first-child {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.85);
        }
        &:last-child {
          font-size: 12px;
          color: #949494;
        }
      }
      .address_eng {
        min-width: 110px;
        margin-right: 25px;
      }
      .address_zh {
        min-width: 60px;
        margin-right: 35px;
      }
    }
  }
  .cash_order_info {
    padding-top: 15px;
  }
  .order_content {
    padding: 25px 17px;
    .title {
      padding-bottom: 10px;
      font-size: 15px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      border-bottom: 1px solid #ededed;
      span {
        display: inline-block;
        width: 4px;
        height: 17px;
        background: #ff3633;
        margin: 0 8px -3px 3px;
      }
    }
    .seller_info {
      display: flex;
      padding: 15px 0 20px 3px;
      .seller_img {
        width: 80px;
        img {
          width: 100%;
        }
      }
      .info {
        color: #525151;
        padding-left: 6px;
        div {
          &:first-child {
            font-size: 15px;
            padding-top: 10px;
          }
          font-size: 12px;
          padding: 5px 0;
          // height: 45px;
          // line-height: 45px;
        }
      }
    }
    .table_food {
      .total {
        width: 100%;
        text-align: right;
        margin-top: 15px;
        font-size: 14px;
        color: #666;
        span {
          font-size: 20px;
          color: #fd4c31;
        }
      }
      .total_lunchbox_price,
      .logistics {
        width: 100%;
        padding: 12px;
        color: #666;
        span {
          font-size: 14px;
          &:last-child {
            float: right;
            // padding-right: 30px;
          }
        }
      }
    }
  }
  .back {
    padding: 20px 40px;
    width: 60%;
    text-align: left;
  }
}
</style>
