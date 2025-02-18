"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        avatar: "",
        nickname: "",
        phone: ""
      }
    };
  },
  onLoad() {
    this.loadUserInfo();
  },
  methods: {
    /**
     * 加载用户信息
     */
    loadUserInfo() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.formData = {
          avatar: userInfo.avatar || "",
          nickname: userInfo.nickname || "",
          phone: userInfo.phone || ""
        };
      }
    },
    /**
     * 处理选择头像
     */
    handleChooseAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          try {
            const uploadRes = await common_vendor.er.uploadFile({
              filePath: tempFilePath,
              cloudPath: `avatar/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`
            });
            this.formData.avatar = uploadRes.fileID;
          } catch (e) {
            common_vendor.index.showToast({
              title: "上传失败，请重试",
              icon: "none"
            });
            common_vendor.index.__f__("error", "at pages/user/edit.vue:100", e);
          } finally {
            common_vendor.index.hideLoading();
          }
        }
      });
    },
    /**
     * 处理保存
     */
    async handleSave() {
      if (!this.formData.nickname.trim()) {
        common_vendor.index.showToast({
          title: "请输入昵称",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_vendor.er.callFunction({
          name: "user-center",
          data: {
            action: "updateProfile",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              avatar: this.formData.avatar,
              nickname: this.formData.nickname
            }
          }
        });
        if (res.result.code === 0) {
          const userInfo = common_vendor.index.getStorageSync("userInfo");
          userInfo.avatar = this.formData.avatar;
          userInfo.nickname = this.formData.nickname;
          common_vendor.index.setStorageSync("userInfo", userInfo);
          common_vendor.index.showToast({
            title: "保存成功"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "保存失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "保存失败，请重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/user/edit.vue:158", e);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.formData.avatar || "/static/default-avatar.png",
    b: common_vendor.o((...args) => $options.handleChooseAvatar && $options.handleChooseAvatar(...args)),
    c: $data.formData.nickname,
    d: common_vendor.o(($event) => $data.formData.nickname = $event.detail.value),
    e: common_vendor.t($data.formData.phone),
    f: common_vendor.o((...args) => $options.handleSave && $options.handleSave(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/edit.js.map
