<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {};
    },
    created() {
      let vCodeId = sessionStorage.getItem("vCodeId");
      if (!vCodeId) {
        this.GenNonDuplicateID();
      }
    },
    methods: {
      GenNonDuplicateID() {
        // 生成不会重复的ID
        let idStr = Date.now().toString(36);
        idStr =
          "h5-" +
          idStr +
          Math.random()
          .toString(36)
          .substr(3);
        sessionStorage.setItem("vCodeId", idStr);
        console.log(idStr);
      }
    }
  };

</script>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-size: 16px;
  }

  /* 清除浮动 */

  .clearFloat:after {
    content: "";
    clear: both;
    display: block;
  }

  /* 单行省略 */

  .single_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 多行省略 */

  .more_hide {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  /* 禁止框选 */
  .cannot_select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }

  /* p标签文字自动换行 */
  p {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }

  a {
    text-decoration: none;
  }

  input {
    outline: none;
  }

  input:-moz-placeholder {
    color: #b0b0b0;
    opacity: 0.5;
  }

  ::-moz-placeholder {
    color: #b0b0b0;
    opacity: 0.5;
  }

  input:-ms-input-placeholder {
    color: #b0b0b0;
    opacity: 0.5;
  }

  input::-webkit-input-placeholder {
    color: #b0b0b0;
    opacity: 0.5;
  }

  @media (min-width: 1400px) {
    * {
      font-size: 16px;
    }
  }

  @media (min-width: 992px) and (max-width: 1400px) {
    * {
      font-size: 14px;
    }
  }

  @media (min-width: 768px) and (max-width: 992px) {
    * {
      font-size: 12px;
    }
  }

  /* message提示框宽度自适应 */
  .el-message {
    min-width: 10px !important;
  }

  /* 首页导出弹窗 */
  .team_home .el-dialog__header {
    border-bottom: 1px solid #ededed;
    text-align: center;
    padding: 10px 15px;
  }

  .team_home .el-dialog__headerbtn {
    top: 15px;
  }

  .team_home .el-dialog {
    width: 25%;
  }

  .team_home .export_popup .el-button.el-button--primary {
    color: #fff;
    background-color: #1890FF;
    border-color: #1890FF;
  }

  .team_home .export_popup .el-date-editor.el-input__inner {
    width: auto;
  }

  .el-date-editor .export_popup .el-range-input {
    width: auto;
  }

  .team_home .export_popup .el-dialog__body {
    padding: 20px 20px 0;
  }

  .team_home .export_popup .el-form-item {
    margin-bottom: 10px;
  }

  /* 首页日期选择 */
  .team_home .el-input__inner {
    height: 28px;
    line-height: 28px;
  }

  .team_home .el-input__icon {
    line-height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
  }

  .team_home .distribution_efficiency .el-date-editor.el-input,
  .team_home .el-date-editor.el-input__inner {
    width: 150px;
  }

  .team_home .leaderboard .delivery_order_detail .el-date-editor.el-input,
  .team_home .el-date-editor.el-input__inner {
    width: 290px;
  }

  .team_home .leaderboard .el-date-editor .el-range-input,
  .el-date-editor .el-range-separator {
    display: flex;
    align-items: center;
    padding: 0;
    display: flex;
    justify-content: center;
  }

  .team_home .leaderboard .el-input__icon.el-range__close-icon {
    position: absolute;
    right: 10px;
  }

  /* 首页排行榜 */
  .team_home .el-carousel__indicators {
    background: #ffffff;
    border-bottom: 1px solid #D9D9D9;
    width: 100%;
    bottom: 360px;
    height: 60px;
    display: flex;
    align-items: center;
    background: #ffffff;
  }

  .team_home .el-carousel__button {
    color: rgba(0, 0, 0, 0.65);
    opacity: 1;
    height: 59px;
  }

  .el-carousel__indicator.is-active button {
    color: #FF644D;
    opacity: 1;
    border-bottom: 2px solid #FF644D;
  }

  .team_home .el-carousel__item {
    background-color: #ffffff;
  }

</style>
