"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_date = require("../../utils/date.js");
const ReviewPopup = () => "../../components/review-popup/review-popup.js";
const _sfc_main = {
  components: {
    ReviewPopup
  },
  data() {
    return {
      id: "",
      isCollected: false,
      showReview: false,
      guideInfo: {
        name: "",
        description: "",
        content: "",
        cover: "",
        tags: [],
        views: 0,
        likes: 0,
        reviews: []
      }
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.loadGuideDetail();
    this.checkCollectionStatus();
  },
  methods: {
    /**
     * 加载攻略详情
     */
    async loadGuideDetail() {
      var _a;
      try {
        const res = await common_vendor.er.callFunction({
          name: "guide-center",
          data: {
            action: "getGuideDetail",
            params: {
              USERID: (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a._id,
              id: this.id
            }
          }
        });
        if (res.result.code === 0) {
          this.guideInfo = res.result.data;
          common_vendor.index.__f__("log", "at pages/guide/detail.vue:133", this.guideInfo);
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "加载失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/guide/detail.vue:145", e);
      }
    },
    /**
     * 检查收藏状态
     */
    async checkCollectionStatus() {
      var _a;
      try {
        const res = await common_vendor.er.callFunction({
          name: "guide-center",
          data: {
            action: "checkCollection",
            params: {
              USERID: (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a._id,
              guideId: this.id
            }
          }
        });
        if (res.result.code === 0) {
          this.isCollected = res.result.data.isCollected;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/guide/detail.vue:169", e);
      }
    },
    /**
     * 处理收藏
     */
    async handleCollect() {
      if (!common_vendor.index.getStorageSync("userInfo")) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      try {
        const res = await common_vendor.er.callFunction({
          name: "guide-center",
          data: {
            action: "toggleCollection",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              guideId: this.id
            }
          }
        });
        if (res.result.code === 0) {
          this.isCollected = !this.isCollected;
          common_vendor.index.showToast({
            title: this.isCollected ? "收藏成功" : "已取消收藏",
            icon: "none"
          });
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "操作失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/guide/detail.vue:213", e);
      }
    },
    /**
     * 处理分享
     */
    handleShare() {
      common_vendor.index.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        title: this.guideInfo.name,
        summary: this.guideInfo.description,
        imageUrl: this.guideInfo.cover,
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/guide/detail.vue:229", "success:" + JSON.stringify(res));
        },
        fail: function(err) {
          common_vendor.index.__f__("log", "at pages/guide/detail.vue:232", "fail:" + JSON.stringify(err));
        }
      });
    },
    /**
     * 预览图片
     */
    previewImage(images, current) {
      common_vendor.index.previewImage({
        urls: images,
        current: images[current]
      });
    },
    /**
     * 显示评论弹窗
     */
    showReviewPopup() {
      if (!common_vendor.index.getStorageSync("userInfo")) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      this.showReview = true;
    },
    /**
     * 隐藏评论弹窗
     */
    hideReviewPopup() {
      this.showReview = false;
    },
    /**
     * 处理评论提交
     */
    handleReviewSubmit() {
      this.loadGuideDetail();
    },
    /**
     * 格式化日期
     */
    formatDate(timestamp) {
      return utils_date.formatDate(timestamp);
    }
  }
};
if (!Array) {
  const _easycom_review_popup2 = common_vendor.resolveComponent("review-popup");
  _easycom_review_popup2();
}
const _easycom_review_popup = () => "../../components/review-popup/review-popup.js";
if (!Math) {
  _easycom_review_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.guideInfo.cover || "/static/default-cover.png",
    b: common_vendor.t($data.guideInfo.name),
    c: common_vendor.t($data.guideInfo.views),
    d: common_vendor.f($data.guideInfo.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    e: common_vendor.t($data.guideInfo.description),
    f: $data.guideInfo.content,
    g: common_vendor.f($data.guideInfo.reviews, (item, index, i0) => {
      return common_vendor.e({
        a: item.avatar,
        b: common_vendor.t(item.nickname),
        c: common_vendor.t(item.content),
        d: item.images && item.images.length
      }, item.images && item.images.length ? {
        e: common_vendor.f(item.images, (img, imgIndex, i1) => {
          return {
            a: imgIndex,
            b: img,
            c: common_vendor.o(($event) => $options.previewImage(item.images, imgIndex), imgIndex)
          };
        })
      } : {}, {
        f: common_vendor.t($options.formatDate(item.created_at)),
        g: index
      });
    }),
    h: common_vendor.o((...args) => $options.showReviewPopup && $options.showReviewPopup(...args)),
    i: common_vendor.t($data.isCollected ? "❤️" : "🤍"),
    j: common_vendor.o((...args) => $options.handleCollect && $options.handleCollect(...args)),
    k: common_vendor.o((...args) => $options.handleShare && $options.handleShare(...args)),
    l: common_vendor.o($options.hideReviewPopup),
    m: common_vendor.o($options.handleReviewSubmit),
    n: common_vendor.p({
      show: $data.showReview,
      type: "guide",
      targetId: $data.id
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/detail.js.map
