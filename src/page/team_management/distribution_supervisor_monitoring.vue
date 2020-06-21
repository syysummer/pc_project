<template>
    <div>
        <div class="public_box">
            <!-- <vTitle :title="distribution_supervisor_monitoring.distribution_supervisor_monitoring"></vTitle> -->
            <div class="distribution_supervisor_monitoring_body">
                <div class="search_box clearFloat">
                    <div class="box">
                        <span>{{distribution_supervisor_monitoring.state}}：</span>
                        <el-select v-model="line_status" size="small">
                            <el-option :label="distribution_supervisor_monitoring.whole" value=""></el-option>
                            <el-option :label="distribution_supervisor_monitoring.on_line" value="0"></el-option>
                            <el-option :label="distribution_supervisor_monitoring.off_line" value="1"></el-option>
                        </el-select>
                    </div>

                    <div class="box">
                        {{distribution_supervisor_monitoring.name_of_the_distributor}}：
                        <input type="text" v-model="deliveryName" />
                    </div>

                    <div class="box">
                        {{distribution_supervisor_monitoring.telephone}}：
                        <input type="text" v-model="tel" />
                    </div>

                    <!-- <div class="box">
                        {{distribution_supervisor_monitoring.ordering_by_holding_single_quantity}}：
                        <el-select v-model="order_amount" size="small" class="box_select">
                            <el-option :label="distribution_supervisor_monitoring.whole" value=""></el-option>
                            <el-option :label="distribution_supervisor_monitoring.from_high_to_low" value="1"></el-option>
                            <el-option :label="distribution_supervisor_monitoring.from_low_to_high" value="0"></el-option>
                        </el-select>
                    </div> -->
                    <el-button type="danger" @click="submit" size="mini">{{distribution_supervisor_monitoring.search}}</el-button>
                    <!-- <div class="box search_btn" @click="submit">
                        <div>
                            <img src="../../assets/icons/manage_icon_search.png" />
                        </div>
                        {{distribution_supervisor_monitoring.search}}
                    </div> -->
                </div>

                <div class="distribution_supervisor_monitoring clearFloat">
                    <div class="distribution_table">
                        <el-table :data="tableData" fixed style="width: 100%" v-loading="loading" :cell-style="cellStyle" :default-sort="{prop: 'orderCount', order: 'descending'}" @sort-change="tableSortChange">
                            <el-table-column prop="deliveryName" :label="distribution_supervisor_monitoring.full_name">
                            </el-table-column>
                            <el-table-column prop="orderCount" :label="distribution_supervisor_monitoring.holding_capacity" min-width="110" sortable="custom">
                              <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                  <p>{{$t('order_detail.line')}}: {{ scope.row.onlineNum }}</p>
                                  <p>{{$t('schedule_list.cash')}}: {{ scope.row.CODNum }}</p>
                                  <div slot="reference" class="name-wrapper">
                                    <span>{{ scope.row.orderCount }}</span>
                                  </div>
                                </el-popover>
                              </template>
                            </el-table-column>
                            <el-table-column prop="status" :label="distribution_supervisor_monitoring.state">
                            </el-table-column>
                            <el-table-column :label="distribution_supervisor_monitoring.location" min-width="90">
                                <template slot-scope="scope">
                                    <img @click='track(scope.row)' v-if="scope.row.status=='在线' || scope.row.status=='On-line'" src="../../assets/icons/manage_icon_location.png" />
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination background layout="prev, pager, next" :total="total" v-if="total >= 1" class="small_pagination" :page-size="showCount" :current-page="parseInt(currentPage)" @current-change="changePages"></el-pagination>
                    </div>
                    <div class="distribution_position">
                        <div id="googleMap" style="width:100%;height:100%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import vTitle from "../../components/v_title.vue";
