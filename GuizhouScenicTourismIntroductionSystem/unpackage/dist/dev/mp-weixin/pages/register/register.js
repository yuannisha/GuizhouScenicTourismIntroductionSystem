"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      verifyCode: "",
      password: "",
      confirmPassword: "",
      counting: false,
      countdown: 60
    };
  },
  methods: {
    /**
     * 获取验证码
     */
    async getVerifyCode() {
      if (this.counting)
        return;
      if (!this.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_vendor.er.callFunction({
          name: "user-center",
          data: {
            action: "sendVerifyCode",
            params: {
              phone: this.phone
            }
          }
        });
        if (res.result.code === 0) {
          common_vendor.index.showToast({
            title: "验证码已发送"
          });
          this.startCountdown();
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "发送失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "发送失败，请稍后重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/register/register.vue:90", e);
      }
    },
    /**
     * 开始倒计时
     */
    startCountdown() {
      this.counting = true;
      this.countdown = 60;
      const timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.counting = false;
          clearInterval(timer);
        }
      }, 1e3);
    },
    /**
     * 处理注册请求
     */
    async handleRegister() {
      if (!this.phone || !this.verifyCode || !this.password || !this.confirmPassword) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (this.password !== this.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_vendor.er.callFunction({
          name: "user-center",
          data: {
            action: "register",
            params: {
              phone: this.phone,
              verifyCode: this.verifyCode,
              password: this.password
            }
          }
        });
        if (res.result.code === 0) {
          common_vendor.index.showToast({
            title: "注册成功"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "注册失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "注册失败，请稍后重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/register/register.vue:169", e);
      }
    },
    /**
     * 返回登录页面
     */
    goToLogin() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.phone,
    b: common_vendor.o(($event) => $data.phone = $event.detail.value),
    c: $data.verifyCode,
    d: common_vendor.o(($event) => $data.verifyCode = $event.detail.value),
    e: common_vendor.t($data.counting ? `${$data.countdown}s后重试` : "获取验证码"),
    f: $data.counting,
    g: common_vendor.o((...args) => $options.getVerifyCode && $options.getVerifyCode(...args)),
    h: $data.password,
    i: common_vendor.o(($event) => $data.password = $event.detail.value),
    j: $data.confirmPassword,
    k: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    l: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    m: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
