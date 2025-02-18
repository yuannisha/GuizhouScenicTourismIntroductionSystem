"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "review-popup",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      content: "",
      images: [],
      score: 5,
      maxImages: 9
    };
  },
  methods: {
    /**
     * 处理评分变化
     */
    handleScoreChange(e) {
      this.score = Number((e.detail.value / 10).toFixed(1));
    },
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("close");
      this.content = "";
      this.images = [];
      this.score = 5;
    },
    /**
     * 选择图片
     */
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          try {
            const uploadTasks = res.tempFilePaths.map((path) => {
              return common_vendor.er.uploadFile({
                filePath: path,
                cloudPath: `review/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`
              });
            });
            const results = await Promise.all(uploadTasks);
            this.images = [...this.images, ...results.map((item) => item.fileID)];
          } catch (e) {
            common_vendor.index.showToast({
              title: "上传失败",
              icon: "none"
            });
          } finally {
            common_vendor.index.hideLoading();
          }
        }
      });
    },
    /**
     * 预览图片
     */
    previewImage(index) {
      common_vendor.index.previewImage({
        urls: this.images,
        current: this.images[index]
      });
    },
    /**
     * 提交评论
     */
    async handleSubmit() {
      if (!this.content.trim()) {
        common_vendor.index.showToast({
          title: "请输入评论内容",
          icon: "none"
        });
        return;
      }
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      try {
        const centerMap = {
          scenic: "scenic-center",
          food: "food-center",
          culture: "culture-center",
          guide: "guide-center"
        };
        const res = await common_vendor.er.callFunction({
          name: centerMap[this.type],
          data: {
            action: "addReview",
            params: {
              USERID: userInfo._id,
              [`${this.type}_id`]: this.targetId,
              content: this.content,
              images: this.images,
              score: this.score
            }
          }
        });
        if (res.result.code === 0) {
          common_vendor.index.showToast({
            title: "评论成功"
          });
          this.$emit("submit");
          this.handleClose();
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "评论失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "评论失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at components/review-popup/review-popup.vue:207", e);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show
  }, $props.show ? common_vendor.e({
    b: common_vendor.o((...args) => $options.handleClose && $options.handleClose(...args)),
    c: common_vendor.o((...args) => $options.handleClose && $options.handleClose(...args)),
    d: $props.type === "scenic" || $props.type === "food"
  }, $props.type === "scenic" || $props.type === "food" ? {
    e: $data.score * 10,
    f: common_vendor.o((...args) => $options.handleScoreChange && $options.handleScoreChange(...args)),
    g: common_vendor.t($data.score)
  } : {}, {
    h: $data.content,
    i: common_vendor.o(($event) => $data.content = $event.detail.value),
    j: $data.images.length > 0
  }, $data.images.length > 0 ? {
    k: common_vendor.f($data.images, (item, index, i0) => {
      return {
        a: index,
        b: item,
        c: common_vendor.o(($event) => $options.previewImage(index), index)
      };
    })
  } : {}, {
    l: $data.images.length < 9
  }, $data.images.length < 9 ? {
    m: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    n: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/review-popup/review-popup.js.map
