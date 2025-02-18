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
      foodDetail: {
        name: "",
        price: 0,
        location: "",
        images: [],
        tags: [],
        description: "",
        score: 0,
        reviews: []
      }
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.loadFoodDetail();
    this.checkCollectionStatus();
  },
  methods: {
    /**
     * 加载美食详情
     */
    async loadFoodDetail() {
      try {
        const res = await common_vendor.er.callFunction({
          name: "food-center",
          data: {
            action: "getFoodDetail",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              id: this.id
            }
          }
        });
        if (res.result.code === 0) {
          this.foodDetail = res.result.data;
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
        common_vendor.index.__f__("error", "at pages/food/detail.vue:150", e);
      }
    },
    /**
     * 检查收藏状态
     */
    async checkCollectionStatus() {
      try {
        const res = await common_vendor.er.callFunction({
          name: "food-center",
          data: {
            action: "checkCollection",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              foodId: this.id
            }
          }
        });
        if (res.result.code === 0) {
          this.isCollected = res.result.data.isCollected;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/food/detail.vue:174", e);
      }
    },
    /**
     * 切换收藏状态
     */
    async toggleCollect() {
      try {
        const res = await common_vendor.er.callFunction({
          name: "food-center",
          data: {
            action: "toggleCollection",
            params: {
              USERID: common_vendor.index.getStorageSync("userInfo")._id,
              foodId: this.id
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
          title: "操作失败，请稍后重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/food/detail.vue:211", e);
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
        title: this.foodDetail.name,
        summary: this.foodDetail.description,
        imageUrl: this.foodDetail.images[0],
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/food/detail.vue:227", "success:" + JSON.stringify(res));
        },
        fail: function(err) {
          common_vendor.index.__f__("log", "at pages/food/detail.vue:230", "fail:" + JSON.stringify(err));
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
      this.loadFoodDetail();
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
    a: common_vendor.f($data.foodDetail.images, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage($data.foodDetail.images, index), index),
        c: index
      };
    }),
    b: common_vendor.t($data.foodDetail.name),
    c: common_vendor.t($data.foodDetail.price),
    d: common_vendor.t($data.foodDetail.location),
    e: common_vendor.f($data.foodDetail.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    f: $data.foodDetail.description,
    g: common_vendor.t($data.foodDetail.score),
    h: common_vendor.f($data.foodDetail.reviews, (item, index, i0) => {
      return common_vendor.e({
        a: item.avatar,
        b: common_vendor.t(item.nickname),
        c: common_vendor.t(item.score),
        d: common_vendor.t(item.content),
        e: item.images && item.images.length
      }, item.images && item.images.length ? {
        f: common_vendor.f(item.images, (img, imgIndex, i1) => {
          return {
            a: imgIndex,
            b: img,
            c: common_vendor.o(($event) => $options.previewImage(item.images, imgIndex), imgIndex)
          };
        })
      } : {}, {
        g: common_vendor.t($options.formatDate(item.created_at)),
        h: index
      });
    }),
    i: common_vendor.o((...args) => $options.showReviewPopup && $options.showReviewPopup(...args)),
    j: common_vendor.t($data.isCollected ? "❤️" : "🤍"),
    k: common_vendor.o((...args) => $options.toggleCollect && $options.toggleCollect(...args)),
    l: common_vendor.o((...args) => $options.handleShare && $options.handleShare(...args)),
    m: common_vendor.o($options.hideReviewPopup),
    n: common_vendor.o($options.handleReviewSubmit),
    o: common_vendor.p({
      show: $data.showReview,
      type: "food",
      targetId: $data.id
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/food/detail.js.map
