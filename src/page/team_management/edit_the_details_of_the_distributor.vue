<template>
  <div class="public_box">
    <!-- <vTitle :title="edit_distributor.title"></vTitle> -->
      <div class="edit_the_details_of_the_distributor_box">
        <el-form label-width="110px" :model="formLabelAlign" size="small">
          <el-form-item :label="edit_distributor.area_code">
            <el-select v-model="formLabelAlign.select" filterable>
              <el-option v-for="(item, index) in CountryJson.data" :key="index" :label="'+'+item.phoneCode+' '+item.countryName" :value="item.countryName"/>
                </el-select>
          </el-form-item>
          <el-form-item :label="edit_distributor.tel">
            <el-input v-model="formLabelAlign.region"></el-input>
          </el-form-item>
          <el-form-item :label="edit_distributor.pass">
            <el-input v-model="formLabelAlign.type"></el-input>
          </el-form-item>
          <el-form-item :label="edit_distributor.name">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item :label="edit_distributor.Reserve_payment">
            <el-input v-model="formLabelAlign.region"></el-input>
          </el-form-item>
          <el-form-item :label="edit_distributor.Num">
            <el-input v-model="formLabelAlign.type"></el-input>
          </el-form-item>
        </el-form>
        <div class="add_img">
          <div class="images">
            <div class="left">
              <div>{{edit_distributor.front}}: </div>
              <!-- <img src="../../assets/images/lazy_default.jpg" alt=""> -->
              <el-upload class="upImg" ref="file_list" :data="postData" action="https://up.qiniup.com" :limit="1" list-type="picture-card" :before-upload="uploadImg"
                :on-success="successUpload" :on-error="errorUpload" :on-exceed="removeUpload" :on-remove="handleRemove">
                <i class="el-icon-circle-plus-outline"></i>
              </el-upload>
            </div>
            <div class="right">
              <div>{{edit_distributor.behind}}: </div>
              <el-upload class="upImg" ref="file_list" :data="postData" action="https://up.qiniup.com" :limit="1" list-type="picture-card" :before-upload="uploadRightImg"
                :on-success="successRightUpload" :on-error="errorRightUpload" :on-exceed="removeRightUpload" :on-remove="handleRightRemove">
                <i class="el-icon-circle-plus-outline"></i>
              </el-upload>
            </div>
          </div>
          <div class="person">
            <div>{{edit_distributor.photo}}: </div>
            <!-- <img src="../../assets/images/login_logo.png" alt=""> -->
            <el-upload class="upImg" ref="file_list" :data="postData" action="https://img.hzxindakeji.com/" :limit="1" list-type="picture-card" :before-upload="uploadImg"
              :on-success="successUpload" :on-error="errorUpload" :on-exceed="removeUpload" :on-remove="handleRemove">
              <i class="el-icon-circle-plus-outline"></i>
            </el-upload>
          </div>
        <div class="btn">
          <el-button type="primary" size="small">{{edit_distributor.cancel}}</el-button>
          <el-button type="warning" size="small">{{edit_distributor.confirm}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vTitle from "../../components/v_title.vue";
import CountryJson from "../../assets/country_code/country_zh.json";
import CountryJsons from "../../assets/country_code/country_en.json";
import { getCookie } from "../../utils/cookies";
import store from "../../store";
export default {
  name: "edit_the_details_of_the_distributor",
  data() {
    return {
      CountryJson,
      formLabelAlign: {
        select: `+63 ${this.$t("edit_distributor.country")}`,
        region: "",
        type: "",
        name: ""
      },
      postData: {
        token: ""
      },
      imagelist: [],
      hash: ""
    };
  },
  components: {
    vTitle
  },
  computed: {
    globalCode() {
      let globalCode = 0;
      let { select, CountryJson } = this;
      let list = CountryJson.data;
      list.forEach(item => {
        if (item.countryName === select) globalCode = item.phoneCode;
      });
      return globalCode || "63";
    },
    edit_distributor() {
      let edit_distributor = this.$t("edit_distributor");
      return edit_distributor;
    }
  },
  created() {
    store.dispatch("qiniuTokenApi", {}).then(res => {
      this.postData.token = res.data.data;
      console.log(res.data);
    });
  },
  mounted() {
    let lang = getCookie("lang");
    if (lang == "zh") {
      this.CountryJson = CountryJson;
    } else {
      this.CountryJson = CountryJsons;
    }
  },
  methods: {
    removeUpload(file, fileList) {
      console.log(file, fileList);
    },
    handleRemove(file, fileList) {
      if (file.status == "success") {
        // fileList.splice(file, 1)
        console.log(fileList);
        if (fileList.length == 0) {
          setTimeout(() => {
            document.getElementsByClassName(
              "el-upload--picture-card"
            )[0].style.display =
              "inline-block";
          }, 300);
        }
      }
    },
    uploadImg(file) {
      console.log(file);
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.4)"
      });
      if (file) {
        loading.close();
      }
    },
    errorUpload(err, file, fileList) {
      console.log("111111111", err);
    },

    successUpload(response, file, fileList) {
        console.log(response)
      this.imagelist = fileList
      console.log('0000000000',file)
      this.hash = "";
      // console.log("response", response, "file", file, "fileList", fileList);
      fileList.forEach(el => {
        if (el.response) {
          this.hash += el.response.hash + ",";
        }
      });
      this.hash = this.hash.substring(0, this.hash.length - 1);
    //   if (file.status == "success") {
        // fileList.splice(file, 1)
        console.log(fileList);
        // if (fileList.length == 1) {
        //     document.getElementsByClassName(
        //       "el-upload--picture-card"
        //     )[0].style.display =
        //       "none";
        // } else {
        //     document.getElementsByClassName(
        //       "el-upload--picture-card"
        //     )[0].style.display =
        //       "inline-block";
        // }
    //   }
    },
    removeRightUpload(file, fileList) {
      console.log(file, fileList);
    },
    handleRightRemove(file, fileList) {
      if (file.status == "success") {
        // fileList.splice(file, 1)
        console.log(fileList);
        if (fileList.length == 0) {
          setTimeout(() => {
            document.getElementsByClassName(
              "el-upload--picture-card"
            )[0].style.display =
              "inline-block";
          }, 300);
        }
      }
    },
    uploadRightImg(file) {
      console.log(file);
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.4)"
      });
      if (file) {
        loading.close();
      }
    },
    errorRightUpload(err, file, fileList) {
      console.log("111111111", err);
    },

    successRightUpload(response, file, fileList) {
      this.hash = "";
      // console.log("response", response, "file", file, "fileList", fileList);
      fileList.forEach(el => {
        if (el.response) {
          this.hash += el.response.hash + ",";
        }
      });
      this.hash = this.hash.substring(0, this.hash.length - 1);
    //   if (file.status == "success") {
        // fileList.splice(file, 1)
        console.log(fileList);
        if (fileList.length == 1) {
            document.getElementsByClassName(
              "el-upload--picture-card"
            )[0].style.display =
              "none";
        } else {
            document.getElementsByClassName(
              "el-upload--picture-card"
            )[0].style.display =
              "inline-block";
        }
    //   }
    },
  }
};
</script>