import store from "../../store";
// 引入英文css样式表
import { setCookie, getCookie, removeCookie } from "../../utils/cookies";
let current_language = getCookie("lang");
if (current_language == "en") {
  require("../../assets/css/distribution_supervisor_monitoring.css");
}
export default {
  name: "distribution_supervisor_monitoring",
  data() {
    return {
      line_status: "",
      order_amount: 1,
      deliveryName: "",
      tel: "",
      tableData: [],
      map: "",
      mapProp: {
        center: {
          lat: 0,
          lng: 0
        },
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      features: [],
      icons: {
        business: {
          icon: require("../../assets/icons/shop_icon_blue.png")
        },
        business_gray: {
          icon: require("../../assets/icons/shop_icon_gray.png")
        },
        distributor: {
          icon: require("../../assets/icons/rider_icon.png")
        },
        site: {
          icon: require("../../assets/icons/dc_icon.png")
        }
      },
      total: 0,
      currentPage: 1,
      showCount: 10,
      loading: false,
      ownerName: "",
      dcTel: "",
      listArray: []
    };
  },
  components: {
    vTitle
  },
  computed: {
    distribution_supervisor_monitoring() {
      let distribution_supervisor_monitoring = this.$t(
        "distribution_supervisor_monitoring"
      );
      return distribution_supervisor_monitoring;
    }
  },
  mounted() {
    let masterInfo = JSON.parse(localStorage.getItem("masterInfo"));
    this.ownerName = masterInfo.dcObj.ownerName;
    this.dcTel = masterInfo.dcObj.ownerPhone;
    // this.deliveryMonitorList();
    // this.initialize();
    google.maps.event.addDomListener(window, "load", this.initialize);
  },
  methods: {
    // sortChange(column, prop, order) {
    //   console.log(column.prop); //prop标签 => nickname
    //   console.log(column.order); //descending降序、ascending升序
    // },
    initialize(rows) {
      // 创建地图
      console.log(rows, "roes");
      let marker, googleContent;
      this.map = new google.maps.Map(
        document.getElementById("googleMap"),
        this.mapProp
      );
      // 标记
      console.log(this.features, ">>>>>>");
      for (var i = 0; i < this.features.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng({
            lat: this.features[i].lat,
            lng: this.features[i].lon
          }),
          icon: this.icons[this.features[i].type].icon,
          map: this.map
        });
        googleContent =
          "<div>" +
          this.features[i].name +
          "：" +
          this.features[i].phone +
          "</div>";
        // console.log(rows.deliveryLat)
        this.clickMarker(marker, googleContent, this.features[i].type);
        if (rows) {
          if (
            rows.deliveryLat == this.features[i].lat &&
            rows.deliveryLon == this.features[i].lon &&
            this.features[i].type == "distributor" &&
            rows.deliveryId == this.features[i].deliveryId
          ) {
            console.log(this.features[i].deliveryId, ">>>>>>");
            let infowindow = new google.maps.InfoWindow();
            infowindow.setContent(googleContent);
            infowindow.open(this.map, marker);
            // break
          }
        }
      }
    },
    tableSortChange({ column, prop, order }) {
      if (order == "descending") {
        this.order_amount = 1;
      } else {
        this.order_amount = 0;
      }
      this.deliveryMonitorList(1);
    },
    submit() {
      this.currentPage = 1;
      this.listArray = []
      this.tableData = []
      this.features = []
      this.deliveryMonitorList(1);
    },
    clickMarker(marker, googleContent, type) {
      decodeURI;
      if (type == "site") {
        google.maps.event.addListener(marker, "click", function() {
          this.map.setZoom(18);
          this.map.setCenter(marker.getPosition());
        });
      } else {
        let infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, "click", function() {
          this.map.setZoom(19);
          this.map.setCenter(marker.getPosition());
          infowindow.setContent(googleContent);
          infowindow.open(this.map, marker);
        });
      }
    },
    track(rows) {
      console.log(rows);
      this.mapProp = {
        center: {
          lat: rows.lat,
          lng: rows.lon
        },
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.initialize(rows);
    },
    deliveryMonitorList(num) {
      this.loading = true;
      store
        .dispatch("deliveryMonitorList", {
          currentPage: this.currentPage,
          showCount: this.showCount,
          deliveryName: this.deliveryName,
          phone: this.tel,
          openStatus: this.line_status,
          orderCountSortWay: this.order_amount
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.loading = false;
            if (this.listArray.indexOf(num) > -1) {
              return;
            }
            if (num == 1) {
              let dcPosition = {
                lat: parseFloat(res.data.data.dcLat),
                lon: parseFloat(res.data.data.dcLon),
                type: "site",
                name: this.ownerName,
                phone: this.dcTel
              };
              console.log(dcPosition, "dcPositions");
              this.mapProp.center.lat = parseFloat(dcPosition.lat);
              this.mapProp.center.lng = parseFloat(dcPosition.lon);
              console.log(this.mapProp.center, "center");
              console.log(this.features, "333333333333");
              this.features.push(dcPosition);
            }
            console.log(this.features, "222222222");
            res.data.data.deliveryMap.deliveryList.forEach(item => {
              if (item.openStatus == 0) {
                item.status = this.$t(
                  "distribution_supervisor_monitoring.on_line"
                );
                item.lat = parseFloat(item.deliveryLat);
                item.lon = parseFloat(item.deliveryLon);
                item.type = "distributor";
                item.name = item.deliveryName;
                item.phone = item.deliveryManTel;
                this.features.push(item);
              } else {
                item.status = this.$t(
                  "distribution_supervisor_monitoring.off_line"
                );
              }
            });
            console.log(this.features, "1111111111");
            if (num == 1) {
              res.data.data.sellerLocationList.forEach(item => {
                item.lat = parseFloat(item.sellerLat);
                item.lon = parseFloat(item.sellerLon);
                item.name = item.sellerName;
                item.phone = item.sellerPhone;
                if (item.sellerBusFlag == 1) {
                  item.type = "business";
                } else {
                  item.type = "business_gray";
                }
                this.features.push(item);
              });
            }
            this.tableData = res.data.data.deliveryMap.deliveryList;
            this.total = res.data.data.deliveryMap.totalResult;
            this.listArray.push(num);
            console.log(this.features, "features");
            this.initialize();
          } else {
            this.loading = false;
            this.$message.error(res.data.message);
          }
        });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log(columnIndex, "columnIndex");
      if (columnIndex === 3) {
        //指定列号
        return "cursor: pointer";
      } else {
        return "";
      }
    },
    changePages(page) {
      this.currentPage = page;
      this.deliveryMonitorList(page);
    }
  }
};
</script>
<style scoped>
.position_img {
  cursor: pointer;
}
.public_box {
  width: 100%;
  background: #ffffff;
  border-radius: 5px;
}

