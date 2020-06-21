<template>
    <div class="public_box">
        <!-- <vTitle :title="evaluation_of_distribution_staff.title"></vTitle> -->
        <div class="evaluation_of_distribution_staff_box">
            <!-- 评价切换 -->
          <div class="switch_evaluation">
            <div class="user_eval" :class="{active_eval: eval==1}" @click="getEval(1)">{{evaluation_of_distribution_staff.user_eval}}</div>
            <div class="seller_eval" :class="{active_eval: eval==2}" @click="getEval(2)">{{evaluation_of_distribution_staff.seller_eval}}</div>
          </div>
          <div>
            <div class="comprehensive_score">
                <span>{{evaluation_of_distribution_staff.comprehensive_score}}：</span>
                <span class="score_num" v-if="eval==1">{{userScore}}</span>
                <span class="score_num" v-if="eval==2">{{sellerScore}}</span>
                <span>{{evaluation_of_distribution_staff.score}}</span>
            </div>
            <!-- 评分筛选 -->
            <div class="filters_box clearFloat">
                <div :class="{'filters_box_active': filters==0}" @click="changefilters(0)">
                    {{evaluation_of_distribution_staff.all}}（{{allScore || 0}}）
                </div>
                <div :class="{'filters_box_active': filters==1}" @click="changefilters(1)">
                    {{evaluation_of_distribution_staff.one}}（{{scoreList.scoreCount1 || 0}}）
                </div>
                <div :class="{'filters_box_active': filters==2}" @click="changefilters(2)">
                    {{evaluation_of_distribution_staff.two}}（{{scoreList.scoreCount2 || 0}}）
                </div>
                <div :class="{'filters_box_active': filters==3}" @click="changefilters(3)">
                    {{evaluation_of_distribution_staff.three}}（{{scoreList.scoreCount3 || 0}}）
                </div>
                <div :class="{'filters_box_active': filters==4}" @click="changefilters(4)">
                    {{evaluation_of_distribution_staff.fore}}（{{scoreList.scoreCount4 || 0}}）
                </div>
                <div :class="{'filters_box_active': filters==5}" @click="changefilters(5)">
                    {{evaluation_of_distribution_staff.five}}（{{scoreList.scoreCount5 || 0}}）
                </div>
            </div>

            <!-- 只看有评论的内容 -->
            <div class="only_has_content clearFloat">
                <el-checkbox v-model="checked" @change="inputCheck"> {{evaluation_of_distribution_staff.only_has_content}}</el-checkbox>
            </div>

            <div class="score_list_box" v-loading="is_loading">
                <!-- 列表数据 -->
                <div class="score_list clearFloat" v-for="(item, index) in commentList" :key="index">
                  <div class="list_header_img" v-if="item.isSellerAnonymous==1">
                        <img src="../../assets/images/lazy_default.jpg" />
                    </div>
                    <div class="list_header_img" v-else>
                        <img :src="item.logoPhoto || photoImg" />
                    </div>
                    <div class="list_body">
                        <div class="username_box clearFloat" v-if="eval == 1">
                            <div>
                                {{item.userName}}
                            </div>
                            <div>
                                {{formatDateTime(item.time)}}
                            </div>
                        </div>
                        <div class="shop_name clearFloat">
                            <div class="list_body_titles">
                                {{evaluation_of_distribution_staff.shop_name}}：
                            </div>
                            <div :class="{list_body_contents: eval==1, list_body_contentses: eval==2}" v-if="item.isSellerAnonymous==1">
                                {{evaluation_of_distribution_staff.eval}}
                            </div>
                            <div :class="{list_body_contents: eval==1, list_body_contentses: eval==2}" v-else>
                                {{item.sellerName}}
                            </div>
                            <div class="sellerTime" v-if="eval == 2">
                                {{formatDateTime(item.sellerCommentDate)}}
                            </div>
                        </div>
                        <div class="shop_score clearFloat">
                            <div class="list_body_titles" v-if="lang=='zh'">
                                评&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分：
                            </div>
                            <div class="list_body_titles" v-if="lang=='en'">
                                {{evaluation_of_distribution_staff.shop_score}}：
                            </div>
                            <div class="list_body_contents">
                                <div class="block">
                                    <el-rate v-model="item.score" allow-half disabled :colors="['#FF3633', '#FF3633', '#FF3633']"></el-rate>
                                </div>
                            </div>
                        </div>
                        <div class="score_content clearFloat">
                            <div class="list_body_titles">
                                {{evaluation_of_distribution_staff.score_content}}：
                            </div>
                            <div class="list_body_contents">
                                {{item.desc}}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- 分页 -->
            <div class="page">
              <el-pagination background layout="prev, pager, next" :total="total" :current-page="parseInt(currentPage)" :page-size="showCount" @current-change="changePage"></el-pagination>
            </div>
            <div class="back_btn_box">
                <span class="back_btn" @click='back_btn_fn'>
                    {{evaluation_of_distribution_staff.back}}
                </span>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import vTitle from "../../components/v_title.vue";
