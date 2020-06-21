<template>
  <div class="salary_set_container">
    <div class="radio_work" v-if="!editNum">
      <span>{{$t("salary_list.type")}} ： </span>
      <!-- <el-radio-group> -->
        <el-radio v-model="resource" label="1">{{$t("salary_list.full")}}</el-radio>
        <el-radio v-model="resource" label="2">{{$t("salary_list.part")}}</el-radio>
      <!-- </el-radio-group> -->
    </div>
    <div class="radio_work" v-else>
      <span>{{$t("salary_list.type")}} ： </span>
      <span v-if="resource==2">{{$t("salary_list.part")}}</span>
      <span v-else>{{$t("salary_list.full")}}</span>
    </div>
    <div class="container_km" v-for="(item, index) in elementList" :key="index" v-loading="loading">
      <div class="delivery_km" v-if="index==0">
        <div class="lists">
          <div>{{$t("salary_list.select_time")}} ：</div>
          <div>
            <el-time-picker v-model="item.startTime" :clearable="false" format="HH:mm" value-format="HH:mm" :class="{noValue: noValue, hasValue: item.startTime}" :editable="false" :disabled="editNum==1" :picker-options="{ format:'HH:mm', maxTime:item.endTime }" :placeholder="$t('salary_list.select_time_place')" size="small">
            </el-time-picker>
            <span class="gray_line">—</span>
            <el-time-picker v-model="item.endTime" :clearable="false" format="HH:mm" value-format="HH:mm" :class="{noValue: noValue, hasValue: item.endTime}" :editable="false" :disabled="editNum==1" :picker-options="{ format:'HH:mm', minTime: item.startTime }" :placeholder="$t('salary_list.select_time_place')" size="small">
            </el-time-picker>
          </div>
        </div>
        <div class="list">
          <div>{{$t("salary_list.balance_m")}} ：</div>
          <div :class="{disableBtn: editNum==1, noValue: noValue, hasValue: item.salary}" class="btn_line">
            <input :disabled="editNum==1" v-model="item.salary" type="number" title=" " autocomplete="off" :placeholder="$t('salary_list.balance_place')" />
            <span>P</span>
          </div>
        </div>
        <el-button type="text" @click="addSalary" v-if="editNum!=1">{{$t("salary_list.add")}}</el-button>
      </div>
      <div class="add" v-if="index>0">
        <div>{{$t("salary_list.di")}}{{chinanum(`${index}`)}}{{$t("salary_list.slot")}}</div>
        <div class="add_km">
          <div class="lists">
            <div>
              <el-time-picker v-model="item.startTime" format="HH:mm" value-format="HH:mm" :clearable="false" :class="{noValue: noValue, hasValue: item.startTime}" :editable="false" :disabled="editNum==1" :picker-options="{format:'HH:mm'}" :placeholder="$t('salary_list.select_time_place')" size="small">
              </el-time-picker>
              <span class="gray_line">—</span>
              <el-time-picker v-model="item.endTime" format="HH:mm" value-format="HH:mm" :clearable="false" :class="{noValue: noValue, hasValue: item.endTime}" :editable="false" :disabled="editNum==1" :picker-options="{format:'HH:mm'}" :placeholder="$t('salary_list.select_time_place')" size="small">
              </el-time-picker>
            </div>
          </div>
          <div class="list">
            <div>{{$t("salary_list.balance_m")}} ：</div>
            <div :class="{disableBtn: editNum==1, noValue: noValue, hasValue: item.salary}" class="btn_line">
              <input :disabled="editNum==1" type="number" title=" " autocomplete="off" v-model="item.salary" :placeholder="$t('salary_list.balance_place')" />
              <span>P</span>
            </div>
          </div>
          <el-button type="text" @click="deleteSalary(index)" v-if="editNum!=1">{{$t("compensation.delete")}}</el-button>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" size="small" @click="submit" v-if="editNum!=1">{{$t("compensation.submit")}}</el-button>
      <el-button type="primary" size="small" @click="goBack" v-if="editNum==1">{{$t("evaluation_of_distribution_staff.back")}}</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { formatDateTime } from "../../utils";