.distribution_supervisor_monitoring_body {
  width: 100%;
  padding: 15px 35px;
}

.search_box {
  width: 100%;
  margin-bottom: 10px;
}

.search_box .box {
  height: 30px;
  float: left;
  margin-right: 15px;
  display: flex;
  align-items: center;
  color: #6d6d6d;
  margin-bottom: 10px;
}

.box input {
  width: 1.25rem;
  height: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  color: #999999;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box.search_btn {
  height: 30px;
  border-radius: 5px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #FF644D;
  color: #ffffff;
  cursor: pointer;
}

.search_btn div {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 5px;
  position: relative;
}

.search_btn img {
  position: absolute;
  top: 1px;
  width: 100%;
  height: 100%;
}

.distribution_supervisor_monitoring {
  width: 100%;
  height: 65vh;
}

.distribution_table {
  float: left;
  width: 30%;
  height: 100%;
  border: 1px solid #e5e5e5;
  border-bottom: 0;
}

.distribution_position {
  float: left;
  padding-left: 15px;
  width: 70%;
  height: 100%;
}
/* .position_img  */

@media (min-width: 992px) and (max-width: 1400px) {
  .distribution_table {
    width: 42%;
  }

  .distribution_position {
    width: 58%;
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  .distribution_table {
    width: 50%;
  }

  .distribution_position {
    width: 50%;
  }
}
</style>