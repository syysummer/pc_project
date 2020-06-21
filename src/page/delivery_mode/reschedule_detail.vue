<template>
  <div class="reschedule_detail">
    <div>
      <div class="detail-box">
        <div v-if="$route.query.status==2||$route.query.status==3">
          <div class="return-reschedule" @click="goback">
            <span>{{reschedule.return}}</span>
          </div>
          <div class="reschedule-order">
            <div class="application">
              <div class="application-list">
                <div class="column" v-if="$route.query.status==2">{{reschedule.status}}</div>
                <div class="column" v-if="$route.query.status==3">{{reschedule.audit_results}}</div>
                <div class="price" v-if="$route.query.status==2&&(orderInfo.orderStatus==3||orderInfo.orderStatus==9)">{{$t('reschedule.status2')}}</div>
                <div class="price" v-if="$route.query.status==2&&orderInfo.orderStatus==5">{{$t('reschedule.status3')}}</div>
                <div class="price" v-if="$route.query.status==2&&(orderInfo.orderStatus==6||orderInfo.orderStatus==8)">{{$t('reschedule.status4')}}</div>
                <div class="price" v-if="$route.query.status==3">{{reschedule.dismissed}}</div>
              </div>
              <div>
                <div class="column">{{reschedule.order_amount}}</div>
                <div class="price act">{{orderInfo.actualPrice}}P</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 配送员信息 -->
        <div v-if="$route.query.status==1">
          <div class="custom-title">{{reschedule.distribution_information}}</div>
          <div class="custom-content">
            <div class="custom-message">{{reschedule.delivery_staff}}：
              <span>{{deliveryInfo.deliveryName}}</span>
            </div>
            <div class="custom-message">{{reschedule.seller_id}}：
              <span>{{deliveryInfo.deliveryId}}</span>
            </div>
            <div class="custom-message">{{reschedule.contact_number}}：
              <span>{{deliveryInfo.deliveryTel}}</span>
            </div>
          </div>
          <div class="position">
            {{reschedule.delivery_location}}：
            <span>{{deliveryAddress}}</span>
          </div>
          <div id="googleMap" style="width:900px;height:300px;"></div>
        </div>

        <!-- 用户信息 -->
        <div class="user-message">
          <div class="custom-title">{{reschedule.user_Info}}</div>
          <div class="custom-content act">
            <div class="custom-message">{{reschedule.username}}:
              <span>{{userInfo.userName}}</span>
            </div>
            <div class="custom-message">{{reschedule.user_id}}：
              <span>{{userInfo.userId}}</span>
            </div>
            <div class="custom-message">{{reschedule.submit_device}}：
              <span v-if="orderInfo.device==1">Android</span>
              <span v-if="orderInfo.device==2">IOS</span>
              <span v-if="orderInfo.device==3">H5</span>
              <span v-if="orderInfo.device==4">PC</span>
              <span v-if="orderInfo.device==5">{{reschedule.no_public}}</span>
            </div>
          </div>
          <div class="custom-content">
            <div class="custom-message">{{reschedule.receiver}}：
              <span>{{orderInfo.name}}</span>
            </div>
            <div class="custom-message">{{reschedule.contact_number}}：
              <span>{{userInfo.globalCode}} {{userInfo.tel}}</span>
            </div>
            <div class="custom-message">{{reschedule.shipping_address}}：
              <span>{{orderInfo.houseNumber}},{{orderInfo.address}}</span>
            </div>
          </div>
        </div>
        <!-- 订单信息 -->
        <div class="user-message">
          <div class="custom-title">{{reschedule.order_info}}</div>
          <div class="custom-content act">
            <div class="custom-message">{{reschedule.order_num}}:
              <span>{{orderInfo.id}}</span>
            </div>
            <div class="custom-message">{{reschedule.delivery_party}}：
              <span v-if="orderInfo.deliveryId==null && orderInfo.deliveryFlag==1">{{reschedule.carat}}</span>
              <span v-if="orderInfo.deliveryId!=null && (orderInfo.deliveryFlag==0 || orderInfo.deliveryFlag==null)">{{reschedule.fast_delivery}}</span>
              <span v-if="orderInfo.deliveryId==null && (orderInfo.deliveryFlag==0 || orderInfo.deliveryFlag==null)">{{reschedule.merchant_delivery}}</span>
            </div>
            <div class="custom-message">{{reschedule.payment_method}}：
              <span v-if="orderInfo.isOrderPayment==1">{{reschedule.online_payment}}</span>
              <span v-if="orderInfo.isOrderPayment==2">{{reschedule.cash_delivery}}</span>
            </div>
          </div>
          <div class="custom-content act">
            <div class="custom-message">{{reschedule.store_information}}：
              <span>{{orderInfo.sellerName}}</span>
            </div>
            <div class="custom-message">{{reschedule.business_phone}}：
              <span>{{sellerInfo.sellerPhone}}</span>
            </div>
            <div class="custom-message">{{reschedule.business_address}}：
              <span>{{sellerInfo.sellerLocation}}</span>
            </div>
          </div>
          <div class="time-detail">
            <template v-for="(item,index) in orderStatus">
              <div class="time-message" v-if="item.orderStatus==0">{{reschedule.creation_time}}：
                <span>{{formatTime(item.createTime)}}</span>
              </div>
              <div class="time-message" v-if="item.orderStatus==1">{{reschedule.payment_time}}：
                <span>{{formatTime(item.createTime)}}</span>
              </div>
              <div class="time-message" v-if="item.orderStatus==2">{{reschedule.merchant_order_time}}：
                <span>{{formatTime(item.createTime)}}</span>
              </div>
              <div class="time-message" v-if="item.orderStatus==3">{{reschedule.delivery_time}}：
                <span>{{formatTime(item.createTime)}}</span>
              </div>
              <div class="time-message" v-if="item.orderStatus==9">{{reschedule.report_time}}：
                <span>{{formatTime(item.createTime)}}</span>
              </div>
              <div class="time-message" v-if="item.orderStatus==5">{{reschedule.pick_time}}：
                <span>{{formatTime(item.createTime)}}</span>
              </div>
              <div class="time-message" v-if="item.orderStatus==6">{{reschedule.delivery_give_time}}：
                <span>{{formatTime(item.createTime)}}</span>
              </div>
            </template>

          </div>
        </div>
        <div class="custom-title">{{reschedule.tracking_information}}</div>
        <div class="track-message">
          <div class="line-left"></div>
          <div class="line-bottom"></div>
          <div class="track-list" v-for="(item,index) in orderTraceInfoList">
            <template v-if="item.userIdentityType==2">
              <div class="track-top clearFloat">
                <div class="track-radio"></div>
                <div class="custom-user">{{reschedule.user}}：
                  <span style="color: rgb(24,144,255)">{{item.name}}</span>
                </div>
                <div class="custom-user">{{reschedule.contact_information}}：{{item.tel}}
                </div>
                <div class="custom-user" v-if="item.orderStatus==0||item.orderStatus==1">{{reschedule.go_order}}</div>
                <div class="custom-user" v-if="item.orderStatus==7">{{reschedule.cancelled}}</div>
                <div class="custom-user" v-if="item.orderStatus==6||item.orderStatus==8">{{reschedule.have_received}}</div>
                <div class="custom-time">{{formatTime(item.createTime)}}</div>
              </div>
            </template>
            <template v-if="item.userIdentityType==1">
              <div class="track-top clearFloat">
                <div class="track-radio"></div>
                <div class="custom-user">{{reschedule.merchant}}：
                  <span style="color: rgb(13,170,56)">{{item.sellerName}}</span>
                </div>
                <div class="custom-user">{{reschedule.contact_information}}：{{item.tel}}
                </div>
                <div class="custom-user" v-if="item.orderStatus==2">{{reschedule.order_received}}</div>
                <div class="custom-user" v-if="item.orderStatus==7">{{reschedule.cancelled}}</div>
                <div class="custom-time">{{formatTime(item.createTime)}}</div>
              </div>
            </template>
            <template v-if="item.userIdentityType==4">
              <div class="track-top clearFloat">
                <div class="track-radio"></div>
                <div class="custom-user">{{reschedule.delivery_staff}}：
                  <span>{{item.deliveryName}}</span>
                </div>
                <div class="custom-user">{{reschedule.delivery}}：{{item.deliveryId}}
                </div>
                <div class="custom-user">{{reschedule.contact_information}}：{{item.deliveryTel}}
                </div>
                <div class="custom-user" v-if="item.applyStatus==1">{{reschedule.initiate_delivered}}</div>
                <div class="custom-user" v-if="item.orderStatus==3&&item.isHandle==0">{{reschedule.has_grabbed_order}}</div>
                <div class="custom-user" v-if="item.orderStatus==3&&item.isHandle==1">{{reschedule.accepted}}&nbsp;{{masterInfo.dcObj.dcName}}&nbsp;{{reschedule.webmaster}}
                  <span style="color:rgb(255,171,48)">&nbsp;{{masterInfo.dcObj.ownerName}}</span>&nbsp;{{reschedule.manual_order}}</div>
                <div class="custom-user" v-if="item.orderStatus==3&&item.isHandle==2">{{reschedule.order_received}}</div>
                <div class="custom-user" v-if="item.orderStatus==3&&item.isHandle==3">{{reschedule.accepted}}&nbsp;{{masterInfo.dcObj.dcName}}&nbsp;{{reschedule.webmaster}}
                  <span style="color:rgb(255,171,48)">&nbsp;{{masterInfo.dcObj.ownerName}}</span>&nbsp;{{reschedule.reassigned_order}}</div>
                <div class="custom-user" v-if="item.orderStatus==9">{{reschedule.reported_store}}</div>
                <div class="custom-user" v-if="item.orderStatus==5">{{reschedule.picked_up}}</div>
                <div class="custom-user" v-if="item.orderStatus==6||item.orderStatus==8">{{reschedule.confirmed_delivery}}</div>
                <div class="custom-time">{{formatTime(item.createTime)}}</div>
              </div>
              <div class="trank-bottom" v-if="item.applyReason">
                <div class="result">{{reschedule.reason_application}}</div>
                <div class="result-detail">
                  {{item.applyReason}}
                </div>
              </div>
            </template>
            <template v-if="item.userIdentityType==5">
              <div class="track-top clearFloat">
                <div class="track-radio"></div>
                <div class="custom-user">{{masterInfo.dcObj.dcName}}{{reschedule.webmaster}}：
                  <span style="color:rgb(255,171,48)">{{masterInfo.dcObj.ownerName}}</span>
                </div>
                <div class="custom-user" v-if="item.applyStatus==2">{{reschedule.approved}}
                </div>
                <div class="custom-user" v-if="item.applyStatus==3">{{reschedule.dismissed}}
                </div>
                <div class="custom-user">{{reschedule.delivery_staff}}：
                  <span>{{item.deliveryName}}</span>&nbsp;&nbsp;{{reschedule.initiate_delivered}}
                </div>
                <div class="custom-time">{{formatTime(item.createTime)}}</div>
              </div>
            </template>
          </div>
        </div>
        <div class="custom-title">{{reschedule.product_information}}</div>
        <div class="table_food">
          <el-table :data="goodsList" style="width: 100%" :header-cell-style="{'background-color': '#F6F9FF'}">
            <el-table-column prop="goodsName" :label="reschedule.dishes"></el-table-column>
            <el-table-column prop="goodsSpecifications" :label="reschedule.specification" v-if="showSpe"></el-table-column>
            <el-table-column prop="num" :label="reschedule.quantity"></el-table-column>
            <el-table-column prop="presentPrice" :label="reschedule.price"></el-table-column>
            <el-table-column prop="totalPrice" :label="reschedule.subtotal" align="center" width="90"></el-table-column>
          </el-table>
          <div class="fee-box">
            <div class="total_lunchbox_price">
              <div class="lunchbox-left">{{reschedule.lunch_fee}}</div>
              <div class="lunchbox-right">{{orderInfo.totalLunchboxPrice}}P</div>
            </div>
            <div class="total_lunchbox_price">
              <div class="lunchbox-left">{{reschedule.shipping_fee}}</div>
              <div class="lunchbox-right">{{orderInfo.logistics}}P</div>
            </div>
            <div class="total_lunchbox_price">
              <div class="lunchbox-left">{{reschedule.distribution_fee_subsidy}}</div>
              <div class="lunchbox-right">({{reschedule.platform_subsidy}}&nbsp;{{orderInfo.platormSubsidyMoney}}+{{reschedule.merchant_subsidy}}&nbsp;{{orderInfo.sellerSubsidyMoney}}+{{reschedule.user_payment}}&nbsp;{{actualLogistics}})</div>
            </div>
          </div>
          <div class="fee-price">
            <div class="pay-box">
              <div class="pay-box-left">{{reschedule.user_paid}}</div>
              <div class="pay-box-right">{{orderInfo.actualPrice}}P</div>
            </div>
            <div class="pay-box">
              <div class="pay-box-left">{{reschedule.merchant_ncome}}</div>
              <div class="pay-box-right">{{orderInfo.expectedIncome}}P</div>
            </div>
            <div class="pay-box">
              <div class="pay-box-left">{{reschedule.platform_subsidy}}</div>
              <div class="pay-box-right act">{{orderInfo.activityMoney}}</div>
            </div>
          </div>
          <div class="submit-button" v-if="$route.query.status==1">
            <div class="go-order" @click="handleClickUp">{{reschedule.immediate_order}}</div>
            <div class="reject-application" @click="refuseOrder">{{reschedule.reject_application}}</div>
            <div class="return" @click="goback">{{reschedule.return}}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="schedule_list.order_people" :visible.sync="dialogVisible" width="45%" center>

      <!-- <div class="add_order">
        <div class="order_type">{{schedule_list.order_type}}
          <span>{{order_payment_type}}</span>
        </div>
        <div class="order_amount">{{schedule_list.order_amount}}：
          <span>{{order_money}}P</span>
        </div>
      </div> -->
      <!-- <el-form :inline="true" ref="form" :model="deliveryType" class="delivery-box">
        <el-form-item :label="reschedule.choose_express">
          <el-radio-group v-model="deliveryType.type">
            <el-radio :label="1">{{reschedule.fast_delivery}}</el-radio>
            <el-radio :label="2">{{reschedule.third_delivery}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form> -->
      <div v-show="deliveryType.type==1">
        <el-form :inline="true" :model="dialogForm" class="demo-form-inline dialog-form1">
          <el-form-item>
            <el-input v-model="dialogForm.deliver_name" size="small" :placeholder="reschedule.please_distributor"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dialogForm.deliver_phone" size="small" :placeholder="reschedule.please_mobile_number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="search" size="mini">{{reschedule.search}}</el-button>
          </el-form-item>
        </el-form>
        <el-table class="dialog_table1" :row-class-name="tableRowClassName" fixed :data="table_deliver" :empty-text="empty" style="width: 100%; padding-bottom: 20px;" v-loading="loading" :default-sort="{prop: 'orderCount', order: 'descending'}" :header-cell-style="{'background-color': '#F6F9FF'}" @sort-change="tableSortChange">
          <!-- <el-table-column type="index" :index="typeIndex" :label="schedule_list.num"></el-table-column> -->
          <el-table-column prop="deliveryName" align="left" :label="$t('rider_manage.name')"></el-table-column>
          <el-table-column prop="deliveryManTel" align="left" :label="$t('rider_manage.rider_column.phone')" min-width="130"></el-table-column>
          <el-table-column prop="orderCount" align="center" :label="schedule_list.holding_amount" min-width="90" sortable='custom'></el-table-column>
          <el-table-column prop="distance" align="center" :label="distanceColumn" min-width="180" sortable='custom'></el-table-column>
          <el-table-column :label="$t('rider_manage.rider_column.operation')" min-width="155" align="center">
            <template slot-scope="scope">
              <div @click="handleClickOrder(scope.row)" type="primary" plain size="mini" class="button-handle">{{schedule_list.orderUp}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div v-show="deliveryType.type==2">
        <div class="distribution">
          <div v-for="(item,index) in distributionList" :class="{act:selectIndex==index}" @click="selectDistribution(index)">{{item.name}}</div>
        </div>
        <div class="distribution-footer">
          <div @click="dialogVisibleSub = false">{{$t('edit_distributor.cancel')}}</div>
          <div @click="confirmSub">{{$t('edit_distributor.confirm')}}</div>
        </div>
      </div> -->
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleSub" width="25%" top="30vh" class="dialog_small_box">
      <span>{{deliver}}&nbsp;{{distanceColumn}}&nbsp;{{distance}}km,{{$t('schedule_list.delivery_dan')}}{{orderCount}}{{$t('schedule_list.dan')}},{{$t('schedule_list.confirm_now')}}</span>
      <div class="dialog-footer">
        <div @click="dialogVisibleSub = false">{{$t('edit_distributor.cancel')}}</div>
        <div @click="confirmSub">{{$t('edit_distributor.confirm')}}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import store from '../../store'
import { formatDateTime } from '../../utils/index'
import vTitle from '../../components/v_title'
export default {
  components: { vTitle },
  data() {
    return {
      dialogForm: {
        deliver_name: '',
        deliver_phone: ''
      },
      deliveryType: {
        type: 1
      },
      dialogForm: {
        deliver_name: '',
        deliver_phone: ''
      },
      empty: this.$t('no_pass_management.empty'),
      table_deliver: [],
      dialogVisible: false,
      dialogVisibleSub: false,
      isLoading: false,
      loading: false,
      orderId: '',
      deliveryId: '',
      deliver: '',
      distance: '',
      distanceColumn: this.$t('reschedule.distance_seller'),
      orderCount: '',
      orderSort: 1,
      distanceSort: '',
      selectIndex: 0,
      showSpe: false,
      deliveryAddress: '',
      goodsList: [],
      map: '',
      mapProp: {
        center: new google.maps.LatLng(22.5428388201, 114.0595442861),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      mapList: [],
      masterInfo: [],
      sellerInfo: [],
      userInfo: [],
      orderInfo: [],
      orderStatus: [],
      deliveryInfo: [],
      reassignmentOrderList: [],
      orderTraceInfoList: []
    }
  },
  mounted() {
    let masterInfo = localStorage.getItem('masterInfo')
    if (masterInfo) {
      this.masterInfo = JSON.parse(masterInfo)
    }
    this.getReassignmentOrderDetail()
    // google.maps.event.addDomListener(window, 'load', this.initialize)
  },
  computed: {
    reschedule() {
      let reschedule = this.$t('reschedule')
      return reschedule
    },
    schedule_list() {
      let schedule_list = this.$t('schedule_list')
      return schedule_list
    },
    orderProfit() {
      return (
        parseFloat(this.orderInfo.expectedIncome) -
        parseFloat(this.orderInfo.activityMoney)
      )
    },
    actualLogistics() {
      return (
        parseFloat(this.orderInfo.logistics) -
        parseFloat(this.orderInfo.platormSubsidyMoney) -
        parseFloat(this.orderInfo.sellerSubsidyMoney)
      )
    }
  },
  methods: {
    getReassignmentOrderDetail() {
      store
        .dispatch('getReassignmentOrderDetail', {
          orderId: this.$route.query.orderId
        })
        .then(res => {
          if (res.data.code == 1) {
            this.sellerInfo = res.data.data.sellerInfo
            this.userInfo = res.data.data.userInfo
            this.orderInfo = res.data.data.orderInfo
            this.orderStatus = res.data.data.orderStatus
            this.goodsList = res.data.data.orderGoods
            this.goodsList.forEach((item, index) => {
              item.presentPrice = item.presentPrice + 'P'
              item.totalPrice = item.totalPrice + 'P'
              if (item.goodsSpecifications) {
                this.showSpe = true
              }
            })
            this.reassignmentOrderList = res.data.data.reassignmentOrderList
            this.deliveryAddress = this.reassignmentOrderList[0].address
            this.orderTraceInfoList = res.data.data.orderTraceInfoList
            this.deliveryInfo = res.data.data.deliveryInfo
            if (this.$route.query.status == 1) {
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
            }
          }
        })
    },
    formatTime(time) {
      return formatDateTime(time)
    },
    initialize() {
      let marker
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
        self.toast(self.$t('delivery_details.no_line'))
      }
    },
    handleClickUp() {
      this.dialogForm.deliver_name = ''
      this.dialogForm.deliver_phone = ''
      this.orderId = this.$route.query.orderId
      this.getAllDeliveryManByDcIdList()
      this.dialogVisible = true
    },
    search() {
      this.getAllDeliveryManByDcIdList()
    },
    getAllDeliveryManByDcIdList() {
      this.loading = true
      store
        .dispatch('getAllDeliveryManByDcIdList', {
          deliveryName: this.dialogForm.deliver_name,
          phone: this.dialogForm.deliver_phone,
          orderId: this.orderId,
          reassignmentType: 3,
          orderSort: this.orderSort,
          distanceSort: this.distanceSort
        })
        .then(res => {
          if (res.data.code == 1) {
            res.data.data.deliveryList.forEach(item => {
              item.distance = parseFloat(parseFloat(item.distance).toFixed(2))
            })
            this.table_deliver = res.data.data.deliveryList
            if (this.table_deliver) {
              if (this.table_deliver[0].distanceType == 1) {
                this.distanceColumn = this.$t('reschedule.distance_between')
              } else if (this.table_deliver[0].distanceType == 2) {
                this.distanceColumn = this.$t('reschedule.distance_delivery')
              } else if (this.table_deliver[0].distanceType == 3) {
                this.distanceColumn = this.$t('reschedule.distance_seller')
              }
            }
            this.loading = false
          } else {
            this.$message.error(res.data.message)
            this.loading = false
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    handleClickOrder(row) {
      this.deliveryId = row.deliveryId
      this.distance = row.distance
      this.deliver = row.deliveryName
      this.orderCount = row.orderCount
      this.dialogVisibleSub = true
    },
    tableSortChange({ column, prop, order }) {
      console.log(prop, order, 'order')
      if (prop == 'orderCount') {
        if (order == 'descending') {
          this.orderSort = 1
          this.distanceSort = ''
        } else {
          this.orderSort = 2
          this.distanceSort = ''
        }
      } else if (prop == 'distance') {
        if (order == 'descending') {
          this.distanceSort = 1
          this.orderSort = ''
        } else {
          this.distanceSort = 2
          this.orderSort = ''
        }
      }
      this.getAllDeliveryManByDcIdList()
    },
    confirmSub() {
      store
        .dispatch('handleOrder', {
          orderId: this.orderId,
          reassignmentType: 3,
          deliveryId: this.deliveryId
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.$message.success(res.data.message)
            this.$router.back()
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.dialogVisibleSub = false
      this.dialogVisible = false
    },
    refuseOrder() {
      this.$confirm(
        this.reschedule.sure_person,
        this.reschedule.sure_person.prompt,
        {
          confirmButtonText: this.$t('edit_distributor.confirm'),
          cancelButtonText: this.$t('edit_distributor.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          store
            .dispatch('rejectReassignmentOrder', {
              orderId: this.$route.query.orderId
            })
            .then(res => {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.$router.back()
            })
        })
        .catch(() => {})
    },
    goback() {
      this.$router.back()
    },
    tableRowClassName({ row, rowIndex }) {
      console.log('888888', rowIndex)
      if (rowIndex % 2 !== 0) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>
<style scoped lang="scss">
.reschedule_detail {
  padding-bottom: 50px;
  background: #fff;
  .button-handle {
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
  }
  .detail-box {
    .reschedule-order {
      .application {
        float: right;
        display: flex;
        margin: 6px 0 0 0;
        .application-list {
          margin: 0 39px 0 0;
        }
        .column {
          text-align: right;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          line-height: 30px;
        }
        .price {
          text-align: right;
          color: rgba(0, 0, 0, 0.85);
          font-size: 20px;
          font-weight: 700;
          &.act {
            color: #ff644d;
          }
        }
      }
    }
    .user-message {
      padding-bottom: 20px;
      border-bottom: 1px solid #e8e8e8;
    }
    .return-reschedule {
      text-align: right;
      padding-top: 32px;
      span {
        background: #1890ff;
        border-radius: 4px;
        color: #fff;
        width: 74px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        display: inline-block;
      }
    }
    margin: 0 32px;
    .custom-title {
      padding: 14px 0 16px 0;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 700;
    }
    .time-detail {
      overflow: hidden;
      width: 900px;
      .time-message {
        float: left;
        width: 300px;
        font-size: 14px;
        padding: 0 0 10px 0;
        color: rgba(0, 0, 0, 0.85);
        &:last-child {
          margin-right: 0;
        }
        span {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
        }
      }
    }
    .custom-content {
      display: flex;
      &.act {
        padding: 0 0 10px 0;
      }
      .custom-message {
        width: 300px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        &:last-child {
          margin-right: 0;
        }
        span {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
        }
      }
    }
    .position {
      padding: 9px 0 16px 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      span {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
      }
    }
    .track-message {
      border-left: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 16px;
      position: relative;
      .line-left {
        position: absolute;
        left: -1px;
        top: 0;
        width: 1px;
        height: 6px;
        background: #fff;
      }
      .line-bottom {
        position: absolute;
        left: -1px;
        bottom: 0;
        width: 1px;
        height: 44px;
        background: #fff;
      }
      .track-top {
        margin-left: 23px;
        padding-bottom: 14px;
        position: relative;
        .track-radio {
          position: absolute;
          left: -29px;
          top: 5px;
          background: #ffffff;
          border: 2px solid #1890ff;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .custom-user {
          float: left;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          margin-right: 30px;
          span {
            font-size: 14px;
            color: #ff644d;
          }
        }
        .custom-time {
          float: right;
          font-size: 12px;
          color: rgba(153, 153, 153, 0.65);
        }
      }
      .trank-bottom {
        margin-bottom: 23px;
        margin-left: 23px;
        border: 1px solid #e9e9e9;
        border-radius: 4px 4px 0px 0px;
        .result {
          font-weight: 700;
          padding: 11px 24px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
          background: #fafafa;
        }
        .result-detail {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
          padding: 16px 24px;
          word-wrap: break-word;
        }
      }
    }
    .table_food {
      .fee-box {
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 11px;
      }
      .fee-price {
        .pay-box {
          overflow: hidden;
          padding: 12px 33px 0 10px;
          .pay-box-left {
            font-size: 14px;
            color: #373737;
            float: left;
          }
          .pay-box-right {
            font-size: 18px;
            color: #ff644d;
            float: right;
            &.act {
              color: #373737;
            }
          }
        }
      }
      .total_lunchbox_price {
        overflow: hidden;
        padding: 12px 33px 0 10px;
        .lunchbox-left {
          font-size: 13px;
          color: #373737;
          float: left;
        }
        .lunchbox-right {
          font-size: 13px;
          color: #373737;
          float: right;
        }
      }
    }
    .submit-button {
      display: flex;
      // padding: 12px 33px 0 10px;
      position: fixed;
      bottom: 25px;
      left: 285px;
      z-index: 1000;
      .go-order {
        background: #ff644d;
        border-radius: 4px;
        color: #fff;
        width: 107px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-right: 22px;
        cursor: pointer;
      }
      .reject-application {
        background: #1890ff;
        border-radius: 4px;
        color: #fff;
        width: 107px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-right: 22px;
        cursor: pointer;
      }
      .return {
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        color: rgba(0, 0, 0, 0.65);
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-right: 22px;
        cursor: pointer;
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 4vh;
    div {
      &:first-child {
        border: 1px solid #dcdfe6;
        color: #606266;
        border-radius: 4px;
        padding: 10px 20px;
        font-size: 14px;
        margin-right: 10px;
      }
      &:last-child {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        padding: 10px 20px;
        border-radius: 4px;
        margin-left: 10px;
        font-size: 14px;
      }
      cursor: pointer;
    }
  }
}
</style>
