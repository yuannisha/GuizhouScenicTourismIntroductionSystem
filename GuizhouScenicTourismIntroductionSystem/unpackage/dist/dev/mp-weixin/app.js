"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/scenic/list.js";
  "./pages/scenic/detail.js";
  "./pages/user/profile.js";
  "./pages/user/edit.js";
  "./pages/user/collections.js";
  "./pages/user/reviews.js";
  "./pages/user/orders.js";
  "./pages/food/list.js";
  "./pages/food/detail.js";
  "./pages/culture/list.js";
  "./pages/culture/detail.js";
  "./pages/guide/list.js";
  "./pages/guide/detail.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
