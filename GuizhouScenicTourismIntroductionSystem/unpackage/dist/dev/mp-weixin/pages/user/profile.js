"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null
    };
  },
  onShow() {
    if (!common_vendor.index.getStorageSync("userInfo")) {
      this.goToLogin();
    }
    this.loadUserInfo();
  },
  methods: {
    /**
     * 加载用户信息
     */
    loadUserInfo() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = userInfo;
      }
    },
    /**
     * 跳转到登录页面
     */
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    /**
     * 跳转到注册页面
     */
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    },
    /**
     * 处理编辑资料
     */
    handleEditProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/user/edit"
      });
    },
    /**
     * 跳转到我的收藏
     */
    goToMyCollections() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/user/collections"
      });
    },
    /**
     * 跳转到我的评价
     */
    goToMyReviews() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/user/reviews"
      });
    },
    /**
     * 跳转到我的订单
     */
    goToMyOrders() {
      if (!this.userInfo) {
        this.goToLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/user/orders"
      });
    },
    /**
     * 处理意见反馈
     */
    handleFeedback() {
      common_vendor.index.navigateTo({
        url: "/pages/feedback/create"
      });
    },
    /**
     * 处理关于我们
     */
    handleAbout() {
      common_vendor.index.navigateTo({
        url: "/pages/about/index"
      });
    },
    /**
     * 处理退出登录
     */
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            this.userInfo = null;
            common_vendor.index.showToast({
              title: "已退出登录"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo
  }, $data.userInfo ? {
    b: $data.userInfo.avatar || "/static/default-avatar.png",
    c: common_vendor.t($data.userInfo.nickname || $data.userInfo.phone),
    d: common_vendor.o((...args) => $options.handleEditProfile && $options.handleEditProfile(...args))
  } : {
    e: common_assets._imports_0$1,
    f: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args)),
    g: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  }, {
    h: common_vendor.o((...args) => $options.goToMyCollections && $options.goToMyCollections(...args)),
    i: common_vendor.o((...args) => $options.goToMyReviews && $options.goToMyReviews(...args)),
    j: common_vendor.o((...args) => $options.goToMyOrders && $options.goToMyOrders(...args)),
    k: common_vendor.o((...args) => $options.handleFeedback && $options.handleFeedback(...args)),
    l: common_vendor.o((...args) => $options.handleAbout && $options.handleAbout(...args)),
    m: $data.userInfo
  }, $data.userInfo ? {
    n: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/profile.js.map