import store from "../../store";
export default {
  data() {
    return {
      resource: "1",
      elementList: [
        {
          startTime: "",
          endTime: "",
          salary: ""
        }
      ],
      editNum: "",
      loading: false,
      noValue: false
      // maxTimes: ""
    };
  },
  computed: {
    ...mapState(["salary_partTime", "salary_fullTime"]),
    salary_time() {
      if (this.resource == "1") {
        return this.salary_partTime;
      } else {
        return this.salary_fullTime;
      }
    }
  },
  mounted() {
    this.resource = this.$route.query.id.toString();
    this.editNum = this.$route.query.edit;
    if (this.editNum) {
      this.getDeliverySalaryInfo();
    }
  },
  watch: {
    resource() {
      if (this.resource == "1") {
        this.getSalaryFullTime({ data: this.elementList });
      } else {
        this.getSalaryPartTime({ data: this.elementList });
      }
      this.elementList = this.salary_time;
      console.log(this.elementList, "@@@@@@@@@@@@");
    }
  },
  methods: {
    ...mapMutations(["getSalaryPartTime", "getSalaryFullTime"]),
    chinanum(num) {
      let china
      if (getCookie('lang') == 'zh') {
        china = new Array(
          "一",
          "二",
          "三",
          "四",
          "五",
          "六",
          "七",
          "八",
          "九",
          "十",
          "十一",
          "十二",
          "十三",
          "十四",
          "十五",
          "十六",
          "十七",
          "十八",
          "十九",
          "二十",
          "二十一",
          "二十二",
          "二十三",
          "二十四"
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
          '12th',
          '13th',
          '14th',
          '15th',
          '16th',
          '17th',
          '18th',
          '19th',
          '20th',
          '21st',
          '22th',
          '23th',
          '24th'
        )
      }
      var arr = new Array();
      var english = (num + ",").split(",");
      for (var i = 0; i < english.length; i++) {
        arr[i] = china[english[i]];
      }
      return arr.join("");
    },
    goBack() {
      this.$router.push({
        path: "/salary_list",
        query: { id: this.resource }
      });
    },
    maxTimes(index) {
      let time;
      if (this.elementList.length > 0) {
        let m =
          parseInt(this.elementList[index - 1].endTime.split(":")[1]) +
          parseInt(this.elementList[index - 1].endTime.split(":")[0]) * 60 -
          10;
        let h = parseInt(m / 60);
        if (h < 10) {
          h = "0" + h;
        }
        let lastM = m % 60;
        if (lastM < 10) {
          lastM = "0" + lastM;
        }
        time = h + ":" + lastM;
        console.log(time, "time");
      }
      return time;
    },
    getDeliverySalaryInfo() {
      this.loading = true;
      let resource;
      if (this.resource == 2) {
        resource = 0;
      } else {
        resource = 1;
      }
      store
        .dispatch("getDeliverySalaryInfo", {
          type: resource,
          id: this.$route.query.salaryId
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.loading = false;
            this.elementList = JSON.parse(res.data.data.salaryRule);
          } else {
            this.loading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
        });
    },
    addSalary() {
      this.noValue = false;
      if (this.elementList.length >= 24) {
        this.$message.warning(this.$t("salary_list.message2"));
        return;
      } else {
        this.elementList.push({
          startTime: "",
          endTime: "",
          salary: ""
        });
      }
    },
    deleteSalary(index) {
      this.elementList.splice(index, 1);
    },
    submit() {
      let flag = false,
        flags = false;
      let value = /^\d+(\.\d{0,2})?$/;
      this.elementList.forEach(item => {
        if (!item.startTime || !item.endTime || !item.salary) {
          flags = true;
        } else if (!value.test(item.salary)) {
          flag = true;
        }
      });
      if (flags) {
        this.$message.error(this.$t("salary_list.message1"));
        return;
      }
      if (flag) {
        this.$message.error(this.$t("salary_list.message3"));
        return;
      }
      for (let i = 0; i < this.elementList.length - 1; i++) {
        if (this.elementList[i].endTime < this.elementList[i].startTime) {
          this.$message.error(this.$t("salary_list.message5"));
          return;
        }
        if (this.elementList[i].endTime > this.elementList[i + 1].startTime) {
          this.$message.error(this.$t("salary_list.message6"));
          return;
        }
      }
      if (
        this.elementList[this.elementList.length - 1].endTime <
        this.elementList[this.elementList.length - 1].startTime
      ) {
        this.$message.error(this.$t("salary_list.message5"));
        return;
      }
      let elementList = JSON.stringify(this.elementList);
      let resource;
      if (this.resource == 2) {
        resource = 0;
      } else {
        resource = 1;
      }
      if (this.editNum) {
        store
          .dispatch("updateDeliverySalaryInfo", {
            type: resource,
            id: this.$route.query.salaryId,
            salaryRule: JSON.stringify(this.elementList)
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.$message.success(res.data.message);
              this.$router.replace({
                path: "/salary_list",
                query: { id: this.resource }
              });
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        store
          .dispatch("deliverySalaryConfigure", {
            deliveryType: resource,
            salaryRule: elementList
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.$message.success(res.data.message);
              this.elementList = [
                {
                  startTime: "",
                  endTime: "",
                  salary: ""
                }
              ];
              this.getSalaryFullTime({ data: this.elementList });
              this.getSalaryPartTime({ data: this.elementList });
              this.$router.replace({
                path: "/salary_list",
                query: { id: this.resource }
              });
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.salary_set_container {
  background: #ffffff;
  border-radius: 2px;
  margin-left: 20px;
  padding: 15px 12px;
  overflow-x: auto;
  .radio_work {
    padding: 10px 20px 20px;
    color: #333;
    span {
      font-size: 14px;
    }
  }
  .delivery_km {
    display: flex;
    align-items: center;
    padding-left: 20px;
    min-width: 725px;
    .lists {
      display: flex;
      align-items: center;
      margin-right: 0.4rem;
      div {
        font-size: 14px;
      }
      .gray_line {
        color: #d9d9d9;
      }
    }
    .list {
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.85);
      div {
        font-size: 14px;
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
        span {
          color: #464646;
          font-size: 14px;
        }
      }
      .btn_line {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        padding: 0 8px;
        margin-right: 23px;
      }
      .disableBtn {
        border: 1px solid #e4e7ed !important;
        color: #c0c4cc;
        cursor: no-drop;
        input {
          color: #c0c4cc;
          cursor: no-drop;
        }
        span {
          color: #c0c4cc;
        }
      }
    }
  }
  .add {
    background: #fbfbfb;
    margin-left: 73px;
    padding: 3px 17px 10px;
    margin: 17px 0 20px 90px;
    min-width: 660px;
    max-width: 750px;
    div {
      &:first-child {
        height: 32px;
        line-height: 32px;
      }
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
    .add_km {
      display: flex;
      align-items: center;
      .lists {
        display: flex;
        align-items: center;
        margin-right: 0.4rem;
        div {
          font-size: 14px;
        }
        .gray_line {
          color: #d9d9d9;
        }
      }
      .list {
        display: flex;
        align-items: center;
        .btn_line {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          height: 32px;
          line-height: 32px;
          padding: 0 8px;
          margin-right: 23px;
          background: #fff;
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }

          input[type="number"] {
            -moz-appearance: textfield;
          }
        }
        .disableBtn {
          border: 1px solid #e4e7ed;
          color: #c0c4cc;
          cursor: no-drop;
          input {
            color: #c0c4cc;
            cursor: no-drop;
          }
          span {
            color: #c0c4cc;
          }
        }
      }
    }
  }
  input {
    border: none;
    font-size: 14px;
    width: 0.8rem;
    background: #fff;
  }
  .btn {
    margin: 30px 100px 10px;
  }
  .noValue {
    border-color: red !important;
  }
  .hasValue {
    border-color: #d9d9d9 !important;
  }
}
</style>
