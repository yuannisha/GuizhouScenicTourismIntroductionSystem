"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_date = require("../../utils/date.js");
const ReviewPopup = () => "../../components/review-popup/review-popup.js";
const BookingPopup = () => "../../components/booking-popup/booking-popup.js";
const _sfc_main = {
  components: {
    ReviewPopup,
    BookingPopup
  },
  data() {
    return {
      id: "",
      isCollected: false,
      showReview: false,
      showBooking: false,
      scenicDetail: {
        name: "",
        price: 0,
        location: "",
        images: [],
        tags: [],
        description: "",
        openingHours: [],
        traffic: [],
        tickets: [],
        score: 0,
        reviews: []
      }
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.loadScenicDetail();
    this.checkCollectionStatus();
  },
  methods: {
    /**
     * 加载景点详情
     */
    async loadScenicDetail() {
      try {
        const res = await common_vendor.er.callFunction({
          name: "scenic-center",
          data: {
            action: "getScenicDetail",
            params: {
              id: this.id,
              USERID: common_vendor.index.getStorageSync("userInfo")._id
            }
          }
        });
        if (res.result.code === 0) {
          this.scenicDetail = res.result.data;
          common_vendor.index.__f__("log", "at pages/scenic/detail.vue:192", "景点详情", this.scenicDetail);
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
        common_vendor.index.__f__("error", "at pages/scenic/detail.vue:204", e);
      }
    },
    /**
     * 检查收藏状态
     */
    async checkCollectionStatus() {
      try {
        const res = await common_vendor.er.callFunction({
          name: "scenic-center",
          data: {
            action: "checkCollection",
            params: {
              scenicId: this.id,
              USERID: common_vendor.index.getStorageSync("userInfo")._id
            }
          }
        });
        if (res.result.code === 0) {
          this.isCollected = res.result.data.isCollected;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/scenic/detail.vue:228", e);
      }
    },
    /**
     * 切换收藏状态
     */
    async toggleCollect() {
      try {
        const res = await common_vendor.er.callFunction({
          name: "scenic-center",
          data: {
            action: "toggleCollection",
            params: {
              scenicId: this.id,
              USERID: common_vendor.index.getStorageSync("userInfo")._id
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
        common_vendor.index.__f__("error", "at pages/scenic/detail.vue:265", e);
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
        title: this.scenicDetail.name,
        summary: this.scenicDetail.description,
        imageUrl: this.scenicDetail.images[0],
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/scenic/detail.vue:281", "success:" + JSON.stringify(res));
        },
        fail: function(err) {
          common_vendor.index.__f__("log", "at pages/scenic/detail.vue:284", "fail:" + JSON.stringify(err));
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
      this.loadScenicDetail();
    },
    /**
     * 显示预订弹窗
     */
    showBookingPopup() {
      if (!common_vendor.index.getStorageSync("userInfo")) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      this.showBooking = true;
    },
    /**
     * 隐藏预订弹窗
     */
    hideBookingPopup() {
      this.showBooking = false;
    },
    /**
     * 处理预订提交
     */
    handleBookingSubmit() {
      common_vendor.index.navigateTo({
        url: "/pages/user/bookings"
      });
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
  const _easycom_booking_popup2 = common_vendor.resolveComponent("booking-popup");
  (_easycom_review_popup2 + _easycom_booking_popup2)();
}
const _easycom_review_popup = () => "../../components/review-popup/review-popup.js";
const _easycom_booking_popup = () => "../../components/booking-popup/booking-popup.js";
if (!Math) {
  (_easycom_review_popup + _easycom_booking_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.scenicDetail.images, (item, index, i0) => {
      return {
        a: item,
        b: index
      };
    }),
    b: common_vendor.t($data.scenicDetail.name),
    c: common_vendor.t($data.scenicDetail.price),
    d: common_vendor.t($data.scenicDetail.location),
    e: common_vendor.f($data.scenicDetail.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    f: $data.scenicDetail.description,
    g: common_vendor.f($data.scenicDetail.openingHours, (item, index, i0) => {
      return {
        a: common_vendor.t(item.day),
        b: common_vendor.t(item.time),
        c: index
      };
    }),
    h: common_vendor.f($data.scenicDetail.traffic, (item, index, i0) => {
      return {
        a: common_vendor.t(item.type),
        b: common_vendor.t(item.description),
        c: index
      };
    }),
    i: common_vendor.f($data.scenicDetail.tickets, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.price),
        c: common_vendor.t(item.description),
        d: index
      };
    }),
    j: common_vendor.t($data.scenicDetail.score),
    k: common_vendor.f($data.scenicDetail.reviews, (item, index, i0) => {
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
    l: common_vendor.o((...args) => $options.showReviewPopup && $options.showReviewPopup(...args)),
    m: common_vendor.t($data.isCollected ? "❤️" : "🤍"),
    n: common_vendor.o((...args) => $options.toggleCollect && $options.toggleCollect(...args)),
    o: common_vendor.o((...args) => $options.handleShare && $options.handleShare(...args)),
    p: common_vendor.o((...args) => $options.showBookingPopup && $options.showBookingPopup(...args)),
    q: common_vendor.o($options.hideReviewPopup),
    r: common_vendor.o($options.handleReviewSubmit),
    s: common_vendor.p({
      show: $data.showReview,
      type: "scenic",
      targetId: $data.id
    }),
    t: common_vendor.o($options.hideBookingPopup),
    v: common_vendor.o($options.handleBookingSubmit),
    w: common_vendor.p({
      show: $data.showBooking,
      scenicId: $data.id,
      tickets: $data.scenicDetail.tickets
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scenic/detail.js.map
