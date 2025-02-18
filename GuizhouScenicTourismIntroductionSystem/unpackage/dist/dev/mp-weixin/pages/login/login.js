"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      verifyCode: "",
      password: "",
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
        common_vendor.index.__f__("error", "at pages/login/login.vue:91", e);
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
     * 处理登录请求
     */
    async handleLogin() {
      if (!this.phone || !this.password || !this.verifyCode) {
        common_vendor.index.showToast({
          title: "请输入手机号和密码",
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
            action: "login",
            params: {
              phone: this.phone,
              verifyCode: this.verifyCode,
              password: this.password
            }
          }
        });
        if (res.result.code === 0) {
          common_vendor.index.setStorageSync("userInfo", res.result.data);
          common_vendor.index.showToast({
            title: "登录成功"
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "登录失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "登录失败，请稍后重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/login/login.vue:168", e);
      }
    },
    /**
     * 跳转到注册页面
     */
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: $data.phone,
    c: common_vendor.o(($event) => $data.phone = $event.detail.value),
    d: $data.verifyCode,
    e: common_vendor.o(($event) => $data.verifyCode = $event.detail.value),
    f: common_vendor.t($data.counting ? `${$data.countdown}s后重试` : "获取验证码"),
    g: $data.counting,
    h: common_vendor.o((...args) => $options.getVerifyCode && $options.getVerifyCode(...args)),
    i: $data.password,
    j: common_vendor.o(($event) => $data.password = $event.detail.value),
    k: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    l: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
