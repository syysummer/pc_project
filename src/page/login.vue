<template>
  <el-col :span="24">
    <div class="login" @keyup.enter="getUser">
      <div class="language-box">
        <div :class="{act:language=='en'}" @click="saveLanguage('en')">EN</div>
        <div :class="{act:language=='zh'}" @click="saveLanguage('zh')">中</div>
      </div>
      <div class="bg_img">
        <img src="../assets/images/login_pic.png" />
      </div>
      <div class="login_form">
        <h1>
          <img src="../assets/images/login_logo.png" alt="">
          <span>{{master_login.title}}</span>
        </h1>
        <div class="input">
          <div><img src="../assets/icons/login_username.png" alt=""></div>
          <input class="name" v-model="userName" :placeholder="master_login.userName" autocomplete="off" />
        </div>
        <div class="input">
          <div class="pass"><img src="../assets/icons/login_password.png" alt=""></div>
          <input class="name" v-model="password" :placeholder="master_login.password" type="password" autocomplete="off" />
        </div>
        <div class="input">
          <input class="name" v-model="vCode" :placeholder="master_login.mCode" type="text" autocomplete="off" />
          <div class="codeImg" @click="getImgCode"><img :src="urlImg" alt=""></div>
        </div>
        <div class="btn" @click="getUser" v-if="!is_loading">
          {{master_login.login}}
        </div>
        <div class="btn loading" v-else>
          <i class="el-icon-loading"></i>
        </div>
      </div>
    </div>
  </el-col>
</template>
<script>
import store from '../store'
import { getCookie, setCookie } from '../utils/cookies'
export default {
  name: 'login',
  data() {
    return {
      urlImg: '',
      userName: '',
      password: '',
      vCode: '',
      userInfo: {},
      is_loading: false,
      language: getCookie('lang')
    }
  },
  computed: {
    master_login() {
      let master_login = this.$t('master_login')
      return master_login
    }
  },
  mounted() {
    this.getImgCode()
  },
  methods: {
    getImgCode() {
      let vCodeId = sessionStorage.getItem('vCodeId')
      // let params = {
      //   clientType: 8,
      //   vCodeId: vCodeId
      // }
      store
        .dispatch('getCode', {
          clientType: 8,
          vCodeId: vCodeId
        })
        .then(res => {
          console.log(res)
          this.urlImg = res
        })
        .catch(err => {})
    },
    getUser() {
      let user = /^[a-zA-Z]{1}[0-9A-Za-z]{5,13}$/
      let userPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      let vCodeId = sessionStorage.getItem('vCodeId')
      if (!this.userName) {
        this.$message.warning(this.$t('master_login.userHolder'))
        return
      } else if (!user.test(this.userName)) {
        this.$message.warning(this.$t('master_login.userHolders'))
        return
      } else if (!this.password) {
        this.$message.warning(this.$t('master_login.passHolder'))
        return
      } else if (!userPass.test(this.password)) {
        this.$message.warning(this.$t('master_login.passHolders'))
        return false
      } else if (!this.vCode) {
        this.$message.warning(this.$t('master_login.mCodeHolder'))
        return
      }
      this.is_loading = true
      store
        .dispatch('loginApi', {
          clientType: 8,
          vCodeId: vCodeId,
          loginType: 1,
          userName: this.userName,
          password: this.password,
          vCode: this.vCode
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.is_loading = false
            this.$message.success(res.data.message)
            console.log('this', res.data.data.userObj)
            this.userInfo = JSON.stringify(res.data.data.userObj)
            localStorage.setItem('masterInfo', this.userInfo)
            this.$router.push('/')
          } else {
            this.$message.error(res.data.message)
            this.getImgCode()
            this.is_loading = false
          }
        })
        .catch(err => {})
    },
    saveLanguage(lang) {
      setCookie('lang', lang, 365)
      window.location.reload()
    }
  }
}
</script>
<style scoped lang='scss'>
.el-col {
  height: 100vh;
  background: #fff;
}
.login {
  width: 65%;
  margin: 25vh auto;
  .language-box {
    float: right;
    display: flex;
    color: #5a5a5a;
    margin: -150px 0 0 0;
    div {
      width: 35px;
      height: 35px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      margin: 0 0 0 8px;
    }
    .act {
      border-radius: 50%;
      border: 2px solid #ff644d;
      color: #ff644d;
    }
  }
  .bg_img {
    float: left;
    width: 50%;
    img {
      width: 100%;
      margin-top: 70px;
    }
  }
  .login_form {
    float: left;
    width: 42%;
    box-shadow: 0 0 3px #b9b9b9;
    margin-left: 8%;
    padding: 30px 40px;
    h1 {
      height: 57px;
      line-height: 57px;
      text-align: center;
      img {
        width: 35px;
        margin-bottom: -17px;
      }
      span {
        display: inline-block;
        font-size: 0.17rem;
        color: #5a5a5a;
      }
    }
    .input {
      border: 1px solid #f1f1f1;
      margin-top: 0.2rem;
      width: 100%;
      display: flex;
      align-items: center;
      div {
        display: inline;
        img {
          width: 24px;
          margin-bottom: -6px;
          margin-left: 10px;
        }
      }
      .name {
        height: 0.3rem;
        margin-top: 1px;
        font-size: 16px;
        border: none;
        margin-left: 5px;
        width: 77%;
      }
      .codeImg {
        width: 23%;
        img {
          width: 100%;
          margin-bottom: -6px;
          margin-left: 0;
        }
      }
      .pass {
        img {
          width: 21px;
          margin-bottom: -3px;
          margin-left: 10px;
          margin-right: 3px;
        }
      }
    }
  }
  .btn {
    width: 100%;
    height: 0.3rem;
    margin-top: 0.2rem;
    background: #ff644d;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }
}
@media screen and (max-width: 1110px) {
  .el-col {
    min-height: 780px;
  }
  .login .login_form .input .name {
    width: 77%;
    font-size: 14px;
  }
  .login .login_form .input div img {
    width: 20px;
    margin-bottom: -2px;
  }
  .login .login_form .input .pass img {
    width: 17px;
    margin-bottom: -4px;
    margin-right: 2px;
  }
}
</style>
