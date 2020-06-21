<template>
	<div class="container-home">
		<el-container>
			<!-- 左侧导航 -->
			<el-aside class="cannot_select" width="223px">
				<div class="logo-header">
					<div><img src="../assets/images/logo_white.png" alt=""></div>
					<div>{{$t('public_model.team_scheduling_backstage')}}</div>
				</div>
				<el-menu :default-active="activePath" class="el-menu-vertical-demo" router @open="handleOpen" @close="handleClose" background-color="#001529" text-color="#fff" active-text-color="#1890FF">
					<!-- 团队首页 -->
					<el-menu-item index="/team_home">
						<i class="iconfont icon-shouye"></i>
						<span>{{$t("public_model.team_home")}}</span>
					</el-menu-item>
					<!-- 团队管理 -->
					<el-submenu index="2">
						<template slot="title">
							<i class="iconfont icon-tuandui"></i>
							<span>{{$t("public_model.team_management")}}</span>
						</template>
						<el-menu-item index="/team_details">{{$t("public_model.team_details")}}</el-menu-item>
						<el-menu-item index="/distribution_management">{{$t("public_model.distribution_management")}}</el-menu-item>
						<el-menu-item index="/distribution_supervisor_monitoring">{{$t("public_model.distribution_supervisor_monitoring")}}</el-menu-item>
						<el-menu-item index="/cash_order_statistics">{{$t("public_model.cash_order_statistics")}}</el-menu-item>
					</el-submenu>
					<!-- 骑手入驻 -->
					<el-submenu index="3">
						<template slot="title">
							<i class="iconfont icon-peisong"></i>
							<span>{{$t("public_model.stationmaster")}}</span>
						</template>
						<el-menu-item index="/admission_management">{{$t("public_model.admission_management")}}</el-menu-item>
						<el-menu-item index="/no_admission_management">{{$t("public_model.no_admission_management")}}</el-menu-item>
					</el-submenu>
					<!-- 调度管理 -->
					<el-submenu index="4">
						<template slot="title">
							<i class="iconfont icon-tiaoduyinqing"></i>
							<span>{{$t("public_model.delivery_mode")}}</span>
						</template>
						<el-menu-item index="/reschedule">{{$t("public_model.change_order")}}</el-menu-item>
						<el-menu-item index="/schedule_list">{{$t("public_model.schedule_list")}}</el-menu-item>
					</el-submenu>
					<!-- 运营管理 -->
					<el-submenu index="5">
						<template slot="title">
							<i class="iconfont icon-yunyingguanli"></i>
							<span>{{$t("public_model.operation_management")}}</span>
						</template>
						<el-menu-item index="/edit_schedule">{{$t("public_model.new_schedule")}}</el-menu-item>
						<el-menu-item index="/schedule_lists">{{$t("public_model.schedule_lists")}}</el-menu-item>
						<el-menu-item index="/compensation">{{$t("public_model.delivery_set")}}</el-menu-item>
						<el-menu-item index="/salary_list">{{$t("public_model.salary_list")}}</el-menu-item>
					</el-submenu>
					<!-- 调度管理 -->
					<el-submenu index="6">
						<template slot="title">
							<i class="iconfont icon-caiwu_"></i>
							<span>{{$t("public_model.finance_management")}}</span>
						</template>
						<el-menu-item index="/balance_list">{{$t("public_model.account_balance")}}</el-menu-item>
						<!-- <el-menu-item index="/schedule_list">{{$t("public_model.schedule_list")}}</el-menu-item> -->
					</el-submenu>
					<!-- 订单管理 -->
					<!-- <el-submenu index="7">
            <template slot="title">
              <i class="iconfont icon-dingdan-blue-copy-copy"></i>
              <span>{{$t("public_model.order_management")}}</span>
            </template>
            <el-menu-item index="/history_order">{{$t("order_manager.history_order")}}</el-menu-item>
            <el-menu-item index="/no_admission_management">{{$t("public_model.no_admission_management")}}</el-menu-item>
          </el-submenu> -->
				</el-menu>
			</el-aside>
			<el-container>
				<!-- 右侧头部 -->
				<el-header class="header-dis" height="8vh">
					<div class="header-info cannot_select">
						<div class="lang-box">
							<div :class="{active_lang: language=='en'}" @click="saveLanguage('en')">EN</div>
							<div :class="{active_lang: language=='zh'}" @click="saveLanguage('zh')">中</div>
						</div>
						<div class="user-info">
							<div class="userImg">
								<img :src="masterInfo.profilePhoto || defaultImg" />
							</div>
							<el-dropdown @command="edit_pw">
								<span class="el-dropdown-link">
									{{masterInfo.userName}}
									<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="edit_pw">{{$t("public_model.edit_pw")}}</el-dropdown-item>
									<el-dropdown-item command="sign_out">{{$t("public_model.sign_out")}}</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</div>
				</el-header>
				<!-- 头部标题 -->
				<div>
					<el-breadcrumb class="app-breadcrumb" separator="">
						<transition-group name="breadcrumb">
							<el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.titles">
								<span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect cannot_select">{{item.meta.titles}}</span>
								<!-- <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link> -->
							</el-breadcrumb-item>
						</transition-group>
					</el-breadcrumb>
				</div>

				<!-- 右侧内容 -->
				<el-main style="background: #F1F5FA; height: 86.5vh; overflow-y: auto;">
					<router-view />
				</el-main>
			</el-container>
			<!-- 修改密码弹窗 -->
			<div class="popup" v-show="edit_pw_box"></div>
			<div class="edit_pw_box" v-show="edit_pw_box">
				<div class="edit_pw_body" @keyup.enter="updatePassword">
					<input type="password" :placeholder="$t('public_model.input_old_pw')" v-model="oldPassword" />
					<input type="password" :placeholder="$t('public_model.input_new_pw')" v-model="newPassword" />
					<input type="password" :placeholder="$t('public_model.re_input_new_pw')" v-model="prePassword" />
					<div class="submit" @click="updatePassword">{{$t('public_model.submit')}}</div>
				</div>
				<div class="close_btn" @click="close_btn">
					<img src="../assets/icons/close_btn.png" />
				</div>
			</div>
		</el-container>
	</div>