<style scoped lang="scss">
.edit_the_details_of_the_distributor_box {
  margin: 25px 0px;
  .add_img {
    margin-left: 35px;
    padding-bottom: 15px;
    color: #606266;
    .images {
      height: 190px;
      min-width: 802px;
      margin-top: 10px;
      .left {
        float: left;
        width: 350px;
        margin-right: 75px;
        position: relative;
        .upImg {
          position: absolute;
          top: 0;
          left: 75px;
          .avatar {
            width: 278px;
            height: 178px;
          }
        }
        .flex-img {
            position: absolute;
            top: 0;
            left: 75px;
        }
        .is-success {
            img {
                width: 100%;
                height: 100%;
            }
        }
      }
      .right {
        float: left;
        width: 350px;
        position: relative;
        .upImg {
          position: absolute;
          top: 0;
          left: 75px;
          .avatar {
            width: 275px;
            height: 150px;
          }
        }
      }
    }
    .person {
      position: relative;
      .personImg {
        position: absolute;
        top: 0;
        left: 75px;
      }
    }
    .btn {
      margin: 200px 75px;
    }
  }
}
@media screen and (max-width: 1024px) {
  .edit_the_details_of_the_distributor_box {
    .images {
      height: 140px;
      .left {
        width: 275px;
        .avatar {
          width: 200px;
          height: 100px;
        }
      }
      .right {
        width: 275px;
        .avatar {
          width: 200px;
          height: 100px;
        }
      }
    }
  }
}
</style>