// 引入英文css样式表
import { setCookie, getCookie, removeCookie } from "../../utils/cookies";
import { formatDateTime } from "../../utils/index";
import photoImg from "../../assets/images/lazy_default.jpg";
import store from "../../store";
let current_language = getCookie("lang");
if (current_language == "en") {
  require("../../assets/css/evaluation_of_distribution_staff_en.css");
}
export default {
  name: "evaluation_of_distribution_staff",
  data() {
    return {
      photoImg,
      lang: "",
      filters: "",
      scores_num: 3,
      eval: 1,
      currentPage: 1,
      currentPages: 1,
      showCount: 7,
      total: 0,
      checked: false,
      desc: "",
      commentList: [],
      scoreList: {},
      userScore: "",
      sellerScore: "",
      allScore: 0,
      loading: false,
      is_loading: false
    };
  },
  components: {
    vTitle
  },
  computed: {
    evaluation_of_distribution_staff() {
      let evaluation_of_distribution_staff = this.$t(
        "evaluation_of_distribution_staff"
      );
      return evaluation_of_distribution_staff;
    }
  },
  created() {
    if (getCookie("lang") == "zh") {
      this.lang = "zh";
    } else if (getCookie("lang") == "en") {
      this.lang = "en";
    }
  },
  mounted() {
    this.eval = this.$route.query.eval;
    if (this.eval == 1) {
      this.getDeliveryCommentListPage();
    } else {
      this.getSellerCommentListPage();
    }
    this.userScore = this.$route.query.userScore;
    this.sellerScore = this.$route.query.sellerScore;
    // this.$nextTick(() => {
    //   document
    //     .getElementsByClassName("public_view")[0]
    //     .addEventListener("scroll", this.scrollHandler, true);
    // });
  },
  methods: {
    formatDateTime(time, type) {
      return formatDateTime(time, type);
    },
    getDeliveryCommentListPage() {
      this.is_loading = true;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.showCount,
        deliveryId: this.$route.query.id,
        desc: this.desc
      };
      if (this.filters == 0) {
        params.score = "";
      } else {
        params.score = this.filters;
      }
      store
        .dispatch("getDeliveryCommentListPage", params)
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.loading = true;
            this.is_loading = false;
            console.log(res.data.data.list, "list");
            res.data.data.list.forEach(item => {
              item.logoPhoto = item.profilePhoto;
            });
            res.data.data.scoreList.forEach(el => {
              if (el.score == 1) {
                this.scoreList.scoreCount1 = el.count;
              } else if (el.score == 2) {
                this.scoreList.scoreCount2 = el.count;
              } else if (el.score == 3) {
                this.scoreList.scoreCount3 = el.count;
              } else if (el.score == 4) {
                this.scoreList.scoreCount4 = el.count;
              } else if (el.score == 5) {
                this.scoreList.scoreCount5 = el.count;
              } else if (el.score == 0) {
                this.scoreList.scoreCount0 = el.count;
              }
              if (this.currentPages == 1) {
                this.allScore += parseFloat(el.count);
              }
            });
            this.commentList = res.data.data.list;
            this.total = res.data.data.totalCount;
            // this.scoreList = res.data.data.scoreList
            console.log("scoreList", this.scoreList);
            console.log("scoreList", this.allScore);
            // if (res.data.data.currentPage >= res.data.data.totalPage) {
            //   this.loading = false;
            //   document
            //     .getElementsByClassName("public_view")[0]
            //     .removeEventListener("scroll", this.scrollHandler);
            // } else {
            //   this.currentPage++;
            // }
          } else {
            this.$message.error(res.data.message);
            this.loading = false;
            this.is_loading = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.loading = false;
          this.is_loading = false;
        });
    },
    getSellerCommentListPage() {
      this.is_loading = true;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.showCount,
        deliveryId: this.$route.query.id,
        sellerCommentDesc: this.desc
      };
      if (this.filters == 0) {
        params.sellerCommentScore = "";
      } else {
        params.sellerCommentScore = this.filters;
      }
      store
        .dispatch("getSellerCommentListPage", params)
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.loading = true;
            this.is_loading = false;
            res.data.data.content.forEach(item => {
              item.logoPhoto = item.sellerLogo;
              item.score = item.sellerCommentScore;
              item.desc = item.sellerCommentDesc;
            });
            console.log(res.data.data.content, "content");
            res.data.data.scoreList.forEach(el => {
              if (el.score == 1) {
                this.scoreList.scoreCount1 = el.count;
              } else if (el.score == 2) {
                this.scoreList.scoreCount2 = el.count;
              } else if (el.score == 3) {
                this.scoreList.scoreCount3 = el.count;
              } else if (el.score == 4) {
                this.scoreList.scoreCount4 = el.count;
              } else if (el.score == 5) {
                this.scoreList.scoreCount5 = el.count;
              }
              if (this.currentPages == 1) {
                this.allScore += parseFloat(el.count);
              }
            });
            this.commentList = res.data.data.content;
            this.total = res.data.data.totalPage * this.showCount;
            // this.scoreList = res.data.data.scoreList
            console.log("scoreList33", this.allScore);
            // if (res.data.data.currentPage >= res.data.data.totalPage) {
            //   this.loading = false;
            //   document
            //     .getElementsByClassName("public_view")[0]
            //     .removeEventListener("scroll", this.scrollHandler);
            // } else {
            //   console.log("555555555");
            //   this.currentPage++;
            // }
          } else {
            this.$message.error(res.data.message);
            this.loading = false;
            this.is_loading = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.loading = false;
          this.is_loading = false;
        });
    },
    changefilters(num) {
      this.currentPage = 1;
      this.currentPages = 1;
      let filtersNum = this.filters;
      this.filters = num;
      if (this.eval == 1 && filtersNum != this.filters) {
        this.allScore = 0;
        this.scoreList = {};
        this.commentList = [];
        this.total = 0;
        this.getDeliveryCommentListPage();
      } else if (this.eval == 2 && filtersNum != this.filters) {
        this.allScore = 0;
        this.scoreList = {};
        this.commentList = [];
        this.total = 0;
        this.getSellerCommentListPage();
      }
    },
    inputCheck() {
      this.currentPage = 1;
      this.currentPages = 1;
      this.allScore = 0;
      this.scoreList = {};
      this.commentList = [];
      if (this.checked) {
        this.desc = 1;
      } else {
        this.desc = "";
      }
      console.log(this.checked);
      console.log("desc", this.desc);
      if (this.eval == 1) {
        this.getDeliveryCommentListPage();
      } else {
        this.getSellerCommentListPage();
      }
    },
    back_btn_fn() {
      history.go(-1);
    },
    getEval(num) {
      let evalNum = this.eval;
      this.eval = num;
      if (evalNum != this.eval) {
        this.filters = "";
      }
      if (this.eval == 1 && evalNum != this.eval) {
        this.currentPage = 1;
        this.currentPages = 1;
        this.allScore = 0;
        this.scoreList = {};
        this.commentList = [];
        this.total = 0;
        this.getDeliveryCommentListPage();
      } else if (this.eval == 2 && evalNum != this.eval) {
        this.currentPage = 1;
        this.currentPages = 1;
        this.allScore = 0;
        this.scoreList = {};
        this.commentList = [];
        this.total = 0;
        this.getSellerCommentListPage();
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.currentPages++;
      if (this.eval == 1) {
        this.getDeliveryCommentListPage();
      } else {
        this.getSellerCommentListPage();
      }
    }
    // scrollHandler() {
    //   if (!this.loading) {
    //     return;
    //   }
    //   this.loading = false;
    //   console.log("------------------");
    //   let clientHeight = document.getElementsByClassName("public_view")[0]
    //     .clientHeight;
    //   let scrollHeight = document.getElementsByClassName("public_view")[0]
    //     .scrollHeight;
    //   let scrollTop = document.getElementsByClassName("public_view")[0]
    //     .scrollTop;
    //   let distance = scrollHeight - clientHeight - scrollTop;
    //   console.log("distance", distance, scrollTop, clientHeight, scrollHeight);
    //   if (distance < 150) {
    //     console.log(111111111111111);
    //     // this.currentPage++;
    //     if (this.eval == 1) {
    //       this.getDeliveryCommentListPage();
    //     } else {
    //       this.getSellerCommentListPage();
    //     }
    //   }
    // }
  }
};
</script>

