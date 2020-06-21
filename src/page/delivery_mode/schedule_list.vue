<template>
  <div class="schedule_list">
    <div class="tab_nav">
      <div class="tab_border">
        <div class="tab-item" :class="{actives: $route.path.indexOf('waiting_single') > -1}" @click="goWaiting">
          <span>{{schedule_list.waiting}}
            <div class="line"></div>
          </span>
        </div>
        <div class="tab-item" :class="{actives: $route.path.indexOf('pick_up') > -1}" @click="goPickUp">
          <span>{{schedule_list.pick_up}}
            <div class="line"></div>
          </span>
        </div>
        <div class="tab-item" :class="{actives: $route.path.indexOf('services') > -1}" @click="goService">
          <span>{{schedule_list.service}}
            <div class="line"></div>
          </span>
        </div>
        <div class="tab-item" :class="{actives: $route.path.indexOf('statistics_data') > -1}" @click="goStatistics">
          <span>{{schedule_list.statistics}}
            <div class="line"></div>
          </span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import vTitle from '../../components/v_title'
import { mapMutations } from 'vuex'
export default {
  name: 'schedule_list',
  data() {
    return {
      active_now: 1
    }
  },
  components: { vTitle },
  computed: {
    schedule_list() {
      let schedule_list = this.$t('schedule_list')
      return schedule_list
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(['updatePage']),
    goWaiting() {
      this.updatePage()
      this.$router.push('/schedule_list/waiting_single')
    },
    goPickUp() {
      this.updatePage()
      this.$router.push('/schedule_list/pick_up')
    },
    goService() {
      this.updatePage()
      this.$router.push('/schedule_list/services')
    },
    goStatistics() {
      this.updatePage()
      this.$router.push('/schedule_list/statistics_data')
    }
  }
}
</script>

<style scoped lang="scss">
.schedule_list {
  background: #fff;
  .tab_nav {
    margin: 0 30px;
    .tab_border {
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ededed;
      .tab-item {
        // &:first-child {
        //   border-top-left-radius: 18px;
        //   border-bottom-left-radius: 18px;
        // }
        &:last-child {
          border-right: none;
        }
        &:first-child {
          padding-left: 8px;
        }
        position: relative;
        &::after {
          padding-right: 22px;
        }
        padding-right: 22px;
        margin: 18px 22px 12px 0;
        // margin: 18px 0 12px 21px;
        height: 100%;
        line-height: 16px;
        color: #333;
        // flex: 1;
        text-align: center;
        border-right: 2px solid #ededed;
        span {
          position: relative;
          .line {
            position: absolute;
          }
        }
        cursor: pointer;
        // .line {
        //   position: absolute;
        //   left: 0;
        //   bottom: 0;
        // }
        &.actives {
          color: #ff644d;
          span {
            position: relative;
            .line {
              position: absolute;
              left: 0;
              right: 0;
              margin: 0 auto;
              bottom: -11px;
              width: 46px;
              height: 2px;
              background: #ff644d;
              border-radius: 1px;
            }
          }
        }
      }
    }
  }
}
</style>
