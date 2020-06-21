<template>
  <div>
    <div class="public_box">
      <!-- <vTitle :title="team_details.distribution_details"></vTitle> -->
      <div class="detail_info_body">
        <div class="clearFloat" :class="{ditail_info: !isEnglish, ditail_infos: isEnglish}">
          <div>
            {{team_details.administrator_account}}：
          </div>
          <div>
            {{userInfo.userName}}
          </div>
        </div>
        <div class="clearFloat" :class="{ditail_info: !isEnglish, ditail_infos: isEnglish}">
          <div>
            {{team_details.name_of_distribution_station}}：
          </div>
          <div>
            {{userInfo.dcName}}
          </div>
        </div>
        <div class="clearFloat" :class="{ditail_info: !isEnglish, ditail_infos: isEnglish}">
          <div>
            {{team_details.name_of_the_person_in_charge}}：
          </div>
          <div>
            {{userInfo.ownerName}}
          </div>
        </div>
        <div class="clearFloat" :class="{ditail_info: !isEnglish, ditail_infos: isEnglish}">
          <div>
            {{team_details.person_in_charge}}：
          </div>
          <div>
            +{{userInfo.ownerPhonepre}} {{userInfo.ownerPhone}}
          </div>
        </div>
        <div class="clearFloat" :class="{ditail_info: !isEnglish, ditail_infos: isEnglish}">
          <div>
            {{team_details.distribution_station_area}}：
          </div>
          <div>
            {{userInfo.province}}{{userInfo.city}}
          </div>
        </div>
        <div class="clearFloat" :class="{ditail_info: !isEnglish, ditail_infos: isEnglish}">
          <div>
            {{team_details.distribution_time}}：
          </div>
          <div v-if="userInfo.allDay==1">
            {{team_details.all_day}}
          </div>
          <div v-if="userInfo.allDay==2">
            {{team_details.morning}}：{{userInfo.am_begin_time}}-{{userInfo.am_end_time}} {{team_details.afternoon}}：{{userInfo.pm_begin_time}}-{{userInfo.pm_end_time}}
          </div>
        </div>
        <div class="clearFloat" :class="{ditail_info: !isEnglish, ditail_infos: isEnglish}">
          <div>
            {{team_details.distribution_area}}：
          </div>
          <div class="map_box">
            <div id="googleMap" style="width:100%;height:100%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vTitle from '../../components/v_title.vue'
import store from '../../store'
import { formatDateTime } from '../../utils'
// 引入英文css样式表
import { setCookie, getCookie, removeCookie } from '../../utils/cookies'
let current_language = getCookie('lang')
// if (current_language == 'en') {
//   require('../../assets/css/team_details_en.css')
// }
export default {
  name: 'team_details',
  data() {
    return {
      map: '',
      mapProp: {
        center: new google.maps.LatLng(22.5428388201, 114.0595442861),
        zoom: '',
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      userInfo: {},
      isEnglish: false
    }
  },
  components: {
    vTitle
  },
  computed: {
    team_details() {
      let team_details = this.$t('team_details')
      return team_details
    }
  },
  mounted() {
    this.getUserInfo()
    let lang = getCookie('lang')
    if (lang == 'en') {
      this.isEnglish = true
    } else {
      this.isEnglish = false
    }
  },
  methods: {
    initialize() {
      if (this.userInfo.dcDistance >= 10) {
        this.mapProp.zoom = 10
      } else {
        this.mapProp.zoom = 14
      }
      this.map = new google.maps.Map(
        document.getElementById('googleMap'),
        this.mapProp
      )
      // 矩形
      // var locations = [
      //     "22.5428388201,114.0595442861",
      //     "25.5428388201,114.0595442861",
      //     "25.5428388201,110.0595442861",
      //     "22.5428388201,110.0595442861",
      //     "22.5428388201,114.0595442861"
      // ];
      // var polyOptions = {
      //     strokeColor: 'red',
      //     strokeOpacity: 1.0,
      //     strokeWeight: 2
      // };
      // var poly = new google.maps.Polyline(polyOptions);
      // poly.setMap(this.map);
      // for (var i = 0; i < locations.length; i++) {
      //     var loc = locations[i].split(',');
      //     var path = poly.getPath();
      //     path.push(new google.maps.LatLng(loc[0], loc[1]));
      // }

      // 圆形
      var cityCircle = new google.maps.Circle({
        strokeWeight: 1,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        map: this.map,
        center: {
          lat: parseFloat(this.userInfo.dcLatitude),
          lng: parseFloat(this.userInfo.dcLongitude)
        },
        radius: parseFloat(this.userInfo.dcDistance) * 1000
      })
      this.map.setCenter(
        new google.maps.LatLng(
          this.userInfo.dcLatitude,
          this.userInfo.dcLongitude
        )
      )
    },
    getUserInfo() {
      let params = { time: new Date().getTime() }
      store.dispatch('getDcInfoByDcId', { params }).then(res => {
        if (res.data.code == 1) {
          this.userInfo = res.data.data
          this.initialize()
          google.maps.event.addDomListener(window, 'load', this.initialize)
        }
      })
      //                 if(window.localStorage){
      //                     this.userInfo=JSON.parse(localStorage.getItem('userInfo')) || ""
      //                 }
    },
    formatTime(time) {
      return formatDateTime(time)
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
.ditail_infos div {
  float: left;
  color: #6d6d6d;
  margin-bottom: 10px;
}
.ditail_info div:first-child {
  width: 10%;
}

.ditail_infos div:first-child {
  width: 20%;
}

.ditail_info div:last-child {
  width: 90%;
}

.ditail_infos div:last-child {
  width: 80%;
}

.map_box {
  width: 100%;
  height: 50vh;
  background: gainsboro;
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
@media (min-width: 1303px) and (max-width: 1700px) {
  .ditail_infos div:first-child {
    width: 18%;
  }
  .ditail_infos div:last-child {
    width: 82%;
  }
}
@media screen and (max-width: 1200px) {
  .ditail_infos div:first-child {
    width: 25%;
  }
  .ditail_infos div:last-child {
    width: 75%;
  }
}
@media screen and (min-width: 1700px) {
  .ditail_infos div:first-child {
    width: 15%;
  }
  .ditail_infos div:last-child {
    width: 85%;
  }
}
</style>