<style scoped>
.evaluation_of_distribution_staff_box {
  padding: 15px 35px;
}

.comprehensive_score {
  width: 100%;
  margin-bottom: 15px;
}

.comprehensive_score span {
  font-size: 14px;
  color: #6d6d6d;
}

.comprehensive_score .score_num {
  font-size: 24px;
  color: #ff3633;
}

.filters_box {
  border-bottom: 1px solid #ededed;
  margin-bottom: 15px;
}

.filters_box div {
  float: left;
  margin-right: 8px;
  font-size: 12px;
  color: #6d6d6d;
  padding: 0 5px 5px;
  cursor: pointer;
}

.filters_box .filters_box_active {
  border-bottom: 1px solid #ff3633;
  color: #ff3633;
}

.only_has_content {
  width: 100%;
  font-size: 12px;
  color: #868686;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.only_has_content input {
  margin-right: 2px;
}

.score_list_box {
  margin-bottom: 20px;
}

.score_list {
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ededed;
}

.back_btn_box {
  margin-top: 10px;
}

.list_header_img {
  float: left;
  width: 8%;
}

.list_header_img img {
  width: 100%;
  object-fit: cover;
  vertical-align: middle;
}

.list_body {
  float: right;
  width: 91%;
}

.username_box {
  width: 100%;
  margin-bottom: 5px;
}

