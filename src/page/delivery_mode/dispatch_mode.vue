<template>
  <div class="dispatch_mode">
    <vTitle :title="dispatch_mode.title"></vTitle>
    <div class="mode_content">
      <div class="node_title">{{dispatch_mode.range}}</div>
      <div class="note">
        {{dispatch_mode.range_note}}
        <el-input v-model="range_num" size="mini" :placeholder="3"></el-input>
        {{dispatch_mode.range_note2}}
      </div>
      <div class="node_title">{{dispatch_mode.delivery_order}}</div>
      <div class="note">
        {{dispatch_mode.delivery_note}}
        <el-input v-model="delivery_num" :placeholder="5" size="mini"></el-input>
        {{dispatch_mode.delivery_note2}}
      </div>
      <div class="node_title">{{dispatch_mode.priority}}</div>
      <div class="note">
        {{dispatch_mode.priority_note}}
        <el-select v-model="priorityType" size="mini">
          <el-option :label="$t('rider_manage.all')" value=""></el-option>
          <el-option :label="dispatch_mode.full" value="1"></el-option>
          <el-option :label="dispatch_mode.part" value="2"></el-option>
        </el-select>
      </div>
      <div class="node_title">{{dispatch_mode.duration}}</div>
      <div class="note">
        {{dispatch_mode.duration_note}}
        <el-input v-model="duration_num" :placeholder="3" size="mini"></el-input>
        {{dispatch_mode.duration_note2}}
      </div>
      <div class="node_title">{{dispatch_mode.refuse}}</div>
      <div class="note">{{dispatch_mode.refuse_note}}</div>
    </div>
    <div class="submits">
      <el-button @click="submit" type="warning" size="small">{{dispatch_mode.submit}}</el-button>
    </div>
  </div>
</template>
<script>
import vTitle from "../../components/v_title";
export default {
  name: "dispatch_mode",
  data() {
    return {
      range_num: "",
      delivery_num: "",
      priorityType: "",
      duration_num: ""
    };
  },
  components: { vTitle },
  computed: {
    dispatch_mode() {
      let dispatch_mode = this.$t("dispatch_mode");
      return dispatch_mode;
    }
  },
  methods: {
    submit () {
      
    }
  }
};
</script>
<style scoped lang="scss">
.dispatch_mode {
  background: #fff;
  height: 83vh;
  .mode_content {
    padding: 25px 40px;
    .node_title {
      color: #435c77;
      font-weight: 600;
    }
    .note {
      display: flex;
      align-items: center;
      color: #666;
      padding: 3px 0 18px;
      .el-input {
        margin: 0 2px;
      }
    }
  }
  .submits {
    padding: 0 40px;
  }
}
</style>
