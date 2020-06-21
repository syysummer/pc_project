<template>
  <div class="compensation_container">
    <div class="container_km" v-for="(item, index) in elementList" :key="index">
      <div class="delivery_km" v-if="index == 0">
        <div class="list">
          <div>{{$t("compensation.delivery_km")}}：</div>
          <div>
            <input v-model="item.deliveryKm" type="number" autocomplete="off" title=" " :placeholder="$t('compensation.km_place')" />
            <span>km</span>
          </div>
        </div>
        <div class="list">
          <div>{{$t("compensation.time_now")}}：</div>
          <div>
            <input v-model="item.maxTime" type="number" autocomplete="off" title=" " placeholder="" />
            <span>min</span>
          </div>
        </div>
        <div class="list">
          <div>{{$t("compensation.warning_time")}}：</div>
          <div>
            <input v-model="item.warnTime" type="number" autocomplete="off" title=" " :placeholder="$t('')" />
            <span>min</span>
          </div>
        </div>
        <el-button type="text" @click="addKm">{{$t("compensation.add")}}</el-button>
      </div>
      <div class="add" v-if="index > 0">
        <div>{{$t("salary_list.di")}}{{chinanum(`${index}`)}} {{$t("compensation.slot")}}</div>
        <div class="add_km">
          <div class="list">
            <div>{{$t("compensation.delivery_km")}}：</div>
            <div>
              <input v-model="item.deliveryKm" type="number" autocomplete="off" title=" " :placeholder="$t('compensation.km_place')" />
              <span>km</span>
            </div>
          </div>
          <div class="list">
            <div>{{$t("compensation.time_now")}} ：</div>
            <div>
              <input v-model="item.maxTime" type="number" autocomplete="off" title=" " placeholder="" />
              <span>min</span>
            </div>
          </div>
          <div class="list">
            <div>{{$t("compensation.warning_time")}}：</div>
            <div>
              <input v-model="item.warnTime" type="number" autocomplete="off" title=" " :placeholder="$t('')" />
              <span>min</span>
            </div>
          </div>
          <el-button type="text" @click="deleteKm(index)">{{$t("compensation.delete")}}</el-button>
        </div>
      </div>
    </div>
    <div class="limit_cancel">
      <div class="title">{{$t("compensation.cancel_limit")}}: </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item :label="$t('compensation.day')">
          <el-input v-model="formInline.dayCancelNumber" type="number" title=" " :placeholder="$t('compensation.num_place')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('compensation.week')">
          <el-input v-model="formInline.weekCancelNumber" type="number" title=" " :placeholder="$t('compensation.num_place')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('compensation.mouth')">
          <el-input v-model="formInline.monthCancelNumber" type="number" title=" " :placeholder="$t('compensation.num_place')"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="limit_cancels">
      <div class="title">{{$t("compensation.cancel_time")}}：</div>
      <div class="list">
        <div>{{$t("compensation.advance")}}</div>
        <div>
          <input type="number" title=" " autocomplete="off" v-model="beforeCancelTime" />
          <span>H</span>
        </div>
        <div>{{$t("compensation.cancel")}}</div>
      </div>
    </div>
    <div class="limit_cancels">
      <div class="title">{{$t("compensation.not_delivery")}}：</div>
      <div class="list">
        <el-input v-model="deliveryCancelNumber" type="number" title=" " :placeholder="$t('compensation.cancel_num')" size="small"></el-input>
      </div>
    </div>
    <div class="limit_cancels">
      <div class="title">{{$t("compensation.reward")}}: </div>
      <div class="time_set">
        <div class="line_for" v-for="(item, index) in rewardList" :key="index">
          <div class="line" v-if="index==0">
            <div>
              {{$t("compensation.advance_arrived")}}&nbsp;
              <div :class="{line_box: !isEnglish, line_box_en: isEnglish}">
                <div class="boxes">
                  <input type="number" title=" " autocomplete="off" v-model="item.advanceTime" />
                  <div>min</div>
                </div>
              </div>
            </div>
            <div>
              {{$t("compensation.reward_delivery")}}&nbsp;
              <div :class="{line_box: !isEnglish, line_box_en: isEnglish}">
                <div class="boxes">
                  <input type="number" title=" " autocomplete="off" v-model="item.percent" :placeholder="$t('compensation.percentage')" />
                  <div>%</div>
                </div>
                &nbsp;{{$t("compensation.reward_deliverys")}}
              </div>
            </div>
            <el-button type="text" @click="addReward">{{$t("compensation.add")}}</el-button>
          </div>
          <div class="notes" v-if="index==0">{{$t("compensation.notes1")}}</div>
          <div class="lines" v-if="index > 0">
            <div>
              {{$t("compensation.advance_arrived")}}&nbsp;
              <div :class="{line_box: !isEnglish, line_box_en: isEnglish}">
                <div class="boxes">
                  <input type="number" title=" " autocomplete="off" v-model="item.advanceTime" />
                  <div>min</div>
                </div>
              </div>
            </div>
            <div>
              {{$t("compensation.reward_delivery")}}&nbsp;
              <div :class="{line_box: !isEnglish, line_box_en: isEnglish}">
                <div class="boxes">
                  <input type="number" title=" " autocomplete="off" v-model="item.percent" :placeholder="$t('compensation.percentage')" />
                  <div>%</div>
                </div>
                &nbsp;{{$t("compensation.reward_deliverys")}}
              </div>
            </div>
            <el-button type="text" @click="deleteReward(index)">{{$t("compensation.delete")}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="limit_cancels">
      <div class="title">{{$t("compensation.punish_set")}}: </div>
      <div class="time_set">
        <div class="line_for" v-for="(item, index) in punishList" :key="index">
          <div class="line" v-if="index==0">
            <div>
              {{$t("compensation.time_out")}}&nbsp;
              <div :class="{line_box: !isEnglish, line_box_en: isEnglish}">
                <div class="boxes">
                  <input type="number" title=" " autocomplete="off" v-model="item.beyondTime" />
                  <div>min</div>
                </div>
              </div>
            </div>
            <div>
              {{$t("compensation.delete_delivery")}}&nbsp;
              <div :class="{line_box: !isEnglish, line_box_en: isEnglish}">
                <div class="boxes">
                  <input type="number" title=" " autocomplete="off" v-model="item.percent" :placeholder="$t('compensation.percentage')" />
                  <div>%</div>
                </div>
                &nbsp;{{$t("compensation.delete_deliverys")}}
              </div>
            </div>
            <el-button type="text" @click="addPunish">{{$t("compensation.add")}}</el-button>
          </div>
          <div class="notes" v-if="index==0">{{$t("compensation.notes2")}}</div>
          <div class="lines" v-if="index > 0">
            <div>
              {{$t("compensation.time_out")}}&nbsp;
              <div :class="{line_box: !isEnglish, line_box_en: isEnglish}">
                <div class="boxes">
                  <input type="number" title=" " autocomplete="off" v-model="item.beyondTime" />
                  <div>min</div>
                </div>
              </div>
            </div>
            <div>
              {{$t("compensation.delete_delivery")}}&nbsp;
              <div :class="{line_box: !isEnglish, line_box_en: isEnglish}">
                <div class="boxes">
                  <input type="number" title=" " autocomplete="off" v-model="item.percent" :placeholder="$t('compensation.percentage')" />
                  <div>%</div>
                </div>
                &nbsp;{{$t("compensation.delete_deliverys")}}
              </div>
            </div>
            <el-button type="text" @click="deletePunish(index)">{{$t("compensation.delete")}}</el-button>
          </div>
        </div>
        <div class="button"><el-button type="primary" @click="submit">{{$t("compensation.submit")}}</el-button></div>
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center top="30vh" class="compensation_dialog">
      <span>{{$t("compensation.save")}}</span>
      <span slot="footer" class="dialog-footer">
        <span class="btn" @click="centerDialogVisible = false">{{$t("edit_distributor.cancel")}}</span>
        <span class="btns" @click="confirm">{{$t("edit_distributor.confirm")}}</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from "../../store";
import { getCookie } from "../../utils/cookies";
export default {
  data() {
    return {
      formInline: {
        dayCancelNumber: "",
        weekCancelNumber: "",
        monthCancelNumber: ""
      },
      beforeCancelTime: "",
      deliveryCancelNumber: "",
      elementList: [
        {
          deliveryKm: "",
          maxTime: "",
          warnTime: ""
        }
      ],
      rewardList: [
        {
          advanceTime: "",
          percent: ""
        }
      ],
      punishList: [
        {
          beyondTime: "",
          percent: ""
        }
      ],
      centerDialogVisible: false,
      isEnglish: false
    }
  },
  mounted() {
    let lang = getCookie("lang")
    if (lang=="en") {
      this.isEnglish = true
    } else {
      this.isEnglish = false
    }
    this.getDcDeliveryRuleInfo();
  },
  methods: {
    getDcDeliveryRuleInfo() {
      store
        .dispatch("getDcDeliveryRuleInfo", {})
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.deliveryCancelNumber = res.data.data.deliveryCancelNumber;
            this.beforeCancelTime = res.data.data.beforeCancelTime;
            this.formInline.dayCancelNumber = res.data.data.dayCancelNumber;
            this.formInline.weekCancelNumber = res.data.data.weekCancelNumber;
            this.formInline.monthCancelNumber = res.data.data.monthCancelNumber;
            this.punishList = JSON.parse(res.data.data.punishRule);
            this.rewardList = JSON.parse(res.data.data.rewardRule);
            this.elementList = JSON.parse(res.data.data.deliveryRule);
            console.log(this.punishRule, 55555555555);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    chinanum(num) {
      let china
      if (getCookie('lang') == 'zh') {
        china = new Array(
          '一',
          '二',
          '三',
          '四',
          '五',
          '六',
          '七',
          '八',
          '九',
          '十',
          '十一',
          '十二'
        )
      } else {
        china = new Array(
          '1st',
          '2nd',
          '3rd',
          '4th',
          '5th',
          '6th',
          '7th',
          '8th',
          '9th',
          '10th',
          '11th',
          '12th'
        )
      }
      var arr = new Array();
      var english = num.split("");
      for (var i = 0; i < english.length; i++) {
        arr[i] = china[english[i]];
      }
      return arr.join("");
    },
    addKm() {
      if (this.elementList.length >= 10) {
        this.$message.warning(this.$t("salary_list.message4"));
        return;
      } 
      this.elementList.push({
        deliveryKm: "",
        maxTime: "",
        warnTime: ""
      });
      console.log(this.elementList, "--------");
    },
    deleteKm(index) {
      console.log(this.elementList, "================++");
      this.elementList.splice(index, 1);
    },
    addReward() {
      if (this.rewardList.length >= 10) {
        this.$message.warning(this.$t("salary_list.message4"));
        return;
      }
      this.rewardList.push({ advanceTime: "", percent: "" });
    },
    deleteReward(index) {
      this.rewardList.splice(index, 1);
    },
    addPunish() {
      if (this.punishList.length >= 10) {
        this.$message.warning(this.$t("salary_list.message4"));
        return;
      }
      this.punishList.push({ beyondTime: "", percent: "" });
    },
    deletePunish(index) {
      this.punishList.splice(index, 1);
    },
    submit() {
      let reg = /^[0-9]+$/;
      let value = /^\d+(\.\d{0,2})?$/;
      let flag = false,
        flags = false;
      this.elementList.forEach(item => {
        if (item.deliveryKm) {
          if (!value.test(item.deliveryKm)) {
            this.$message.error(this.$t("compensation.message1"));
            flag = true;
          }
        }
        if (item.maxTime) {
          if (!reg.test(item.maxTime)) {
            this.$message.error(this.$t("compensation.message2"));
            flag = true;
          }
        }
        if (item.warnTime) {
          if (!reg.test(item.warnTime)) {
            this.$message.error(this.$t("compensation.message2"));
            flag = true;
          }
        }
      });
      this.punishList.forEach(item => {
        if (item.beyondTime) {
          if (!reg.test(item.beyondTime)) {
            this.$message.error(this.$t("compensation.message2"));
            flag = true;
          }
        }
        if (item.percent) {
          if (!reg.test(item.percent)) {
            this.$message.error(this.$t("compensation.message3"));
            flag = true;
          }
        }
      });
      this.rewardList.forEach(item => {
        if (item.advanceTime) {
          if (!reg.test(item.advanceTime)) {
            this.$message.error(this.$t("compensation.message2"));
            flag = true;
          }
        }
        if (item.percent) {
          if (!reg.test(item.percent)) {
            this.$message.error(this.$t("compensation.message3"));
            flag = true;
          }
        }
      });
      if (flag) {
        return;
      }
      if (this.deliveryCancelNumber) {
        if (!reg.test(this.deliveryCancelNumber)) {
          this.$message.error(this.$t("compensation.message4"));
          return;
        }
      }
      if (this.beforeCancelTime) {
        if (!reg.test(this.beforeCancelTime)) {
          this.$message.error(this.$t("compensation.message2"));
          return;
        }
      }
      if (this.formInline.dayCancelNumber) {
        if (!reg.test(this.formInline.dayCancelNumber)) {
          this.$message.error(this.$t("compensation.message4"));
          return;
        }
      }
      if (this.formInline.weekCancelNumber) {
        if (!reg.test(this.formInline.weekCancelNumber)) {
          this.$message.error(this.$t("compensation.message4"));
          return;
        }
      }
      if (this.formInline.monthCancelNumber) {
        if (!reg.test(this.formInline.monthCancelNumber)) {
          this.$message.error(this.$t("compensation.message4"));
          return;
        }
      }
      if (this.formInline.dayCancelNumber && this.formInline.weekCancelNumber) {
        if (
          parseInt(this.formInline.dayCancelNumber) >=
          parseInt(this.formInline.weekCancelNumber)
        ) {
          this.$message.warning(this.$t("compensation.message5"));
          return;
        }
      }
      if (
        this.formInline.dayCancelNumber &&
        this.formInline.monthCancelNumber
      ) {
        if (
          parseInt(this.formInline.dayCancelNumber) >=
          parseInt(this.formInline.monthCancelNumber)
        ) {
          this.$message.warning(this.$t("compensation.message5"));
          return;
        }
      }
      if (
        this.formInline.weekCancelNumber &&
        this.formInline.monthCancelNumber
      ) {
        if (
          parseInt(this.formInline.weekCancelNumber) >=
          parseInt(this.formInline.monthCancelNumber)
        ) {
          this.$message.warning(this.$t("compensation.message5"));
          return;
        }
      }
      this.centerDialogVisible = true;
    },
    confirm() {
      store
        .dispatch("deliveryConfigure", {
          deliveryRule: JSON.stringify(this.elementList),
          rewardRule: JSON.stringify(this.rewardList),
          punishRule: JSON.stringify(this.punishList),
          dayCancelNumber: this.formInline.dayCancelNumber,
          weekCancelNumber: this.formInline.weekCancelNumber,
          monthCancelNumber: this.formInline.monthCancelNumber,
          beforeCancelTime: this.beforeCancelTime,
          deliveryCancelNumber: this.deliveryCancelNumber
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.$message.success(res.data.message);
            this.centerDialogVisible = false;
            this.getDcDeliveryRuleInfo();
          } else {
            this.centerDialogVisible = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.compensation_container {
  background: #ffffff;
  border-radius: 2px;
  margin-left: 20px;
  padding: 15px 12px;
  overflow-x: auto;
  .delivery_km {
    display: flex;
    align-items: center;
    min-width: 760px;
    .list {
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.85);
      div {
        font-size: 14px;
        &:nth-child(2) {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
          padding: 0 8px;
          margin-right: 23px;
        }
        span {
          color: #464646;
          font-size: 14px;
        }
      }
    }
  }
  .add {
    background: #fbfbfb;
    margin-left: 73px;
    padding: 3px 17px 10px;
    margin: 17px 0 20px 73px;
    min-width: 840px;
    max-width: 1000px;
    div {
      &:first-child {
        height: 30px;
        line-height: 30px;
      }
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
    .add_km {
      display: flex;
      align-items: center;
      .list {
        display: flex;
        align-items: center;
        div {
          &:nth-child(2) {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            margin-right: 23px;
            background: #ffffff;
          }
        }
      }
    }
  }
  .limit_cancel {
    display: flex;
    margin-top: 5px;
    min-width: 900px;
    .el-form {
      // min-width: 765px;
    }
    div {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .title {
      margin-top: 6px;
      margin-right: 12px;
      min-width: 100px;
    }
  }
  .limit_cancels {
    display: flex;
    margin-bottom: 20px;
    .el-form {
      min-width: 765px;
    }
    div {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .title {
      margin-top: 6px;
      margin-right: 12px;
      min-width: 100px;
    }
    .list {
      display: flex;
      align-items: center;
      div {
        &:nth-child(2) {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
          padding: 0 8px;
          margin: 0 10px;
        }
      }
    }
    .time_set {
      .line {
        display: flex;
        align-items: center;
        div {
          display: flex;
          align-items: center;
          .line_box {
            margin-right: 23px;
            margin-left: 5px;
          }
          .line_box_en {
            margin-right: 23px;
          }
          .box {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
          }
          .boxes {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            background: #ffffff;
          }
        }
      }
      .line_for {
        &:last-child {
          margin-bottom: 0;
        }
        margin-bottom: 15px;
      }
      .lines {
        display: flex;
        align-items: center;
        background: #fbfbfb;
        padding: 8px 30px 15px 8px;
        min-width: 640px;
        div {
          display: flex;
          align-items: center;
          .line_box {
            margin-right: 23px;
            margin-left: 5px;
          }
          .line_box_en {
            margin-right: 23px;
          }
          .box {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            background: #ffffff;
          }
          .boxes {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            background: #ffffff;
          }
        }
      }
      .button {
        margin-top: 35px;
      }
      .notes {
        font-size: 12px;
        color: #999999;
        margin-bottom: 12px;
      }
    }
  }
  input {
    border: none;
    font-size: 14px;
    width: 0.8rem;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
  .btn {
    display: inline-block;
    border: 1px solid #dcdfe6;
    padding: 5px 10px;
    color: #333;
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
  }
  .btns {
    display: inline-block;
    border: 1px solid #409eff;
    background-color: #409eff;
    padding: 5px 10px;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
