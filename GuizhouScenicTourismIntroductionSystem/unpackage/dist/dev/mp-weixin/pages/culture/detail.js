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
      cultureInfo: {
        name: "",
        description: "",
        content: "",
        images: [],
        tags: [],
        views: 0,
        reviews: []
      },
      isCollected: false,
      showReview: false
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.loadCultureDetail();
    this.checkCollectionStatus();
  },
  methods: {
    /**
     * 加载文化详情
     */
    async loadCultureDetail() {
      try {
        const res = await common_vendor.er.callFunction({
          name: "culture-center",
          data: {
            action: "getCultureDetail",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              id: this.id
            }
          }
        });
        if (res.result.code === 0) {
          this.cultureInfo = res.result.data;
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "加载失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "加载失败，请稍后重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/culture/detail.vue:143", e);
      }
    },
    /**
     * 检查收藏状态
     */
    async checkCollectionStatus() {
      try {
        const res = await common_vendor.er.callFunction({
          name: "culture-center",
          data: {
            action: "checkCollection",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              cultureId: this.id
            }
          }
        });
        if (res.result.code === 0) {
          this.isCollected = res.result.data.isCollected;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/culture/detail.vue:167", e);
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
          name: "culture-center",
          data: {
            action: "toggleCollection",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              cultureId: this.id
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
          title: "操作失败，请重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/culture/detail.vue:211", e);
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
        title: this.cultureInfo.name,
        summary: this.cultureInfo.description,
        imageUrl: this.cultureInfo.images[0],
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/culture/detail.vue:227", "success:" + JSON.stringify(res));
        },
        fail: function(err) {
          common_vendor.index.__f__("log", "at pages/culture/detail.vue:230", "fail:" + JSON.stringify(err));
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
      this.loadCultureDetail();
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
    a: common_vendor.f($data.cultureInfo.images, (image, index, i0) => {
      return {
        a: image,
        b: common_vendor.o(($event) => $options.previewImage(index), index),
        c: index
      };
    }),
    b: common_vendor.t($data.cultureInfo.name),
    c: common_vendor.t($data.cultureInfo.views),
    d: common_vendor.f($data.cultureInfo.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    e: common_vendor.t($data.cultureInfo.description),
    f: $data.cultureInfo.content,
    g: common_vendor.f($data.cultureInfo.reviews, (item, index, i0) => {
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
      type: "culture",
      targetId: $data.id
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/culture/detail.js.map