.username_box div:first-child {
  float: left;
  color: 474747;
}

.username_box div:last-child {
  float: right;
  font-size: 12px;
  color: #aeaeae;
}

.shop_name,
.shop_score,
.score_content {
  font-size: 12px;
  color: #868686;
  padding-bottom: 5px;
  width: 100%;
  display: flex;
  align-items: center;
}

.list_body_titles {
  font-size: 12px;
  float: left;
  width: 8%;
}
.sellerTime {
  font-size: 12px;
  width: 15%;
}
.list_body_contents {
  font-size: 12px;
  float: left;
  width: 92%;
}
.list_body_contentses {
  font-size: 12px;
  float: left;
  width: 77%;
}
.back_btn {
  background: #44a4ff;
  border-radius: 5px;
  padding: 6px 20px;
  color: #ffffff;
  cursor: pointer;
}
.switch_evaluation {
  width: 300px;
  display: flex;
  height: 35px;
  border: 1px solid #9099a3;
  align-items: center;
  border-radius: 17px;
  color: #666;
  margin: 15px 0 25px;
}
.switch_evaluation div {
  height: 35px;
  line-height: 35px;
  flex: 1;
  text-align: center;
  cursor: pointer;
}
.switch_evaluation .user_eval {
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
.switch_evaluation .seller_eval {
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}
.active_eval {
  background: #435c77;
  color: #fff;
}
.public_box .page {
  margin: 20px 0 25px;
}
.public_box .page .el-pagination {
  text-align: center;
}

@media (min-width: 1200px) and (max-width: 1400px) {
  .list_body_titles {
    width: 10%;
  }
  .list_body_contents {
    width: 90%;
  }
  .sellerTime {
    width: 20%;
  }
  .list_body_contentses {
    width: 70%;
  }
}
@media screen and (max-width: 1199px) {
  .list_body_titles {
    width: 12%;
  }
  .list_body_contents {
    width: 88%;
  }
  .sellerTime {
    width: 23%;
  }
  .list_body_contentses {
    width: 65%;
  }
}
@media (min-width: 768px) and (max-width: 992px) {
  .list_body_titles {
    width: 13%;
  }
  .list_body_contents {
    width: 87%;
  }
}
</style>