</template>
<script>
import { setCookie, getCookie } from '../utils/cookies'
import store from '../store'
import defaultImg from '../assets/icons/home_personal.png'
require('../assets/css/home_zh.css')
export default {
  data() {
    return {
      defaultImg,
      language: '',
      masterInfo: {},
      oldPassword: '',
      newPassword: '',
      prePassword: '',
      edit_pw_box: false,
      levelList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  mounted() {
    let lang = getCookie('lang')
    this.language = lang
    let masterInfo = localStorage.getItem('masterInfo')
    console.log('sssss', JSON.parse(masterInfo))
    if (masterInfo) {
      this.masterInfo = JSON.parse(masterInfo)
    }
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(this.$route.matched, '==========')
      const first = matched[0]
      if (first && first.name !== 'team_home') {
        // matched = [
        //   {
        //     path: "/team_home",
        //     meta: { titles: "团队首页" }
        //   }
        // ].concat(matched);
      }
      this.levelList = matched
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    saveLanguage(lang) {
      setCookie('lang', lang, 365)
      window.location.reload()
    },
    edit_pw(command) {
      if (command == 'edit_pw') {
        // 修改密码
        this.edit_pw_box = true
      } else if (command == 'sign_out') {
        console.log('退出登录')
        store
          .dispatch('logoutApi', {})
          .then(res => {
            console.log(res)
            if (res.data.code == 1) {
              this.$router.push('/login')
              localStorage.removeItem('masterInfo')
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    updatePassword() {
      let userPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if (!this.oldPassword) {
        this.$message.error(this.$t('public_model.pw_no_empty'))
        return
      }
      if (!this.newPassword) {
        this.$message.error(this.$t('public_model.new_pw_no_empty'))
        return
      }
      if (!userPass.test(this.newPassword)) {
        this.$message.error(this.$t('master_login.passHolders'))
        return
      }
      if (!this.prePassword) {
        this.$message.error(this.$t('public_model.new_pw_no_empty'))
        return
      }
      if (this.newPassword != this.prePassword) {
        this.$message.error(this.$t('public_model.inconsistent_pw'))
        return
      }
      this.$axios
        .post('/innerService/ChangeThePassword', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          cfmPassword: this.prePassword
        })
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success(res.data.message)
            localStorage.removeItem('masterInfo')
            this.close_btn()
            this.$router.push('/login')
          } else {
            this.$message.error(res.data.message)
          }
        })
    },
    close_btn() {
      this.edit_pw_box = false
    }
  },
  computed: {
    activePath() {
      if (
        this.$route.path.indexOf('reschedule') > -1 ||
        this.$route.path.indexOf('schedule_list') > -1 ||
        this.$route.path.indexOf('business_sche') > -1
      ) {
        return '/' + this.$route.path.split('/')[1]
      } else {
        return this.$route.path
      }
    }
  }
}
</script>
<style scoped lang="scss">
.container-home {
  .logo-header {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eb2825;
    color: #fff;
    height: 8vh;

    div {
      img {
        margin-bottom: -3px;
      }
    }
  }

  .el-menu-vertical-demo {
    height: 92vh;
    overflow-y: auto;

    .el-submenu__title i {
      color: #fff;
    }

    .el-menu-item i {
      color: #fff;
    }

    .el-submenu__title {
      .icon-tuandui {
        font-size: 17px;
      }

      .icon-tiaoduyinqing {
        font-size: 14px;
      }

      .icon-yunyingguanli {
        font-size: 12px;
      }

      .icon-caiwu_ {
        font-size: 12px;
      }
    }

    .is-active {
      .el-submenu__title {
        background: #002140 !important;
      }

      .el-submenu__title span,
      .el-submenu__title i {
        color: #ff3633;
      }

      .el-menu-item {
        background: #002140;
      }
    }
  }

  .app-breadcrumb {
    height: 5.5vh;
    line-height: 5.5vh;
    margin-left: 20px;

    .no-redirect {
      // font-size: 15px;
      color: #333333;
      font-weight: 600;
    }
  }

  .header-dis {
    display: flex;
    padding: 0;
    height: 8vh;

    .header-info {
      display: flex;
      width: 100%;
      padding: 6px 0;
      align-items: center;
      background: #001e4e;
      box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
      color: #fff;

      .lang-box {
        display: flex;
        flex: 1;
        margin-left: 50px;

        div {
          width: 30px;
          height: 30px;
          line-height: 28px;
          text-align: center;
          cursor: pointer;
        }

        .active_lang {
          border: 2px solid #fff;
          border-radius: 15px;
        }
      }

      .user-info {
        display: flex;
        align-items: center;
        margin-right: 20px;

        .el-dropdown {
          span {
            color: #fff;
          }
        }

        .userImg {
          width: 30px;
          margin-right: 5px;

          img {
            width: 100%;
            margin-bottom: -3px;
          }
        }
      }
    }
  }
}
</style>
