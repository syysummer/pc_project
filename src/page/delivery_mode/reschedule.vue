<template>
  <div class="reschedule_list">
    <div class="tab_nav">
      <div class="tab_border">
        <div class="tab-item" :class="{actives: $route.path.indexOf('reschedule_waiting') > -1}" @click="goWaiting">
          <span>{{reschedule.pending_review}}({{rescheduleNum.checkNum}})
            <div class="line"></div>
          </span>
        </div>
        <div class="tab-item" :class="{actives: $route.path.indexOf('reschedule_success') > -1}" @click="goPickUp">
          <span>{{reschedule.success_reassigned}}({{rescheduleNum.agreeNum}})
            <div class="line"></div>
          </span>
        </div>
        <div class="tab-item" :class="{actives: $route.path.indexOf('reschedule_refuse') > -1}" @click="goService">
          <span>{{reschedule.dismissed}}({{rescheduleNum.rejectNum}})
            <div class="line"></div>
          </span>
        </div>
        <!-- <div class="tab-item" :class="{actives: $route.path.indexOf('reschedule_waiting') > -1}" @click="goWaiting">
          <div class="line"></div>待审核(165)</div>
        <div class="tab-item" :class="{actives: $route.path.indexOf('reschedule_success') > -1}" @click="goPickUp">
          <div class="line"></div>改派成功(0)</div>
        <div class="tab-item" :class="{actives: $route.path.indexOf('reschedule_refuse') > -1}" @click="goService">
          <div class="line"></div>已驳回(0)</div>-->
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import vTitle from '../../components/v_title'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'schedule_list',
  data() {
    return {
      active_now: 1
    }
  },
  components: { vTitle },
  computed: {
    ...mapState(['rescheduleNum']),
    reschedule() {
      let reschedule = this.$t('reschedule')
      return reschedule
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(['updatePage']),
    goWaiting() {
      this.updatePage()
      this.$router.push('/reschedule/reschedule_waiting')
    },
    goPickUp() {
      this.updatePage()
      this.$router.push('/reschedule/reschedule_success')
    },
    goService() {
      this.updatePage()
      this.$router.push('/reschedule/reschedule_refuse')
    }
  }
}
</script>

<style scoped lang="scss">
.reschedule_list {
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
        position: relative;
        &::after {
          padding-right: 22px;
        }
        padding-right: 22px;
        margin: 18px 22px 12px 0;
        // margin: 18px 0 12px 21px;
        height: 100%;
        color: #333;
        line-height: 16px;
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
              bottom: -12px;
              width: 65px;
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
